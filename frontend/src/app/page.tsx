import type { Metadata } from "next";
import { ContactSection } from "@/features/contact/contact-section";
import { AboutSection } from "@/features/home/about-section";
import { ClosingBand } from "@/features/home/closing-band";
import { FaqSection } from "@/features/home/faq-section";
import { FeatureStrip } from "@/features/home/feature-strip";
import { HomeHero } from "@/features/home/home-hero";
import { ServicesSection } from "@/features/home/services-section";
import { Footer } from "@/features/layout/footer";
import { Header } from "@/features/layout/header";
import { PricingSection } from "@/features/pricing/components/pricing-section";
import { localBusinessJsonLd, serializeJsonLd } from "@/features/seo/local-business";
import { siteUrl } from "@/lib/build-env";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(localBusinessJsonLd(siteUrl())) }}
      />
      <Header />
      <main id="tartalom">
        <HomeHero />
        <FeatureStrip />
        <div className="py-6">
          <AboutSection />
        </div>
        <ServicesSection />
        <PricingSection />
        {/* GalleryBand and ReviewsSection stay hidden until real client photos and reviews exist. */}
        <div className="border-t border-line py-6">
          <FaqSection />
        </div>
        <ContactSection />
        <ClosingBand />
      </main>
      <Footer />
    </>
  );
}
