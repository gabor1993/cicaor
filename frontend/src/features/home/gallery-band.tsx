"use client";

import { useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Photo } from "@/components/ui/photo";
import { Eyebrow } from "@/components/ui/section-heading";
import { hu } from "@/content/hu";

const VISIBLE = 3;

const toneFor = (index: number) => (index % 3) as 0 | 1 | 2;

export function GalleryBand() {
  const { gallery, brand } = hu;
  const total = gallery.items.length;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [offset, setOffset] = useState(0);
  const [current, setCurrent] = useState(0);

  const wrap = (value: number) => (value + total) % total;
  const visible = Array.from({ length: VISIBLE }, (_, i) => wrap(offset + i));

  function open(index: number) {
    setCurrent(index);
    dialogRef.current?.showModal();
  }

  const roundButton =
    "flex size-9 shrink-0 items-center justify-center rounded-full bg-card text-foreground shadow-md hover:bg-background";

  return (
    <section id="galeria" aria-labelledby="gallery-title" className="relative isolate overflow-hidden bg-band">
      {/* Photo on the left fading into the band, like in the design. */}
      <Photo
        src={gallery.image}
        alt={gallery.imageAlt}
        sizes="30vw"
        tone={0}
        className="absolute inset-y-0 left-0 -z-10 hidden h-full w-[30%] md:flex"
      />
      <div aria-hidden className="absolute inset-y-0 left-[18%] -z-10 hidden w-[14%] bg-gradient-to-r from-transparent to-band md:block" />

      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-6 sm:px-6 md:grid-cols-[28%_1fr] lg:grid-cols-[28%_1fr_1.6fr]">
        <div className="md:col-start-2">
          <Eyebrow>{gallery.eyebrow}</Eyebrow>
          <h2 id="gallery-title" className="mt-1 font-display text-2xl leading-tight sm:text-3xl">
            {gallery.titleLines[0]}
            <br />
            {gallery.titleLines[1]}
          </h2>
          <p className="mt-3 text-xs text-muted">{gallery.body}</p>
          <button
            type="button"
            onClick={() => open(0)}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-xs font-bold text-on-accent hover:opacity-90"
          >
            {gallery.cta}
            <ArrowRight aria-hidden className="size-4" />
          </button>
        </div>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={gallery.eyebrow}
          className="flex items-center gap-3 md:col-span-2 lg:col-span-1"
        >
          <button type="button" aria-label={gallery.previous} onClick={() => setOffset(wrap(offset - 1))} className={roundButton}>
            <ChevronLeft aria-hidden className="size-4" />
          </button>
          <ul className="grid flex-1 grid-cols-3 gap-3">
            {visible.map((index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => open(index)}
                  aria-label={`${gallery.openImage}: ${gallery.items[index].caption}`}
                  className="block w-full overflow-hidden"
                >
                  <Photo
                    src={gallery.items[index].image}
                    alt={gallery.items[index].caption}
                    sizes="(min-width: 1024px) 15vw, 30vw"
                    tone={toneFor(index)}
                    className="aspect-[5/4] w-full transition hover:scale-105"
                  />
                </button>
              </li>
            ))}
          </ul>
          <button type="button" aria-label={gallery.next} onClick={() => setOffset(wrap(offset + 1))} className={roundButton}>
            <ChevronRight aria-hidden className="size-4" />
          </button>
        </div>
      </div>

      {/* A native modal <dialog> traps focus and closes on Esc without extra code. */}
      <dialog
        ref={dialogRef}
        aria-label={gallery.items[current].caption}
        className="m-auto w-[min(92vw,44rem)] bg-[#24271d] p-4 text-[#f6f3ec] backdrop:bg-black/80"
      >
        <div className="flex justify-end">
          <button type="button" aria-label={gallery.close} onClick={() => dialogRef.current?.close()} className="p-1">
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" aria-label={gallery.previous} onClick={() => setCurrent(wrap(current - 1))} className="p-1">
            <ChevronLeft aria-hidden />
          </button>
          <Photo
            src={gallery.items[current].image}
            alt={gallery.items[current].caption}
            sizes="(min-width: 768px) 44rem, 92vw"
            tone={toneFor(current)}
            className="aspect-[4/3] min-w-0 flex-1"
          />
          <button type="button" aria-label={gallery.next} onClick={() => setCurrent(wrap(current + 1))} className="p-1">
            <ChevronRight aria-hidden />
          </button>
        </div>
        <div className="mt-3 flex items-end justify-between px-10 text-xs">
          <p>
            <span className="block text-sm">{gallery.items[current].caption}</span>
            <span className="opacity-70">
              © {new Date().getFullYear()} {brand.name}
            </span>
          </p>
          <p aria-live="polite">
            {current + 1}/{total}
          </p>
        </div>
      </dialog>
    </section>
  );
}
