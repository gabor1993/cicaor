import { describe, expect, it } from "vitest";
import { assertSameOrigin, collectImageUrls, replaceImageUrls } from "./cms-images";

const response = {
  homeHero: { image: "https://cms.example.test/hero.jpg", imageAlt: "Cica" },
  about: { image: null, quoteImage: "https://cms.example.test/quote.jpg", quoteImageAlt: "Idézet" },
  gallery: { items: [{ caption: "Első", image: "https://cms.example.test/hero.jpg" }] },
};

describe("collectImageUrls", () => {
  it("finds every image once and skips alt texts and empty images", () => {
    expect(collectImageUrls(response)).toEqual(["https://cms.example.test/hero.jpg", "https://cms.example.test/quote.jpg"]);
  });
});

describe("replaceImageUrls", () => {
  it("swaps image URLs for local paths and leaves other values alone", () => {
    const paths = new Map([
      ["https://cms.example.test/hero.jpg", "/cms/a.webp"],
      ["https://cms.example.test/quote.jpg", "/cms/b.webp"],
    ]);
    expect(replaceImageUrls(response, paths)).toEqual({
      homeHero: { image: "/cms/a.webp", imageAlt: "Cica" },
      about: { image: null, quoteImage: "/cms/b.webp", quoteImageAlt: "Idézet" },
      gallery: { items: [{ caption: "Első", image: "/cms/a.webp" }] },
    });
  });
});

describe("assertSameOrigin", () => {
  it("accepts CMS images and rejects other hosts", () => {
    expect(() => assertSameOrigin("https://cms.example.test/a.jpg", "https://cms.example.test")).not.toThrow();
    expect(() => assertSameOrigin("https://evil.example/a.jpg", "https://cms.example.test")).toThrow();
  });
});
