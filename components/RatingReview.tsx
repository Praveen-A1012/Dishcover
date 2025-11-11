// components/RatingReview.tsx
"use client";
import { useState } from "react";

export default function RatingReview({
  recipeId,
  recipe,
  recipeName,
  onSuccess,
}: {
  recipeId?: string;
  recipe?: any;
  recipeName?: string;
  onSuccess?: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login");
      return;
    }

    const payload: any = { rating, title, body };
    if (recipeId) payload.recipeId = recipeId;
    else if (recipe)
      payload.recipe = {
        id: recipe.id,
        title: recipe.recipeName || recipe.title,
        externalId: recipe.externalId || null,
      };
    else if (recipeName) payload.recipe = { title: recipeName };

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Thanks for your review!");
      setRating(5);
      setTitle("");
      setBody("");
      if (onSuccess) onSuccess();
    } else {
      const j = await res.json();
      alert("Error: " + (j?.error || "unknown"));
    }
  }

  return (
    <form onSubmit={submitReview} style={{ marginTop: 12 }}>
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-center">
        <label className="col-span-1 font-bold text-black">Rating</label>
        <div className="col-span-5">
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border rounded px-2 py-1 bg-white text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <label className="col-span-1 font-bold text-black">Title</label>
        <div className="col-span-5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-2 py-1 bg-white text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Title of your review"
          />
        </div>

        <label className="col-span-1 font-bold text-black">Review</label>
        <div className="col-span-5">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full border rounded px-2 py-1 bg-white text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-28"
            placeholder="Write your detailed review here..."
          />
        </div>

        <div className="col-span-1" />
        <div className="col-span-5">
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-black text-white font-bold rounded"
          >
            Submit review
          </button>
        </div>
      </div>
    </form>
  );
}
