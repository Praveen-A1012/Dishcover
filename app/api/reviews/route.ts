// app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const recipeId = url.searchParams.get("recipeId");
  const recipeName = url.searchParams.get("recipeName");
  if (!recipeId && !recipeName) return NextResponse.json({ error: "Missing recipeId or recipeName" }, { status: 400 });

  let targetId = recipeId;
  if (!targetId && recipeName) {
    const found = await prisma.recipe.findFirst({ where: { title: recipeName } });
    if (found) targetId = found.id;
    else {
      // no recipe -> empty result
      return NextResponse.json({ reviews: [], averageRating: null, totalReviews: 0 });
    }
  }

  const reviews = await prisma.review.findMany({
    where: { recipeId: targetId! },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const agg = await prisma.review.aggregate({
    where: { recipeId: targetId! },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return NextResponse.json({
    reviews,
    averageRating: agg._avg?.rating ?? null,
    totalReviews: agg._count?.rating ?? 0,
  });
}

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { recipeId, rating, title, body, recipe } = await req.json();
  if (!rating || !(recipeId || recipe)) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Upsert recipe if recipe object provided
  let dbRecipeId = recipeId;
  if (recipe) {
    // If recipe has an id, try to fetch it. Otherwise find by title or create a new Recipe row.
    if (recipe.id) {
      const rec = await prisma.recipe.findUnique({ where: { id: recipe.id } });
      if (rec) dbRecipeId = rec.id;
    }

    if (!dbRecipeId) {
      if (recipe.externalId) {
        // try find by externalId
        const rec = await prisma.recipe.findFirst({ where: { externalId: recipe.externalId } });
        if (rec) dbRecipeId = rec.id;
      }
    }

    if (!dbRecipeId) {
      // try find by title
      if (recipe.title) {
        const rec = await prisma.recipe.findFirst({ where: { title: recipe.title } });
        if (rec) dbRecipeId = rec.id;
      }
    }

    if (!dbRecipeId) {
      // create a new Recipe record
      const created = await prisma.recipe.create({
        data: {
          title: recipe.title || recipe.recipeName || "Untitled",
          description: recipe.description || null,
          externalId: recipe.externalId || null,
        },
      });
      dbRecipeId = created.id;
    }
  }

  const rv = await prisma.review.create({
    data: {
      userId: payload.userId,
      recipeId: dbRecipeId!,
      rating: Math.max(1, Math.min(5, Number(rating))),
      title,
      body,
    },
  });

  // mark recipe as recommended so it surfaces to other users
  try {
    // prisma client may be out of sync until user runs `prisma generate` after schema change;
    // cast to any to avoid compile errors in the dev environment here.
    await (prisma as any).recipe.update({ where: { id: dbRecipeId! }, data: { recommended: true } });
  } catch (e) {
    // ignore if update fails
  }

  return NextResponse.json({ review: rv });
}

export async function DELETE(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reviewId } = await req.json();
  if (!reviewId) return NextResponse.json({ error: "Missing reviewId" }, { status: 400 });

  const existing = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.userId !== payload.userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.review.delete({ where: { id: reviewId } });
  return NextResponse.json({ ok: true });
}
