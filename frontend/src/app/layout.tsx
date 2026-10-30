import type { Metadata } from "next";
import { Carlito, Caveat, Cormorant_Garamond, Playfair_Display } from "next/font/google";
import { hu } from "@/content/hu";
import { siteUrl } from "@/lib/build-env";
import "./globals.css";

// "latin-ext" is required for the Hungarian letters ő and ű.
// next/font needs literal options at build time, so the subsets cannot be shared via a variable.
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin", "latin-ext"] });
// The decorative fonts are not preloaded, so they do not compete with the hero photo (the LCP element).
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  preload: false,
});
// Carlito is built on Lato 2; the Lato served by Google Fonts lacks ő and ű despite "latin-ext".
const carlito = Carlito({ variable: "--font-carlito", subsets: ["latin", "latin-ext"], weight: ["400", "700"] });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin", "latin-ext"], preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: hu.seoTitle,
  description: hu.siteDescription,
  openGraph: {
    type: "website",
    locale: "hu_HU",
    siteName: hu.brand.name,
    title: hu.seoTitle,
    description: hu.siteDescription,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: hu.homeHero.imageAlt }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="hu"
      // Lets Next.js switch off the smooth scrolling from globals.css while it resets the scroll
      // position on page changes; without it the reset is animated and can land mid-page.
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${cormorant.variable} ${carlito.variable} ${caveat.variable} antialiased`}
    >
      <body>
        <a
          href="#tartalom"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
        >
          {hu.skipToContent}
        </a>
        {children}
      </body>
    </html>
  );
}
