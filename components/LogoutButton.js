"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="focus-ring px-3 py-2 text-sm text-ink-muted hover:text-ember transition-colors"
    >
      Log out
    </button>
  );
}
