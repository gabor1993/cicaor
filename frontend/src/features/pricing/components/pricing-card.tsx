"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarDays, Check, ChevronDown, PawPrint } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { hu, type Duration } from "@/content/hu";
import { contactLinkFor, durationsFor, formatPrice, priceFor } from "../lib/pricing";
import { DurationSelector } from "./duration-selector";

type PricingPackage = (typeof hu.packages.items)[number];

export function PricingCard({ pkg }: { pkg: PricingPackage }) {
  const [duration, setDuration] = useState<Duration>(60);
  const copy = hu.packages;
  const { multiDay } = hu;
  const headingId = `package-${pkg.id}`;
  const options = durationsFor(pkg.id);

  return (
    <article
      aria-labelledby={headingId}
      className={`relative flex flex-col rounded-2xl border bg-card p-3 shadow-sm ${
        pkg.popular ? "border-accent shadow-lg lg:-mt-3 lg:mb-3" : "border-line"
      }`}
    >
      <div className="relative">
        <Image
          src={pkg.image}
          alt={pkg.imageAlt}
          width={800}
          height={600}
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="aspect-[4/3] w-full rounded-lg object-cover"
        />
        {pkg.popular && (
          <span className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-accent px-3 py-1 text-xs font-bold text-on-accent">
            {copy.popular}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-5 p-4">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted">{pkg.label}</p>
          <h3 id={headingId} className="mt-1 font-display text-3xl">
            {pkg.name}
          </h3>
          <p className="mt-1 font-serif text-lg text-muted">{pkg.tagline}</p>
        </header>

        <DurationSelector name={`duration-${pkg.id}`} options={options} value={duration} onChange={setDuration} />

        <div>
          <p className="font-display text-3xl">
            {formatPrice(priceFor(pkg.visitRate, duration))}{" "}
            <span className="font-sans text-sm text-muted">{copy.perVisit}</span>
          </p>
          <p className="mt-2 flex gap-2 text-sm">
            <CalendarDays aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
            <span>
              {multiDay.label} <strong>{formatPrice(priceFor(pkg.multiDayRate, duration))}</strong> {multiDay.perNight}{" "}
              <span className="whitespace-nowrap text-muted">{multiDay.visitsPerDay}</span>
            </span>
          </p>
        </div>

        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-bold [&::-webkit-details-marker]:hidden">
            {copy.features}
            <ChevronDown aria-hidden className="size-4 shrink-0 transition group-open:rotate-180" />
          </summary>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {pkg.features.map((feature) => (
              <li key={feature} className="flex gap-2">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                {feature}
              </li>
            ))}
          </ul>
        </details>

        <p className="flex items-center gap-2 border-t border-line pt-4 text-xs text-muted">
          <PawPrint aria-hidden className="size-4 shrink-0" />
          {copy.bookable} {options.join(" / ")} {copy.minutes}
        </p>

        <ButtonLink
          href={contactLinkFor(pkg.id, duration)}
          variant={pkg.popular || pkg.id === "komfort" ? "solid" : "outline"}
        >
          {copy.select}
          <span className="sr-only"> – {pkg.name}</span>
        </ButtonLink>
      </div>
    </article>
  );
}
