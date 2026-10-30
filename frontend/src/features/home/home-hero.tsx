import Image from "next/image";
import { Heart, PawPrint } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { hu } from "@/content/hu";

export function HomeHero() {
  const { homeHero } = hu;

  return (
    <section aria-labelledby="home-hero-title" className="relative isolate overflow-hidden lg:flex lg:min-h-[min(42vw,720px)] lg:items-center">
      {/* The hero photo is the LCP element, so it loads eagerly with high priority. */}
      <Image
        src={homeHero.image}
        alt={homeHero.imageAlt}
        fill
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
        className="-z-20 object-cover object-[70%_30%]"
      />
      {/* Darkens the left side so the white text meets WCAG AA contrast on any photo. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 text-[#f6f3ec] sm:px-6 lg:py-16">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.35em]">{homeHero.eyebrow}</p>
        <h1 id="home-hero-title" className="mt-2 flex items-start gap-3 font-display text-6xl leading-none sm:text-7xl">
          {homeHero.title}
          <PawPrint aria-hidden className="mt-2 size-7" />
        </h1>
        <p className="mt-4 font-serif text-2xl sm:text-3xl">{homeHero.subtitle}</p>
        <p className="mt-4 max-w-xs text-sm leading-relaxed">{homeHero.body}</p>
        <ButtonLink href="#szolgaltatasok" variant="outlineLight" className="mt-6">
          {homeHero.cta}
        </ButtonLink>

        <p className="mt-8 flex max-w-[14rem] items-end gap-2 font-script text-2xl leading-tight sm:absolute sm:right-10 sm:top-12 sm:mt-0 sm:-rotate-12 sm:text-3xl">
          {homeHero.script}
          <Heart aria-hidden className="mb-2 size-5 shrink-0" />
        </p>
      </div>
    </section>
  );
}
