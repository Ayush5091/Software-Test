"use client";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QRCheckIn({ userId, loyaltyPoints }) {
  const [points, setPoints] = useState(loyaltyPoints || 0);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function simulateScan() {
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch("/api/checkin", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setPoints(data.loyaltyPoints);
        setStatus(`Checked in — ${data.totalVisits} total visits.`);
      } else {
        setStatus(data.error || "Check-in failed.");
      }
    } catch {
      setStatus("Network error. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="card p-6">
      <h3 className="font-display font-semibold text-lg text-ink mb-1">QR check-in</h3>
      <p className="text-sm text-ink-muted mb-5">Show this code at the front desk scanner to check in.</p>

      <div className="flex items-center gap-5">
        <div className="bg-white p-3 rounded-card">
          <QRCodeSVG value={`fitbook-checkin:${userId}`} size={96} />
        </div>
        <div>
          <p className="text-xs text-ink-faint mb-1">Loyalty points</p>
          <p className="font-mono text-2xl text-sage">{points}</p>
          <button
            onClick={simulateScan}
            disabled={loading}
            className="focus-ring mt-3 text-sm px-3 py-1.5 rounded-md border border-base-line text-ink hover:border-signal transition-colors disabled:opacity-60"
          >
            {loading ? "Scanning…" : "Simulate scan"}
          </button>
        </div>
      </div>
      {status && <p className="text-sm text-ink-muted mt-4">{status}</p>}
    </div>
  );
}
