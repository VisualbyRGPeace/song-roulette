import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SongLibrary from "@/components/SongLibrary";
import { getAllSongs } from "@/lib/youtube";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Songs — Song Roulette" };

export default async function SongsPage() {
  const songs = await getAllSongs();
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-14">
      <PageHeader eyebrow="Library" title="Every song." subtitle="Search the whole pool, or pick one yourself." />
      <SongLibrary songs={songs} search categories languages />
    </div>
  );
}
