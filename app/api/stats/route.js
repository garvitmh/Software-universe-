import { NextResponse } from "next/server";
import { stats } from "@/lib/content/repository";

// GET /api/stats — whole-library counts.
export function GET() {
  return NextResponse.json(stats());
}
