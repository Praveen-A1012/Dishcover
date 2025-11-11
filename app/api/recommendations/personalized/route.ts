import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        diet: true,
        favorites: {
          select: {
            id: true,
            recipeName: true,
            description: true,
            servings: true,
            prepTimeMinutes: true,
            cookTimeMinutes: true,
            ingredients: true,
            instructions: true,
            chefTips: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // ✅ Fetch recommended recipes
    const allRecipes = await prisma.recipe.findMany({
      where: { recommended: true },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        title: true,
        description: true,
        diet: true,
        servings: true,
        prepTimeMinutes: true,
        cookTimeMinutes: true,
        ingredients: true,
        instructions: true,
        chefTips: true,
        recommended: true,
        createdAt: true,
      },
    });

    // ✅ Filter by user diet (if provided)
    let personalized = allRecipes;
    if (user.diet) {
      const diet = user.diet.toLowerCase();
      personalized = personalized.filter(
        (r) =>
          r.diet?.toLowerCase() === diet ||
          r.description?.toLowerCase().includes(diet) ||
          r.title.toLowerCase().includes(diet)
      );
    }

    // ✅ Exclude already favorited recipes from seeded recommendations
    const favoriteNames = user.favorites.map((f) => f.recipeName.toLowerCase());
    personalized = personalized.filter(
      (r) => !favoriteNames.includes(r.title.toLowerCase())
    );

    // ✅ Convert user favorites to recommendation format
    const favoriteRecipes = user.favorites.map((fav) => ({
      id: fav.id,
      title: fav.recipeName,
      description: fav.description || "",
      diet: null,
      servings: fav.servings,
      prepTimeMinutes: fav.prepTimeMinutes,
      cookTimeMinutes: fav.cookTimeMinutes,
      ingredients: fav.ingredients || [],
      instructions: fav.instructions || [],
      chefTips: fav.chefTips || [],
      recommended: false,
      createdAt: fav.createdAt,
    }));

    // ✅ Ensure at least 1 favorite is included (if user has favorites)
    let finalRecommendations;
    if (favoriteRecipes.length > 0) {
      // Pick a random favorite to include
      const randomFavorite = favoriteRecipes[Math.floor(Math.random() * favoriteRecipes.length)];
      // Take top 9 from personalized seeded recipes + 1 favorite
      const topSeeded = personalized.slice(0, 9);
      finalRecommendations = [randomFavorite, ...topSeeded].slice(0, 10);
    } else {
      finalRecommendations = personalized.slice(0, 10);
    }

    // ✅ Always sanitize JSON fields
    const top = finalRecommendations.map((r) => ({
      ...r,
      ingredients: r.ingredients || [],
      instructions: r.instructions || [],
      chefTips: r.chefTips || [],
    }));

    return NextResponse.json({ recommendations: top });
  } catch (err) {
    console.error("Error fetching personalized recommendations:", err);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
