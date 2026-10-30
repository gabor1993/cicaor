import Image from "next/image";
import { Check, Heart, PawPrint } from "lucide-react";
import { PhotoPlaceholder } from "@/components/ui/photo-placeholder";
import { Eyebrow } from "@/components/ui/section-heading";
import { hu } from "@/content/hu";

export function AboutSection() {
  const { about } = hu;

  return (
    <section id="rolam" aria-labelledby="about-title" className="px-4 sm:px-6">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.5fr_1.4fr_auto_1fr] lg:gap-6">
        <PhotoPlaceholder alt={about.imageAlt} tone={0} className="aspect-[4/3] w-full" />

        <div className="lg:pl-4">
          <Eyebrow>{about.eyebrow}</Eyebrow>
          <h2 id="about-title" className="mt-2 font-display text-3xl leading-tight">
            {about.titleLines[0]}
            <br />
            {about.titleLines[1]}
          </h2>
          <p className="mt-4 text-xs leading-relaxed text-muted">{about.body}</p>
          <ul className="mt-4 flex flex-col gap-1.5 text-[0.7rem]">
            {about.points.map((point) => (
              <li key={point} className="flex gap-2">
                <Check aria-hidden className="size-3.5 shrink-0 text-accent" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="hidden max-w-[6.5rem] -rotate-12 flex-col items-center text-center font-script text-lg leading-tight text-taupe lg:flex">
          {about.script}
          <Heart aria-hidden className="mt-1 size-4" />
        </p>

        <figure className="overflow-hidden bg-band">
          <Image
            src="/images/about-quote.webp"
            alt={about.quoteImageAlt}
            width={800}
            height={600}
            sizes="(min-width: 1024px) 25vw, 100vw"
            className="aspect-[4/3] w-full object-cover"
          />
          <blockquote className="px-5 py-5 text-center font-serif text-lg italic leading-snug">
            {about.quote}
            <PawPrint aria-hidden className="mx-auto mt-3 size-4 not-italic" />
          </blockquote>
        </figure>
      </div>
    </section>
  );
}
