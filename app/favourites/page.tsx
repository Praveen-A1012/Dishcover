"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FavouritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<any[]>([]);
  const [reviewsMap, setReviewsMap] = useState<Record<string, any[]>>({});
  const [diet, setDiet] = useState<string>("");

  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ router]);

  useEffect(() => {
    // Get user diet from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const u = JSON.parse(userData);
      setDiet(u.diet || "");
    }
  }, []);

  useEffect(() => {
    if (!diet) setFilteredFavorites(favorites);
    else {
      // Filter by diet preference if possible (if ingredient or description mentions diet)
      setFilteredFavorites(
        favorites.filter(fav => {
          // Simple filter: check if description or ingredients mention diet
          const desc = (fav.description || "").toLowerCase();
          const ings = (fav.ingredients || []).map((i: any) => (i.name || "").toLowerCase()).join(" ");
          return desc.includes(diet.toLowerCase()) || ings.includes(diet.toLowerCase());
        })
      );
    }
  }, [diet, favorites]);

  async function loadFavorites() {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const res = await fetch("/api/favourites", { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const j = await res.json();
      const favs = j.favorites || [];
      setFavorites(favs);

      // fetch reviews for each favorite
      const promises = favs.map(async (f: any) => {
        const name = encodeURIComponent(f.recipeName);
        const rv = await fetch(`/api/reviews?recipeName=${name}`);
        if (!rv.ok) return { key: f.recipeName, reviews: [] };
        const rj = await rv.json();
        return { key: f.recipeName, reviews: rj.reviews || [] };
      });
      const results = await Promise.all(promises);
      const map: Record<string, any[]> = {};
      results.forEach((r) => {
        if (r) map[r.key] = r.reviews || [];
      });
      setReviewsMap(map);
    } catch (e) {
      // ignore
    }
  }

  async function deleteReview(id: string, recipeName: string) {
    const token = localStorage.getItem('token');
    if (!token) { alert('Please login'); return; }
    try {
      const res = await fetch('/api/reviews', { method: 'DELETE', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ reviewId: id }) });
      if (res.ok) {
        // refresh favourites + reviews
        await loadFavorites();
        alert('Deleted');
      } else {
        const j = await res.json();
        alert('Error: ' + (j?.error || 'unknown'));
      }
    } catch (e) { /* ignore */ }
  }

  async function removeFavorite(recipeName: string) {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const res = await fetch("/api/favourites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ recipeName }),
      });
      if (res.ok) {
        // refresh list
        await loadFavorites();
      }
    } catch (e) {
      // ignore
    }
  }

  function copyShoppingList(ingredients: any[]) {
    const list = (ingredients || []).map((ing: any) => `${ing.quantity} ${ing.name}`).join("\n");
    if (list.length === 0) return;
    navigator.clipboard.writeText(`Shopping list for favorites:\n\n${list}`);
    // optional: show toast (sonner) but avoiding new dependency here
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6">
      <h1 className="text-4xl font-bold text-black text-center mb-8">Your Favourite Recipes</h1>

      <div className="mb-8 flex justify-end">
        <div className="flex items-center bg-white rounded-full shadow px-4 py-2 gap-2 border border-gray-200">
          <span className="font-semibold text-black text-sm">Diet:</span>
          <select
            value={diet}
            onChange={e => setDiet(e.target.value)}
            className="appearance-none bg-transparent text-black font-semibold text-sm px-2 py-1 focus:outline-none"
          >
            <option value="">All</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Pescatarian">Pescatarian</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
            <option value="Keto">Keto</option>
            <option value="Paleo">Paleo</option>
            <option value="Gluten-Free">Gluten-Free</option>
            <option value="Dairy-Free">Dairy-Free</option>
            <option value="Low-Carb">Low-Carb</option>
            <option value="Low-Fat">Low-Fat</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {filteredFavorites.length === 0 ? (
        <p className="text-center text-black font-bold text-lg">No favourite recipes yet.</p>
      ) : (
        <div className="space-y-6 max-w-5xl mx-auto">
          {filteredFavorites.map((recipe, index) => (
            <div
              key={recipe.id || index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="font-bold text-black text-xl mb-1">{recipe.recipeName}</h2>
                  <p className="text-black text-sm mb-1">{recipe.description}</p>
                  <p className="text-xs text-black">Serves: {recipe.servings || "-"} • Prep: {recipe.prepTimeMinutes ?? "-"} min • Cook: {recipe.cookTimeMinutes ?? "-"} min</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeFavorite(recipe.recipeName)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => copyShoppingList(recipe.ingredients)}
                    className="px-3 py-1 text-black text-sm bg-primary text-white rounded"
                  >
                    Copy Shopping List
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold text-black mb-2">Ingredients</h3>
                  <ul className="list-disc list-inside text-black text-sm">
                    {(recipe.ingredients || []).map((ing: any, i: number) => (
                      <li key={i}>{ing.quantity} {ing.name}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-black mb-2">Instructions</h3>
                  <ol className=" text-black list-inside text-sm">
                    {(recipe.instructions || []).map((inst: any, i: number) => (
                      <li key={i} className="mb-1">{inst.step ? `${inst.step}. ` : ""}{inst.description}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {recipe.chefTips && recipe.chefTips.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-bold text-black mb-2">Chef Tips</h3>
                  <ul className="list-disc text-black list-inside text-sm">
                    {recipe.chefTips.map((tip: any, i: number) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4">
                <h3 className="font-bold text-black mb-2">Recent reviews</h3>
                {reviewsMap[recipe.recipeName] && reviewsMap[recipe.recipeName].length > 0 ? (
                  <ul className="space-y-2">
                    {reviewsMap[recipe.recipeName].map((rv: any) => (
                      <li key={rv.id} className="p-2 border rounded">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <strong className="text-black text-base">{rv.title || ""}</strong>
                            <div className="text-sm text-black font-medium">{rv.body}</div>
                            <div className="text-xs text-black mt-1">By {rv.user?.name || rv.user?.email || "Unknown"} • {new Date(rv.createdAt).toLocaleString()}</div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="font-bold text-black text-lg">{rv.rating}★</span>
                            <button onClick={() => deleteReview(rv.id, recipe.recipeName)} className="px-2 py-1 text-sm bg-red-500 text-white rounded">Delete</button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-black">No reviews yet.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
