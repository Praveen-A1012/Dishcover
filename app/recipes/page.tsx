"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RecipeForm } from "@/components/recipe-form";
import { RecipeDisplay } from "@/components/recipe-display";
import { generateRecipe } from "@/lib/llm";
import { Recipe, RecipeRequest, RecipeRequestFormData } from "@/types/recipe";
import { toast } from "sonner";

export default function RecipesPage() {
  
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFav, setIsFav] = useState(false); // ✅ track favorite status

  const router = useRouter();

  // Check login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.replace("/login");
    else setLoading(false);
  }, [router]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  const handleRecipeRequest = async (request: RecipeRequestFormData) => {
    const recipeRequest: RecipeRequest = {
      mainDish: request.mainDish,
      dietaryRestrictions: request.dietaryRestrictions,
      availableIngredients: request.availableIngredients,
      maxCookingTime: request.maxCookingTime,
      servingSize: request.servingSize,
    };

    setIsGenerating(true);
    setError(null);

    try {
      const generatedRecipe = await generateRecipe(recipeRequest);
      setRecipe(generatedRecipe);
      toast.success("Recipe generated successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate recipe";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartOver = () => setRecipe(null);

  // Save to server-backed favorites
  const handleSaveFavourite = async () => {
    if (!recipe) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    // naive check: fetch existing favorites to avoid duplicates
    try {
      const check = await fetch("/api/favourites", { headers: { Authorization: `Bearer ${token}` } });
      if (!check.ok) return;
      const j = await check.json();
      if ((j.favorites || []).some((f: any) => f.recipeName === recipe!.recipeName)) {
        toast.info("This recipe is already in your favorites!");
        setIsFav(true);
        return;
      }

      const payload = { recipe: { recipeName: recipe.recipeName, description: recipe.description, servings: recipe.servings, prepTimeMinutes: recipe.prepTimeMinutes, cookTimeMinutes: recipe.cookTimeMinutes, ingredients: recipe.ingredients, instructions: recipe.instructions, chefTips: recipe.chefTips } };
      const res = await fetch("/api/favourites", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      if (res.ok) {
        setIsFav(true);
        toast.success("Recipe saved to favorites!");
      }
    } catch (e) {
      // ignore
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6">
      <main className="max-w-4xl mx-auto space-y-6">
        {!recipe ? (
          <>
            <h1 className="text-3xl font-bold text-center mb-8">Generate Your Recipe</h1>
            <RecipeForm onSubmit={handleRecipeRequest} isLoading={isGenerating} />
            {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
          </>
        ) : (
          <>
            <RecipeDisplay recipe={recipe} onStartOver={handleStartOver} />

            {/* ✅ Save to Favorites button */}
            <div className="text-center mt-4">
              <button
                onClick={handleSaveFavourite}
                className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition"
              >
                {isFav ? "Saved to Favorites ✓" : "Save to Favorites"}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
