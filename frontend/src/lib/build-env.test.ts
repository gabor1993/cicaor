import { describe, expect, it } from "vitest";
import { siteUrl, validateBuildEnv } from "./build-env";
import { siteMode } from "./site-mode";

const live = {
  CONTEXT: "production",
  NEXT_PUBLIC_SITE_MODE: "live",
  SITE_URL: "https://cicaor.hu",
  NEXT_PUBLIC_CONTACT_API_URL: "https://api.cicaor.hu/contact.php",
  CMS_URL: "https://cms.cicaor.hu",
};

describe("validateBuildEnv", () => {
  it("accepts a complete live environment", () => {
    expect(() => validateBuildEnv(live)).not.toThrow();
  });

  it("names every missing or non-https value of the live site", () => {
    expect(() => validateBuildEnv({ ...live, NEXT_PUBLIC_CONTACT_API_URL: undefined, CMS_URL: "http://cms.cicaor.hu" })).toThrow(
      /NEXT_PUBLIC_CONTACT_API_URL[\s\S]*CMS_URL/,
    );
  });

  it("only needs the site address for the demo", () => {
    expect(() => validateBuildEnv({ CONTEXT: "production", SITE_URL: "https://cicaor.netlify.app" })).not.toThrow();
    expect(() => validateBuildEnv({ CONTEXT: "production" })).toThrow(/SITE_URL/);
  });

  it("does not require anything outside production", () => {
    expect(() => validateBuildEnv({})).not.toThrow();
    expect(() => validateBuildEnv({ CONTEXT: "deploy-preview" })).not.toThrow();
  });
});

describe("siteMode", () => {
  it("is the demo unless live is set explicitly", () => {
    expect(siteMode({})).toBe("demo");
    expect(siteMode({ NEXT_PUBLIC_SITE_MODE: "LIVE" })).toBe("demo");
    expect(siteMode({ NEXT_PUBLIC_SITE_MODE: "live" })).toBe("live");
  });
});

describe("siteUrl", () => {
  it("drops a trailing slash and falls back to localhost", () => {
    expect(siteUrl({ SITE_URL: "https://cicaor.hu/" })).toBe("https://cicaor.hu");
    expect(siteUrl({})).toBe("http://localhost:3000");
  });
});
