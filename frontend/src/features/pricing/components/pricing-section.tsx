import { SectionHeading } from "@/components/ui/section-heading";
import { hu } from "@/content/hu";
import { AddOnsGrid } from "./add-ons-grid";
import { PricingCard } from "./pricing-card";

export function PricingSection() {
  const { packages } = hu;

  return (
    <section id="arak" aria-labelledby="packages-title" className="border-t border-line px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-16">
        <div>
          <SectionHeading
            id="packages-title"
            eyebrow={packages.eyebrow}
            title={packages.title}
            subtitle={packages.subtitle}
            lines
          />
          <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
            {packages.items.map((pkg) => (
              <PricingCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
        <AddOnsGrid />
      </div>
    </section>
  );
}
