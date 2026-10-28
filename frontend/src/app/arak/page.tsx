import type { Metadata } from "next";
import { hu } from "@/content/hu";
import { Footer } from "@/features/layout/footer";
import { Header } from "@/features/layout/header";
import { CtaBand } from "@/features/pricing/components/cta-band";
import { PricingHero } from "@/features/pricing/components/pricing-hero";
import { PricingSection } from "@/features/pricing/components/pricing-section";

export const metadata: Metadata = {
  title: `${hu.pricingPageTitle} – ${hu.brand.name}`,
  description: hu.pricingPageDescription,
};

export default function PricingPage() {
  return (
    <>
      <Header />
      <main id="tartalom">
        <PricingHero />
        <PricingSection />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
