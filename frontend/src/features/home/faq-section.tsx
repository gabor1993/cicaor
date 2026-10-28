"use client";

import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { PhotoPlaceholder } from "@/components/ui/photo-placeholder";
import { Eyebrow } from "@/components/ui/section-heading";
import { hu } from "@/content/hu";

export function FaqSection() {
  const { faq } = hu;
  const [showAll, setShowAll] = useState(false);
  const items = showAll ? [...faq.items, ...faq.moreItems] : faq.items;

  return (
    <section id="gyik" aria-labelledby="faq-title" className="px-4 py-4 sm:px-6">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-12">
        <PhotoPlaceholder alt={faq.imageAlt} tone={0} className="hidden aspect-[5/3] lg:col-span-3 lg:flex" />

        <div className="lg:col-span-4 lg:border-r lg:border-line lg:pr-8">
          <Eyebrow>{faq.eyebrow}</Eyebrow>
          <h2 id="faq-title" className="mt-1 font-display text-2xl sm:text-3xl">
            {faq.title}
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-muted">{faq.body}</p>
          <button
            type="button"
            aria-expanded={showAll}
            aria-controls="faq-list"
            onClick={() => setShowAll((value) => !value)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-xs font-bold text-on-accent hover:opacity-90"
          >
            {showAll ? faq.showLess : faq.showAll}
            <ArrowRight aria-hidden className="size-4" />
          </button>
        </div>

        <div id="faq-list" className="flex flex-col gap-2 lg:col-span-5">
          {items.map((item, index) => (
            // Native <details> gives keyboard and screen reader support without extra JavaScript.
            <details key={index} className="group border border-line bg-card px-4 py-2.5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xs [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus aria-hidden className="size-4 shrink-0 text-muted transition group-open:rotate-45" />
              </summary>
              <p className="mt-2 text-xs text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
