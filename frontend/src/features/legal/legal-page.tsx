import { ArrowLeft, ArrowUp, PawPrint, ScrollText } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Eyebrow } from "@/components/ui/section-heading";
import { legalUi, type LegalBlock, type LegalDocument } from "@/content/legal-hu";
import { Footer } from "@/features/layout/footer";
import { Header } from "@/features/layout/header";

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") return <p>{block}</p>;
  return (
    <ul className="space-y-2 border-l-2 border-sand pl-5">
      {block.list.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function LegalPage({ document }: { document: LegalDocument }) {
  return (
    <>
      <div className="print:hidden">
        <Header />
      </div>
      <main id="tartalom">
        <header className="bg-band px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <Eyebrow lines>{legalUi.eyebrow}</Eyebrow>
            <h1 id="top" className="mt-3 flex items-start gap-3 font-display text-4xl leading-tight sm:text-5xl">
              {document.title}
              <PawPrint aria-hidden className="mt-2 size-6 shrink-0 text-taupe" />
            </h1>
            <p className="mt-5 max-w-2xl font-serif text-xl leading-snug">{document.intro}</p>
            <p className="mt-6 text-xs text-muted">
              {legalUi.effectiveFrom} {legalUi.effectiveDate}
            </p>
          </div>
        </header>

        <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[14rem_1fr] lg:gap-14 lg:py-16">
          <nav aria-labelledby="toc-title" className="lg:sticky lg:top-24 lg:self-start print:hidden">
            <h2 id="toc-title" className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-muted">
              <ScrollText aria-hidden className="size-4" />
              {legalUi.tocLabel}
            </h2>
            <ol className="mt-4 space-y-1 border-l border-line text-sm">
              {document.sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="-ml-px flex gap-2 border-l border-transparent py-1 pl-4 text-muted hover:border-accent hover:text-foreground"
                  >
                    <span className="tabular-nums text-taupe">{index + 1}.</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="max-w-prose space-y-12 text-sm leading-relaxed">
            {document.sections.map((section, index) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
                <h2 id={`${section.id}-title`} className="flex items-baseline gap-3 font-display text-2xl">
                  <span aria-hidden className="font-serif text-3xl text-taupe">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 rounded-2xl border border-line bg-card p-5 sm:p-6">
                  {section.blocks.map((block, blockIndex) => (
                    <Block key={blockIndex} block={block} />
                  ))}
                </div>
              </section>
            ))}

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8 print:hidden">
              <ButtonLink href="/" variant="outline" arrow={false} className="text-xs">
                <ArrowLeft aria-hidden className="size-4" />
                {legalUi.backHome}
              </ButtonLink>
              <a href="#top" className="inline-flex items-center gap-2 text-xs text-muted hover:text-foreground">
                <ArrowUp aria-hidden className="size-4" />
                {legalUi.backToTop}
              </a>
            </div>
          </article>
        </div>
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}
