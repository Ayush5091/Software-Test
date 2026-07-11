import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import { getSessionUser, requireRole } from "@/lib/auth";

export async function GET() {
  const session = getSessionUser();
  const check = requireRole(session);
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

  await dbConnect();
  const user = await User.findById(session.id).select("progressLogs attendance").lean();
  return NextResponse.json({ progressLogs: user.progressLogs || [], attendance: user.attendance || [] });
}

export async function POST(req) {
  const session = getSessionUser();
  const check = requireRole(session);
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

  const { weightKg, note } = await req.json();
  if (!weightKg) return NextResponse.json({ error: "weightKg is required." }, { status: 400 });

  await dbConnect();
  const user = await User.findByIdAndUpdate(
    session.id,
    { $push: { progressLogs: { date: new Date(), weightKg, note: note || "" } }, weightKg },
    { new: true }
  ).select("progressLogs");

  return NextResponse.json({ progressLogs: user.progressLogs });
}
