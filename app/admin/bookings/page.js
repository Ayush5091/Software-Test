import dbConnect from "@/lib/dbConnect";
import Booking from "@/lib/models/Booking";
import AdminBookingStatus from "@/components/admin/AdminBookingStatus";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  await dbConnect();
  const bookings = await Booking.find()
    .populate("member", "name email")
    .populate({ path: "trainer", populate: { path: "user", select: "name" } })
    .sort({ date: -1 })
    .limit(200)
    .lean();

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">All bookings</h1>
      <p className="text-ink-muted mb-10">{bookings.length} bookings across sessions, trainers, and equipment.</p>

      <div className="card overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs text-ink-faint border-b border-base-line">
              <th className="p-4 font-normal">Title</th>
              <th className="p-4 font-normal">Member</th>
              <th className="p-4 font-normal">Type</th>
              <th className="p-4 font-normal">When</th>
              <th className="p-4 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-b border-base-line last:border-0">
                <td className="p-4 text-ink">{b.title}</td>
                <td className="p-4 text-sm text-ink-muted">{b.member?.name}</td>
                <td className="p-4 text-xs uppercase text-ink-faint">{b.type}</td>
                <td className="p-4 text-xs text-ink-muted font-mono">
                  {new Date(b.date).toLocaleDateString()} · {b.timeSlot}
                </td>
                <td className="p-4">
                  <AdminBookingStatus bookingId={b._id.toString()} status={b.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && <p className="text-sm text-ink-muted p-4">No bookings yet.</p>}
      </div>
    </div>
  );
}
