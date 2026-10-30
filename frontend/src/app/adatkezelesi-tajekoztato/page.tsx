import type { Metadata } from "next";
import { hu } from "@/content/hu";
import { privacyPolicy } from "@/content/legal-hu";
import { LegalPage } from "@/features/legal/legal-page";

export const metadata: Metadata = {
  title: `${privacyPolicy.title} – ${hu.brand.name}`,
  description: privacyPolicy.description,
  alternates: { canonical: "/adatkezelesi-tajekoztato/" },
};

export default function PrivacyPolicyPage() {
  return <LegalPage document={privacyPolicy} />;
}
