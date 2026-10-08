interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export default function PageHeader({ eyebrow, title, subtitle }: Props) {
  return (
    <div className="mb-10 sm:mb-14">
      <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-muted">{eyebrow}</p>
      <h1 className="text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-7xl">{title}</h1>
      {subtitle ? <p className="mt-5 max-w-xl text-sm text-muted sm:text-base">{subtitle}</p> : null}
    </div>
  );
}
