import Link from "next/link";
import { PawPrint } from "lucide-react";
import { hu } from "@/content/hu";

// lucide-react v1 dropped brand icons, so these two are drawn inline.
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </svg>
  );
}

// TODO: replace the placeholder social links with the real profiles.
const social = [
  { label: hu.footer.social.facebook, href: "#", Icon: FacebookIcon },
  { label: hu.footer.social.instagram, href: "#", Icon: InstagramIcon },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-line bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label={hu.nav.footerLabel}>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 xl:gap-x-7">
            {hu.nav.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="whitespace-nowrap text-[0.6rem] uppercase tracking-[0.12em] text-muted hover:text-foreground xl:text-[0.65rem]"
                >
                  {item.label}
                </Link>
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
    </footer>
  );
}
