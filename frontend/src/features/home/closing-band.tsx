import { Heart } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Logo } from "@/components/ui/logo";
import { hu } from "@/content/hu";

export function ClosingBand() {
  const { closing } = hu;

  return (
    <section aria-labelledby="closing-title" className="bg-footer text-on-footer">
      <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 py-6 sm:px-6 md:grid-cols-[auto_1fr_auto_auto] md:gap-16">
        <Logo inverted />
        <div>
          <h2 id="closing-title" className="font-serif text-2xl">
            {closing.title}
          </h2>
          <p className="mt-1 text-xs opacity-80">{closing.body}</p>
        </div>
        <ButtonLink href="#kapcsolat" variant="outlineLight">
          {closing.cta}
        </ButtonLink>
        <Heart aria-hidden className="hidden size-7 md:block" strokeWidth={1.25} />
      </div>
    </section>
  );
}
