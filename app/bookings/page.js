import { getSessionUser } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/lib/models/Booking";
import BookingActions from "@/components/BookingActions";

export const dynamic = "force-dynamic";

const STATUS_COLOR = {
  confirmed: "text-sage",
  pending: "text-signal-bright",
  cancelled: "text-ink-faint",
  rejected: "text-ember",
  completed: "text-ink-muted"
};

export default async function BookingsPage() {
  const session = getSessionUser();
  await dbConnect();
  const bookings = await Booking.find({ member: session.id })
    .populate({ path: "trainer", populate: { path: "user", select: "name" } })
    .sort({ date: -1 })
    .lean();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">Booking history</h1>
      <p className="text-ink-muted mb-10">Every session, trainer booking, and equipment reservation you've made.</p>

      {bookings.length === 0 ? (
        <p className="text-ink-muted">No bookings yet.</p>
      ) : (
        <div className="card divide-y divide-base-line">
          {bookings.map((b) => (
            <div key={b._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-ink font-medium">{b.title}</p>
                <p className="text-xs text-ink-faint mt-1">
                  {new Date(b.date).toLocaleDateString()} · {b.timeSlot} · <span className="uppercase">{b.type}</span>
                </p>
                {b.notes && <p className="text-xs text-ink-muted mt-1">Note: {b.notes}</p>}
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-mono uppercase tracking-wide ${STATUS_COLOR[b.status]}`}>
                  {b.status}
                </span>
                <BookingActions bookingId={b._id.toString()} status={b.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
