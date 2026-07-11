"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ROLES = ["member", "trainer", "admin"];

export default function UserRow({ user }) {
  const router = useRouter();
  const [role, setRole] = useState(user.role);
  const [loading, setLoading] = useState(false);

  async function changeRole(newRole) {
    setRole(newRole);
    setLoading(true);
    await fetch(`/api/users/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole })
    });
    setLoading(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm(`Remove ${user.name}? This can't be undone.`)) return;
    setLoading(true);
    await fetch(`/api/users/${user._id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <tr className="border-b border-base-line last:border-0">
      <td className="py-3 pr-4 text-ink">{user.name}</td>
      <td className="py-3 pr-4 text-ink-muted text-sm">{user.email}</td>
      <td className="py-3 pr-4">
        <select
          value={role}
          disabled={loading}
          onChange={(e) => changeRole(e.target.value)}
          className="bg-base-raised border border-base-line rounded-md px-2 py-1 text-sm text-ink focus-ring"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </td>
      <td className="py-3 pr-4 font-mono text-sm text-sage">{user.loyaltyPoints}</td>
      <td className="py-3 text-right">
        <button onClick={remove} disabled={loading} className="focus-ring text-xs text-ember hover:underline">
          Remove
        </button>
      </td>
    </tr>
  );
}
