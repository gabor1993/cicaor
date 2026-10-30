import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { flattenSegmentFiles } from "./segment-files";

let root = "";

afterEach(async () => {
  if (root) await rm(root, { recursive: true, force: true });
});

describe("flattenSegmentFiles", () => {
  it("adds the flat prefetch file next to the nested one Windows produces", async () => {
    root = await mkdtemp(join(tmpdir(), "segments-"));
    await mkdir(join(root, "aszf", "__next.aszf"), { recursive: true });
    await writeFile(join(root, "aszf", "__next.aszf", "__PAGE__.txt"), "payload");

    expect(await flattenSegmentFiles(root)).toEqual([join("aszf", "__next.aszf.__PAGE__.txt")]);
    expect(await readFile(join(root, "aszf", "__next.aszf.__PAGE__.txt"), "utf8")).toBe("payload");
  });

  it("leaves correct flat files alone", async () => {
    root = await mkdtemp(join(tmpdir(), "segments-"));
    await mkdir(join(root, "aszf", "__next.aszf"), { recursive: true });
    await writeFile(join(root, "aszf", "__next.aszf", "__PAGE__.txt"), "nested");
    await writeFile(join(root, "aszf", "__next.aszf.__PAGE__.txt"), "flat");

    expect(await flattenSegmentFiles(root)).toEqual([]);
    expect(await readFile(join(root, "aszf", "__next.aszf.__PAGE__.txt"), "utf8")).toBe("flat");
  });
});
