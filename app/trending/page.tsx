import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SongLibrary from "@/components/SongLibrary";
import { getTrending } from "@/lib/youtube";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Trending — Song Roulette" };

const STATUS_TEXT = {
  live: "Updated recently",
  "no-key": "Live trending isn't configured. Showing a curated list of popular songs.",
  error: "Trending songs are temporarily unavailable. Showing a curated list instead.",
} as const;

export default async function TrendingPage() {
  const { songs, status } = await getTrending();
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-14">
      <PageHeader eyebrow="Trending" title={"What's hot right now."} subtitle={STATUS_TEXT[status]} />
      <SongLibrary songs={songs} languages />
    </div>
  );
}
