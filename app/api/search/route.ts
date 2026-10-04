import { NextResponse } from "next/server";
import { getSearchSuggestions } from "@/lib/data";

export const dynamic = "force-dynamic";

/** Lightweight search suggestions for the site-wide search box. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q && q.length > 80) {
    return NextResponse.json({ error: "Query too long." }, { status: 400 });
  }

  const { destinations, events } = await getSearchSuggestions(q, 6);
  return NextResponse.json({ destinations, events });
}