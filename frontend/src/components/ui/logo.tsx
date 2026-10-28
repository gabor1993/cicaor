import Link from "next/link";
import { hu } from "@/content/hu";

/** Line drawing of a sitting cat with a heart, approximating the logo in the design. Swap for the final SVG when available. */
function CatMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 48 56"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17 13 L15 4 L22 9 Q26 8 30 9 L37 4 L35 13 Q38 17 37 22 Q35 27 29 29 Q37 34 38 43 Q39 51 31 53 L16 53 Q8 52 8 44 Q8 36 16 31" />
      <path d="M16 31 Q12 27 13 21 Q13 16 17 13" />
      <path d="M38 47 Q46 46 45 38 Q44 32 40 33" />
      <path d="M22 44 Q19 40 21 38 Q23 36.5 24 39 Q25 36.5 27 38 Q29 40 26 44 L24 46 Z" />
    </svg>
  );
}

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <CatMark className="h-11 w-auto" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.7rem]">{hu.brand.name}</span>
        <span
          className={`mt-1 whitespace-nowrap text-[0.55rem] font-bold uppercase tracking-[0.25em] ${
            inverted ? "opacity-80" : "text-muted"
          }`}
        >
          {hu.brand.tagline}
        </span>
      </span>
    </Link>
  );
}
