import { constants } from "node:fs";
import { copyFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";

// Next.js 16 builds segment prefetch file names with path.relative(), which returns "aszf\__PAGE__" on Windows.
// Only "/" is turned into ".", so the export writes "aszf/__next.aszf/__PAGE__.txt" while the browser asks for
// "aszf/__next.aszf.__PAGE__.txt" and gets a 404. This adds the expected flat copy; on Linux there is nothing to do.

const PREFIX = "__next.";

async function filesIn(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => (entry.isDirectory() ? filesIn(join(directory, entry.name)) : [join(directory, entry.name)])),
  );
  return nested.flat();
}

/** Returns the flat file names it created, relative to `root`. */
export async function flattenSegmentFiles(root: string): Promise<string[]> {
  const created: string[] = [];
  const walk = async (directory: string): Promise<void> => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const path = join(directory, entry.name);
      if (!entry.name.startsWith(PREFIX)) {
        await walk(path);
        continue;
      }
      for (const file of await filesIn(path)) {
        const flatName = [entry.name, ...relative(path, file).split(/[\\/]/)].join(".");
        const target = join(directory, flatName);
        try {
          await copyFile(file, target, constants.COPYFILE_EXCL);
          created.push(relative(root, target));
        } catch (error) {
          // A flat file that already exists (as on Linux) is correct as it is.
          if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
        }
      }
    }
  };
  await walk(root);
  return created;
}
