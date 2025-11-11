// app/api/favorites/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// ---------------- GET: Fetch all user favorites ----------------
export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const payload = verifyToken(token);
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const favs = await prisma.favorite.findMany({
    where: { userId: payload.userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ favorites: favs });
}

// ---------------- POST: Add a new favorite ----------------
export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const payload = verifyToken(token);
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { recipe } = await req.json();
  if (!recipe || !recipe.recipeName)
    return NextResponse.json({ error: "Missing recipe" }, { status: 400 });

  try {
    // 1️⃣ Look for a full Recipe in the DB (by title)
    let recipeRow = await prisma.recipe.findFirst({
      where: { title: recipe.recipeName },
      select: {
        title: true,
        description: true,
        servings: true,
        prepTimeMinutes: true,
        cookTimeMinutes: true,
        ingredients: true,
        instructions: true,
        chefTips: true,
      },
    });

    // 2️⃣ If it doesn't exist, create a minimal one
    if (!recipeRow) {
      recipeRow = await prisma.recipe.create({
        data: {
          title: recipe.recipeName,
          description: recipe.description || null,
          recommended: true,
          servings: recipe.servings ?? null,
          prepTimeMinutes: recipe.prepTimeMinutes ?? null,
          cookTimeMinutes: recipe.cookTimeMinutes ?? null,
          ingredients: recipe.ingredients ?? [],
          instructions: recipe.instructions ?? [],
          chefTips: recipe.chefTips ?? [],
        },
        select: {
          title: true,
          description: true,
          servings: true,
          prepTimeMinutes: true,
          cookTimeMinutes: true,
          ingredients: true,
          instructions: true,
          chefTips: true,
        },
      });
    }

    // 3️⃣ Create Favorite record using full recipe data
    const fav = await prisma.favorite.create({
      data: {
        userId: payload.userId,
        recipeName: recipeRow.title,
        description: recipeRow.description,
        servings: recipeRow.servings,
        prepTimeMinutes: recipeRow.prepTimeMinutes,
        cookTimeMinutes: recipeRow.cookTimeMinutes,
        ingredients: recipeRow.ingredients ?? [],
        instructions: recipeRow.instructions ?? [],
        chefTips: recipeRow.chefTips ?? [],
      },
    });

    return NextResponse.json({ favorite: fav });
  } catch (e: any) {
    console.error("Error adding favorite:", e);
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}

// ---------------- DELETE: Remove a favorite ----------------
export async function DELETE(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const payload = verifyToken(token);
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { recipeName } = await req.json();
  if (!recipeName)
    return NextResponse.json({ error: "Missing recipeName" }, { status: 400 });

  await prisma.favorite.deleteMany({
    where: { userId: payload.userId, recipeName },
  });

  return NextResponse.json({ ok: true });
}
