"use client";
import { useEffect, useState } from "react";
import ProgressChart from "@/components/charts/ProgressChart";
import { DIET_PLANS } from "@/lib/diet";

export default function ProgressPage() {
  const [data, setData] = useState(null);
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  const [goal, setGoal] = useState("general_fitness");
  const [saving, setSaving] = useState(false);

  async function load() {
    const [progressRes, meRes] = await Promise.all([fetch("/api/progress"), fetch("/api/auth/me")]);
    const progress = await progressRes.json();
    const me = await meRes.json();
    setData(progress);
    if (me.user?.goal) setGoal(me.user.goal);
  }

  useEffect(() => {
    load();
  }, []);

  async function addLog(e) {
    e.preventDefault();
    if (!weight) return;
    setSaving(true);
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weightKg: parseFloat(weight), note })
    });
    setWeight("");
    setNote("");
    setSaving(false);
    load();
  }

  const diet = DIET_PLANS[goal] || DIET_PLANS.general_fitness;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">Progress dashboard</h1>
      <p className="text-ink-muted mb-10">Track your weight trend, attendance, and diet direction in one place.</p>

      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <div className="card p-6 lg:col-span-2">
          <h3 className="font-display font-semibold text-lg text-ink mb-4">Weight trend</h3>
          <ProgressChart logs={data?.progressLogs} />
        </div>
        <div className="card p-6">
          <h3 className="font-display font-semibold text-lg text-ink mb-4">Log a weigh-in</h3>
          <form onSubmit={addLog} className="space-y-3">
            <input
              type="number"
              step="0.1"
              placeholder="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink font-mono focus-ring"
            />
            <input
              placeholder="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink text-sm focus-ring"
            />
            <button
              disabled={saving}
              className="focus-ring w-full py-2 rounded-md bg-signal hover:bg-signal-bright text-white text-sm font-medium disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save log"}
            </button>
          </form>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-display font-semibold text-lg text-ink mb-1">Attendance</h3>
          <p className="text-sm text-ink-muted mb-4">Check-ins logged via QR at the front desk.</p>
          <p className="font-mono text-3xl text-sage">{data?.attendance?.length || 0}</p>
          <p className="text-xs text-ink-faint mt-1">total visits</p>
        </div>

        <div className="card p-6">
          <h3 className="font-display font-semibold text-lg text-ink mb-1">Diet direction</h3>
          <p className="text-sm text-ink-muted mb-4">{diet.summary}</p>
          <ul className="text-sm text-ink space-y-1.5">
            {diet.meals.map((m) => (
              <li key={m}>• {m}</li>
            ))}
          </ul>
          <p className="text-[11px] text-ink-faint mt-4">
            General guidance only — check with a nutritionist for a plan tailored to you.
          </p>
        </div>
      </div>
    </div>
  );
}
