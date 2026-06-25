import { NextResponse } from "next/server";
import { getGlossary } from "@/lib/content/repository";

export const dynamic = "force-dynamic";

// GET /api/glossary?q=
export function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || undefined;
  const terms = getGlossary({ q });
  return NextResponse.json({ count: terms.length, terms });
}
