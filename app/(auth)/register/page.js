"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const GOALS = [
  { value: "general_fitness", label: "General fitness" },
  { value: "lose_weight", label: "Lose weight" },
  { value: "build_muscle", label: "Build muscle" },
  { value: "endurance", label: "Endurance" }
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", goal: "general_fitness" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create your account.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">Create your account</h1>
      <p className="text-ink-muted mb-8">Set your goal — the workout planner uses it right away.</p>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        {error && (
          <p className="text-sm text-ember bg-ember/10 border border-ember/30 rounded-md px-3 py-2">{error}</p>
        )}
        <div>
          <label className="text-sm text-ink-muted block mb-1">Full name</label>
          <input
            required
            className="w-full bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink focus-ring"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm text-ink-muted block mb-1">Email</label>
          <input
            type="email"
            required
            className="w-full bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink focus-ring"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm text-ink-muted block mb-1">Password</label>
          <input
            type="password"
            required
            minLength={6}
            className="w-full bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink focus-ring"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm text-ink-muted block mb-1">Fitness goal</label>
          <select
            className="w-full bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink focus-ring"
            value={form.goal}
            onChange={(e) => setForm({ ...form, goal: e.target.value })}
          >
            {GOALS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="focus-ring w-full py-2.5 rounded-md bg-signal hover:bg-signal-bright text-white font-medium transition-colors disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-sm text-ink-muted mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-signal-bright hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
