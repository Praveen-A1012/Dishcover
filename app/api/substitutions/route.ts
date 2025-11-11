// app/api/substitutions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { suggestSubstitutionsRaw } from "@/lib/llm-wrapper";

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const payload = verifyToken(token);
  const { recipeId, ingredient, restriction } = await req.json();

  if (!ingredient) return NextResponse.json({ error: "Missing ingredient" }, { status: 400 });

  const suggestions = await suggestSubstitutionsRaw(ingredient, restriction || "");

  // store suggestion in DB for caching and reuse
  const item = await prisma.substitutionSuggestion.create({
    data: {
      recipeId: recipeId || null,
      ingredient,
      suggestions: typeof suggestions === "string" ? { text: suggestions } : suggestions,
      createdById: payload?.userId || null,
    },
  });

  return NextResponse.json({ item });
}
