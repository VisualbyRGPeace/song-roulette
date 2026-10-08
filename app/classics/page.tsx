import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SongLibrary from "@/components/SongLibrary";
import { songs } from "@/data/songs";

export const metadata: Metadata = { title: "Classics — Song Roulette" };

const classics = songs.filter((s) => s.category === "classic" || s.category === "nostalgia");

export default function ClassicsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-14">
      <PageHeader
        eyebrow="Classics"
        title="Songs that never left."
        subtitle="Decade filters only include songs with a known release year."
      />
      <SongLibrary songs={classics} languages decades />
    </div>
  );
}
