// "demo" until the business launches: a banner says so, the contact form sends nothing, search engines are asked
// not to index the site and the legal pages explain that no data is processed. NEXT_PUBLIC_SITE_MODE=live turns
// the real site on. Only relative imports here: next.config.ts and scripts/ load this file outside the "@/" alias.

export type SiteMode = "demo" | "live";

export function siteMode(env: { NEXT_PUBLIC_SITE_MODE?: string }): SiteMode {
  return env.NEXT_PUBLIC_SITE_MODE === "live" ? "live" : "demo";
}

// Read with the literal name, because Next.js only inlines NEXT_PUBLIC_ variables written out in full.
export const isDemo = siteMode({ NEXT_PUBLIC_SITE_MODE: process.env.NEXT_PUBLIC_SITE_MODE }) === "demo";
