import { Cat, CalendarDays, Clock, MapPin, Zap, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { hu } from "@/content/hu";

const icons: Record<(typeof hu.addOns.items)[number]["icon"], LucideIcon> = {
  cat: Cat,
  calendar: CalendarDays,
  "map-pin": MapPin,
  clock: Clock,
  zap: Zap,
};

export function AddOnsGrid() {
  const { addOns } = hu;

  return (
    <section aria-labelledby="addons-title">
      <SectionHeading id="addons-title" eyebrow={addOns.eyebrow} title={addOns.title} subtitle={addOns.subtitle} lines />
      <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
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
    </section>
  );
}
