"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlanRow({ plan }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function deactivate() {
    if (!confirm(`Deactivate the ${plan.name} plan?`)) return;
    setLoading(true);
    await fetch(`/api/plans/${plan._id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <tr className="border-b border-base-line last:border-0">
      <td className="py-3 pr-4 text-ink">{plan.name}</td>
      <td className="py-3 pr-4 font-mono text-sm text-ink">${plan.price}</td>
      <td className="py-3 pr-4 text-sm text-ink-muted">{plan.durationDays} days</td>
      <td className="py-3 text-right">
        <button onClick={deactivate} disabled={loading} className="focus-ring text-xs text-ember hover:underline">
          Deactivate
        </button>
      </td>
    </tr>
  );
}
