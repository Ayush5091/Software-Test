import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import MembershipPlan from "@/lib/models/MembershipPlan";
import { getSessionUser, requireRole } from "@/lib/auth";

export async function PUT(req, { params }) {
  const user = getSessionUser();
  const check = requireRole(user, ["admin"]);
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

  const body = await req.json();
  await dbConnect();
  const plan = await MembershipPlan.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json({ plan });
}

export async function DELETE(_req, { params }) {
  const user = getSessionUser();
  const check = requireRole(user, ["admin"]);
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

  await dbConnect();
  await MembershipPlan.findByIdAndUpdate(params.id, { active: false });
  return NextResponse.json({ ok: true });
}
