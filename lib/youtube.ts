import { songs as localSongs } from "@/data/songs";
import type { Song, SongLanguage, TrendingResult } from "@/types/song";

// Runs at build time only (GitHub Actions). It reads YOUTUBE_API_KEY and must never be imported by a client component.

const VI_CHARS =
  /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;

interface YouTubeThumb {
  url: string;
}
interface YouTubeItem {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails?: { high?: YouTubeThumb; medium?: YouTubeThumb; default?: YouTubeThumb };
  };
  statistics?: { viewCount?: string };
}
interface YouTubeResponse {
  items?: YouTubeItem[];
}

/** YouTube titles look like "Artist - Song (Official MV)": split and clean them. */
function parseTitle(rawTitle: string, channel: string): { title: string; artist: string } {
  const cleaned = rawTitle
    .replace(
      /\s*[([【][^)\]】]*(official|mv|m\/v|lyric|audio|video|visualizer|4k|hd)[^)\]】]*[)\]】]/gi,
      "",
    )
    .replace(/\s*\|.*$/, "")
    .trim();

  const parts = cleaned.split(/\s+[-–—]\s+/);
  const first = parts[0];
  if (parts.length >= 2 && first) {
    return { artist: first.trim(), title: parts.slice(1).join(" - ").trim() };
  }
  const artist = channel.replace(/\s*-\s*Topic$/i, "").replace(/VEVO$/i, "").trim();
  return { artist, title: cleaned };
}

function detectLanguage(text: string): SongLanguage {
  if (VI_CHARS.test(text)) return "vi";
  return /^[\x00-\x7F]*$/.test(text) ? "en" : "other";
}

function toSong(item: YouTubeItem): Song {
  const { title, artist } = parseTitle(item.snippet.title, item.snippet.channelTitle);
  const thumbs = item.snippet.thumbnails;
  const thumbnail = (thumbs?.high ?? thumbs?.medium ?? thumbs?.default)?.url;
  const views = Number(item.statistics?.viewCount);

  return {
    id: `yt-${item.id}`,
    title,
    artist,
    youtubeId: item.id,
    ...(thumbnail ? { thumbnail } : {}),
    category: "trending",
    language: detectLanguage(`${title} ${artist}`),
    ...(Number.isFinite(views) ? { popularity: views } : {}),
  };
}

const localTrending = (): Song[] => localSongs.filter((s) => s.category === "trending");

/** Trending songs from YouTube when configured, otherwise (or on any error) the local list. */
export async function getTrending(): Promise<TrendingResult> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return { songs: localTrending(), status: "no-key", fetchedAt: new Date().toISOString() };

  try {
    const params = new URLSearchParams({
      part: "snippet,statistics",
      chart: "mostPopular",
      videoCategoryId: "10", // Music
      regionCode: process.env.YOUTUBE_REGION_CODE || "VN",
      maxResults: "30",
      key,
    });
    const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`);
    if (!res.ok) throw new Error(`YouTube API responded ${res.status}`);

    const data = (await res.json()) as YouTubeResponse;
    const live = (data.items ?? []).map(toSong).filter((s) => s.title.length > 0);
    if (live.length === 0) throw new Error("YouTube API returned no videos");

    return { songs: live, status: "live", fetchedAt: new Date().toISOString() };
  } catch (error) {
    // Log server-side only; the UI just gets the fallback list.
    console.error("[trending]", error instanceof Error ? error.message : error);
    return { songs: localTrending(), status: "error", fetchedAt: new Date().toISOString() };
  }
}

/** Whole pool for the roulette and library: local classics/nostalgia + current trending. */
export async function getAllSongs(): Promise<Song[]> {
  const { songs: trending } = await getTrending();
  return [...localSongs.filter((s) => s.category !== "trending"), ...trending];
}
