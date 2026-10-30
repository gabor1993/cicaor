import { z } from "zod";

// Build-time settings. Netlify sets CONTEXT=production for the live site, and only that build insists on every
// value: a missing contact URL would otherwise ship a form that silently posts nowhere.
// Only relative imports here: next.config.ts and scripts/ load this file outside the "@/" alias.

const httpsUrl = z.url({ protocol: /^https$/ });

const productionEnvSchema = z.object({
  SITE_URL: httpsUrl,
  NEXT_PUBLIC_CONTACT_API_URL: httpsUrl,
  CMS_URL: httpsUrl,
});

export const fallbackSiteUrl = "http://localhost:3000";

export function validateBuildEnv(env: Record<string, string | undefined>): void {
  if (env.CONTEXT !== "production") return;
  const result = productionEnvSchema.safeParse(env);
  if (!result.success) {
    const problems = result.error.issues.map((issue) => `- ${issue.path.join(".")}: ${issue.message}`).join("\n");
    throw new Error(`Missing or invalid environment variables for the production build:\n${problems}`);
  }
}

/** The public origin, used for canonical URLs, the sitemap and social previews. */
export function siteUrl(env: Record<string, string | undefined> = process.env): string {
  return (env.SITE_URL ?? fallbackSiteUrl).replace(/\/$/, "");
}
