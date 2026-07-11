import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/lib/models/Booking";
import { getSessionUser, requireRole } from "@/lib/auth";

// GET: members see their own bookings; trainers see bookings assigned to them;
// admins see everything.
export async function GET(req) {
  const session = getSessionUser();
  const check = requireRole(session);
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

  await dbConnect();

  let query = {};
  if (session.role === "member") {
    query = { member: session.id };
  } else if (session.role === "trainer") {
    const Trainer = (await import("@/lib/models/Trainer")).default;
    const trainerProfile = await Trainer.findOne({ user: session.id });
    query = { trainer: trainerProfile?._id || null };
  }
  // admin: no filter, sees all

  const bookings = await Booking.find(query)
    .populate("member", "name email")
    .populate({ path: "trainer", populate: { path: "user", select: "name email" } })
    .sort({ date: -1 })
    .lean();

  return NextResponse.json({ bookings });
}

export async function POST(req) {
  const session = getSessionUser();
  const check = requireRole(session, ["member", "admin"]);
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

  const { type, trainer, title, date, timeSlot, notes } = await req.json();
  if (!type || !title || !date || !timeSlot) {
    return NextResponse.json({ error: "Type, title, date, and time slot are required." }, { status: 400 });
  }

  await dbConnect();
  const booking = await Booking.create({
    member: session.id,
    type,
    trainer: trainer || null,
    title,
    date,
    timeSlot,
    notes: notes || "",
    status: type === "trainer" ? "pending" : "confirmed"
  });

  return NextResponse.json({ booking }, { status: 201 });
}
