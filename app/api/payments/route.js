import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/lib/models/Payment";
import MembershipPlan from "@/lib/models/MembershipPlan";
import User from "@/lib/models/User";
import { getSessionUser, requireRole } from "@/lib/auth";

export async function GET() {
  const session = getSessionUser();
  const check = requireRole(session);
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

  await dbConnect();
  const query = session.role === "admin" ? {} : { user: session.id };
  const payments = await Payment.find(query).populate("user", "name email").sort({ createdAt: -1 }).lean();
  return NextResponse.json({ payments });
}

// Demo payment: no real card processor. Simulates success and, for
// memberships, activates the plan on the member's account immediately.
export async function POST(req) {
  const session = getSessionUser();
  const check = requireRole(session, ["member"]);
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

  const { purpose, referenceId, amount, method } = await req.json();
  if (!purpose || !amount) {
    return NextResponse.json({ error: "Purpose and amount are required." }, { status: 400 });
  }

  await dbConnect();
  const payment = await Payment.create({
    user: session.id,
    purpose,
    referenceId: referenceId || null,
    amount,
    method: method || "demo_card",
    status: "success"
  });

  if (purpose === "membership" && referenceId) {
    const plan = await MembershipPlan.findById(referenceId);
    if (plan) {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
      await User.findByIdAndUpdate(session.id, {
        activeMembership: { plan: plan._id, startDate, endDate }
      });
    }
  }

  return NextResponse.json({ payment }, { status: 201 });
}
