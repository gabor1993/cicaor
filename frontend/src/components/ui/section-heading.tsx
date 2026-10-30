type EyebrowProps = { children: string; lines?: boolean; className?: string };

export function Eyebrow({ children, lines = false, className = "" }: EyebrowProps) {
  return (
    <p className={`flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-muted ${className}`}>
      {lines && <span aria-hidden className="h-px w-8 bg-taupe" />}
      {children}
      {lines && <span aria-hidden className="h-px w-8 bg-taupe" />}
    </p>
  );
}

type SectionHeadingProps = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  lines?: boolean;
};

export function SectionHeading({ id, eyebrow, title, subtitle, lines = false }: SectionHeadingProps) {
  return (
    <header className="mx-auto max-w-3xl text-center">
      <Eyebrow lines={lines} className="justify-center">
        {eyebrow}
      </Eyebrow>
      <h2 id={id} className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
    </header>
  );
}
