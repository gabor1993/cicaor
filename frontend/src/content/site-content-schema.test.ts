import { describe, expect, it } from "vitest";
import snapshot from "./site-content.json";
import { siteContentSchema } from "./site-content-schema";

describe("siteContentSchema", () => {
  it("accepts the committed snapshot", () => {
    expect(siteContentSchema.safeParse(snapshot).success).toBe(true);
  });

  it("rejects content with a missing package", () => {
    const items = snapshot.packages.items.filter((pkg) => pkg.id !== "lux");
    const result = siteContentSchema.safeParse({ ...snapshot, packages: { ...snapshot.packages, items } });
    expect(result.success).toBe(false);
  });

  it("rejects empty texts and images hosted elsewhere", () => {
    expect(siteContentSchema.safeParse({ ...snapshot, closing: { ...snapshot.closing, title: "  " } }).success).toBe(false);
    const hero = { ...snapshot.homeHero, image: "https://evil.example/hero.webp" };
    expect(siteContentSchema.safeParse({ ...snapshot, homeHero: hero }).success).toBe(false);
  });
});
