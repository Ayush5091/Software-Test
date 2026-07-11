import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import { getSessionUser, requireRole } from "@/lib/auth";

export async function PUT(req, { params }) {
  const session = getSessionUser();
  const check = requireRole(session);
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

  const body = await req.json();
  await dbConnect();

  if (session.role !== "admin" && session.id !== params.id) {
    return NextResponse.json({ error: "You can only edit your own profile." }, { status: 403 });
  }

  const allowed =
    session.role === "admin"
      ? body
      : { goal: body.goal, heightCm: body.heightCm, weightKg: body.weightKg, phone: body.phone };

  const user = await User.findByIdAndUpdate(params.id, allowed, { new: true }).select("-passwordHash");
  return NextResponse.json({ user });
}

export async function DELETE(_req, { params }) {
  const session = getSessionUser();
  const check = requireRole(session, ["admin"]);
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

  await dbConnect();
  await User.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
