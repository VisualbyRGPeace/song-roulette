export type SongCategory = "trending" | "classic" | "nostalgia" | "random";
export type SongLanguage = "vi" | "en" | "other";

export interface Song {
  id: string;
  title: string;
  artist: string;
  youtubeId?: string;
  thumbnail?: string;
  year?: number;
  category: SongCategory;
  language: SongLanguage;
  popularity?: number;
}

export type CategoryFilter = "all" | "trending" | "classic" | "nostalgia";
export type LanguageFilter = "all" | "vi" | "en";

export interface SongFilters {
  category: CategoryFilter;
  language: LanguageFilter;
}

export type TrendingStatus = "live" | "no-key" | "error";

export interface TrendingResult {
  songs: Song[];
  status: TrendingStatus;
  /** ISO time the list was generated (build time on GitHub Pages) */
  fetchedAt: string;
}
