// Security headers for Netlify's _headers file. A static export cannot set headers itself (no next.config headers()).

/**
 * The static export inlines its own boot scripts and next/image adds inline styles, and a static site cannot
 * use per-request nonces, so scripts and styles need 'unsafe-inline'. The rest still blocks foreign scripts,
 * framing, plugins and form posts or fetches to any host other than the contact backend.
 */
export function contentSecurityPolicy(contactApiUrl: string | undefined): string {
  const contactOrigin = contactApiUrl?.startsWith("http") ? new URL(contactApiUrl).origin : "";
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self'${contactOrigin ? ` ${contactOrigin}` : ""}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export function headersFile({ contactApiUrl, demo }: { contactApiUrl: string | undefined; demo: boolean }): string {
  const headers = {
    // The demo form sends nothing, so it needs no backend origin.
    "Content-Security-Policy": contentSecurityPolicy(demo ? undefined : contactApiUrl),
    // Covers files a meta tag cannot, such as images and robots-visible text files.
    ...(demo ? { "X-Robots-Tag": "noindex, nofollow" } : {}),
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  };
  const lines = Object.entries(headers).map(([name, value]) => `  ${name}: ${value}`);
  // Hashed build assets never change, so browsers may keep them for a year.
  return ["/*", ...lines, "", "/_next/static/*", "  Cache-Control: public, max-age=31536000, immutable", ""].join("\n");
}
