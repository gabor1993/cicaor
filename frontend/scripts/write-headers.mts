// Runs after `next build` (npm "postbuild") and writes Netlify's _headers into the export.

import { writeFile } from "node:fs/promises";
import { headersFile } from "./security-headers.ts";

await writeFile(new URL("../out/_headers", import.meta.url), headersFile(process.env.NEXT_PUBLIC_CONTACT_API_URL));
console.log("Wrote out/_headers.");
