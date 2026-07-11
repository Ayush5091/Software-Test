"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingActions({ bookingId, status }) {
  const router = useRouter();
  const [rescheduling, setRescheduling] = useState(false);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [loading, setLoading] = useState(false);

  async function patch(body) {
    setLoading(true);
    await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    setLoading(false);
    setRescheduling(false);
    router.refresh();
  }

  if (status === "cancelled" || status === "completed" || status === "rejected") {
    return <span className="text-xs text-ink-faint">No actions available</span>;
  }

  if (rescheduling) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={date}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDate(e.target.value)}
          className="bg-base-raised border border-base-line rounded-md px-2 py-1 text-xs text-ink focus-ring"
        />
        <input
          type="time"
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          className="bg-base-raised border border-base-line rounded-md px-2 py-1 text-xs text-ink focus-ring"
        />
        <button
          disabled={loading || !date || !timeSlot}
          onClick={() => patch({ date, timeSlot })}
          className="focus-ring text-xs px-2 py-1 rounded-md bg-signal text-white disabled:opacity-60"
        >
          Save
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        disabled={loading}
        onClick={() => setRescheduling(true)}
        className="focus-ring text-xs text-signal-bright hover:underline"
      >
        Reschedule
      </button>
      <button
        disabled={loading}
        onClick={() => patch({ status: "cancelled" })}
        className="focus-ring text-xs text-ember hover:underline"
      >
        Cancel
      </button>
    </div>
  );
}
