import { NextResponse } from "next/server";
import { listEntries } from "@/lib/content/repository";

export const dynamic = "force-dynamic";

// GET /api/content?category=&q=
export function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const q = searchParams.get("q") || undefined;
  const entries = listEntries({ category, q });
  return NextResponse.json({ count: entries.length, entries });
}
