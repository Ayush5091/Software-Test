import { getSessionUser } from "@/lib/auth";
import BookingForm from "@/components/BookingForm";
import Link from "next/link";

const CLASSES = [
  { title: "HIIT Circuit", time: ["07:00", "18:00"], blurb: "High-intensity intervals, 45 minutes." },
  { title: "Yoga Flow", time: ["06:30", "17:30"], blurb: "Mobility and breathwork, 60 minutes." },
  { title: "Strength Foundations", time: ["09:00", "19:00"], blurb: "Barbell basics, 50 minutes." },
  { title: "Spin", time: ["06:00", "18:30"], blurb: "Cardio cycling class, 40 minutes." }
];

const EQUIPMENT = [
  { title: "Squat rack — Bay 1", time: ["07:00", "12:00", "17:00"] },
  { title: "Rowing machine", time: ["08:00", "13:00", "18:00"] },
  { title: "Bench press station", time: ["07:30", "12:30", "17:30"] }
];

export const dynamic = "force-dynamic";

export default function SessionsPage() {
  const session = getSessionUser();
  const canBook = session && session.role === "member";

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">Sessions & equipment</h1>
      <p className="text-ink-muted mb-10">Reserve a class, or hold a piece of equipment for a time slot.</p>

      <h2 className="font-display font-semibold text-xl text-ink mb-4">Group classes</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-14">
        {CLASSES.map((c) => (
          <div key={c.title} className="card p-6">
            <h3 className="font-display font-semibold text-lg text-ink">{c.title}</h3>
            <p className="text-sm text-ink-muted mt-1 mb-4">{c.blurb}</p>
            {canBook ? (
              <BookingForm type="session" title={c.title} slotOptions={c.time} />
            ) : (
              <Link href="/login" className="text-sm text-signal-bright hover:underline">
                Log in as a member to book →
              </Link>
            )}
          </div>
        ))}
      </div>

      <h2 className="font-display font-semibold text-xl text-ink mb-4">Equipment reservation</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {EQUIPMENT.map((e) => (
          <div key={e.title} className="card p-6">
            <h3 className="font-display font-semibold text-lg text-ink">{e.title}</h3>
            <p className="text-sm text-ink-muted mt-1 mb-4">Reserve a 30-minute block.</p>
            {canBook ? (
              <BookingForm type="equipment" title={e.title} slotOptions={e.time} />
            ) : (
              <Link href="/login" className="text-sm text-signal-bright hover:underline">
                Log in as a member to book →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
