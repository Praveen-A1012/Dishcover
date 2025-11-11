"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(() => {
    const checkToken = () => setLoggedIn(!!localStorage.getItem("token"));
    checkToken();
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
    router.push("/login");
  }

  // 🔍 Search recipes
  const executeSearch = async (q?: string) => {
    const query = (q ?? searchQuery).trim();
    setSearchQuery(query);
    if (!query) {
      setSearchResults([]);
      return;
    }
    setLoadingSearch(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`/api/recipes/search?query=${encodeURIComponent(query)}` , {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.recipes || []);
      } else {
        setSearchResults([]);
      }
    } catch (e) {
      console.error("Search error:", e);
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const addToFavorites = async (recipe: any) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      // Map search result to API's expected payload
      const payload = {
        recipe: {
          recipeName: recipe.title,
          description: recipe.description ?? null,
          servings: recipe.servings ?? null,
          prepTimeMinutes: recipe.prepTimeMinutes ?? null,
          cookTimeMinutes: recipe.cookTimeMinutes ?? null,
          ingredients: recipe.ingredients ?? [],
          instructions: recipe.instructions ?? [],
          chefTips: recipe.chefTips ?? [],
        },
      };

      const res = await fetch("/api/favourites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert("Added to favorites!");
        setSearchQuery("");
        setSearchResults([]);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to add favorite.");
    }
  };

  return (
    <header className="w-full bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="font-extrabold text-2xl text-gray-800 hover:text-indigo-600 transition">
            Meal
          </Link>

          <nav className="hidden sm:flex gap-4">
            <Link href="/recipes" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition">
              Recipes
            </Link>
            <Link href="/favourites" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition">
              Favourites
            </Link>
            <Link href="/reviews" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition">
              Ratings & Reviews
            </Link>
            <Link href="/profile" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition">
              Account / Profile
            </Link>
          </nav>

          {/* Search bar */}
          <div className="relative ml-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeSearch();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    executeSearch();
                  }
                }}
                className="px-3 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 placeholder:text-gray-500 bg-white w-56"
              />
              <button
                type="submit"
                disabled={loadingSearch}
                className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
              >
                {loadingSearch ? 'Searching...' : 'Search'}
              </button>
            </form>
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 shadow-lg z-50 max-h-64 overflow-y-auto text-gray-800">
                {searchResults.map((r) => {
                  const added = !!r.isFavorite;
                  return (
                    <div key={r.id} className="flex justify-between items-center px-3 py-2 hover:bg-gray-100">
                      <span className="truncate max-w-[55%] font-medium">{r.title}</span>
                      <button
                        onClick={() => !added && addToFavorites(r)}
                        disabled={added}
                        className={`text-xs px-2 py-1 rounded ${added ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-indigo-500 text-white'}`}
                      >
                        {added ? 'Added' : 'Add'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {searchQuery && !loadingSearch && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 shadow-lg z-50 p-3 text-gray-600 text-sm">
                No recipes found.
              </div>
            )}
          </div>
        </div>

        {/* Right: Auth */}
        <div>
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 transition">
                Login
              </Link>
              <Link href="/register" className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm font-semibold hover:bg-gray-900 transition">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
