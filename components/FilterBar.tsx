"use client";

import type { CategoryFilter, LanguageFilter, SongFilters } from "@/types/song";

const CATEGORIES: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "trending", label: "Trending" },
  { value: "classic", label: "Classics" },
  { value: "nostalgia", label: "Nostalgia" },
];

const LANGUAGES: { value: LanguageFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "vi", label: "Vietnamese" },
  { value: "en", label: "English" },
];

interface PillProps {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function Pill({ active, disabled, onClick, children }: PillProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-xs tracking-wide transition-colors disabled:opacity-50 ${
        active ? "border-ink bg-ink text-bg" : "border-line text-muted hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

interface Props {
  value: SongFilters;
  onChange: (next: SongFilters) => void;
  disabled?: boolean;
}

export default function FilterBar({ value, onChange, disabled }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div role="group" aria-label="Category" className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => (
          <Pill
            key={c.value}
            active={value.category === c.value}
            disabled={disabled}
            onClick={() => onChange({ ...value, category: c.value })}
          >
            {c.label}
          </Pill>
        ))}
      </div>
      <div role="group" aria-label="Language" className="flex flex-wrap justify-center gap-2">
        {LANGUAGES.map((l) => (
          <Pill
            key={l.value}
            active={value.language === l.value}
            disabled={disabled}
            onClick={() => onChange({ ...value, language: l.value })}
          >
            {l.label}
          </Pill>
        ))}
      </div>
    </div>
  );
}
