import { describe, expect, it } from "vitest";
import { contactSchema } from "./schema";

const valid = {
  name: "Teszt Elek",
  email: "teszt@example.com",
  phone: "",
  packageId: "moka",
  duration: "60",
  message: "Szia!",
  consent: true,
  website: "",
};

describe("contactSchema", () => {
  it("accepts a valid enquiry", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a duration the package does not offer", () => {
    const result = contactSchema.safeParse({ ...valid, packageId: "lux", duration: "30" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["duration"]);
  });

  it("allows every duration without a package", () => {
    expect(contactSchema.safeParse({ ...valid, packageId: "", duration: "30" }).success).toBe(true);
  });
});
