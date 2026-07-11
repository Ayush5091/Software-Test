import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import { getSessionUser, requireRole } from "@/lib/auth";

export async function GET() {
  const session = getSessionUser();
  const check = requireRole(session, ["admin"]);
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

  await dbConnect();
  const users = await User.find().select("-passwordHash").sort({ createdAt: -1 }).lean();
  return NextResponse.json({ users });
}
