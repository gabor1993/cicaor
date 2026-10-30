// Runs after `next build` (npm "postbuild"): writes Netlify's _headers and repairs the prefetch files of a
// Windows build (see segment-files.ts).

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { siteMode } from "../src/lib/site-mode.ts";
import { headersFile } from "./security-headers.ts";
import { flattenSegmentFiles } from "./segment-files.ts";

const outDir = new URL("../out/", import.meta.url);

const demo = siteMode({ NEXT_PUBLIC_SITE_MODE: process.env.NEXT_PUBLIC_SITE_MODE }) === "demo";
await writeFile(
  new URL("_headers", outDir),
  headersFile({ contactApiUrl: process.env.NEXT_PUBLIC_CONTACT_API_URL, demo }),
);
console.log(`Wrote out/_headers (${demo ? "demo" : "live"}).`);

const flattened = await flattenSegmentFiles(fileURLToPath(outDir));
if (flattened.length > 0) console.log(`Added ${flattened.length} prefetch files missing from the Windows export.`);
