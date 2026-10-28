import { SectionHeading } from "@/components/ui/section-heading";
import { hu } from "@/content/hu";

// Not in the design yet; styled to match the home page until real reviews and a design exist.
export function ReviewsSection() {
  const { reviews } = hu;
  return (
    <section id="velemenyek" aria-labelledby="reviews-title" className="px-4 py-10 sm:px-6">
      <SectionHeading id="reviews-title" eyebrow={reviews.eyebrow} title={reviews.title} />
      <ul className="mx-auto mt-6 grid max-w-6xl gap-4 md:grid-cols-3">
        {reviews.items.map((item, index) => (
          <li key={index}>
            <figure className="h-full border border-line bg-card p-6">
              <blockquote className="font-serif text-lg italic">{item.quote}</blockquote>
              <figcaption className="mt-3 text-xs text-muted">{item.author}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
