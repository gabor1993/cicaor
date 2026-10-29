"use client";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import Link from "next/link";
import { samePageHashTarget } from "@/lib/same-page-hash";

type AnchorLinkProps = ComponentPropsWithoutRef<typeof Link>;

// Next.js scrolls to a hash only as part of a navigation, and linking to the URL that is
// already open is not one, so a repeated click on e.g. "#kapcsolat" would do nothing.
export function AnchorLink({ href, onClick, ...props }: AnchorLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    const isPlainClick = event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    if (event.defaultPrevented || !isPlainClick || typeof href !== "string") return;

    const id = samePageHashTarget(href, window.location.href);
    const target = id && document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    // Wait a frame so layout changes from onClick (e.g. closing the mobile menu) land first.
    requestAnimationFrame(() => target.scrollIntoView());
  }

  return <Link href={href} onClick={handleClick} {...props} />;
}
