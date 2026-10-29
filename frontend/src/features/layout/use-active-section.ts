"use client";

import { useCallback, useSyncExternalStore } from "react";
import { pickActiveSection } from "@/lib/active-section";

// scroll-padding-top in globals.css is 80px; the extra 40px marks a section active once it
// sits just under the sticky header, which is also where anchor links land.
const activationLine = 120;

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

/** Returns the id of the section currently under the header, or "" above the first one. */
export function useActiveSection(ids: readonly string[]): string {
  const getSnapshot = useCallback(() => {
    const sections = ids.flatMap((id) => {
      const element = document.getElementById(id);
      return element ? [{ id, top: element.getBoundingClientRect().top }] : [];
    });
    const root = document.documentElement;
    const atBottom = Math.ceil(window.scrollY + window.innerHeight) >= root.scrollHeight - 2;
    return pickActiveSection(sections, activationLine, atBottom) ?? "";
  }, [ids]);

  return useSyncExternalStore(subscribe, getSnapshot, () => "");
}
