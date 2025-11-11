"use client";
import { useState } from "react";

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleChange(e: any) {
    e.preventDefault();
    setMessage("");
    if (!oldPassword || !newPassword || !confirm) {
      setMessage("All fields required");
      return;
    }
    if (newPassword !== confirm) {
      setMessage("Passwords do not match");
      return;
    }
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (res.ok) {
        setMessage("Password changed");
        setOldPassword(""); setNewPassword(""); setConfirm("");
      } else {
        const j = await res.json();
        setMessage(j.error || "Failed to change password");
      }
    } catch {
      setMessage("Failed to change password");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleChange} className="space-y-3">
      <div>
        <label className="block font-bold">Old Password</label>
        <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full border rounded p-2" />
      </div>
      <div>
        <label className="block font-bold">New Password</label>
        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full border rounded p-2" />
      </div>
      <div>
        <label className="block font-bold">Confirm New Password</label>
        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full border rounded p-2" />
      </div>
      <button type="submit" className="px-4 py-2 bg-black text-white rounded font-bold" disabled={loading}>
        Change Password
      </button>
      {message && <div className="mt-2 text-red-600">{message}</div>}
    </form>
  );
}