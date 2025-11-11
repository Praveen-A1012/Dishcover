"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  // 🔄 Check token on mount and when it changes in localStorage
  useEffect(() => {
    const checkToken = () => {
      setLoggedIn(!!localStorage.getItem("token"));
    };

    checkToken(); // Initial check

    // Listen for login/logout changes in localStorage (from other tabs or components)
    window.addEventListener("storage", checkToken);

    return () => {
      window.removeEventListener("storage", checkToken);
    };
  }, []);

  // 🔴 Logout handler
  function handleLogout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
    router.push("/login");
  }

  return (
    <header className="w-full bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side: Logo + Nav links */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-extrabold text-2xl text-gray-800 tracking-tight hover:text-indigo-600 transition"
          >
            Meal
          </Link>

          <nav className="hidden sm:flex gap-4">
            <Link
              href="/recipes"
              className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition"
            >
              Recipes
            </Link>
            <Link
              href="/favourites"
              className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition"
            >
              Favourites
            </Link>
            <Link
              href="/reviews"
              className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition"
            >
              Ratings & Reviews
            </Link>
            <Link
              href="/profile"
              className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition"
            >
              Account / Profile
            </Link>
          </nav>
        </div>

        {/* Right side: Auth button */}
        <div>
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
