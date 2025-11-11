"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    heightCm: "",
    weightKg: "",
    diet: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Load profile on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    async function fetchUser() {
      try {
        const res = await fetch("/api/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const j = await res.json();
          setUser(j.user);
          setForm({
            name: j.user.name || "",
            phone: j.user.phone || "",
            address: j.user.address || "",
            heightCm: j.user.heightCm !== null ? String(j.user.heightCm) : "",
            weightKg: j.user.weightKg !== null ? String(j.user.weightKg) : "",
            diet: j.user.diet || "",
          });
          localStorage.setItem("user", JSON.stringify(j.user));
        } else {
          router.replace("/login");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        router.replace("/login");
      }
    }

    fetchUser();
  }, [router]);

  function handleChange(e: any) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  // ✅ Save profile updates
  const handleSave = async () => {
    setMessage("");
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = {
      ...form,
      heightCm: form.heightCm !== "" ? Number(form.heightCm) : null,
      weightKg: form.weightKg !== "" ? Number(form.weightKg) : null,
    };

    console.log("[PROFILE SAVE] Payload sent to backend:", payload);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage("✅ Profile updated successfully!");
        setEditMode(false);

        // ✅ Re-fetch updated profile (use GET, not POST)
        const res2 = await fetch("/api/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res2.ok) {
          const j = await res2.json();
          setUser(j.user);
          localStorage.setItem("user", JSON.stringify(j.user));
        }
      } else if (res.status === 401) {
        setMessage("Session expired. Please log in again.");
        router.replace("/login");
      } else {
        setMessage("❌ Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setMessage("❌ An error occurred while saving.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  const handleForceClear = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (!user) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6 space-y-6">
      <div className="w-full max-w-2xl flex justify-between mb-4">
        <Button variant="outline" onClick={() => router.push("/")}>← Back</Button>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleForceClear}>Force Clear LocalStorage</Button>
          <Button variant="destructive" onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="w-full max-w-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-black">Account Profile</CardTitle>
        </CardHeader>
        <CardContent className="text-black">
          <div className="mb-4"><span className="font-bold">Email:</span> {user.email}</div>
          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-1 text-black">Name</label>
                <Input name="name" value={form.name} onChange={handleChange} className="text-black" />
              </div>
              <div>
                <label className="block font-bold mb-1 text-black">Phone</label>
                <Input name="phone" value={form.phone} onChange={handleChange} className="text-black" />
              </div>
              <div>
                <label className="block font-bold mb-1 text-black">Address</label>
                <Input name="address" value={form.address} onChange={handleChange} className="text-black" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-bold mb-1 text-black">Height (cm)</label>
                  <Input name="heightCm" type="number" value={form.heightCm} onChange={handleChange} className="text-black" />
                </div>
                <div className="flex-1">
                  <label className="block font-bold mb-1 text-black">Weight (kg)</label>
                  <Input name="weightKg" type="number" value={form.weightKg} onChange={handleChange} className="text-black" />
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1 text-black">Diet Preference</label>
                <select
                  name="diet"
                  value={form.diet}
                  onChange={handleChange}
                  className="w-full border rounded p-2 text-black bg-white"
                >
                  <option value="">Select diet preference</option>
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

              <div className="flex gap-2 mt-4">
                <Button onClick={handleSave} type="button">Save</Button>
                <Button variant="outline" onClick={() => setEditMode(false)} type="button">Cancel</Button>
              </div>

              {message && (
                <div className={`mt-2 ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
                  {message}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div><span className="font-bold text-black">Name:</span> {user.name}</div>
              <div><span className="font-bold text-black">Phone:</span> {user.phone || <span className='text-gray-400'>Not set</span>}</div>
              <div><span className="font-bold text-black">Address:</span> {user.address || <span className='text-gray-400'>Not set</span>}</div>
              <div><span className="font-bold text-black">Height:</span> {user.heightCm ? `${user.heightCm} cm` : <span className='text-gray-400'>Not set</span>}</div>
              <div><span className="font-bold text-black">Weight:</span> {user.weightKg ? `${user.weightKg} kg` : <span className='text-gray-400'>Not set</span>}</div>
              <div><span className="font-bold text-black">Diet Preference:</span> {user.diet || <span className='text-gray-400'>Not set</span>}</div>
              <Button onClick={() => setEditMode(true)} className="mt-2">Edit</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card className="w-full max-w-2xl mt-4 bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-black">Change Password</CardTitle>
        </CardHeader>
        <CardContent className="text-black">
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
