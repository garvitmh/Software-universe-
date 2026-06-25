import { NextResponse } from "next/server";
import { getEntry } from "@/lib/content/repository";

// GET /api/content/:slug — one full entry.
export function GET(_request, { params }) {
  const entry = getEntry(params.slug);
  if (!entry) return NextResponse.json({ error: "Entry not found", slug: params.slug }, { status: 404 });
  return NextResponse.json(entry);
}
