"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not log in.");
        setLoading(false);
        return;
      }
      const next = params.get("next");
      const dest =
        next || (data.user.role === "admin" ? "/admin/users" : data.user.role === "trainer" ? "/trainer/appointments" : "/dashboard");
      router.push(dest);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">Log in</h1>
      <p className="text-ink-muted mb-8">Welcome back. Pick up where you left off.</p>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        {error && (
          <p className="text-sm text-ember bg-ember/10 border border-ember/30 rounded-md px-3 py-2">{error}</p>
        )}
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
            className="w-full bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink focus-ring"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="focus-ring w-full py-2.5 rounded-md bg-signal hover:bg-signal-bright text-white font-medium transition-colors disabled:opacity-60"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="text-sm text-ink-muted mt-6">
        New to FitBook?{" "}
        <Link href="/register" className="text-signal-bright hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
