import { hu } from "@/content/hu";
import { durationsFor, priceFor } from "@/features/pricing/lib/pricing";

// schema.org LocalBusiness for search engines. Telephone and e-mail are added once the business details are final.

type Offer = {
  "@type": "Offer";
  itemOffered: { "@type": "Service"; name: string; description: string };
  price: number;
  priceCurrency: "HUF";
};

export function localBusinessJsonLd(siteUrl: string) {
  const offers: Offer[] = hu.packages.items.map((pkg) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: pkg.name, description: pkg.tagline },
    // The lowest price a visit of this package can be booked for.
    price: priceFor(pkg.visitRate, durationsFor(pkg.id)[0]),
    priceCurrency: "HUF",
  }));
  const prices = hu.packages.items.flatMap((pkg) => durationsFor(pkg.id).map((d) => priceFor(pkg.visitRate, d)));

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: hu.brand.name,
    description: hu.siteDescription,
    url: `${siteUrl}/`,
    image: `${siteUrl}/og.jpg`,
    areaServed: { "@type": "City", name: "Budapest" },
    priceRange: `${Math.min(...prices)}–${Math.max(...prices)} HUF`,
    makesOffer: offers,
  };
}

/** JSON for a <script type="application/ld+json">; "<" is escaped so CMS text can never close the script tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
