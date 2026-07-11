import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/lib/models/Booking";
import Trainer from "@/lib/models/Trainer";
import User from "@/lib/models/User";
import { getSessionUser, requireRole } from "@/lib/auth";

const MEMBER_ACTIONS = ["cancelled", "reschedule"];
const TRAINER_ACTIONS = ["confirmed", "rejected", "completed"];

// PATCH supports: member cancel/reschedule, trainer accept/reject/complete,
// admin can do anything.
export async function PATCH(req, { params }) {
  const session = getSessionUser();
  const check = requireRole(session);
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

  await dbConnect();
  const booking = await Booking.findById(params.id);
  if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });

  const body = await req.json();

  if (session.role === "member") {
    if (booking.member.toString() !== session.id) {
      return NextResponse.json({ error: "Not your booking." }, { status: 403 });
    }
    if (body.status === "cancelled") {
      booking.status = "cancelled";
    } else if (body.date && body.timeSlot) {
      booking.date = body.date;
      booking.timeSlot = body.timeSlot;
      booking.status = booking.type === "trainer" ? "pending" : "confirmed";
    }
  } else if (session.role === "trainer") {
    const trainerProfile = await Trainer.findOne({ user: session.id });
    if (!trainerProfile || booking.trainer?.toString() !== trainerProfile._id.toString()) {
      return NextResponse.json({ error: "Not your booking." }, { status: 403 });
    }
    if (!TRAINER_ACTIONS.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status for trainer." }, { status: 400 });
    }
    booking.status = body.status;
  } else if (session.role === "admin") {
    if (body.status) booking.status = body.status;
    if (body.date) booking.date = body.date;
    if (body.timeSlot) booking.timeSlot = body.timeSlot;
  }

  await booking.save();

  // Award loyalty points when a session is marked completed.
  if (booking.status === "completed") {
    await User.findByIdAndUpdate(booking.member, { $inc: { loyaltyPoints: 10 } });
  }

  return NextResponse.json({ booking });
}

export async function DELETE(_req, { params }) {
  const session = getSessionUser();
  const check = requireRole(session, ["admin"]);
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

  await dbConnect();
  await Booking.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
