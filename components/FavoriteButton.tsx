// components/FavoriteButton.tsx
"use client";
import { useState, useEffect } from "react";

export default function FavoriteButton({ recipe }: { recipe: any }) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    // naive check: you can call GET /api/favorites and set isFav based on recipe.id
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("/api/favourites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const j = await res.json();
      const found = (j.favorites || []).some((f: any) => f.recipeName === recipe.recipeName);
      setIsFav(found);
    })();
  }, [recipe?.recipeName]);

  async function toggle() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to save favorites");
      return;
    }

    if (!isFav) {
      const res = await fetch("/api/favourites", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ recipe }),
      });
      if (res.ok) setIsFav(true);
    } else {
      const res = await fetch("/api/favourites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ recipeName: recipe.recipeName }),
      });
      if (res.ok) setIsFav(false);
    }
  }

  return (
    <button onClick={toggle} style={{ padding: 8 }}>
      {isFav ? "Remove favorite ❤️" : "Save favorite ♡"}
    </button>
  );
}
