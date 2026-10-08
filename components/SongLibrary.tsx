"use client";

import { useMemo, useState } from "react";
import type { CategoryFilter, LanguageFilter, Song } from "@/types/song";
import { normalize } from "@/lib/songUtils";
import SongCard from "@/components/SongCard";
import { Pill } from "@/components/FilterBar";

type Decade = "all" | "1980" | "1990" | "2000" | "2010";

const DECADES: { value: Decade; label: string }[] = [
  { value: "all", label: "All years" },
  { value: "1980", label: "80s" },
  { value: "1990", label: "90s" },
  { value: "2000", label: "2000s" },
  { value: "2010", label: "2010s" },
];

interface Props {
  songs: Song[];
  search?: boolean;
  categories?: boolean;
  languages?: boolean;
  decades?: boolean;
}

export default function SongLibrary({ songs, search, categories, languages, decades }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [language, setLanguage] = useState<LanguageFilter>("all");
  const [decade, setDecade] = useState<Decade>("all");

  const visible = useMemo(() => {
    const q = normalize(query.trim());
    return songs.filter((s) => {
      if (category !== "all" && s.category !== category) return false;
      if (language !== "all" && s.language !== language) return false;
      if (decade !== "all") {
        const start = Number(decade);
        if (!s.year || s.year < start || s.year >= start + 10) return false;
      }
      return !q || normalize(`${s.title} ${s.artist}`).includes(q);
    });
  }, [songs, query, category, language, decade]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4">
        {search ? (
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or artist"
            aria-label="Search songs"
            className="w-full rounded-full border border-line bg-surface px-5 py-3 text-sm outline-none placeholder:text-muted focus:border-ink sm:max-w-sm"
          />
        ) : null}

        {categories ? (
          <div role="group" aria-label="Category" className="flex flex-wrap gap-2">
            {(
              [
                ["all", "All"],
                ["trending", "Trending"],
                ["classic", "Classics"],
                ["nostalgia", "Nostalgia"],
              ] as const
            ).map(([value, label]) => (
              <Pill key={value} active={category === value} onClick={() => setCategory(value)}>
                {label}
              </Pill>
            ))}
          </div>
        ) : null}

        {languages ? (
          <div role="group" aria-label="Language" className="flex flex-wrap gap-2">
            {(
              [
                ["all", "All languages"],
                ["vi", "Vietnamese"],
                ["en", "English"],
              ] as const
            ).map(([value, label]) => (
              <Pill key={value} active={language === value} onClick={() => setLanguage(value)}>
                {label}
              </Pill>
            ))}
          </div>
        ) : null}

        {decades ? (
          <div role="group" aria-label="Decade" className="flex flex-wrap gap-2">
            {DECADES.map((d) => (
              <Pill key={d.value} active={decade === d.value} onClick={() => setDecade(d.value)}>
                {d.label}
              </Pill>
            ))}
          </div>
        ) : null}
      </div>

      <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-muted" role="status">
        {visible.length} songs
      </p>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">Không tìm thấy bài nào.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((song) => (
            <li key={song.id}>
              <SongCard song={song} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
