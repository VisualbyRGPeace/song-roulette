"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Song, SongFilters } from "@/types/song";
import { filterSongs, pickRandomSong } from "@/lib/randomSong";
import { addHistory, recentSongIds } from "@/lib/storage";
import FilterBar from "@/components/FilterBar";
import RandomButton, { type SpinPhase } from "@/components/RandomButton";
import SongResult from "@/components/SongResult";

const SPIN_MS = 2200;

export default function SongRoulette({ songs }: { songs: Song[] }) {
  const reduceMotion = useReducedMotion();
  const [filters, setFilters] = useState<SongFilters>({ category: "all", language: "all" });
  const [phase, setPhase] = useState<SpinPhase>("idle");
  const [ticker, setTicker] = useState("");
  const [result, setResult] = useState<Song | null>(null);
  const [noMatch, setNoMatch] = useState(false);
  const timers = useRef<number[]>([]);

  const pool = useMemo(() => filterSongs(songs, filters), [songs, filters]);

  // Clear pending animation timers on unmount.
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  const schedule = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const finish = (winner: Song) => {
    setResult(winner);
    setPhase("done");
    addHistory(winner);
  };

  const spin = () => {
    if (phase === "spinning") return;

    // The winner is decided up-front (avoiding recent picks); the ticker is purely cosmetic.
    const winner = pickRandomSong(pool, recentSongIds());
    if (!winner) {
      setNoMatch(true);
      return;
    }

    setNoMatch(false);
    setResult(null);
    setPhase("spinning");

    if (reduceMotion) {
      schedule(() => finish(winner), 600);
      return;
    }

    // Ticker slows down: the delay between titles grows from 60ms to ~380ms.
    let elapsed = 0;
    let delay = 60;
    const tick = () => {
      if (elapsed >= SPIN_MS) {
        finish(winner);
        return;
      }
      const random = pool[Math.floor(Math.random() * pool.length)];
      if (random) setTicker(random.title);
      elapsed += delay;
      delay = Math.min(delay * 1.18, 380);
      schedule(tick, delay);
    };
    tick();
  };

  const view = phase === "idle" ? "idle" : phase === "spinning" ? "spinning" : "done";

  return (
    <section className="mx-auto flex min-h-[calc(100svh-5.5rem)] w-full max-w-6xl flex-col px-5 sm:px-8">
      <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
        <AnimatePresence mode="wait">
          {view === "idle" && (
            <motion.div
              key="idle"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <p className="mb-6 text-[11px] uppercase tracking-[0.24em] text-muted">Your next song</p>
              <h1 className="text-[clamp(3.5rem,14vw,9.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.04em]">
                What
                <br />
                will you
                <br />
                sing?
              </h1>
              <p className="mb-10 mt-8 text-sm text-muted sm:text-base">{"Let fate choose your next song."}</p>
              <RandomButton phase="idle" onClick={spin} />
            </motion.div>
          )}

          {view === "spinning" && (
            <motion.div
              key="spinning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full flex-col items-center"
            >
              <p className="mb-8 text-[11px] uppercase tracking-[0.24em] text-muted">
                {"Choosing your destiny..."}
              </p>
              <p
                aria-hidden="true"
                className="h-[2.4em] w-full max-w-3xl overflow-hidden px-2 text-4xl font-semibold leading-[1.2] tracking-[-0.03em] sm:text-6xl"
              >
                {ticker || "…"}
              </p>
              <span className="sr-only">Đang bốc bài</span>
              <div className="mt-10">
                <RandomButton phase="spinning" onClick={spin} />
              </div>
            </motion.div>
          )}

          {view === "done" && result && (
            <motion.div key="done" exit={{ opacity: 0 }} className="w-full">
              <SongResult song={result} onRespin={spin} />
            </motion.div>
          )}
        </AnimatePresence>

        <div aria-live="polite" className="sr-only">
          {result ? `Tonight, you sing ${result.title} by ${result.artist}` : ""}
        </div>

        <div className="mt-10 w-full">
          <FilterBar value={filters} onChange={setFilters} disabled={phase === "spinning"} />
          {noMatch ? (
            <p role="status" className="mt-4 text-sm text-muted">
              Không có bài nào khớp bộ lọc này. Thử đổi bộ lọc nhé.
            </p>
          ) : null}
        </div>
      </div>

      <p className="pb-6 text-center text-[11px] uppercase tracking-[0.18em] text-muted">
        Trending · Classics · Nostalgia — {songs.length} songs
      </p>
    </section>
  );
}
