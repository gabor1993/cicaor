// Pulls the editable content from WordPress into src/content/site-content.json and its images into public/cms/.
// Runs before every build (npm "prebuild"). Without CMS_URL it keeps the committed snapshot, so local builds work
// offline. With CMS_URL any error stops the build: Netlify then keeps the previous deploy live.

import { createHash } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { siteContentSchema } from "../src/content/site-content-schema.ts";
import { assertSameOrigin, collectImageUrls, replaceImageUrls } from "./cms-images.ts";

const MAX_IMAGE_WIDTH = 1920;
const TIMEOUT_MS = 30_000;
const contentFile = new URL("../src/content/site-content.json", import.meta.url);
const imageDir = new URL("../public/cms/", import.meta.url);

const cmsUrl = process.env.CMS_URL;
if (!cmsUrl) {
  console.log("CMS_URL is not set: using the committed content snapshot.");
  process.exit(0);
}

const base = new URL(cmsUrl.endsWith("/") ? cmsUrl : `${cmsUrl}/`);
// The query form of the REST route works with and without pretty permalinks.
const endpoint = new URL("?rest_route=/cicaor/v1/content", base);

async function download(url: string): Promise<Buffer> {
  const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) throw new Error(`${url} answered ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

const raw: unknown = JSON.parse((await download(endpoint.href)).toString("utf8"));

// Nothing is written until the whole content is valid, so a failed pull leaves the working copy as it was.
const paths = new Map<string, string>();
const files = new Map<string, Buffer>();
for (const url of collectImageUrls(raw)) {
  assertSameOrigin(url, base.origin);
  const image = await sharp(await download(url))
    .rotate()
    .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
  // Named after the content, so a replaced photo gets a new URL and is never served from a stale cache.
  const name = `${createHash("sha256").update(image).digest("hex").slice(0, 16)}.webp`;
  files.set(name, image);
  paths.set(url, `/cms/${name}`);
}

const result = siteContentSchema.safeParse(replaceImageUrls(raw, paths));
if (!result.success) {
  console.error("The CMS content is incomplete or invalid:");
  for (const issue of result.error.issues) console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  process.exit(1);
}

// public/cms only ever holds the images of the current content.
await rm(imageDir, { recursive: true, force: true });
await mkdir(imageDir, { recursive: true });
for (const [name, image] of files) await writeFile(new URL(name, imageDir), image);
await writeFile(contentFile, `${JSON.stringify(result.data, null, 2)}\n`);
console.log(`Pulled the CMS content and ${paths.size} images from ${base.origin}.`);
