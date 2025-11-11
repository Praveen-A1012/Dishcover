"use client";

import { useState, useEffect } from "react";
import { RecipeForm } from "@/components/recipe-form";
import { RecipeDisplay } from "@/components/recipe-display";
import { generateRecipe } from "@/lib/llm";
import { Recipe, RecipeRequest, RecipeRequestFormData } from "@/types/recipe";
import RecipeCard from "@/components/recipe-card";
import { toast } from "sonner";

export default function Home() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Recipe[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const token = localStorage.getItem("token");
        const url = token
          ? "/api/recommendations/personalized"
          : "/api/recommendations";

        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (res.ok) {
          const data = await res.json();
          let recs = data.recommendations || [];
          recs = recs.sort(() => 0.5 - Math.random()).slice(0, 10);
          setRecommendations(recs);
        } else {
          console.warn("Failed to load recommendations:", res.status);
          setRecommendations([]);
        }
      } catch (e) {
        console.error("Error fetching recommendations:", e);
        setRecommendations([]);
      } finally {
        setLoadingRecs(false);
      }
    }

    fetchRecommendations();
  }, []);

  const handleRecipeRequest = async (request: RecipeRequestFormData) => {
    const recipeRequest: RecipeRequest = {
      mainDish: request.mainDish,
      dietaryRestrictions: request.dietaryRestrictions,
      availableIngredients: request.availableIngredients,
      maxCookingTime: request.maxCookingTime,
      servingSize: request.servingSize,
    };

    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setRecipe(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-accent">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-12">

        {/* === Recommendations Section (Horizontal Scroll) === */}
        {!recipe && (
          <section className="w-full max-w-6xl mx-auto bg-card/50 p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              Recommended for You
            </h2>

            {loadingRecs ? (
              <p className="text-center text-gray-500">Loading recipes...</p>
            ) : recommendations.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 pr-2">
                {recommendations.map((rec) => (
                  <div key={(rec as any).id || rec.recipeName} className="flex-shrink-0 w-64">
                    <RecipeCard recipe={rec} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No recommendations found.
              </p>
            )}
          </section>
        )}

        {/* === Recipe Generator Container === */}
        <section className="w-full max-w-2xl mx-auto bg-card/40 p-6 rounded-xl shadow-lg">
          {!recipe ? (
            <>
              <h2 className="text-2xl font-semibold text-center mb-4">
                Generate a New Recipe
              </h2>

              <RecipeForm onSubmit={handleRecipeRequest} isLoading={isLoading} />

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {error}
                </div>
              )}
            </>
          ) : (
            <RecipeDisplay recipe={recipe} onStartOver={handleStartOver} />
          )}
        </section>
      </main>

      {/* === Footer === */}
      <footer className="bg-muted/50 border-t border-border/10 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          Powered by AI • Made with ❤️ for home cooks everywhere
        </div>
      </footer>
    </div>
  );
}
