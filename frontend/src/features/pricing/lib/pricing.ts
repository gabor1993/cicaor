import { durations, hu, type Duration, type PackageId } from "@/content/hu";

export type PackageSelection = { packageId: PackageId | ""; duration: Duration };

export const defaultSelection: PackageSelection = { packageId: "", duration: 60 };

/** Link from a pricing card to the contact form on the home page, carrying the chosen package. */
export function contactLinkFor(packageId: PackageId, duration: Duration): string {
  return `/?csomag=${packageId}&ido=${duration}#kapcsolat`;
}

/** Reads ?csomag=…&ido=… back. The URL is user-editable, so anything unknown falls back to the default. */
export function parseSelection(search: string): PackageSelection {
  const params = new URLSearchParams(search);
  const packageId = hu.packages.items.find((pkg) => pkg.id === params.get("csomag"))?.id ?? "";
  const duration = durations.find((value) => String(value) === params.get("ido")) ?? defaultSelection.duration;
  return { packageId, duration };
}

// hu-HU skips grouping for 4-digit numbers by default ("4000"); the design shows "4 000".
const priceFormatter = new Intl.NumberFormat("hu-HU", {
  maximumFractionDigits: 0,
  useGrouping: "always",
});

/** Formats an amount as "4 000 Ft" using a non-breaking space between thousands. */
export function formatPrice(amount: number): string {
  // Intl uses a narrow no-break space (U+202F) for hu-HU; normalise to a regular NBSP for consistent rendering.
  return `${priceFormatter.format(amount).replace(/ /g, " ")} Ft`;
}

export function getVisitPrice(prices: Record<Duration, number>, duration: Duration): number {
  return prices[duration];
}
