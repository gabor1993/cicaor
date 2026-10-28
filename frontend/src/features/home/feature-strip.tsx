import { Heart, House, PawPrint, ShieldCheck, type LucideIcon } from "lucide-react";
import { hu } from "@/content/hu";

const icons: Record<(typeof hu.features)[number]["icon"], LucideIcon> = {
  heart: Heart,
  shield: ShieldCheck,
  paw: PawPrint,
  house: House,
};

export function FeatureStrip() {
  return (
    <section aria-label={hu.homeHero.eyebrow} className="border-b border-line bg-card">
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-4 py-6 sm:px-6 lg:grid-cols-4 lg:divide-x lg:divide-line">
        {hu.features.map((feature) => {
          const Icon = icons[feature.icon];
          return (
            <li key={feature.title} className="flex flex-col items-center px-4 text-center">
              <Icon aria-hidden className="size-7" strokeWidth={1.25} />
              <h2 className="mt-3 font-serif text-base font-semibold">{feature.title}</h2>
              <p className="mt-1 max-w-[13rem] text-xs leading-relaxed text-muted">{feature.body}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
