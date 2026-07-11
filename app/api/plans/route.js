import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import MembershipPlan from "@/lib/models/MembershipPlan";
import { getSessionUser, requireRole } from "@/lib/auth";

export async function GET() {
  await dbConnect();
  const plans = await MembershipPlan.find({ active: true }).sort({ price: 1 }).lean();
  return NextResponse.json({ plans });
}

export async function POST(req) {
  const user = getSessionUser();
  const check = requireRole(user, ["admin"]);
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

  const body = await req.json();
  await dbConnect();
  const plan = await MembershipPlan.create(body);
  return NextResponse.json({ plan }, { status: 201 });
}
