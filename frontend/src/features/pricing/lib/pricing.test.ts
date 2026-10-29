import { describe, expect, it } from "vitest";
import { durations, hu } from "@/content/hu";
import { contactLinkFor, formatPrice, parseSelection, priceFor } from "./pricing";

describe("contact link round trip", () => {
  it("parses back what contactLinkFor produces", () => {
    const link = contactLinkFor("moka", 90);
    const search = link.slice(link.indexOf("?"), link.indexOf("#"));
    expect(parseSelection(search)).toEqual({ packageId: "moka", duration: 90 });
  });

  it("falls back to defaults for unknown or tampered values", () => {
    expect(parseSelection("?csomag=<script>&ido=45")).toEqual({ packageId: "", duration: 60 });
    expect(parseSelection("")).toEqual({ packageId: "", duration: 60 });
  });
});

describe("formatPrice", () => {
  it("groups thousands with a non-breaking space and appends Ft", () => {
    expect(formatPrice(4000)).toBe("4 000 Ft");
    expect(formatPrice(750)).toBe("750 Ft");
  });
});

describe("priceFor", () => {
  it("adds one step for every 30 minutes beyond the base", () => {
    const rate = { base: 3000, step: 750 };
    expect(priceFor(rate, 30)).toBe(3000);
    expect(priceFor(rate, 60)).toBe(3750);
    expect(priceFor(rate, 90)).toBe(4500);
  });

  it("matches the agreed price list for every package", () => {
    const table = Object.fromEntries(
      hu.packages.items.map((pkg) => [
        pkg.id,
        durations.map((duration) => [priceFor(pkg.visitRate, duration), priceFor(pkg.multiDayRate, duration)]),
      ]),
    );
    expect(table).toEqual({
      komfort: [
        [3000, 2500],
        [6000, 4000],
        [9000, 5500],
      ],
      moka: [
        [4000, 3500],
        [7000, 5000],
        [10000, 6500],
      ],
      lux: [
        [5000, 4000],
        [8000, 5500],
        [11000, 7000],
      ],
    });
  });
});
