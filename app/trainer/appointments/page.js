import { getSessionUser } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Trainer from "@/lib/models/Trainer";
import Booking from "@/lib/models/Booking";
import TrainerBookingActions from "@/components/TrainerBookingActions";

export const dynamic = "force-dynamic";

const STATUS_COLOR = {
  confirmed: "text-sage",
  pending: "text-signal-bright",
  cancelled: "text-ink-faint",
  rejected: "text-ember",
  completed: "text-ink-muted"
};

export default async function TrainerAppointmentsPage() {
  const session = getSessionUser();
  await dbConnect();

  const trainerProfile = await Trainer.findOne({ user: session.id }).lean();
  const bookings = trainerProfile
    ? await Booking.find({ trainer: trainerProfile._id })
        .populate("member", "name email")
        .sort({ date: 1 })
        .lean()
    : [];

  const today = new Date().setHours(0, 0, 0, 0);
  const todays = bookings.filter((b) => new Date(b.date).setHours(0, 0, 0, 0) === today);
  const upcoming = bookings.filter((b) => new Date(b.date).setHours(0, 0, 0, 0) > today);

  function renderList(list, emptyText) {
    if (list.length === 0) return <p className="text-sm text-ink-muted">{emptyText}</p>;
    return (
      <div className="card divide-y divide-base-line">
        {list.map((b) => (
          <div key={b._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-ink font-medium">{b.title}</p>
              <p className="text-xs text-ink-faint mt-1">
                {new Date(b.date).toLocaleDateString()} · {b.timeSlot} · {b.member?.name}
              </p>
              {b.notes && <p className="text-xs text-ink-muted mt-1">Note: {b.notes}</p>}
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-xs font-mono uppercase tracking-wide ${STATUS_COLOR[b.status]}`}>
                {b.status}
              </span>
              <TrainerBookingActions bookingId={b._id.toString()} status={b.status} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">Appointments</h1>
      <p className="text-ink-muted mb-10">Accept or reject session requests, and track today's schedule.</p>

      {!trainerProfile ? (
        <p className="text-ember">
          Your account isn't linked to a trainer profile yet — ask an admin to set this up.
        </p>
      ) : (
        <>
          <h2 className="font-display font-semibold text-xl text-ink mb-4">Today</h2>
          <div className="mb-12">{renderList(todays, "No appointments today.")}</div>

          <h2 className="font-display font-semibold text-xl text-ink mb-4">Upcoming</h2>
          {renderList(upcoming, "Nothing else on the books yet.")}
        </>
      )}
    </div>
  );
}
