import type { Song, SongFilters } from "@/types/song";

/** How many of the most recent picks are excluded from the next spin. */
export const MAX_RECENT_SONGS = 10;

export function filterSongs(songs: Song[], { category, language }: SongFilters): Song[] {
  return songs.filter(
    (s) =>
      (category === "all" || s.category === category) &&
      (language === "all" || s.language === language),
  );
}

/**
 * Picks a random song from `pool`, skipping songs in `recentIds` (most recent first).
 * If the pool is smaller than the history window, only the very last pick is avoided,
 * so small pools (e.g. "Trending + English") never get stuck.
 */
export function pickRandomSong(pool: Song[], recentIds: string[]): Song | null {
  if (pool.length === 0) return null;

  const recent = new Set(recentIds.slice(0, MAX_RECENT_SONGS));
  let candidates = pool.filter((s) => !recent.has(s.id));

  if (candidates.length === 0) {
    const last = recentIds[0];
    candidates = pool.length > 1 ? pool.filter((s) => s.id !== last) : pool;
  }

  return candidates[Math.floor(Math.random() * candidates.length)] ?? null;
}
