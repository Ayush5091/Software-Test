"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyPlanButton({ planId, price }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("demo_card");
  const [done, setDone] = useState(false);

  async function handlePay() {
    setLoading(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose: "membership", referenceId: planId, amount: price, method })
      });
      if (res.ok) {
        setDone(true);
        router.refresh();
      }
    } catch {
      // no-op, button re-enables
    }
    setLoading(false);
  }

  if (done) {
    return <p className="text-sm text-sage">Plan activated. Check your dashboard.</p>;
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="focus-ring w-full py-2.5 rounded-md bg-signal hover:bg-signal-bright text-white font-medium transition-colors"
      >
        Choose plan
      </button>
    );
  }

  return (
    <div className="border border-base-line rounded-card p-4 space-y-3">
      <p className="text-xs text-ink-faint">Demo checkout — no real charge is made.</p>
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className="w-full bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink text-sm focus-ring"
      >
        <option value="demo_card">Card ending 4242</option>
        <option value="demo_upi">UPI</option>
      </select>
      <button
        onClick={handlePay}
        disabled={loading}
        className="focus-ring w-full py-2.5 rounded-md bg-ember hover:bg-ember-dim text-white font-medium transition-colors disabled:opacity-60"
      >
        {loading ? "Processing…" : `Pay $${price}`}
      </button>
    </div>
  );
}
