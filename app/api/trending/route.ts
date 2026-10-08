import { NextResponse } from "next/server";
import { getTrending } from "@/lib/youtube";

export const revalidate = 3600;

export async function GET() {
  const result = await getTrending();
  return NextResponse.json(result);
}
