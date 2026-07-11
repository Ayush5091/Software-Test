"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingForm({ type, title, trainerId, slotOptions }) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState(slotOptions?.[0] || "07:00");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, title, trainer: trainerId || null, date, timeSlot, notes })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("Booked! Check My Bookings for the confirmation.");
        router.refresh();
      } else {
        setStatus(data.error || "Could not book that slot.");
      }
    } catch {
      setStatus("Network error. Please try again.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="border border-base-line rounded-card p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-ink-muted block mb-1">Date</label>
          <input
            type="date"
            required
            min={new Date().toISOString().split("T")[0]}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-base-raised border border-base-line rounded-md px-2 py-1.5 text-ink text-sm focus-ring"
          />
        </div>
        <div>
          <label className="text-xs text-ink-muted block mb-1">Time slot</label>
          {slotOptions?.length ? (
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full bg-base-raised border border-base-line rounded-md px-2 py-1.5 text-ink text-sm focus-ring"
            >
              {slotOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="time"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full bg-base-raised border border-base-line rounded-md px-2 py-1.5 text-ink text-sm focus-ring"
            />
          )}
        </div>
      </div>
      <input
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full bg-base-raised border border-base-line rounded-md px-2 py-1.5 text-ink text-sm focus-ring"
      />
      <button
        type="submit"
        disabled={loading}
        className="focus-ring w-full py-2 rounded-md bg-signal hover:bg-signal-bright text-white text-sm font-medium transition-colors disabled:opacity-60"
      >
        {loading ? "Booking…" : "Confirm booking"}
      </button>
      {status && <p className="text-xs text-ink-muted">{status}</p>}
    </form>
  );
}
