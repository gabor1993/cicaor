import { Cat } from "lucide-react";

type Tone = 0 | 1 | 2;

type PhotoPlaceholderProps = {
  alt: string;
  tone?: Tone;
  className?: string;
};

// Stand-in until real photos are added to public/images (then swap for next/image).
// Warm tones echo the photos in the design.
const tones: Record<Tone, string> = {
  0: "from-[#cdb89a] via-[#a68a6c] to-[#6e5a45]",
  1: "from-[#8a7058] via-[#5e4a39] to-[#3a2e24]",
  2: "from-[#ddd2c0] via-[#b9a58c] to-[#857158]",
};

export function PhotoPlaceholder({ alt, tone = 0, className = "" }: PhotoPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`flex items-center justify-center bg-gradient-to-br ${tones[tone]} text-[#f6f3ec]/60 ${className}`}
    >
      <Cat aria-hidden className="size-1/4 max-h-20 min-h-8" strokeWidth={1.25} />
    </div>
  );
}
