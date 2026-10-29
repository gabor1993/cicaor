"use client";

import { useState } from "react";
import { AnchorLink } from "@/components/ui/anchor-link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button-link";
import { hu } from "@/content/hu";
import { useActiveSection } from "./use-active-section";

const sectionIds = hu.nav.items.flatMap((item) => (item.href.includes("#") ? [item.href.split("#")[1]] : []));

// Every menu item points into the home page: section links are current while their section is
// on screen, and "Kezdőlap" while the reader is still above the first section.
function currentFor(href: string, pathname: string, activeSection: string): "page" | "location" | undefined {
  if (pathname !== "/") return undefined;
  const hash = href.split("#")[1];
  if (hash) return hash === activeSection ? "location" : undefined;
  return activeSection === "" ? "page" : undefined;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const activeSection = useActiveSection(sectionIds);
  const { nav } = hu;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2.5 sm:px-6">
        <Logo />

        <nav aria-label={nav.label} className="hidden lg:block">
          <ul className="flex items-center gap-4 xl:gap-7">
            {nav.items.map((item) => {
              const current = currentFor(item.href, pathname, activeSection);
              return (
                <li key={item.href}>
                  <AnchorLink
                    href={item.href}
                    aria-current={current}
                    className={`whitespace-nowrap border-b py-1 text-[0.72rem] transition hover:text-accent xl:text-[0.8rem] ${
                      current ? "border-foreground" : "border-transparent"
                    }`}
                  >
                    {item.label}
                  </AnchorLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Wrapper controls visibility: "hidden" on the link itself would clash with its inline-flex. */}
        <div className="hidden lg:block">
          <ButtonLink href="/#kapcsolat" className="whitespace-nowrap px-5 text-xs">
            {nav.contactCta}
          </ButtonLink>
        </div>

        <button
          type="button"
          className="rounded-full p-2 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? nav.closeMenu : nav.openMenu}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label={nav.label} className="border-t border-line bg-card px-4 py-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {nav.items.map((item) => (
              <li key={item.href}>
                <AnchorLink
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={currentFor(item.href, pathname, activeSection)}
                  className="block rounded-lg px-3 py-3 text-base aria-[current]:font-bold"
                >
                  {item.label}
                </AnchorLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
