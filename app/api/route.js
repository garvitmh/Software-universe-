import { NextResponse } from "next/server";
import { stats } from "@/lib/content/repository";

// GET /api — a self-describing index of the content API.
export function GET() {
  return NextResponse.json({
    name: "Software Universe content API",
    version: 1,
    stats: stats(),
    endpoints: {
      "GET /api/content": "list entry summaries (filters: ?category=, ?q=)",
      "GET /api/content/:slug": "one entry, full",
      "GET /api/glossary": "glossary terms (filter: ?q=)",
      "GET /api/search": "search entries, terms & paths (?q=, ?limit=)",
      "GET /api/stats": "whole-library counts",
    },
  });
}
