import dbConnect from "@/lib/dbConnect";
import Trainer from "@/lib/models/Trainer";
import { getSessionUser } from "@/lib/auth";
import BookingForm from "@/components/BookingForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

function allSlots(trainer) {
  const slots = new Set();
  trainer.availability?.forEach((a) => a.slots.forEach((s) => slots.add(s)));
  return Array.from(slots).sort();
}

export default async function TrainersPage() {
  await dbConnect();
  const session = getSessionUser();
  const trainers = await Trainer.find().populate("user", "name email").lean();

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">Personal trainers</h1>
      <p className="text-ink-muted mb-10">Book 1:1 coaching with a specialist.</p>

      {trainers.length === 0 ? (
        <p className="text-ink-muted">No trainers listed yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {trainers.map((t) => (
            <div key={t._id} className="card p-6">
              <h3 className="font-display font-semibold text-xl text-ink">{t.user?.name}</h3>
              <p className="text-sm text-ember mt-1">{t.specialties?.join(" · ")}</p>
              <p className="text-sm text-ink-muted mt-2">{t.bio}</p>
              <p className="font-mono text-lg text-ink mt-3">${t.ratePerSession} / session</p>

              <div className="mt-5">
                {session && session.role === "member" ? (
                  <BookingForm
                    type="trainer"
                    title={`1:1 session with ${t.user?.name}`}
                    trainerId={t._id.toString()}
                    slotOptions={allSlots(t)}
                  />
                ) : (
                  <Link href="/login" className="text-sm text-signal-bright hover:underline">
                    Log in as a member to book →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
