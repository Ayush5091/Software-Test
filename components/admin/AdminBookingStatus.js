"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["pending", "confirmed", "rejected", "cancelled", "completed"];

export default function AdminBookingStatus({ bookingId, status }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [loading, setLoading] = useState(false);

  async function update(newStatus) {
    setValue(newStatus);
    setLoading(true);
    await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <select
      value={value}
      disabled={loading}
      onChange={(e) => update(e.target.value)}
      className="bg-base-raised border border-base-line rounded-md px-2 py-1 text-xs text-ink focus-ring"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
