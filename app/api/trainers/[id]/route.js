import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Trainer from "@/lib/models/Trainer";
import { getSessionUser, requireRole } from "@/lib/auth";

export async function PUT(req, { params }) {
  const session = getSessionUser();
  const check = requireRole(session, ["admin"]);
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

  const body = await req.json();
  await dbConnect();
  const trainer = await Trainer.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json({ trainer });
}

export async function DELETE(_req, { params }) {
  const session = getSessionUser();
  const check = requireRole(session, ["admin"]);
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

  await dbConnect();
  await Trainer.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
