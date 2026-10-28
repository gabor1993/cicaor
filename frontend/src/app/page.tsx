import { ContactSection } from "@/features/contact/contact-section";
import { AboutSection } from "@/features/home/about-section";
import { ClosingBand } from "@/features/home/closing-band";
import { FaqSection } from "@/features/home/faq-section";
import { FeatureStrip } from "@/features/home/feature-strip";
import { GalleryBand } from "@/features/home/gallery-band";
import { HomeHero } from "@/features/home/home-hero";
import { ReviewsSection } from "@/features/home/reviews-section";
import { ServicesSection } from "@/features/home/services-section";
import { Footer } from "@/features/layout/footer";
import { Header } from "@/features/layout/header";

export default function Home() {
  return (
    <>
      <Header />
      <main id="tartalom">
        <HomeHero />
        <FeatureStrip />
        <div className="py-6">
          <AboutSection />
        </div>
        <ServicesSection />
        <GalleryBand />
        <ReviewsSection />
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
