import Image from "next/image";
import { CalendarDays, Cat, House, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { hu } from "@/content/hu";

type ServiceKey = (typeof hu.services.items)[number]["icon"];

const icons: Record<ServiceKey, LucideIcon> = {
  house: House,
  cats: Cat,
  calendar: CalendarDays,
};

const images: Record<ServiceKey, string> = {
  house: "/images/service-daily-visit.webp",
  cats: "/images/service-multiple-cats.webp",
  calendar: "/images/service-long-absence.webp",
};

export function ServicesSection() {
  const { services } = hu;

  return (
    <section id="szolgaltatasok" aria-labelledby="services-title" className="px-4 py-10 sm:px-6">
      <SectionHeading
        id="services-title"
        eyebrow={services.eyebrow}
        title={services.title}
        subtitle={services.subtitle}
      />
      {/* Flex-wrap instead of a grid so an odd card left on its own row stays centred. */}
      <div className="mx-auto mt-6 flex max-w-6xl flex-wrap justify-center gap-4">
        {services.items.map((item) => {
          const Icon = icons[item.icon];
          return (
            <article
              key={item.title}
              className="flex w-full flex-col border border-line bg-card sm:w-[calc(50%-0.5rem)] lg:w-[calc((100%-2rem)/3)]"
            >
              <Image
                src={images[item.icon]}
                alt={item.imageAlt}
                width={800}
                height={533}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="aspect-[3/2] w-full object-cover"
              />
              <div className="relative flex flex-1 flex-col px-4 pb-5 pt-8">
                <span className="absolute -top-6 left-4 flex size-12 items-center justify-center rounded-full bg-card">
                  <Icon aria-hidden className="size-5" strokeWidth={1.5} />
                </span>
                <h3 className="font-serif text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">{item.body}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
