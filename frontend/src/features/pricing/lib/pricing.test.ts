import { describe, expect, it } from "vitest";
import { contactLinkFor, formatPrice, getVisitPrice, parseSelection } from "./pricing";

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

describe("getVisitPrice", () => {
  const prices = { 30: 3000, 60: 4000, 90: 5500 } as const;

  it("returns the price for the selected duration", () => {
    expect(getVisitPrice(prices, 30)).toBe(3000);
    expect(getVisitPrice(prices, 90)).toBe(5500);
  });
});
