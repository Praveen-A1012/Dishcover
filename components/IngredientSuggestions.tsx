// components/IngredientSuggestions.tsx
"use client";
import { useState } from "react";

export default function IngredientSuggestions({ recipeId, ingredient }: { recipeId?: string; ingredient: string }) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any>(null);

  async function getSuggestions() {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch("/api/substitutions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ recipeId, ingredient }),
    });
    const j = await res.json();
    setLoading(false);
    if (res.ok) {
      setSuggestions(j.item?.suggestions || j.item || j);
    } else {
      alert(j.error || "Error fetching suggestions");
    }
  }

  return (
    <div style={{ marginTop: 12 }}>
      <button onClick={getSuggestions} disabled={loading}>
        {loading ? "Thinking..." : `Substitutes for "${ingredient}"`}
      </button>

      {suggestions && (
        <div style={{ marginTop: 8 }}>
          {Array.isArray(suggestions) ? (
            <ul>
              {suggestions.map((s: any, i: number) => (
                <li key={i}>
                  <strong>{s.name || s.substitute || s}</strong> — {s.reason || s.explanation || ""}
                  {s.ratio ? ` (ratio: ${s.ratio})` : ""}
                </li>
              ))}
            </ul>
          ) : (
            <pre>{JSON.stringify(suggestions, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}
