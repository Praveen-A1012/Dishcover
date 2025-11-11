import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("query") || "").trim();

    if (!query) return NextResponse.json({ recipes: [] });

    // Try to identify the user (optional) so we can merge favourites
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const payload = verifyToken(token);
    const userId = (payload as any)?.userId as string | undefined;

    // Fetch recipes from the main Recipe table
    // Strategy: do a fast ILIKE contains query, and if it returns too few
    // results, fall back to a fuzzy trigram similarity query via $queryRaw.
    let recipeRows = await prisma.recipe.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        servings: true,
        prepTimeMinutes: true,
        cookTimeMinutes: true,
        ingredients: true,
        instructions: true,
        chefTips: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // If too few results, use trigram similarity for typos like "biriyani"
    if (recipeRows.length < 3) {
      const q = query.toLowerCase();
      // @ts-ignore using raw to leverage pg_trgm similarity
      const fuzzy = await prisma.$queryRaw<any[]>`
        SELECT id, title, description, "servings", "prepTimeMinutes", "cookTimeMinutes",
               ingredients, instructions, "chefTips", "createdAt",
               similarity(lower(title), ${q}) AS sim
        FROM "Recipe"
        WHERE similarity(lower(title), ${q}) > 0.15
        ORDER BY sim DESC, "createdAt" DESC
        LIMIT 20;
      `;
      if (Array.isArray(fuzzy) && fuzzy.length) {
        recipeRows = fuzzy;
      }
    }

    // Optionally fetch user favourites matching the query
    let favouriteRows: Array<any> = [];
    if (userId) {
      favouriteRows = await prisma.favorite.findMany({
        where: {
          userId,
          OR: [
            { recipeName: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      });

      // Fuzzy fallback for favourites as well
      if (favouriteRows.length < 1) {
        const q = query.toLowerCase();
        // @ts-ignore raw to use pg_trgm
        const fuzzyFavs = await prisma.$queryRaw<any[]>`
          SELECT * , similarity(lower("recipeName"), ${q}) AS sim
          FROM "Favorite"
          WHERE "userId" = ${userId} AND similarity(lower("recipeName"), ${q}) > 0.15
          ORDER BY sim DESC, "createdAt" DESC
          LIMIT 20;
        `;
        if (Array.isArray(fuzzyFavs) && fuzzyFavs.length) {
          favouriteRows = fuzzyFavs;
        }
      }
    }

    // Build a set of favourite names to mark matches in recipe results
    const favNameSet = new Set(
      favouriteRows.map((f) => (f.recipeName as string).toLowerCase())
    );

    // Normalise shapes and merge, de-duplicating by title/recipeName
    type Result = {
      id: string;
      title: string;
      description?: string | null;
      servings?: number | null;
      prepTimeMinutes?: number | null;
      cookTimeMinutes?: number | null;
      ingredients?: any;
      instructions?: any;
      chefTips?: any;
      isFavorite: boolean;
      source: "recipe" | "favorite";
    };

    const merged = new Map<string, Result>();

    // 1) Include favourites first (if any)
    for (const f of favouriteRows) {
      const key = (f.recipeName as string).toLowerCase();
      merged.set(key, {
        id: f.id,
        title: f.recipeName,
        description: f.description ?? null,
        servings: f.servings ?? null,
        prepTimeMinutes: f.prepTimeMinutes ?? null,
        cookTimeMinutes: f.cookTimeMinutes ?? null,
        ingredients: f.ingredients ?? [],
        instructions: f.instructions ?? [],
        chefTips: f.chefTips ?? [],
        isFavorite: true,
        source: "favorite",
      });
    }

    // 2) Add recipe table results, marking isFavorite if also in favourites
    for (const r of recipeRows) {
      const key = (r.title as string).toLowerCase();
      if (merged.has(key)) continue; // avoid duplicates
      merged.set(key, {
        id: r.id,
        title: r.title,
        description: r.description ?? null,
        servings: r.servings ?? null,
        prepTimeMinutes: r.prepTimeMinutes ?? null,
        cookTimeMinutes: r.cookTimeMinutes ?? null,
        ingredients: r.ingredients ?? [],
        instructions: r.instructions ?? [],
        chefTips: r.chefTips ?? [],
        isFavorite: favNameSet.has(key),
        source: "recipe",
      });
    }

    const recipes = Array.from(merged.values()).slice(0, 20);

    return NextResponse.json({ recipes });
  } catch (e: any) {
    console.error("Search error:", e);
    return NextResponse.json(
      { recipes: [], error: "Search failed" },
      { status: 500 }
    );
  }
}
