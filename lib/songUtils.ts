import type { Song, SongCategory } from "@/types/song";

export const CATEGORY_LABEL: Record<SongCategory, string> = {
  trending: "Trending",
  classic: "Classic",
  nostalgia: "Nostalgia",
  random: "Random",
};

/** Direct video link when we know the id, otherwise a YouTube search for the karaoke version. */
export function youtubeUrl(song: Song): string {
  if (song.youtubeId) return `https://www.youtube.com/watch?v=${song.youtubeId}`;
  const query = encodeURIComponent(`${song.title} ${song.artist} karaoke`);
  return `https://www.youtube.com/results?search_query=${query}`;
}

export function thumbnailUrl(song: Song): string | undefined {
  if (song.thumbnail) return song.thumbnail;
  if (song.youtubeId) return `https://i.ytimg.com/vi/${song.youtubeId}/hqdefault.jpg`;
  return undefined;
}

/** Lowercase + strip Vietnamese diacritics so "mua" matches "Mưa". */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase();
}
