/**
 * Returns the target element id when `href` points to a hash on the page that is
 * already open (same path, query and hash), otherwise null.
 */
export function samePageHashTarget(href: string, currentHref: string): string | null {
  const target = new URL(href, currentHref);
  const current = new URL(currentHref);

  if (!target.hash || target.href !== current.href) return null;
  return decodeURIComponent(target.hash.slice(1));
}
