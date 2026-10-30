import { describe, expect, it } from "vitest";
import { contentSecurityPolicy, headersFile } from "./security-headers";

describe("contentSecurityPolicy", () => {
  it("allows fetches only to the contact backend's origin", () => {
    const csp = contentSecurityPolicy("https://api.cicaor.hu/contact.php");
    expect(csp).toContain("connect-src 'self' https://api.cicaor.hu;");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it("stays on 'self' for a same-origin or missing contact URL", () => {
    expect(contentSecurityPolicy("/backend/contact.php")).toContain("connect-src 'self';");
    expect(contentSecurityPolicy(undefined)).toContain("connect-src 'self';");
  });
});

describe("headersFile", () => {
  it("applies the headers to every path and caches hashed assets", () => {
    const file = headersFile({ contactApiUrl: undefined, demo: false });
    expect(file.startsWith("/*\n  Content-Security-Policy:")).toBe(true);
    expect(file).toContain("/_next/static/*\n  Cache-Control: public, max-age=31536000, immutable");
  });

  it("keeps the demo out of search engines and away from the contact backend", () => {
    const demo = headersFile({ contactApiUrl: "https://api.cicaor.hu/contact.php", demo: true });
    expect(demo).toContain("X-Robots-Tag: noindex, nofollow");
    expect(demo).not.toContain("api.cicaor.hu");
    const live = headersFile({ contactApiUrl: "https://api.cicaor.hu/contact.php", demo: false });
    expect(live).not.toContain("X-Robots-Tag");
    expect(live).toContain("connect-src 'self' https://api.cicaor.hu;");
  });
});
