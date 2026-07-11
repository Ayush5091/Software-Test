"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrainerRow({ trainer }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function remove() {
    if (!confirm(`Remove trainer ${trainer.user?.name}?`)) return;
    setLoading(true);
    await fetch(`/api/trainers/${trainer._id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <tr className="border-b border-base-line last:border-0">
      <td className="py-3 pr-4 text-ink">{trainer.user?.name}</td>
      <td className="py-3 pr-4 text-ink-muted text-sm">{trainer.user?.email}</td>
      <td className="py-3 pr-4 text-sm text-ember">{trainer.specialties?.join(", ")}</td>
      <td className="py-3 pr-4 font-mono text-sm text-ink">${trainer.ratePerSession}</td>
      <td className="py-3 text-right">
        <button onClick={remove} disabled={loading} className="focus-ring text-xs text-ember hover:underline">
          Remove
        </button>
      </td>
    </tr>
  );
}
