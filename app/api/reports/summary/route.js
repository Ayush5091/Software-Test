import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import Trainer from "@/lib/models/Trainer";
import Booking from "@/lib/models/Booking";
import Payment from "@/lib/models/Payment";
import { getSessionUser, requireRole } from "@/lib/auth";

export async function GET() {
  const session = getSessionUser();
  const check = requireRole(session, ["admin"]);
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

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
      Payment.find().sort({ createdAt: -1 }).limit(10).populate("user", "name email").lean()
    ]);

  return NextResponse.json({
    totalMembers,
    totalTrainers,
    totalBookings,
    bookingsByStatus,
    totalRevenue: revenueAgg[0]?.total || 0,
    recentPayments
  });
}
