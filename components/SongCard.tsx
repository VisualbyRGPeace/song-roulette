import Image from "next/image";
import type { Song } from "@/types/song";
import { CATEGORY_LABEL, thumbnailUrl, youtubeUrl } from "@/lib/songUtils";

export default function SongCard({ song }: { song: Song }) {
  const thumb = thumbnailUrl(song);
  return (
    <a
      href={youtubeUrl(song)}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-line bg-surface p-3 transition-colors hover:border-ink"
    >
      <div className="relative mb-3 aspect-video overflow-hidden rounded-xl bg-line/60">
        {thumb ? (
          <Image
            src={thumb}
            alt=""
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 24vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center text-5xl font-semibold tracking-[-0.04em] text-muted/40"
          >
            {song.title.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <h3 className="truncate text-sm font-semibold tracking-tight">{song.title}</h3>
      <p className="truncate text-sm text-muted">{song.artist}</p>
      <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted">
        {song.year ? `${song.year} · ` : ""}
        {CATEGORY_LABEL[song.category]}
      </p>
    </a>
  );
}
