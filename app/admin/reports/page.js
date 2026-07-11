import { getSessionUser } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import Trainer from "@/lib/models/Trainer";
import Booking from "@/lib/models/Booking";
import Payment from "@/lib/models/Payment";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  await dbConnect();

  const [totalMembers, totalTrainers, totalBookings, bookingsByStatus, revenueAgg, recentPayments] =
    await Promise.all([
      User.countDocuments({ role: "member" }),
      Trainer.countDocuments(),
      Booking.countDocuments(),
      Booking.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Payment.aggregate([
        { $match: { status: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Payment.find().sort({ createdAt: -1 }).limit(8).populate("user", "name").lean()
    ]);

  const statusMap = Object.fromEntries(bookingsByStatus.map((b) => [b._id, b.count]));
  const maxCount = Math.max(1, ...Object.values(statusMap));

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">Reports & analytics</h1>
      <p className="text-ink-muted mb-10">A snapshot of gym activity.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="card p-6">
          <p className="text-xs text-ink-faint mb-1">Members</p>
          <p className="font-mono text-3xl text-ink">{totalMembers}</p>
        </div>
        <div className="card p-6">
          <p className="text-xs text-ink-faint mb-1">Trainers</p>
          <p className="font-mono text-3xl text-ink">{totalTrainers}</p>
        </div>
        <div className="card p-6">
          <p className="text-xs text-ink-faint mb-1">Total bookings</p>
          <p className="font-mono text-3xl text-ink">{totalBookings}</p>
        </div>
        <div className="card p-6">
          <p className="text-xs text-ink-faint mb-1">Revenue collected</p>
          <p className="font-mono text-3xl text-sage">${(revenueAgg[0]?.total || 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-display font-semibold text-lg text-ink mb-5">Bookings by status</h3>
          <div className="space-y-3">
            {Object.entries(statusMap).length === 0 && <p className="text-sm text-ink-muted">No bookings yet.</p>}
            {Object.entries(statusMap).map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between text-xs text-ink-muted mb-1">
                  <span className="uppercase font-mono">{status}</span>
                  <span className="font-mono">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-base-raised overflow-hidden">
                  <div
                    className="h-full bg-signal rounded-full"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-display font-semibold text-lg text-ink mb-5">Recent payments</h3>
          {recentPayments.length === 0 ? (
            <p className="text-sm text-ink-muted">No payments yet.</p>
          ) : (
            <ul className="divide-y divide-base-line">
              {recentPayments.map((p) => (
                <li key={p._id} className="py-3 flex justify-between text-sm">
                  <span className="text-ink">{p.user?.name}</span>
                  <span className="font-mono text-ink-muted">${p.amount}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
