// Runs after `next build` (npm "postbuild") and writes Netlify's _headers into the export.

import { writeFile } from "node:fs/promises";
import { siteMode } from "../src/lib/site-mode.ts";
import { headersFile } from "./security-headers.ts";

const demo = siteMode({ NEXT_PUBLIC_SITE_MODE: process.env.NEXT_PUBLIC_SITE_MODE }) === "demo";
await writeFile(
  new URL("../out/_headers", import.meta.url),
  headersFile({ contactApiUrl: process.env.NEXT_PUBLIC_CONTACT_API_URL, demo }),
);
console.log(`Wrote out/_headers (${demo ? "demo" : "live"}).`);
