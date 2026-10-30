import { describe, expect, it } from "vitest";
import { hu } from "@/content/hu";
import { contactLinkFor, durationsFor, fitDuration, formatPrice, parseSelection, priceFor } from "./pricing";

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

  it("moves a duration the package does not offer to the package's shortest one", () => {
    expect(parseSelection("?csomag=lux&ido=30")).toEqual({ packageId: "lux", duration: 60 });
  });
});

describe("durations per package", () => {
  it("offers every duration without a package and no 30 minutes for CicaLux", () => {
    expect(durationsFor("")).toEqual([30, 60, 90]);
    expect(durationsFor("komfort")).toEqual([30, 60, 90]);
    expect(durationsFor("lux")).toEqual([60, 90]);
  });

  it("keeps an offered duration and replaces one that is not offered", () => {
    expect(fitDuration("lux", 90)).toBe(90);
    expect(fitDuration("lux", 30)).toBe(60);
    expect(fitDuration("moka", 30)).toBe(30);
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
        durationsFor(pkg.id).map((duration) => [
          priceFor(pkg.visitRate, duration),
          priceFor(pkg.multiDayRate, duration),
        ]),
      ]),
    );
    expect(table).toEqual({
      komfort: [
        [4000, 3500],
        [7000, 5000],
        [10000, 6500],
      ],
      moka: [
        [5000, 4500],
        [8000, 6000],
        [11000, 7500],
      ],
      lux: [
        [9000, 6500],
        [12000, 8000],
      ],
    });
  });
});
