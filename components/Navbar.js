import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

const memberLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/plans", label: "Plans" },
  { href: "/trainers", label: "Trainers" },
  { href: "/sessions", label: "Sessions" },
  { href: "/workout-planner", label: "Planner" },
  { href: "/bookings", label: "Bookings" }
];

const trainerLinks = [
  { href: "/trainer/appointments", label: "Appointments" },
  { href: "/trainer/schedule", label: "My Schedule" }
];

const adminLinks = [
  { href: "/admin/users", label: "Users" },
  { href: "/admin/trainers", label: "Trainers" },
  { href: "/admin/plans", label: "Plans" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/announcements", label: "Announcements" }
];

export default function Navbar({ user }) {
  const links = !user
    ? []
    : user.role === "admin"
    ? adminLinks
    : user.role === "trainer"
    ? trainerLinks
    : memberLinks;

  return (
    <header className="sticky top-0 z-40 bg-base/90 backdrop-blur border-b border-base-line">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="font-display font-bold text-xl tracking-tight text-ink flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-signal inline-block" />
          FitBook
        </Link>

        <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="focus-ring px-3 py-2 text-sm text-ink-muted hover:text-ink rounded-md transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-ink-muted font-mono">{user.name}</span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="focus-ring px-3 py-2 text-sm text-ink-muted hover:text-ink">
                Log in
              </Link>
              <Link
                href="/register"
                className="focus-ring px-4 py-2 text-sm font-medium rounded-md bg-signal hover:bg-signal-bright text-white transition-colors"
              >
                Join now
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
