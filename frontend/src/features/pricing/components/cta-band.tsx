import { Heart } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { hu } from "@/content/hu";

export function CtaBand() {
  const { ctaBand } = hu;

  return (
    <section aria-labelledby="cta-title" className="bg-band-cta px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 rounded-3xl bg-card px-6 py-6 text-center shadow-sm md:flex-row md:text-left">
        <Heart aria-hidden className="hidden size-8 shrink-0 text-taupe md:block" strokeWidth={1.25} />
        <div className="flex-1">
          <h2 id="cta-title" className="font-serif text-2xl">
            {ctaBand.title}
          </h2>
          <p className="mt-1 text-sm text-muted">{ctaBand.body}</p>
        </div>
        <ButtonLink href="#kapcsolat">{ctaBand.cta}</ButtonLink>
      </div>
    </section>
  );
}
