
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rankRecipes } from "@/lib/recommendation-score";

// GET /api/recommendations?userId=...
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // Fetch all recommended recipes from seed
    const seededRecipes = await prisma.recipe.findMany({
      where: { recommended: true },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        title: true,
        description: true,
        diet: true,
        ingredients: true,
        instructions: true,
        chefTips: true,
        servings: true,
        prepTimeMinutes: true,
        cookTimeMinutes: true,
        recommended: true,
        createdAt: true,
      },
    });

    let recommendations: any[] = seededRecipes;

    if (userId) {
      // Fetch user and their favorites
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { diet: true, favorites: true },
      });
      
      if (user) {
        // Convert favorites to recipe format and combine with seeded recipes
        const favoriteRecipes = (user.favorites || []).map(fav => ({
          id: fav.id,
          title: fav.recipeName,
          description: fav.description || "",
          diet: null,
          ingredients: fav.ingredients,
          instructions: fav.instructions,
          chefTips: fav.chefTips || [],
          servings: fav.servings,
          prepTimeMinutes: fav.prepTimeMinutes,
          cookTimeMinutes: fav.cookTimeMinutes,
          recommended: false,
          createdAt: fav.createdAt,
        }));

        // Rank seeded recipes based on user preferences
        const rankedSeeded = rankRecipes(
          seededRecipes,
          user.diet || "",
          user.favorites || [],
          9 // Get top 9 from seeded
        );

        // Ensure at least one favorite recipe is included (if user has favorites)
        if (favoriteRecipes.length > 0) {
          // Pick a random favorite to include
          const randomFavorite = favoriteRecipes[Math.floor(Math.random() * favoriteRecipes.length)];
          recommendations = [randomFavorite, ...rankedSeeded].slice(0, 10);
        } else {
          recommendations = rankedSeeded.slice(0, 10);
        }
      } else {
        recommendations = seededRecipes.slice(0, 10);
      }
    } else {
      recommendations = seededRecipes.slice(0, 10);
    }

    const sanitized = recommendations.map(r => ({
      ...r,
      ingredients: r.ingredients || [],
      instructions: r.instructions || [],
      chefTips: r.chefTips || [],
    }));

    return NextResponse.json({ recommendations: sanitized });
  } catch (err) {
    console.error("Error fetching personalized recommendations:", err);
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
