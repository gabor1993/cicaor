// Image handling for scripts/pull-cms-content.mts. The CMS sends absolute image URLs; the site serves its own copies.

const isImageKey = (key: string) => key === "image" || key.endsWith("Image");

/** Every image URL in the CMS response (values of "image" or "...Image" keys). */
export function collectImageUrls(value: unknown): string[] {
  const urls = new Set<string>();
  const walk = (node: unknown) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (node === null || typeof node !== "object") return;
    for (const [key, child] of Object.entries(node)) {
      if (isImageKey(key) && typeof child === "string") urls.add(child);
      else walk(child);
    }
  };
  walk(value);
  return [...urls];
}

/** A copy of the response with each image URL swapped for its local path. */
export function replaceImageUrls(value: unknown, paths: ReadonlyMap<string, string>): unknown {
  if (Array.isArray(value)) return value.map((item) => replaceImageUrls(item, paths));
  if (value === null || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [
      key,
      isImageKey(key) && typeof child === "string" ? (paths.get(child) ?? child) : replaceImageUrls(child, paths),
    ]),
  );
}

/** Images may only come from the CMS itself, so a tampered response cannot make the build fetch other hosts. */
export function assertSameOrigin(url: string, cmsOrigin: string): void {
  if (new URL(url).origin !== cmsOrigin) {
    throw new Error(`Image is not hosted on the CMS (${cmsOrigin}): ${url}`);
  }
}
