"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrainerBookingActions({ bookingId, status }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setStatus(next) {
    setLoading(true);
    await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next })
    });
    setLoading(false);
    router.refresh();
  }

  if (status !== "pending" && status !== "confirmed") {
    return <span className="text-xs text-ink-faint">No actions available</span>;
  }

  return (
    <div className="flex items-center gap-3">
      {status === "pending" && (
        <>
          <button
            disabled={loading}
            onClick={() => setStatus("confirmed")}
            className="focus-ring text-xs text-sage hover:underline"
          >
            Accept
          </button>
          <button
            disabled={loading}
            onClick={() => setStatus("rejected")}
            className="focus-ring text-xs text-ember hover:underline"
          >
            Reject
          </button>
        </>
      )}
      {status === "confirmed" && (
        <button
          disabled={loading}
          onClick={() => setStatus("completed")}
          className="focus-ring text-xs text-signal-bright hover:underline"
        >
          Mark completed
        </button>
      )}
    </div>
  );
}
