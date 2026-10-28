import type { Metadata } from "next";
import { Caveat, Cormorant_Garamond, Lato, Playfair_Display } from "next/font/google";
import { hu } from "@/content/hu";
import "./globals.css";

// "latin-ext" is required for the Hungarian letters ő and ű.
// next/font needs literal options at build time, so the subsets cannot be shared via a variable.
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin", "latin-ext"] });
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});
const lato = Lato({ variable: "--font-lato", subsets: ["latin", "latin-ext"], weight: ["400", "700"] });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: `${hu.brand.name} – ${hu.brand.tagline}`,
  description: hu.siteDescription,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="hu"
      className={`${playfair.variable} ${cormorant.variable} ${lato.variable} ${caveat.variable} antialiased`}
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
