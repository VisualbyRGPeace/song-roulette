"use client";

export type SpinPhase = "idle" | "spinning" | "done";

const LABEL: Record<SpinPhase, string> = {
  idle: "BỐC BÀI",
  spinning: "ĐANG BỐC...",
  done: "BỐC LẠI",
};

interface Props {
  phase: SpinPhase;
  onClick: () => void;
}

export default function RandomButton({ phase, onClick }: Props) {
  const spinning = phase === "spinning";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={spinning}
      aria-busy={spinning}
      className="inline-flex min-h-[56px] min-w-[200px] items-center justify-center rounded-full bg-ink px-10 text-sm font-medium tracking-[0.2em] text-bg transition duration-300 hover:scale-[1.03] hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
    >
      {LABEL[phase]}
    </button>
  );
}
