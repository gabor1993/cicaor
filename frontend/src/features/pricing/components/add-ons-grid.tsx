import { Cat, CalendarDays, ChevronDown, CirclePlus, Clock, MapPin, Zap, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { hu } from "@/content/hu";

const icons: Record<(typeof hu.addOns.items)[number]["icon"], LucideIcon> = {
  cat: Cat,
  calendar: CalendarDays,
  "map-pin": MapPin,
  clock: Clock,
  zap: Zap,
  plus: CirclePlus,
};

export function AddOnsGrid() {
  const { addOns } = hu;

  return (
    <section aria-labelledby="addons-title">
      <SectionHeading
        id="addons-title"
        eyebrow={addOns.eyebrow}
        title={addOns.title}
        subtitle={addOns.subtitle}
        lines
      />
      {/* Native <details> keeps the list collapsible without JavaScript, like the FAQ. */}
      <details className="group mt-6">
        <summary className="mx-auto flex w-fit cursor-pointer list-none items-center gap-2 rounded-full border border-line px-5 py-2 text-xs hover:border-accent [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">{addOns.show}</span>
          <span className="hidden group-open:inline">{addOns.hide}</span>
          <ChevronDown aria-hidden className="size-4 transition group-open:rotate-180" />
        </summary>
        <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {addOns.items.map((item) => {
            const Icon = icons[item.icon];
            return (
              <li key={item.id} className="flex flex-col items-center gap-2 bg-card p-6 text-center">
                <Icon aria-hidden className="size-8 text-accent" strokeWidth={1.25} />
                <h3 className="font-serif text-lg">{item.name}</h3>
                <p className="text-sm">
                  {item.price} <span className="text-muted">{item.unit}</span>
                </p>
                <p className="text-xs text-muted">{item.note}</p>
              </li>
            );
          })}
        </ul>
      </details>
    </section>
  );
}
