import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/build-env";
import { isDemo } from "@/lib/site-mode";

// A static export only writes route handlers marked as static.
export const dynamic = "force-static";

// The demo stays crawlable on purpose: crawlers only see its "noindex" if they are allowed to fetch the pages.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: isDemo ? undefined : `${siteUrl()}/sitemap.xml`,
  };
}
