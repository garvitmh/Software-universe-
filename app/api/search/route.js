import { NextResponse } from "next/server";
import { search } from "@/lib/content/repository";

export const dynamic = "force-dynamic";

// GET /api/search?q=&limit=
export function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const limit = Math.min(50, Number(searchParams.get("limit")) || 12);
  return NextResponse.json({ query: q, results: search(q, limit) });
}
