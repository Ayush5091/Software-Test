import Link from "next/link";
import StatTicker from "@/components/StatTicker";
import { Dumbbell, CalendarCheck, QrCode, LineChart, Users, Sparkles } from "lucide-react";

const FEATURES = [
  {
    icon: CalendarCheck,
    title: "Book sessions & trainers",
    body: "Reserve classes, 1:1 coaching, or equipment in a few taps. Reschedule or cancel without calling the front desk."
  },
  {
    icon: Sparkles,
    title: "AI workout planner",
    body: "Tell FitBook your goal — lose weight, build muscle, endurance — and get a structured weekly plan with step-by-step form cues."
  },
  {
    icon: QrCode,
    title: "QR check-in",
    body: "Scan in at the door. Attendance and loyalty points are logged automatically, no front-desk queue."
  },
  {
    icon: LineChart,
    title: "Progress dashboard",
    body: "Track weight trends, attendance streaks, and BMI over time in one clean view."
  },
  {
    icon: Users,
    title: "Built for three roles",
    body: "Members book and track. Trainers manage schedules and appointments. Admins run the whole gym from one dashboard."
  },
  {
    icon: Dumbbell,
    title: "Membership plans",
    body: "Browse tiered plans, pay securely (demo checkout included), and see exactly what's active on your account."
  }
];

export default function HomePage() {
  return (
    <div>
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-14 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-sage mb-5">
            GYM BOOKING &amp; MEMBERSHIP OS
          </p>
          <h1 className="font-display font-bold text-5xl sm:text-6xl leading-[1.05] tracking-tight text-ink">
            Train with intent.
            <br />
            <span className="text-signal-bright">Book, track, repeat.</span>
          </h1>
          <p className="mt-6 text-lg text-ink-muted max-w-xl">
            FitBook replaces the front-desk clipboard: membership plans, trainer bookings,
            QR check-in, and an AI-built workout plan — all in one place, for members,
            trainers, and admins alike.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="focus-ring px-6 py-3 rounded-md bg-signal hover:bg-signal-bright text-white font-medium transition-colors"
            >
              Start your membership
            </Link>
            <Link
              href="/workout-planner"
              className="focus-ring px-6 py-3 rounded-md border border-base-line text-ink hover:border-signal transition-colors"
            >
              Try the AI planner
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <p className="text-xs font-mono text-ink-faint mb-4 tracking-widest">TODAY AT A GLANCE</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { k: "07:00", v: "HIIT with Marcus — 6 spots left" },
              { k: "09:00", v: "Strength coaching — Ariana" },
              { k: "17:00", v: "Yoga Flow — Priya" },
              { k: "18:00", v: "Open floor — equipment booking" }
            ].map((row) => (
              <div key={row.k} className="border border-base-line rounded-card p-4">
                <p className="font-mono text-signal-bright text-sm">{row.k}</p>
                <p className="text-sm text-ink-muted mt-1">{row.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StatTicker />

      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="font-display font-semibold text-3xl text-ink mb-2">Everything the gym needs</h2>
        <p className="text-ink-muted mb-12 max-w-2xl">
          One system for the front desk, the coaching staff, and the people on the floor.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6">
              <f.icon size={22} className="text-ember mb-4" />
              <h3 className="font-display font-semibold text-lg text-ink mb-2">{f.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="card p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-semibold text-2xl text-ink">Ready to book your first session?</h3>
            <p className="text-ink-muted mt-2">Create an account — it takes under a minute.</p>
          </div>
          <Link
            href="/register"
            className="focus-ring px-6 py-3 rounded-md bg-ember hover:bg-ember-dim text-white font-medium whitespace-nowrap transition-colors"
          >
            Join FitBook
          </Link>
        </div>
      </section>
    </div>
  );
}
