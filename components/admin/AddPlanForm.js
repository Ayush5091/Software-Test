"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPlanForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", description: "", durationDays: "", price: "", perks: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        durationDays: Number(form.durationDays),
        price: Number(form.price),
        perks: form.perks.split(",").map((p) => p.trim()).filter(Boolean)
      })
    });
    if (res.ok) {
      setForm({ name: "", description: "", durationDays: "", price: "", perks: "" });
      setStatus("Plan added.");
      router.refresh();
    } else {
      setStatus("Could not add plan.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 grid sm:grid-cols-2 gap-4 mb-10">
      <input
        placeholder="Plan name"
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink text-sm focus-ring"
      />
      <input
        type="number"
        placeholder="Price ($)"
        required
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        className="bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink text-sm focus-ring"
      />
      <input
        type="number"
        placeholder="Duration (days)"
        required
        value={form.durationDays}
        onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
        className="bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink text-sm focus-ring"
      />
      <input
        placeholder="Perks (comma separated)"
        value={form.perks}
        onChange={(e) => setForm({ ...form, perks: e.target.value })}
        className="bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink text-sm focus-ring"
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink text-sm focus-ring sm:col-span-2"
      />
      <button
        disabled={loading}
        className="focus-ring px-4 py-2 rounded-md bg-signal hover:bg-signal-bright text-white text-sm font-medium disabled:opacity-60 sm:col-span-2"
      >
        {loading ? "Adding…" : "Add plan"}
      </button>
      {status && <p className="text-sm text-ink-muted sm:col-span-2">{status}</p>}
    </form>
  );
}
