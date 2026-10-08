import { NextResponse } from "next/server";
import { getTrending } from "@/lib/youtube";

// Static export: this JSON file is generated at build time (the workflow rebuilds hourly).
export const dynamic = "force-static";

export async function GET() {
  const result = await getTrending();
  return NextResponse.json(result);
}
