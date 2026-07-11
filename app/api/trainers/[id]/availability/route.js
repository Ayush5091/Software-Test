import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Trainer from "@/lib/models/Trainer";
import User from "@/lib/models/User";
import { getSessionUser, requireRole } from "@/lib/auth";

// Trainer updates their own weekly availability slots.
export async function PUT(req, { params }) {
  const session = getSessionUser();
  const check = requireRole(session, ["trainer", "admin"]);
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

  await dbConnect();
  const trainer = await Trainer.findById(params.id);
  if (!trainer) return NextResponse.json({ error: "Trainer not found." }, { status: 404 });

  if (session.role === "trainer" && trainer.user.toString() !== session.id) {
    return NextResponse.json({ error: "You can only edit your own availability." }, { status: 403 });
  }

  const { availability } = await req.json();
  trainer.availability = availability;
  await trainer.save();
  return NextResponse.json({ trainer });
}
