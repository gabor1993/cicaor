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
    const file = headersFile(undefined);
    expect(file.startsWith("/*\n  Content-Security-Policy:")).toBe(true);
    expect(file).toContain("/_next/static/*\n  Cache-Control: public, max-age=31536000, immutable");
  });
});
