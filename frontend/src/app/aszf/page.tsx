import type { Metadata } from "next";
import { hu } from "@/content/hu";
import { terms } from "@/content/legal-hu";
import { LegalPage } from "@/features/legal/legal-page";

export const metadata: Metadata = {
  title: `${terms.title} – ${hu.brand.name}`,
  description: terms.description,
  alternates: { canonical: "/aszf/" },
};

export default function TermsPage() {
  return <LegalPage document={terms} />;
}
