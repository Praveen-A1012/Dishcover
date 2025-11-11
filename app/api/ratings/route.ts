import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const recipeId = url.searchParams.get("recipeId");
  const recipeName = url.searchParams.get("recipeName");

  if (!recipeId && !recipeName) return NextResponse.json({ error: "Missing recipeId or recipeName" }, { status: 400 });

  let targetId = recipeId;
  if (!targetId && recipeName) {
    const r = await prisma.recipe.findFirst({ where: { title: recipeName } });
    if (!r) {
      return NextResponse.json({ averageRating: null, totalReviews: 0, recipeId: null });
    }
    targetId = r.id;
  }

  const agg = await prisma.review.aggregate({
    where: { recipeId: targetId! },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return NextResponse.json({ averageRating: agg._avg.rating ?? null, totalReviews: agg._count.rating, recipeId: targetId });
}
