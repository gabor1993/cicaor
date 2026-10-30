import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/build-env";

// A static export only writes route handlers marked as static.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
