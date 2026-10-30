import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/build-env";

// A static export only writes route handlers marked as static.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/adatkezelesi-tajekoztato/`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/aszf/`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
