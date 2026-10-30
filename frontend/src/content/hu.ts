import { siteContent } from "./site-content";
import type { packageIds } from "./site-content-schema";

// All user-facing copy is reached through `hu`, so components stay free of hardcoded text.
// Content editable in WordPress comes from site-content.json; this file only adds the fixed interface copy.
// Package rates: "base" is the 30-minute price and "step" is added for every further 30 minutes.
// A package without the 30-minute option keeps its 30-minute base as the starting point of the calculation.

export const durations = [30, 60, 90] as const;
export type Duration = (typeof durations)[number];

export type PackageId = (typeof packageIds)[number];

// Kept in code, not in the CMS: backend/src/validation.php mirrors these to reject durations a package does not offer.
const packageDurations: Record<PackageId, readonly Duration[]> = {
  komfort: [30, 60, 90],
  moka: [30, 60, 90],
  lux: [60, 90],
};

const { packages, addOns, gallery, faq } = siteContent;

export const hu = {
  ...siteContent,
  brand: { name: "CicaŐr", tagline: "Biztonságban a cicád" },
  skipToContent: "Ugrás a tartalomra",
  nav: {
    label: "Főmenü",
    footerLabel: "Lábléc menü",
    openMenu: "Menü megnyitása",
    closeMenu: "Menü bezárása",
    items: [
      { href: "/", label: "Kezdőlap" },
      { href: "/#rolam", label: "Rólam" },
      { href: "/#szolgaltatasok", label: "Szolgáltatások" },
      { href: "/#arak", label: "Árak" },
      { href: "/#gyik", label: "Gyakori kérdések" },
      { href: "/#kapcsolat", label: "Kapcsolat" },
    ],
    contactCta: "Kapcsolatfelvétel",
  },
  packages: {
    ...packages,
    items: packages.items.map((pkg) => ({ ...pkg, durations: packageDurations[pkg.id] })),
    durationLabel: "Látogatás hossza",
    minutes: "perc",
    perVisit: "/ látogatás",
    popular: "Népszerű",
    select: "Kiválasztom",
    bookable: "Foglalható időtartam:",
    features: "Mit tartalmaz?",
  },
  multiDay: {
    label: "3 napnál hosszabb távollétre:",
    perNight: "/ nap",
    visitsPerDay: "(1 látogatás/nap)",
  },
  addOns: {
    ...addOns,
    show: "Felárak megjelenítése",
    hide: "Felárak elrejtése",
  },
  gallery: {
    ...gallery,
    openImage: "Kép megnyitása nagyban",
    close: "Bezárás",
    previous: "Előző kép",
    next: "Következő kép",
  },
  faq: {
    ...faq,
    showAll: "Teljes kérdéssor",
    showLess: "Kevesebb kérdés",
  },
  contact: {
    eyebrow: "Kapcsolat",
    title: "Írj nekem",
    subtitle: "Töltsd ki az űrlapot, és hamarosan válaszolok.",
    fields: {
      name: "Név",
      email: "E-mail cím",
      phone: "Telefonszám (nem kötelező)",
      package: "Csomag",
      packageNone: "Még nem döntöttem el",
      duration: "Látogatás hossza",
      message: "Üzenet",
      consent: {
        before: "Elolvastam az",
        link: "adatkezelési tájékoztatót",
        newTab: "(új lapon nyílik meg)",
        after: ", és hozzájárulok, hogy a megadott adataimat a megkeresés megválaszolásához kezeljem.",
      },
    },
    submit: "Üzenet küldése",
    sending: "Küldés…",
    success: "Köszönöm az üzeneted, hamarosan jelentkezem!",
    genericError: "Az üzenetet most nem sikerült elküldeni. Kérlek, próbáld újra később.",
    rateLimited: "Túl sok kérés érkezett, kérlek, várj egy kicsit, és próbáld újra.",
    validation: {
      nameRequired: "Kérlek, add meg a neved.",
      emailInvalid: "Kérlek, érvényes e-mail címet adj meg.",
      messageRequired: "Kérlek, írj üzenetet.",
      messageTooLong: "Az üzenet legfeljebb 2000 karakter lehet.",
      consentRequired: "Az adatkezelés elfogadása szükséges.",
      durationUnavailable: "Ehhez a csomaghoz ez az időtartam nem foglalható.",
    },
  },
  footer: {
    rights: "Minden jog fenntartva.",
    legal: { label: "Jogi információk", privacy: "Adatkezelési tájékoztató", terms: "ÁSZF" },
    creditPrefix: "Developed by",
    creditName: "GABENIX",
    script: "Egy kis törődés, nagy nyugalom.",
    social: { facebook: "Facebook", email: "E-mail" },
  },
} as const;

export type Messages = typeof hu;
