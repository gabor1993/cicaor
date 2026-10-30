import type { Metadata } from "next";
import { hu } from "@/content/hu";
import { demoNotice, privacyPolicy } from "@/content/legal-hu";
import { LegalPage } from "@/features/legal/legal-page";
import { isDemo } from "@/lib/site-mode";

const document = isDemo ? demoNotice : privacyPolicy;

export const metadata: Metadata = {
  title: `${document.title} – ${hu.brand.name}`,
  description: document.description,
  alternates: { canonical: "/adatkezelesi-tajekoztato/" },
};

export default function PrivacyPolicyPage() {
  return <LegalPage document={document} />;
}
