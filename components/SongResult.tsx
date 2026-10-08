"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { Song } from "@/types/song";
import { CATEGORY_LABEL, thumbnailUrl, youtubeUrl } from "@/lib/songUtils";
import RandomButton from "@/components/RandomButton";

interface Props {
  song: Song;
  onRespin: () => void;
}

export default function SongResult({ song, onRespin }: Props) {
  const reduceMotion = useReducedMotion();
  const thumb = thumbnailUrl(song);

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-md rounded-3xl border border-line bg-surface p-5 text-left sm:p-6"
    >
      <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-muted">Tonight, you sing...</p>

      {thumb ? (
        <div className="relative mb-5 aspect-video overflow-hidden rounded-2xl bg-line">
          <Image src={thumb} alt="" fill sizes="(max-width: 640px) 90vw, 28rem" className="object-cover" />
        </div>
      ) : null}

      <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">{song.title}</h2>
      <p className="mt-2 text-base text-muted">{song.artist}</p>

      <p className="mt-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-muted">
        {song.year ? <span>{song.year}</span> : null}
        <span className="rounded-full border border-line px-3 py-1">{CATEGORY_LABEL[song.category]}</span>
      </p>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <a
          href={youtubeUrl(song)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-full border border-ink px-6 text-xs font-medium tracking-[0.18em] transition-colors hover:bg-ink hover:text-bg"
        >
          XEM TRÊN YOUTUBE
          <ExternalLink size={14} aria-hidden="true" />
        </a>
        <RandomButton phase="done" onClick={onRespin} />
      </div>
      <p className="mt-4 text-center text-xs text-muted">{"Not feeling it?"}</p>
    </motion.article>
  );
}
