"use client";

import { useEffect, useState } from "react";
import RatingReview from "@/components/RatingReview";
import { useRouter } from "next/navigation";

export default function ReviewsPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [ratings, setRatings] = useState<Record<string, any>>({});
  const [reviewsMap, setReviewsMap] = useState<Record<string, any[]>>({});

  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      // fetch ratings for each favorite in parallel
      const ratingPromises = favs.map(async (f: any) => {
        const name = encodeURIComponent(f.recipeName);
        const [rres, rvres] = await Promise.all([
          fetch(`/api/ratings?recipeName=${name}`),
          fetch(`/api/reviews?recipeName=${name}`),
        ]);

        const ratingData = rres.ok ? await rres.json() : null;
        const reviewsData = rvres.ok ? await rvres.json() : { reviews: [] };

        return { key: f.recipeName, rating: ratingData, reviews: reviewsData.reviews || [] };
      });

      const results = await Promise.all(ratingPromises);
      const map: Record<string, any> = {};
      const rmap: Record<string, any[]> = {};
      results.forEach((r) => {
        if (r) {
          map[r.key] = r.rating;
          rmap[r.key] = r.reviews || [];
        }
      });
      setRatings(map);
      setReviewsMap(rmap);
    } catch (e) {
      // ignore for now
    }
  }

  async function refreshForRecipe(recipeName: string) {
    try {
      const name = encodeURIComponent(recipeName);
      const [rres, rvres] = await Promise.all([
        fetch(`/api/ratings?recipeName=${name}`),
        fetch(`/api/reviews?recipeName=${name}`),
      ]);
      if (rres.ok) {
        const rd = await rres.json();
        setRatings((s) => ({ ...s, [recipeName]: rd }));
      }
      if (rvres.ok) {
        const rj = await rvres.json();
        setReviewsMap((s) => ({ ...s, [recipeName]: rj.reviews || [] }));
      }
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
        await refreshForRecipe(recipeName);
        alert('Deleted');
      } else {
        const j = await res.json();
        alert('Error: ' + (j?.error || 'unknown'));
      }
    } catch (e) { /* ignore */ }
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6">
      <h1 className="text-4xl font-bold text-black text-center mb-8">Ratings & Reviews for your saved dishes</h1>

      {favorites.length === 0 ? (
        <p className="text-center text-black font-bold text-lg">No favourite recipes yet.</p>
      ) : (
        <div className="space-y-6 max-w-5xl mx-auto">
          {favorites.map((recipe, index) => (
            <div key={recipe.id || index} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-black text-xl mb-1">{recipe.recipeName}</h2>
                  <p className="text-black text-sm">{recipe.description}</p>
                  <p className="text-xs text-black font-semibold mt-1">
                    {ratings[recipe.recipeName] && ratings[recipe.recipeName].averageRating
                      ? `Average: ${Number(ratings[recipe.recipeName].averageRating).toFixed(1)} (${ratings[recipe.recipeName].totalReviews} reviews)`
                      : "No ratings yet"}
                  </p>
                </div>

                <div>
                  {/* Provide a small place for quick actions */}
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
                  <h3 className="font-bold text-black mb-2">Leave a review</h3>
                  <RatingReview recipeName={recipe.recipeName} recipe={recipe} onSuccess={() => refreshForRecipe(recipe.recipeName)} />

                  <div className="mt-4">
                    <h4 className="font-semibold text-black mb-2">Recent reviews</h4>
                    {reviewsMap[recipe.recipeName] && reviewsMap[recipe.recipeName].length > 0 ? (
                      <ul className="space-y-2">
                        {reviewsMap[recipe.recipeName].map((rv: any) => (
                          <li key={rv.id} className="p-2 border rounded">
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <strong className="text-black">{rv.title || ""}</strong>
                                <div className="text-sm text-black">{rv.body}</div>
                                <div className="text-xs text-muted-foreground mt-1">By {rv.user?.name || rv.user?.email || "Unknown"} • {new Date(rv.createdAt).toLocaleString()}</div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <span className="font-bold text-black">{rv.rating}★</span>
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
