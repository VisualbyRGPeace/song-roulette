"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearHistory, readHistory, type HistoryEntry } from "@/lib/storage";
import { youtubeUrl } from "@/lib/songUtils";

function formatTime(at: number): string {
  const d = new Date(at);
  const time = d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  return d.toDateString() === new Date().toDateString()
    ? time
    : `${d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })} · ${time}`;
}

export default function HistoryList() {
  // null = not loaded yet (localStorage is only available after mount)
  const [entries, setEntries] = useState<HistoryEntry[] | null>(null);

  useEffect(() => {
    setEntries(readHistory());
  }, []);

  if (entries === null) return null;

  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted">
        Chưa có bài nào.{" "}
        <Link href="/" className="text-ink underline underline-offset-4">
          Bốc thử một bài
        </Link>
        .
      </p>
    );
  }

  return (
    <div>
      <ul className="divide-y divide-line border-y border-line">
        {entries.map((e) => (
          <li key={e.at}>
            <a
              href={youtubeUrl(e.song)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-baseline gap-4 py-4 transition-colors hover:text-muted"
            >
              <span className="w-24 shrink-0 text-xs tabular-nums text-muted sm:w-32">{formatTime(e.at)}</span>
              <span className="min-w-0 truncate text-sm sm:text-base">
                {e.song.title} <span className="text-muted">— {e.song.artist}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => {
          clearHistory();
          setEntries([]);
        }}
        className="mt-8 rounded-full border border-line px-5 py-3 text-xs tracking-[0.18em] text-muted transition-colors hover:border-ink hover:text-ink"
      >
        CLEAR HISTORY
      </button>
    </div>
  );
}
