import { describe, expect, it } from "vitest";
import { pickActiveSection } from "./active-section";

const line = 120;

describe("pickActiveSection", () => {
  it("returns null above the first section", () => {
    expect(pickActiveSection([{ id: "rolam", top: 400 }, { id: "arak", top: 1400 }], line, false)).toBeNull();
  });

  it("returns the last section that scrolled past the line", () => {
    const sections = [
      { id: "rolam", top: -900 },
      { id: "arak", top: 80 },
      { id: "kapcsolat", top: 900 },
    ];
    expect(pickActiveSection(sections, line, false)).toBe("arak");
  });

  it("returns the last section at the bottom of the page", () => {
    const sections = [
      { id: "gyik", top: -300 },
      { id: "kapcsolat", top: 300 },
    ];
    expect(pickActiveSection(sections, line, true)).toBe("kapcsolat");
  });

  it("returns null when there are no sections", () => {
    expect(pickActiveSection([], line, true)).toBeNull();
  });
});
