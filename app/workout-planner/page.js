"use client";
import { useState } from "react";
import ExerciseIllustration from "@/components/ExerciseIllustration";
import { EXERCISES, goalLabel } from "@/lib/exercises";

const GOALS = ["general_fitness", "lose_weight", "build_muscle", "endurance"];

function ExerciseCard({ ex }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card p-5">
      <ExerciseIllustration name={ex.illustration} />
      <div className="mt-4 flex items-start justify-between gap-2">
        <div>
          <h4 className="font-display font-semibold text-ink">{ex.name}</h4>
          <p className="text-xs text-ink-faint mt-0.5">
            {ex.muscle} · {ex.equipment} · {ex.difficulty}
          </p>
        </div>
      </div>
      <p className="font-mono text-sm text-signal-bright mt-2">{ex.sets}</p>
      <button
        onClick={() => setOpen(!open)}
        className="focus-ring text-xs text-ink-muted hover:text-ink mt-3 underline"
      >
        {open ? "Hide steps" : "Show steps"}
      </button>
      {open && (
        <ol className="mt-3 space-y-2 text-sm text-ink-muted list-none">
          {ex.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-mono text-xs text-ember shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default function WorkoutPlannerPage() {
  const [goal, setGoal] = useState("general_fitness");
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generatePlan() {
    setLoading(true);
    const res = await fetch("/api/workouts/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal, daysPerWeek })
    });
    const data = await res.json();
    setPlan(data.plan);
    setLoading(false);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">Workout planner</h1>
      <p className="text-ink-muted mb-10 max-w-2xl">
        Pick a goal and FitBook builds a weekly split from the exercise library below — each move includes
        sets, target muscles, and step-by-step form cues.
      </p>

      <div className="card p-6 mb-12 flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex-1">
          <label className="text-xs text-ink-muted block mb-1">Goal</label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink focus-ring"
          >
            {GOALS.map((g) => (
              <option key={g} value={g}>
                {goalLabel(g)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-ink-muted block mb-1">Days per week</label>
          <select
            value={daysPerWeek}
            onChange={(e) => setDaysPerWeek(Number(e.target.value))}
            className="bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink focus-ring"
          >
            {[2, 3, 4, 5].map((d) => (
              <option key={d} value={d}>
                {d} days
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={generatePlan}
          disabled={loading}
          className="focus-ring px-6 py-2.5 rounded-md bg-signal hover:bg-signal-bright text-white font-medium transition-colors disabled:opacity-60"
        >
          {loading ? "Building plan…" : "Generate plan"}
        </button>
      </div>

      {plan && (
        <div className="mb-16">
          <h2 className="font-display font-semibold text-xl text-ink mb-5">
            Your {plan.daysPerWeek}-day {plan.goalLabel} split
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plan.days.map((d) => (
              <div key={d.day} className="card p-5">
                <p className="font-mono text-xs text-ember tracking-widest mb-3">{d.day.toUpperCase()}</p>
                <ul className="space-y-2">
                  {d.exercises.map((ex) => (
                    <li key={ex.id} className="text-sm text-ink flex justify-between">
                      <span>{ex.name}</span>
                      <span className="text-ink-faint font-mono text-xs">{ex.sets}</span>
                    </li>
                  ))}
                  {d.exercises.length === 0 && <li className="text-sm text-ink-faint">Rest day</li>}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="font-display font-semibold text-xl text-ink mb-5">Full exercise library</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {EXERCISES.map((ex) => (
          <ExerciseCard key={ex.id} ex={ex} />
        ))}
      </div>
    </div>
  );
}
