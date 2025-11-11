"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import bgImage from "@/app/Gemini_Generated_Image_8unih8unih8unih8.png";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recs, setRecs] = useState<any[]>([]);
  const [recLoading, setRecLoading] = useState(false);
  const [hasFavourites, setHasFavourites] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.replace("/login");
    else setLoading(false);
  }, [router]);

  useEffect(() => {
    async function fetchFavouritesAndRecs() {
      setRecLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;
      // Check if user has favourites
      const favRes = await fetch("/api/favourites", { headers: { Authorization: `Bearer ${token}` } });
      if (favRes.ok) {
        const favs = await favRes.json();
        if (Array.isArray(favs.favorites) && favs.favorites.length > 0) {
          setHasFavourites(true);
          // Only fetch recommendations if user has favourites
          const recRes = await fetch("/api/recommendations/personalized", { headers: { Authorization: `Bearer ${token}` } });
          if (recRes.ok) {
            const j = await recRes.json();
            setRecs(j.recommendations || []);
          } else {
            setRecs([]);
          }
        } else {
          setHasFavourites(false);
          setRecs([]);
        }
      } else {
        setHasFavourites(false);
        setRecs([]);
      }
      setRecLoading(false);
    }
    fetchFavouritesAndRecs();
  }, []);

  async function addToFavorites(recipe: any) {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    try {
      const payload = { recipe: { recipeName: recipe.title || recipe.recipeName, description: recipe.description || null, ingredients: [], instructions: [] } };
      const res = await fetch('/api/favourites', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      if (res.ok) alert('Added to favourites');
      else alert('Failed to add');
    } catch (e) { /* ignore */ }
  }

  if (loading)
    return <div className="text-center mt-20 text-gray-600">Loading...</div>;

  return (
  <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* 🔹 Background Image */}
      <Image
        src={bgImage}
        alt="Dishcover background"
        fill
        priority
        className="object-cover brightness-75"
      />

      {/* 🔹 Overlay gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>

      {/* 🔹 Centered Content */}
      <div className="relative z-10 text-center flex flex-col items-center justify-center px-4 sm:px-6">
        <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight drop-shadow-lg">
          Dishcover
        </h1>
        <p className="mt-4 text-lg sm:text-2xl text-white/90 font-medium drop-shadow-md">
          Unearth Your Next Culinary Adventure
        </p>

        {/* 🔹 Personalized Recommendations */}
        <div className="mt-8 w-full max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Recommended for You</h2>
          {recLoading ? (
            <div className="text-white">Loading recommendations...</div>
          ) : hasFavourites === false ? (
            <div className="text-white/80">Add some dishes to your favourites to get personalized recommendations!</div>
          ) : recs.length === 0 ? (
            <div className="text-white/80">No recommendations yet.</div>
          ) : (
            <div className="space-y-4">
              {recs.map((r: any) => (
                <div key={r.id} className="bg-white/90 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between shadow">
                  <div className="text-left">
                    <div className="font-bold text-black text-lg">{r.title}</div>
                    <div className="text-black text-sm mb-1">{r.description}</div>
                  </div>
                  <button
                    onClick={() => addToFavorites(r)}
                    className="mt-2 md:mt-0 px-4 py-2 bg-black text-white rounded font-bold hover:bg-gray-900"
                  >
                    Add to Favourites
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🔹 Generate Recipes Button */}
        <button
          onClick={() => router.push("/recipes")}
          className="mt-10 bg-green-600 text-white text-lg sm:text-xl font-semibold rounded-full px-10 py-4 hover:bg-green-700 hover:scale-105 transition-all duration-300 shadow-lg"
        >
          Generate Recipes
        </button>
      </div>
    </div>
  );
}
