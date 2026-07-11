"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddTrainerForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", specialties: "", ratePerSession: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    const res = await fetch("/api/trainers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        specialties: form.specialties.split(",").map((s) => s.trim()).filter(Boolean),
        ratePerSession: Number(form.ratePerSession) || 0
      })
    });
    const data = await res.json();
    if (res.ok) {
      setStatus("Trainer added.");
      setForm({ name: "", email: "", password: "", specialties: "", ratePerSession: "" });
      router.refresh();
    } else {
      setStatus(data.error || "Could not add trainer.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 grid sm:grid-cols-2 gap-4 mb-10">
      <input
        placeholder="Full name"
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink text-sm focus-ring"
      />
      <input
        type="email"
        placeholder="Email"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink text-sm focus-ring"
      />
      <input
        type="password"
        placeholder="Temporary password"
        required
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink text-sm focus-ring"
      />
      <input
        placeholder="Specialties (comma separated)"
        value={form.specialties}
        onChange={(e) => setForm({ ...form, specialties: e.target.value })}
        className="bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink text-sm focus-ring"
      />
      <input
        type="number"
        placeholder="Rate per session ($)"
        value={form.ratePerSession}
        onChange={(e) => setForm({ ...form, ratePerSession: e.target.value })}
        className="bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink text-sm focus-ring"
      />
      <button
        disabled={loading}
        className="focus-ring px-4 py-2 rounded-md bg-signal hover:bg-signal-bright text-white text-sm font-medium disabled:opacity-60"
      >
        {loading ? "Adding…" : "Add trainer"}
      </button>
      {status && <p className="text-sm text-ink-muted sm:col-span-2">{status}</p>}
    </form>
  );
}
