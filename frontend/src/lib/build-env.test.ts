import { describe, expect, it } from "vitest";
import { siteUrl, validateBuildEnv } from "./build-env";

const production = {
  CONTEXT: "production",
  SITE_URL: "https://cicaor.hu",
  NEXT_PUBLIC_CONTACT_API_URL: "https://api.cicaor.hu/contact.php",
  CMS_URL: "https://cms.cicaor.hu",
};

describe("validateBuildEnv", () => {
  it("accepts a complete production environment", () => {
    expect(() => validateBuildEnv(production)).not.toThrow();
  });

  it("names every missing or non-https value in production", () => {
    expect(() => validateBuildEnv({ ...production, NEXT_PUBLIC_CONTACT_API_URL: undefined, CMS_URL: "http://cms.cicaor.hu" })).toThrow(
      /NEXT_PUBLIC_CONTACT_API_URL[\s\S]*CMS_URL/,
    );
  });

  it("does not require anything outside production", () => {
    expect(() => validateBuildEnv({})).not.toThrow();
    expect(() => validateBuildEnv({ CONTEXT: "deploy-preview" })).not.toThrow();
  });
});

describe("siteUrl", () => {
  it("drops a trailing slash and falls back to localhost", () => {
    expect(siteUrl({ SITE_URL: "https://cicaor.hu/" })).toBe("https://cicaor.hu");
    expect(siteUrl({})).toBe("http://localhost:3000");
  });
});
