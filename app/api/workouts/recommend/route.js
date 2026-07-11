import { NextResponse } from "next/server";
import { recommendPlan } from "@/lib/exercises";

export async function POST(req) {
  const { goal, daysPerWeek } = await req.json();
  const plan = recommendPlan(goal || "general_fitness", daysPerWeek || 3);
  return NextResponse.json({ plan });
}
