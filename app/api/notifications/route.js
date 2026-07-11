import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Notification from "@/lib/models/Notification";
import { getSessionUser, requireRole } from "@/lib/auth";

export async function GET() {
  const session = getSessionUser();
  const check = requireRole(session);
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

  await dbConnect();
  const audience = session.role === "admin" ? {} : { audience: { $in: ["all", session.role + "s"] } };
  const notifications = await Notification.find(audience).sort({ createdAt: -1 }).limit(30).lean();
  return NextResponse.json({ notifications });
}

export async function POST(req) {
  const session = getSessionUser();
  const check = requireRole(session, ["admin"]);
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

  const { title, message, audience } = await req.json();
  if (!title || !message) {
    return NextResponse.json({ error: "Title and message are required." }, { status: 400 });
  }

  await dbConnect();
  const notification = await Notification.create({
    title,
    message,
    audience: audience || "all",
    createdBy: session.id
  });
  return NextResponse.json({ notification }, { status: 201 });
}
