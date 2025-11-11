"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

const DIETS = [
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Non-Vegetarian",
  "Keto",
  "Paleo",
  "Gluten-Free",
  "Dairy-Free",
  "Low-Carb",
  "Low-Fat",
  "Other"
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
    heightCm: "",
    weightKg: "",
    diet: "None",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Basic client validation
    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }
    // Require: min 8 chars, 1 upper, 1 lower, 1 number, 1 special character
    const strongPw = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!strongPw.test(form.password)) {
      setError("Password must be at least 8 characters and include upper, lower, number, and special character.");
      return;
    }

    const ageNum = form.age ? parseInt(form.age, 10) : undefined;
    const heightNum = form.heightCm ? parseInt(form.heightCm, 10) : undefined;
    const weightNum = form.weightKg ? parseInt(form.weightKg, 10) : undefined;

    if (ageNum && (ageNum < 5 || ageNum > 120)) {
      setError("Age must be between 5 and 120.");
      return;
    }
    if (heightNum && (heightNum < 50 || heightNum > 300)) {
      setError("Height must be between 50 and 300 cm.");
      return;
    }
    if (weightNum && (weightNum < 20 || weightNum > 500)) {
      setError("Weight must be between 20 and 500 kg.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          name: form.name.trim() || null,
          age: ageNum || null, // stored once migration applied
          heightCm: heightNum || null,
          weightKg: weightNum || null,
          diet: form.diet === "None" ? null : form.diet,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Registration failed");
      } else {
        // no token returned by register route currently; login after register
        router.push("/login");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-black mb-6 text-center">Create your account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-black">Email</label>
            <Input type="email" name="email" value={form.email} onChange={handleChange} required autoComplete="email" className="bg-white text-black placeholder:text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-black">Password</label>
            <Input type="password" name="password" value={form.password} onChange={handleChange} required autoComplete="new-password" className="bg-white text-black placeholder:text-gray-500" />
            <p className="text-xs text-muted-foreground mt-1">Minimum 6 characters.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-black">Name</label>
            <Input name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="bg-white text-black placeholder:text-gray-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-black">Age</label>
              <Input type="number" name="age" value={form.age} onChange={handleChange} placeholder="Years" min={5} max={120} className="bg-white text-black placeholder:text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-black">Dietary Preference</label>
              <select name="diet" value={form.diet} onChange={handleChange} className="border rounded-md px-3 py-2 w-full text-black bg-white">
                <option value="">Select diet preference</option>
                {DIETS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-black">Height (cm)</label>
              <Input type="number" name="heightCm" value={form.heightCm} onChange={handleChange} placeholder="e.g. 175" min={50} max={300} className="bg-white text-black placeholder:text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-black">Weight (kg)</label>
              <Input type="number" name="weightKg" value={form.weightKg} onChange={handleChange} placeholder="e.g. 70" min={20} max={500} className="bg-white text-black placeholder:text-gray-500" />
            </div>
          </div>
          {error && <div className="text-red-600 text-sm font-medium text-center">{error}</div>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
        <div className="text-center mt-4">
          <button onClick={() => router.push('/login')} className="text-indigo-600 text-sm font-medium hover:underline">Already have an account? Sign in</button>
        </div>
      </div>
    </div>
  );
}
