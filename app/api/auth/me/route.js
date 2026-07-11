import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";

export async function GET() {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ user: null });

  await dbConnect();
  const user = await User.findById(session.id).select("-passwordHash").lean();
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({ user });
}
