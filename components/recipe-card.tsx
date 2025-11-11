"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Recipe } from "@/types/recipe";

// Use server-backed favorites

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [favorite, setFavorite] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("/api/favourites", { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const j = await res.json();
        const found = (j.favorites || []).some((f: any) => f.recipeName === recipe.recipeName);
        setFavorite(found);
      } catch (e) {
        // ignore
      }
    })();
  }, [recipe]);

  const toggleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    if (favorite) {
      const res = await fetch("/api/favourites", { method: "DELETE", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ recipeName: recipe.recipeName }) });
      if (res.ok) setFavorite(false);
    } else {
      const payload = { recipe: { recipeName: recipe.recipeName, description: recipe.description, servings: recipe.servings, prepTimeMinutes: recipe.prepTimeMinutes, cookTimeMinutes: recipe.cookTimeMinutes, ingredients: recipe.ingredients, instructions: recipe.instructions, chefTips: recipe.chefTips } };
      const res = await fetch("/api/favourites", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      if (res.ok) setFavorite(true);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{recipe.recipeName}</h2>
        <button
          onClick={toggleFavorite}
          className={`px-3 py-1 rounded-md font-medium ${
            favorite ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          {favorite ? "Unfavorite" : "Favorite"}
        </button>
      </div>

      <p><strong>Description:</strong> {recipe.description}</p>
      <p><strong>Prep Time:</strong> {recipe.prepTimeMinutes} min</p>
      <p><strong>Cook Time:</strong> {recipe.cookTimeMinutes} min</p>
      <p><strong>Servings:</strong> {recipe.servings}</p>

      <div>
        <strong>Ingredients:</strong>
        <ul className="list-disc list-inside">
          {recipe.ingredients.map((ing, idx) => (
            <li key={idx}>{ing.quantity} {ing.name}</li>
          ))}
        </ul>
      </div>

      <div>
        <strong>Instructions:</strong>
        <ol className="list-decimal list-inside">
          {recipe.instructions.map((inst) => (
            <li key={inst.step}>{inst.description}</li>
          ))}
        </ol>
      </div>

      <div>
        <strong>Chef Tips:</strong>
        <ul className="list-disc list-inside">
          {recipe.chefTips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
