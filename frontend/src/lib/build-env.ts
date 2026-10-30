import { z } from "zod";
import { siteMode } from "./site-mode";

// Build-time settings. Netlify sets CONTEXT=production for the live site, and only that build insists on every
// value: a missing contact URL would otherwise ship a form that silently posts nowhere. The demo site sends no
// form and needs no CMS, so it only needs its own address.
// Only relative imports here: next.config.ts and scripts/ load this file outside the "@/" alias.

const httpsUrl = z.url({ protocol: /^https$/ });

const demoEnvSchema = z.object({ SITE_URL: httpsUrl });

const liveEnvSchema = demoEnvSchema.extend({
  NEXT_PUBLIC_CONTACT_API_URL: httpsUrl,
  CMS_URL: httpsUrl,
});

export const fallbackSiteUrl = "http://localhost:3000";

export function validateBuildEnv(env: Record<string, string | undefined>): void {
  if (env.CONTEXT !== "production") return;
  const schema = siteMode(env) === "live" ? liveEnvSchema : demoEnvSchema;
  const result = schema.safeParse(env);
  if (!result.success) {
    const problems = result.error.issues.map((issue) => `- ${issue.path.join(".")}: ${issue.message}`).join("\n");
    throw new Error(`Missing or invalid environment variables for the production build:\n${problems}`);
  }
}

/** The public origin, used for canonical URLs, the sitemap and social previews. */
export function siteUrl(env: Record<string, string | undefined> = process.env): string {
  return (env.SITE_URL ?? fallbackSiteUrl).replace(/\/$/, "");
}
