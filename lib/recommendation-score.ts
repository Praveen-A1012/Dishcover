// lib/recommendation-score.ts
// Utility to score and rank recipes for recommendations
import { Recipe } from "@/types/recipe";

export function scoreRecipe(
  recipe: any, // can be Prisma recipe or Favorite
  userDiet: string,
  favoriteRecipes: any[]
): number {
  let score = 0;
  // +10 for matching dietary preference
  if (recipe.diet && userDiet && recipe.diet === userDiet) score += 10;

  for (const fav of favoriteRecipes) {
    // +3 for each shared tag (if tags exist)
    if (recipe.tags && fav.tags) {
      score += recipe.tags.filter((tag: string) => fav.tags.includes(tag)).length * 3;
    }
    // +2 for each shared ingredient
    if (recipe.ingredients && fav.ingredients) {
      const recipeIngs = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
      const favIngs = Array.isArray(fav.ingredients) ? fav.ingredients : [];
      score += recipeIngs.filter((ing: any) => favIngs.some((f: any) => f.name === ing.name)).length * 2;
    }
    // +5 for matching cuisine (if present)
    if (recipe.cuisine && fav.cuisine && recipe.cuisine === fav.cuisine) score += 5;
  }
  // -1000 if already a favorite
  if (favoriteRecipes.some(fav => fav.id === recipe.id || fav.recipeName === recipe.title)) score -= 1000;
  return score;
}

export function rankRecipes(
  recipes: any[],
  userDiet: string,
  favoriteRecipes: any[],
  topN = 10
) {
  return recipes
    .map(r => ({ ...r, score: scoreRecipe(r, userDiet, favoriteRecipes) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}
