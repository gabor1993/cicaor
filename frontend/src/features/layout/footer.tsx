import { AnchorLink } from "@/components/ui/anchor-link";
import { PawPrint } from "lucide-react";
import { hu } from "@/content/hu";

const developerUrl = "https://gabenix.hu";

// lucide-react v1 dropped brand icons, so this one is drawn inline.
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3z" />
    </svg>
  );
}

// TODO: replace the placeholder social link with the real profile.
const social = [{ label: hu.footer.social.facebook, href: "#", Icon: FacebookIcon }] as const;

export function Footer() {
  return (
    <footer className="border-t border-line bg-background print:hidden">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label={hu.nav.footerLabel}>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 xl:gap-x-7">
            {hu.nav.items.map((item) => (
              <li key={item.href}>
                <AnchorLink
                  href={item.href}
                  className="whitespace-nowrap text-[0.6rem] uppercase tracking-[0.12em] text-muted hover:text-foreground xl:text-[0.65rem]"
                >
                  {item.label}
                </AnchorLink>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="flex gap-5">
          {social.map(({ label, href, Icon }) => (
            <li key={label}>
              <a href={href} aria-label={label} className="text-foreground hover:text-accent">
                <Icon className="size-4" />
              </a>
            </li>
          ))}
        </ul>
        <p className="flex items-center gap-3 whitespace-nowrap text-[0.7rem] text-muted">
          © {new Date().getFullYear()} {hu.brand.name}. {hu.footer.rights}
          <PawPrint aria-hidden className="size-3.5 text-foreground" />
        </p>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-3 text-[0.65rem] text-muted sm:flex-row sm:justify-between sm:px-6">
          <nav aria-label={hu.footer.legal.label}>
            <ul className="flex gap-4">
              <li>
                <AnchorLink href="/adatkezelesi-tajekoztato/" className="hover:text-foreground hover:underline">
                  {hu.footer.legal.privacy}
                </AnchorLink>
              </li>
              <li>
                <AnchorLink href="/aszf/" className="hover:text-foreground hover:underline">
                  {hu.footer.legal.terms}
                </AnchorLink>
              </li>
            </ul>
          </nav>
          <p>
            {hu.footer.creditPrefix}{" "}
            <a href={developerUrl} className="font-bold underline-offset-2 hover:text-foreground hover:underline">
              {hu.footer.creditName}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
