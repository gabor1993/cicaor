import { describe, expect, it } from "vitest";
import { localBusinessJsonLd, serializeJsonLd } from "./local-business";

describe("localBusinessJsonLd", () => {
  const data = localBusinessJsonLd("https://cicaor.hu");

  it("describes the business in Budapest with absolute URLs", () => {
    expect(data["@type"]).toBe("LocalBusiness");
    expect(data.areaServed.name).toBe("Budapest");
    expect(data.url).toBe("https://cicaor.hu/");
    expect(data.image).toBe("https://cicaor.hu/og.jpg");
  });

  it("offers every package from its lowest bookable price", () => {
    expect(data.makesOffer.map((offer) => [offer.itemOffered.name, offer.price])).toEqual([
      ["CicaKomfort", 4000],
      ["CicaMóka", 5000],
      ["CicaLux", 9000],
    ]);
    expect(data.priceRange).toBe("4000–12000 HUF");
  });
});

describe("serializeJsonLd", () => {
  it("cannot be used to close the script tag", () => {
    expect(serializeJsonLd({ name: "</script><script>alert(1)</script>" })).not.toContain("<");
  });
});
