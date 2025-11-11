import { Recipe } from "@/types/recipe";

const FAVORITES_KEY = "culinary-assistant-favorites";

export function getFavorites(): Recipe[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: Recipe[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Failed to save favorites:", error);
  }
}

export function addFavorite(recipe: Recipe): void {
  const favorites = getFavorites();
  // Avoid duplicates by checking recipe name
  if (!favorites.some((r) => r.recipeName === recipe.recipeName)) {
    favorites.push(recipe);
    saveFavorites(favorites);
  }
}

export function removeFavorite(recipeName: string): void {
  const favorites = getFavorites();
  const updated = favorites.filter((r) => r.recipeName !== recipeName);
  saveFavorites(updated);
}

export function isFavorite(recipeName: string): boolean {
  const favorites = getFavorites();
  return favorites.some((r) => r.recipeName === recipeName);
}
