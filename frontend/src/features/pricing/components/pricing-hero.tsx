import { Heart, PawPrint } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { PhotoPlaceholder } from "@/components/ui/photo-placeholder";
import { hu } from "@/content/hu";

export function PricingHero() {
  const { hero } = hu;

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <PhotoPlaceholder
        alt={hero.imageAlt}
        tone={1}
        className="absolute inset-0 -z-20 size-full"
      />
      {/* Darkens the photo so the white text always meets WCAG AA contrast. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />

      <div className="mx-auto max-w-7xl px-4 py-20 text-[#f6f3ec] sm:px-6 sm:py-28 lg:py-36">
        <p className="text-xs font-bold uppercase tracking-[0.3em]">{hero.eyebrow}</p>
        <h1 id="hero-title" className="mt-4 max-w-xl font-display text-5xl leading-tight sm:text-6xl">
          {hero.title}
        </h1>
        <p className="mt-4 font-serif text-2xl">{hero.subtitle}</p>
        <p className="mt-6 max-w-md text-sm leading-relaxed">{hero.body}</p>
        <ButtonLink href="#csomagok" variant="light" className="mt-8 text-xs uppercase tracking-widest">
          {hero.cta}
        </ButtonLink>

        <p className="mt-10 flex items-center gap-2 font-script text-2xl sm:absolute sm:right-10 sm:top-10 sm:mt-0 sm:-rotate-6 sm:text-3xl">
          {hero.script}
          <Heart aria-hidden className="size-4" />
          <PawPrint aria-hidden className="size-5" />
        </p>
      </div>
    </section>
  );
}
