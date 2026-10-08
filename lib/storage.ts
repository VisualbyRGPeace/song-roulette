import type { Song } from "@/types/song";
import { MAX_RECENT_SONGS } from "@/lib/randomSong";

const KEY = "song-roulette:history";
const MAX_ENTRIES = 100;

export interface HistoryEntry {
  song: Song;
  at: number;
}

/** Safe on the server and when localStorage is blocked. */
export function readHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function addHistory(song: Song): void {
  const next = [{ song, at: Date.now() }, ...readHistory()].slice(0, MAX_ENTRIES);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked: history is a nice-to-have */
  }
}

export function clearHistory(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** Ids of the most recent picks, newest first. */
export function recentSongIds(): string[] {
  return readHistory()
    .slice(0, MAX_RECENT_SONGS)
    .map((e) => e.song.id);
}
