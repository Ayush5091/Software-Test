"use client";
import { useEffect, useState } from "react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TrainerSchedulePage() {
  const [trainer, setTrainer] = useState(null);
  const [availability, setAvailability] = useState(
    DAYS.map((_, i) => ({ dayOfWeek: i, slots: [] }))
  );
  const [newSlot, setNewSlot] = useState({});
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const meRes = await fetch("/api/auth/me");
      const me = await meRes.json();
      const trainersRes = await fetch("/api/trainers");
      const { trainers } = await trainersRes.json();
      const mine = trainers.find((t) => t.user?._id === me.user?._id || t.user === me.user?._id);
      if (mine) {
        setTrainer(mine);
        const merged = DAYS.map((_, i) => {
          const existing = mine.availability?.find((a) => a.dayOfWeek === i);
          return { dayOfWeek: i, slots: existing?.slots || [] };
        });
        setAvailability(merged);
      }
      setLoading(false);
    }
    load();
  }, []);

  function addSlot(dayIndex) {
    const slot = newSlot[dayIndex];
    if (!slot) return;
    setAvailability((prev) =>
      prev.map((d, i) => (i === dayIndex ? { ...d, slots: [...new Set([...d.slots, slot])].sort() } : d))
    );
    setNewSlot((prev) => ({ ...prev, [dayIndex]: "" }));
  }

  function removeSlot(dayIndex, slot) {
    setAvailability((prev) =>
      prev.map((d, i) => (i === dayIndex ? { ...d, slots: d.slots.filter((s) => s !== slot) } : d))
    );
  }

  async function save() {
    if (!trainer) return;
    setStatus("Saving…");
    const res = await fetch(`/api/trainers/${trainer._id}/availability`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ availability })
    });
    setStatus(res.ok ? "Saved." : "Could not save.");
  }

  if (loading) return <div className="max-w-4xl mx-auto px-6 py-16 text-ink-muted">Loading…</div>;

  if (!trainer) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-ember">Your account isn't linked to a trainer profile yet — ask an admin to set this up.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">My schedule</h1>
      <p className="text-ink-muted mb-10">Set the time slots members can book you for, by day of the week.</p>

      <div className="space-y-4">
        {DAYS.map((day, i) => (
          <div key={day} className="card p-5">
            <p className="font-display font-semibold text-ink mb-3">{day}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {availability[i].slots.length === 0 && (
                <span className="text-xs text-ink-faint">No slots set</span>
              )}
              {availability[i].slots.map((s) => (
                <span
                  key={s}
                  className="text-xs font-mono bg-base-raised border border-base-line rounded-md px-2 py-1 flex items-center gap-2"
                >
                  {s}
                  <button onClick={() => removeSlot(i, s)} className="text-ember focus-ring">
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="time"
                value={newSlot[i] || ""}
                onChange={(e) => setNewSlot((prev) => ({ ...prev, [i]: e.target.value }))}
                className="bg-base-raised border border-base-line rounded-md px-2 py-1.5 text-sm text-ink focus-ring"
              />
              <button
                onClick={() => addSlot(i)}
                className="focus-ring text-sm px-3 py-1.5 rounded-md border border-base-line text-ink hover:border-signal"
              >
                Add slot
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={save}
        className="focus-ring mt-8 px-6 py-2.5 rounded-md bg-signal hover:bg-signal-bright text-white font-medium transition-colors"
      >
        Save schedule
      </button>
      {status && <p className="text-sm text-ink-muted mt-3">{status}</p>}
    </div>
  );
}
