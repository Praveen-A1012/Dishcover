"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RecommendationsPage() {
  const router = useRouter();
  const [recs, setRecs] = useState<any[]>([]);

  useEffect(() => {
    loadRecs();
  }, []);

  async function loadRecs() {
    try {
      const res = await fetch('/api/recommendations');
      if (!res.ok) return;
      const j = await res.json();
      setRecs(j.recommendations || []);
    } catch (e) {
      // ignore
    }
  }

  async function addToFavorites(recipe: any) {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    try {
      const payload = { recipe: { recipeName: recipe.title || recipe.recipeName, description: recipe.description || null, ingredients: [], instructions: [] } };
      const res = await fetch('/api/favourites', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      if (res.ok) alert('Added to favourites');
      else alert('Failed to add');
    } catch (e) { /* ignore */ }
  }

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      <h1 className="text-4xl font-bold text-black text-center mb-8">Recommended Recipes</h1>
      {recs.length === 0 ? (
        <p className="text-center text-black">No recommendations yet.</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {recs.map((r: any) => (
            <div key={r.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-black">{r.title}</h2>
                  <p className="text-sm text-black">{r.description}</p>
                </div>
                <div>
                  <button onClick={() => addToFavorites(r)} className="px-3 py-1 bg-primary text-white rounded">Add to favourites</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
