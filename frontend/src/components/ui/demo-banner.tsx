import { Info } from "lucide-react";
import { hu } from "@/content/hu";
import { isDemo } from "@/lib/site-mode";

// Tells visitors the business is not open yet, so nobody mistakes the demo for a bookable service.
export function DemoBanner() {
  if (!isDemo) return null;
  return (
    <p className="flex items-center justify-center gap-2 bg-footer px-4 py-2 text-center text-xs text-on-footer print:hidden">
      <Info aria-hidden className="size-4 shrink-0" />
      {hu.demo.banner}
    </p>
  );
}
