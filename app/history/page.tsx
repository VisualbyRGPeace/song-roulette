import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import HistoryList from "@/components/HistoryList";

export const metadata: Metadata = { title: "History — Song Roulette" };

export default function HistoryPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-14">
      <PageHeader eyebrow="Your history" title={"Songs you've faced."} />
      <HistoryList />
    </div>
  );
}
