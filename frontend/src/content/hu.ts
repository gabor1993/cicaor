// All user-facing copy lives here so components stay free of hardcoded text.
// Prices marked TODO are placeholders until the real 30/90 minute prices are known.

export const durations = [30, 60, 90] as const;
export type Duration = (typeof durations)[number];

export type PackageId = "komfort" | "moka" | "lux";

export const hu = {
  brand: { name: "CicaŐr", tagline: "Biztonságban a cicád" },
  siteDescription:
    "CicaŐr – megbízható, szeretetteljes cicaszitter szolgáltatás. A cicád a saját otthonában maradhat, amíg te távol vagy.",
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
  homeHero: {
    eyebrow: "Cicaszitter szolgáltatás",
    title: "CicaŐr",
    subtitle: "Mert minden cica különleges.",
    body: "Megbízható, szeretetteljes gondoskodás a te cicádnak, amíg te távol vagy.",
    cta: "Szolgáltatások megtekintése",
    script: "Boldog cicák, nyugodt gazdik.",
    imageAlt: "Fekete-fehér cica pihen egy puha takarón",
  },
  features: [
    {
      icon: "heart",
      title: "Személyre szabott gondoskodás",
      body: "Minden cica egyedi, minden igény számít.",
    },
    { icon: "shield", title: "Megbízhatóság", body: "Pontosság, felelősség, nyugalom." },
    { icon: "paw", title: "Tapasztalat", body: "Évek óta macskák között, valódi szeretettel." },
    { icon: "house", title: "Otthonos környezet", body: "A cicád a saját otthonában maradhat." },
  ],
  packages: {
    eyebrow: "Árak és csomagok",
    title: "Válaszd ki a számodra ideális gondoskodást!",
    subtitle:
      "Minden csomagunk tartalmazza az alapvető gondoskodást, a szeretetteljes törődést és a rendszeres beszámolót a gazdi számára.",
    durationLabel: "Látogatás hossza",
    minutes: "perc",
    perVisit: "/ látogatás",
    popular: "Népszerű",
    select: "Kiválasztom",
    recommended: "Javasolt időtartam: 30 / 60 / 90 perc",
    items: [
      {
        id: "komfort",
        label: "Alapcsomag",
        name: "CicaKomfort",
        tagline: "Az alapvető szükségletek biztonságban.",
        prices: { 30: 3000, 60: 4000, 90: 5500 }, // TODO: confirm 30/90 min prices
        perNight: 4500,
        features: [
          "Etetés, friss víz",
          "Alomtisztítás",
          "Simogatás, törődés",
          "Rövid beszámoló fotóval",
        ],
        popular: false,
        imageAlt: "Cirmos cica pihen egy kényelmes takarón",
      },
      {
        id: "moka",
        label: "Komplett csomag",
        name: "CicaMóka",
        tagline: "Több idő, több figyelem, több közös játék.",
        prices: { 30: 4300, 60: 5500, 90: 7000 }, // TODO: confirm 30/90 min prices
        perNight: 6200,
        features: [
          "Minden, ami a CicaKomfort csomagban van",
          "Hosszabb játék és foglalkozás",
          "Fotók vagy videók a cicáról",
          "Részletesebb napi beszámoló",
        ],
        popular: true,
        imageAlt: "Vörös cica tollas játékkal játszik",
      },
      {
        id: "lux",
        label: "Prémium csomag",
        name: "CicaLux",
        tagline: "Több társaság, több nyugalom.",
        prices: { 30: 6000, 60: 7500, 90: 9500 }, // TODO: confirm 30/90 min prices
        perNight: 8500,
        features: [
          "Minden, ami a CicaMóka csomagban van",
          "Hosszabb látogatás, több játék",
          "Növénylocsolás, levél- és csomagátvétel (megbeszélés szerint)",
          "Részletesebb beszámoló és több fénykép",
        ],
        popular: false,
        imageAlt: "Szürke cica az ablak előtt nyugszik",
      },
    ],
  },
  multiDay: {
    title: "Többnapos csomagok",
    body: "Hosszabb távollét esetén a többnapos csomagokkal még kedvezőbb áron gondoskodunk cicádról.",
    script: "Kedvezőbb áron hosszabb távolléthez",
    tag: "(többnapos)",
    perNight: "/ nap",
    visitsPerDay: "(1 látogatás/nap)",
    cta: "Részletek a többnapos csomagokról",
  },
  addOns: {
    eyebrow: "Felárak",
    title: "Kiegészítő szolgáltatások",
    subtitle: "Az alábbi felárak a csomagárakon felül értendőek.",
    items: [
      {
        id: "extra-cat",
        icon: "cat",
        name: "További cica",
        price: "+1 000 Ft",
        unit: "/ látogatás",
        note: "Minden további cica külön felárral vehető igénybe.",
      },
      {
        id: "weekend",
        icon: "calendar",
        name: "Hétvége és ünnepnap",
        price: "+1 500 Ft",
        unit: "/ látogatás",
        note: "Szombat, vasárnap és ünnepnapokon.",
      },
      {
        id: "travel",
        icon: "map-pin",
        name: "Kiszállás / távolság",
        price: "+500 – 1 500 Ft",
        unit: "/ látogatás",
        note: "Az alap területen kívüli címek esetén.",
      },
      {
        id: "longer",
        icon: "clock",
        name: "Hosszabb látogatás",
        price: "+1 000 Ft",
        unit: "/ 15 perc",
        note: "A csomagidőn túli, minden megkezdett 15 perc.",
      },
      {
        id: "urgent",
        icon: "zap",
        name: "Sürgős foglalás",
        price: "+1 000 Ft",
        unit: "/ látogatás",
        note: "24 órán belüli foglalás esetén.",
      },
    ],
  },
  ctaBand: {
    title: "Kérdésed van az árakkal kapcsolatban?",
    body: "Írj nekünk bátran, szívesen segítünk a számodra legjobb csomag kiválasztásában!",
    cta: "Kapcsolatfelvétel",
  },
  about: {
    eyebrow: "Rólam",
    titleLines: ["Szívvel-lélekkel", "a cicákért"],
    body: "Gyerekkorom óta rajongok a cicákért, így számomra ez nem csak egy szolgáltatás, hanem hivatás. Fontos számomra, hogy minden cica biztonságban, szeretetben és a saját környezetében érezze magát, amíg te távol vagy.",
    points: [
      "Felelősségteljesen és pontosan dolgozom",
      "Rendszeres fotókkal és üzenetekkel tartom a kapcsolatot",
      "Minden cicához egyéni figyelmet és gondoskodást biztosítok",
    ],
    cta: "Tudj meg többet rólam",
    script: "A cicák mosolyt csalnak az életbe.",
    quote: "„Nem csak egy állat, hanem egy családtag.”",
    imageAlt: "Mosolygó cicaszitter átöleli a cirmos cicát",
    quoteImageAlt: "Fekete-fehér cica arca közelről, meleg fényben",
  },
  services: {
    eyebrow: "Szolgáltatások",
    title: "Miben tudok segíteni?",
    subtitle: "Rövid vagy hosszabb távollét esetén is számíthatsz rám.",
    items: [
      {
        icon: "house",
        title: "Napi látogatás",
        body: "Etetés, friss víz, alom takarítás, játék, simogatás, fotók.",
        imageAlt: "Fekete-fehér cica sétál a nyitott ajtó mellett",
      },
      {
        icon: "cats",
        title: "Több cica esetén",
        body: "Több cica, több törődés. Egyedi igények szerint.",
        imageAlt: "Két fekete-fehér cica orrot érint az ablak előtt",
      },
      {
        icon: "calendar",
        title: "Hosszabb távollét",
        body: "Egyéni egyeztetés alapján, rugalmas csomagokkal.",
        imageAlt: "Fekete-fehér cica pihen egy kötött takarón",
      },
    ],
  },
  gallery: {
    eyebrow: "Galéria",
    titleLines: ["Egy kis betekintés", "a mindennapokba"],
    body: "Képek a cicákról, akikről már gondoskodtam.",
    cta: "Megnézem a galériát",
    imageAlt: "Cirmos cica pihen a takarón",
    openImage: "Kép megnyitása nagyban",
    close: "Bezárás",
    previous: "Előző kép",
    next: "Következő kép",
    items: [
      "Cica a kanapén",
      "Cica az ablakban",
      "Cica a teraszajtónál",
      "Két cica pihen",
      "Játék közben",
      "Szundikáló cica",
      "Reggeli simogatás",
      "Új barátok",
    ],
  },
  reviews: {
    eyebrow: "Vélemények",
    title: "Mit mondanak a gazdik?",
    items: [
      { quote: "TODO: Valódi vélemény érkezik ide.", author: "Gazdi neve" },
      { quote: "TODO: Valódi vélemény érkezik ide.", author: "Gazdi neve" },
      { quote: "TODO: Valódi vélemény érkezik ide.", author: "Gazdi neve" },
    ],
  },
  faq: {
    eyebrow: "Gyakori kérdések",
    title: "Minden, amit tudni szeretnél",
    body: "Összegyűjtöttük a leggyakrabban felmerülő kérdéseket, hogy könnyebben dönthess, és nyugodt szívvel bízd rám a cicádat.",
    showAll: "Teljes kérdéssor",
    showLess: "Kevesebb kérdés",
    imageAlt: "Fekete-fehér cica fekszik egy kötött takarón",
    items: [
      {
        q: "Meddig előre érdemes foglalni?",
        a: "Érdemes legalább 1–2 héttel előre jelezni, iskolai szünetek és ünnepek idején még korábban. Ha sürgős, írj bátran: ha van szabad időpontom, megoldjuk.",
      },
      {
        q: "Mi történik, ha a cicám beteg vagy különleges ellátást igényel?",
        a: "Szívesen adok gyógyszert vagy követek speciális étrendet a megbeszéltek szerint. Előre egyeztetjük a teendőket és az állatorvos elérhetőségét, hogy szükség esetén azonnal intézkedni tudjak.",
      },
      {
        q: "Hogyan zajlik a kapcsolat a látogatások alatt?",
        a: "Minden látogatás után fotót és rövid üzenetet küldök arról, hogy van a cicád. Ha bármi szokatlant tapasztalok, azonnal jelzem.",
      },
      {
        q: "Milyen felszerelést biztosítok?",
        a: "Az eledelt, az almot és a megszokott játékokat te biztosítod, hogy a cicád semmiben ne lássa a változást. A takarításhoz szükséges eszközöket én hozom.",
      },
      {
        q: "Hány cicára tudok vigyázni egyszerre?",
        a: "Egy háztartásban legfeljebb 3 cicáról gondoskodom egy látogatás alatt. Ennél több cica esetén kérj egyedi ajánlatot.",
      },
    ],
    // Shown after "Teljes kérdéssor" is pressed.
    moreItems: [
      {
        q: "Hogyan történik a kulcsátadás?",
        a: "A kulcsot az ismerkedő találkozón veszem át, és a megbeszélt módon adom vissza. A kulcson nem szerepel a címed, és senkinek nem adom tovább.",
      },
      {
        q: "Van lehetőség ismerkedő találkozóra az első látogatás előtt?",
        a: "Igen, az első látogatás előtt ingyenesen ellátogatok hozzátok, hogy megismerjem a cicádat, és átbeszéljük a teendőket.",
      },
    ],
  },
  closing: {
    title: "Készen állsz a következő nyaralásra?",
    body: "Vedd fel velem a kapcsolatot, és beszéljük meg a részleteket!",
    cta: "Kapcsolatfelvétel",
  },
  contact: {
    eyebrow: "Kapcsolat",
    title: "Írj nekünk",
    subtitle: "Töltsd ki az űrlapot, és hamarosan válaszolunk.",
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
        after: ", és hozzájárulok, hogy a megadott adataimat a megkeresés megválaszolásához kezeljék.",
      },
    },
    submit: "Üzenet küldése",
    sending: "Küldés…",
    success: "Köszönjük az üzeneted, hamarosan jelentkezünk!",
    genericError: "Az üzenetet most nem sikerült elküldeni. Kérjük, próbáld újra később.",
    rateLimited: "Túl sok kérés érkezett, kérjük, várj egy kicsit, és próbáld újra.",
    validation: {
      nameRequired: "Kérjük, add meg a neved.",
      emailInvalid: "Kérjük, érvényes e-mail címet adj meg.",
      messageRequired: "Kérjük, írj üzenetet.",
      messageTooLong: "Az üzenet legfeljebb 2000 karakter lehet.",
      consentRequired: "Az adatkezelés elfogadása szükséges.",
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
