import { CalendarDays, PawPrint } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { hu } from "@/content/hu";
import { formatPrice } from "../lib/pricing";

export function MultiDayStrip() {
  const { multiDay, packages } = hu;

  return (
    <section
      aria-labelledby="multi-day-title"
      className="rounded-2xl bg-band p-6 sm:p-8 lg:grid lg:grid-cols-[1.3fr_auto_2fr] lg:items-center lg:gap-6"
    >
      <div className="flex gap-4">
        <CalendarDays aria-hidden className="size-10 shrink-0 text-accent" strokeWidth={1.25} />
        <div>
          <h3 id="multi-day-title" className="font-display text-2xl">
            {multiDay.title}
          </h3>
          <p className="mt-2 text-sm text-muted">{multiDay.body}</p>
          <ButtonLink href="/#kapcsolat" className="mt-4">
            {multiDay.cta}
          </ButtonLink>
        </div>
      </div>

      <p className="mt-6 hidden max-w-[8rem] -rotate-12 flex-col items-center text-center font-script text-lg leading-tight text-taupe lg:mt-0 lg:flex">
        {multiDay.script}
        <PawPrint aria-hidden className="mt-2 size-4" />
      </p>

      <ul className="mt-6 grid grid-cols-3 divide-x divide-line text-center lg:mt-0">
        {packages.items.map((pkg) => (
          <li key={pkg.id} className="px-2">
            <p className="font-serif text-lg">{pkg.name}</p>
            <p className="text-xs text-muted">{multiDay.tag}</p>
            <p className="mt-2 font-display text-xl">
              {formatPrice(pkg.perNight)} <span className="font-sans text-xs">{multiDay.perNight}</span>
            </p>
            <p className="text-xs text-muted">{multiDay.visitsPerDay}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
