import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("query") || "").trim();

    if (!query) return NextResponse.json({ recipes: [] });

    const recipes = await prisma.recipe.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
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
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({ recipes });
  } catch (e: any) {
    console.error("Search error:", e);
    return NextResponse.json({ recipes: [], error: "Search failed" }, { status: 500 });
  }
}
