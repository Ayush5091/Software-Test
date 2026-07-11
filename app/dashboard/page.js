import { getSessionUser } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import Booking from "@/lib/models/Booking";
import MembershipPlan from "@/lib/models/MembershipPlan";
import BMICalculator from "@/components/BMICalculator";
import QRCheckIn from "@/components/QRCheckIn";
import Link from "next/link";
import { goalLabel } from "@/lib/exercises";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = getSessionUser();
  await dbConnect();

  const user = await User.findById(session.id).populate("activeMembership.plan").lean();
  const upcoming = await Booking.find({
    member: session.id,
    status: { $in: ["confirmed", "pending"] },
    date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
  })
    .sort({ date: 1 })
    .limit(5)
    .lean();

  const membershipActive =
    user.activeMembership?.endDate && new Date(user.activeMembership.endDate) > new Date();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-display font-bold text-3xl text-ink mb-1">Welcome back, {user.name.split(" ")[0]}</h1>
      <p className="text-ink-muted mb-10">Goal: {goalLabel(user.goal)}</p>

      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <div className="card p-6">
          <p className="text-xs text-ink-faint mb-1">Membership</p>
          {membershipActive ? (
            <>
              <p className="font-display font-semibold text-xl text-ink">{user.activeMembership.plan.name}</p>
              <p className="text-sm text-ink-muted mt-1">
                Active until {new Date(user.activeMembership.endDate).toLocaleDateString()}
              </p>
            </>
          ) : (
            <>
              <p className="font-display font-semibold text-xl text-ink">No active plan</p>
              <Link href="/plans" className="text-sm text-signal-bright hover:underline mt-1 inline-block">
                Browse membership plans →
              </Link>
            </>
          )}
        </div>

        <div className="card p-6">
          <p className="text-xs text-ink-faint mb-1">Loyalty points</p>
          <p className="font-mono text-3xl text-sage">{user.loyaltyPoints}</p>
          <p className="text-sm text-ink-muted mt-1">{user.attendance?.length || 0} total check-ins</p>
        </div>

        <div className="card p-6">
          <p className="text-xs text-ink-faint mb-1">Upcoming bookings</p>
          <p className="font-mono text-3xl text-ink">{upcoming.length}</p>
          <Link href="/bookings" className="text-sm text-signal-bright hover:underline mt-1 inline-block">
            View booking history →
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        <BMICalculator initialHeight={user.heightCm} initialWeight={user.weightKg} />
        <QRCheckIn userId={user._id.toString()} loyaltyPoints={user.loyaltyPoints} />
      </div>

      <div className="card p-6">
        <h3 className="font-display font-semibold text-lg text-ink mb-4">Upcoming sessions</h3>
        {upcoming.length === 0 ? (
          <p className="text-sm text-ink-muted">
            Nothing booked yet.{" "}
            <Link href="/sessions" className="text-signal-bright hover:underline">
              Book a session
            </Link>{" "}
            or{" "}
            <Link href="/trainers" className="text-signal-bright hover:underline">
              find a trainer
            </Link>
            .
          </p>
        ) : (
          <ul className="divide-y divide-base-line">
            {upcoming.map((b) => (
              <li key={b._id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-ink">{b.title}</p>
                  <p className="text-xs text-ink-faint">
                    {new Date(b.date).toLocaleDateString()} · {b.timeSlot}
                  </p>
                </div>
                <span className="text-xs font-mono uppercase tracking-wide text-ink-muted">{b.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
