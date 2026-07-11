import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import { getSessionUser, requireRole } from "@/lib/auth";

// Simulates a QR check-in scan: logs attendance + awards a small loyalty
// bonus. In production this would be hit by a scanner at the front door.
export async function POST() {
  const session = getSessionUser();
  const check = requireRole(session, ["member"]);
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

  await dbConnect();
  const user = await User.findByIdAndUpdate(
    session.id,
    {
      $push: { attendance: { date: new Date(), checkedInVia: "qr" } },
      $inc: { loyaltyPoints: 5 }
    },
    { new: true }
  );

  return NextResponse.json({
    checkedInAt: new Date(),
    loyaltyPoints: user.loyaltyPoints,
    totalVisits: user.attendance.length
  });
}
