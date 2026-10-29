import { describe, expect, it } from "vitest";
import { samePageHashTarget } from "./same-page-hash";

const origin = "https://cicaor.hu";

describe("samePageHashTarget", () => {
  it("returns the id when the link repeats the hash already in the URL", () => {
    expect(samePageHashTarget("#kapcsolat", `${origin}/#kapcsolat`)).toBe("kapcsolat");
    expect(samePageHashTarget("/#kapcsolat", `${origin}/#kapcsolat`)).toBe("kapcsolat");
  });

  it("keeps the query string in the comparison", () => {
    const current = `${origin}/?csomag=alap&ido=60#kapcsolat`;
    expect(samePageHashTarget("/?csomag=alap&ido=60#kapcsolat", current)).toBe("kapcsolat");
    expect(samePageHashTarget("/?csomag=alap&ido=90#kapcsolat", current)).toBeNull();
  });

  it("leaves new hashes and other pages to the router", () => {
    expect(samePageHashTarget("#kapcsolat", `${origin}/`)).toBeNull();
    expect(samePageHashTarget("/#kapcsolat", `${origin}/aszf/#kapcsolat`)).toBeNull();
    expect(samePageHashTarget("/aszf/", `${origin}/aszf/`)).toBeNull();
  });
});
