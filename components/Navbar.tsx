import Link from "next/link";

const links = [
  { href: "/trending", label: "Trending", hideOnMobile: false },
  { href: "/classics", label: "Classics", hideOnMobile: false },
  { href: "/songs", label: "Songs", hideOnMobile: true },
  { href: "/history", label: "History", hideOnMobile: false },
];

export default function Navbar() {
  return (
    <header>
      <nav
        aria-label="Main"
        className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-5 sm:px-8 sm:py-6"
      >
        <Link href="/" className="text-xs font-semibold tracking-[0.14em] sm:text-sm sm:tracking-[0.2em]">
          SONG ROULETTE
        </Link>
        <ul className="flex items-center gap-4 text-[11px] uppercase tracking-[0.12em] text-muted sm:gap-8 sm:text-xs">
          {links.map((l) => (
            <li key={l.href} className={l.hideOnMobile ? "hidden sm:block" : undefined}>
              <Link href={l.href} className="transition-colors hover:text-ink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
