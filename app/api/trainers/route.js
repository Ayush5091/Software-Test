import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Trainer from "@/lib/models/Trainer";
import User from "@/lib/models/User";
import { getSessionUser, requireRole, hashPassword } from "@/lib/auth";

export async function GET() {
  await dbConnect();
  const trainers = await Trainer.find().populate("user", "name email").lean();
  return NextResponse.json({ trainers });
}

// Admin creates a trainer: makes a User (role: trainer) + Trainer profile.
export async function POST(req) {
  const session = getSessionUser();
  const check = requireRole(session, ["admin"]);
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

  const { name, email, password, specialties, bio, ratePerSession, availability } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
  }

  await dbConnect();
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return NextResponse.json({ error: "Email already in use." }, { status: 409 });

  const passwordHash = await hashPassword(password);
  const user = await User.create({ name, email: email.toLowerCase(), passwordHash, role: "trainer" });
  const trainer = await Trainer.create({
    user: user._id,
    specialties: specialties || [],
    bio: bio || "",
    ratePerSession: ratePerSession || 0,
    availability: availability || []
  });

  return NextResponse.json({ trainer }, { status: 201 });
}
