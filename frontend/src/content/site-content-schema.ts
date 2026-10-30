import { z } from "zod";

// The contract between the WordPress endpoint (cms/cicaor-content) and the site. Everything the CMS sends
// is validated against this at build time, so a bad edit fails the build instead of breaking the page.
// Only relative imports here: scripts/pull-cms-content.mts loads this file directly with Node.

const text = z.string().trim().min(1);
// Images are always served from this site, never hotlinked from the CMS.
const imagePath = z.string().regex(/^\/[\w\-./]+\.(webp|jpe?g|png)$/);
const rate = z.object({ base: z.number().int().positive(), step: z.number().int().nonnegative() });
const titleLines = z.tuple([text, text]);
const question = z.object({ q: text, a: text });

export const packageIds = ["komfort", "moka", "lux"] as const;

export const siteContentSchema = z.object({
  siteDescription: text,
  homeHero: z.object({
    eyebrow: text,
    title: text,
    subtitle: text,
    body: text,
    cta: text,
    script: text,
    image: imagePath,
    imageAlt: text,
  }),
  features: z
    .array(z.object({ icon: z.enum(["heart", "shield", "paw", "house"]), title: text, body: text }))
    .min(1),
  packages: z.object({
    eyebrow: text,
    title: text,
    subtitle: text,
    items: z
      .array(
        z.object({
          id: z.enum(packageIds),
          label: text,
          name: text,
          tagline: text,
          visitRate: rate,
          multiDayRate: rate,
          features: z.array(text).min(1),
          popular: z.boolean(),
          image: imagePath,
          imageAlt: text,
        }),
      )
      // The ids are wired into the contact form and the PHP validation, so the CMS can edit packages but not add or drop them.
      .refine((items) => items.length === packageIds.length && packageIds.every((id) => items.some((pkg) => pkg.id === id)), {
        message: "Every package (komfort, moka, lux) must appear exactly once.",
      }),
  }),
  addOns: z.object({
    eyebrow: text,
    title: text,
    subtitle: text,
    items: z
      .array(
        z.object({
          id: text,
          icon: z.enum(["cat", "calendar", "map-pin", "zap", "repeat", "key"]),
          name: text,
          price: text,
          unit: text,
          note: text,
        }),
      )
      .min(1),
  }),
  about: z.object({
    eyebrow: text,
    titleLines,
    body: text,
    points: z.array(text).min(1),
    script: text,
    quote: text,
    image: imagePath.nullable(),
    imageAlt: text,
    quoteImage: imagePath,
    quoteImageAlt: text,
  }),
  services: z.object({
    eyebrow: text,
    title: text,
    subtitle: text,
    items: z
      .array(
        z.object({
          icon: z.enum(["house", "cats", "calendar"]),
          title: text,
          body: text,
          image: imagePath,
          imageAlt: text,
        }),
      )
      .min(1),
  }),
  gallery: z.object({
    eyebrow: text,
    titleLines,
    body: text,
    cta: text,
    image: imagePath.nullable(),
    imageAlt: text,
    items: z.array(z.object({ caption: text, image: imagePath.nullable() })).min(1),
  }),
  reviews: z.object({
    eyebrow: text,
    title: text,
    items: z.array(z.object({ quote: text, author: text })).min(1),
  }),
  faq: z.object({
    eyebrow: text,
    title: text,
    body: text,
    image: imagePath,
    imageAlt: text,
    items: z.array(question).min(1),
    // Shown after "Teljes kérdéssor" is pressed.
    moreItems: z.array(question),
  }),
  closing: z.object({ title: text, body: text, cta: text }),
});

export type SiteContent = z.infer<typeof siteContentSchema>;
