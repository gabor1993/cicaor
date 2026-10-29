import Image from "next/image";
import { CalendarDays, Cat, CirclePlus, House, PawPrint, type LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { hu } from "@/content/hu";

type ServiceKey = (typeof hu.services.items)[number]["icon"];

const icons: Record<ServiceKey, LucideIcon> = {
  house: House,
  cats: Cat,
  calendar: CalendarDays,
  plus: CirclePlus,
};

const images: Record<ServiceKey, string> = {
  house: "/images/service-daily-visit.webp",
  cats: "/images/service-multiple-cats.webp",
  calendar: "/images/service-long-absence.webp",
  plus: "/images/service-extras.webp",
};

function PricingSummary() {
  const { pricingSummary } = hu;
  return (
    <aside aria-labelledby="pricing-summary-title" className="flex flex-col bg-band p-5">
      <h3 id="pricing-summary-title" className="font-serif text-2xl">
        {pricingSummary.title}
      </h3>
      <dl className="mt-4 text-[0.7rem]">
        {pricingSummary.rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-3 border-b border-line py-3">
            <dt>{row.label}</dt>
            <dd className="whitespace-nowrap text-right">{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 flex flex-1 items-start gap-3 text-[0.7rem] leading-relaxed text-muted">
        {pricingSummary.note}
        <PawPrint aria-hidden className="size-8 shrink-0 text-taupe" strokeWidth={1.25} />
      </p>
      <ButtonLink href="#kapcsolat" className="mt-4 w-full whitespace-nowrap px-4 text-xs">
        {pricingSummary.cta}
      </ButtonLink>
    </aside>
  );
}

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
      <div className="mx-auto mt-6 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(4,1fr)_1.25fr]">
        {services.items.map((item) => {
          const Icon = icons[item.icon];
          return (
            <article key={item.title} className="flex flex-col border border-line bg-card">
              <Image
                src={images[item.icon]}
                alt={item.imageAlt}
                width={800}
                height={533}
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                className="aspect-[3/2] w-full object-cover"
              />
              <div className="relative flex flex-1 flex-col px-4 pb-4 pt-8">
                <span className="absolute -top-6 left-4 flex size-12 items-center justify-center rounded-full bg-card">
                  <Icon aria-hidden className="size-5" strokeWidth={1.5} />
                </span>
                <h3 className="font-serif text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-muted">{item.body}</p>
                <p className="mt-4 font-serif text-base">
                  {item.price} {item.unit && <span className="text-taupe">{item.unit}</span>}
                </p>
                <p className="text-[0.65rem] text-muted">{item.note}</p>
              </div>
            </article>
          );
        })}
        <PricingSummary />
      </div>
    </section>
  );
}
