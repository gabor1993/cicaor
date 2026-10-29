// Legal texts live apart from hu.ts because they are long and change on their own schedule.
// Every "[TODO: …]" must be filled in, and both documents reviewed by a lawyer, before going live.

export type LegalBlock = string | { list: readonly string[] };

export type LegalSection = {
  id: string;
  title: string;
  blocks: readonly LegalBlock[];
};

export type LegalDocument = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: readonly LegalSection[];
};

export const legalUi = {
  eyebrow: "Jogi információk",
  effectiveFrom: "Hatályos:",
  effectiveDate: "[TODO: hatálybalépés dátuma]",
  tocLabel: "Tartalom",
  backToTop: "Vissza a tetejére",
  backHome: "Vissza a főoldalra",
} as const;

const operator = {
  name: "[TODO: név vagy cégnév]",
  address: "[TODO: székhely / levelezési cím]",
  taxNumber: "[TODO: adószám]",
  registration: "[TODO: nyilvántartási szám (egyéni vállalkozó) vagy cégjegyzékszám]",
  email: "[TODO: e-mail cím]",
  phone: "[TODO: telefonszám]",
} as const;

const operatorList = [
  `Név: ${operator.name}`,
  `Cím: ${operator.address}`,
  `Adószám: ${operator.taxNumber}`,
  `Nyilvántartási szám: ${operator.registration}`,
  `E-mail: ${operator.email}`,
  `Telefon: ${operator.phone}`,
] as const;

export const privacyPolicy: LegalDocument = {
  slug: "adatkezelesi-tajekoztato",
  title: "Adatkezelési tájékoztató",
  description: "Hogyan kezeli a CicaŐr a weboldalon és a kapcsolatfelvétel során megadott személyes adatokat.",
  intro:
    "Fontos számomra, hogy a rám bízott adatokkal ugyanolyan gondosan bánjak, mint a rám bízott cicákkal. Ez a tájékoztató az Európai Unió általános adatvédelmi rendelete (GDPR) és az információs önrendelkezési jogról szóló 2011. évi CXII. törvény alapján bemutatja, milyen adatokat, milyen célból és meddig kezelek.",
  sections: [
    {
      id: "adatkezelo",
      title: "Az adatkezelő",
      blocks: [{ list: operatorList }],
    },
    {
      id: "kapcsolatfelvetel",
      title: "Kapcsolatfelvétel és ajánlatkérés",
      blocks: [
        "Ha a kapcsolati űrlapon, e-mailben vagy telefonon megkeresel, az alábbi adatokat kezelem:",
        {
          list: [
            "Kezelt adatok: név, e-mail cím, telefonszám (nem kötelező), a választott csomag és időtartam, valamint az üzenet tartalma.",
            "Cél: a megkeresés megválaszolása, ajánlat adása és a látogatások egyeztetése.",
            "Jogalap: a hozzájárulásod, amelyet az űrlap elküldése előtt a jelölőnégyzettel adsz meg (GDPR 6. cikk (1) bekezdés a) pont). Ha megrendeled a szolgáltatást, az ehhez szükséges adatokat a szerződés teljesítése érdekében kezelem (GDPR 6. cikk (1) bekezdés b) pont).",
            "Időtartam: ha nem jön létre megrendelés, a megkeresés lezárásától számított [TODO: pl. 1 év] elteltével törlöm az adatokat. Megrendelés esetén a szerződés megszűnésétől számított 5 évig (a polgári jogi elévülési idő) őrzöm meg őket.",
          ],
        },
        "A hozzájárulásodat bármikor visszavonhatod egy e-mailben, ez nem érinti a visszavonás előtti adatkezelés jogszerűségét.",
      ],
    },
    {
      id: "szolgaltatas",
      title: "A szolgáltatás teljesítése",
      blocks: [
        "A cicaszitter szolgáltatás nyújtásához a megrendelés során további adatokra is szükségem lehet:",
        {
          list: [
            "Kezelt adatok: a látogatás helyszínének címe, a kulcsátadás módja, a cica neve, szokásai, egészségi állapotára és etetésére vonatkozó információk, az állatorvos elérhetősége, valamint egy vészhelyzeti kapcsolattartó neve és telefonszáma.",
            "Jogalap: a szerződés teljesítése (GDPR 6. cikk (1) bekezdés b) pont). A vészhelyzeti kapcsolattartó adatait az ő tájékoztatása mellett, a megrendelő jogos érdeke alapján kezelem (GDPR 6. cikk (1) bekezdés f) pont).",
            "Időtartam: a szerződés megszűnésétől számított 5 év. A számlázáshoz szükséges adatokat a számviteli törvény szerint 8 évig őrzöm meg.",
          ],
        },
        "A látogatások alatt készült fotókat és üzeneteket kizárólag neked küldöm el. Közzétételükre csak külön, írásos hozzájárulásod alapján kerülhet sor.",
      ],
    },
    {
      id: "weboldal",
      title: "A weboldal használata",
      blocks: [
        {
          list: [
            "Visszaélés elleni védelem: a kapcsolati űrlap túlterhelés és kéretlen üzenetek elleni védelme érdekében az IP-címed egyirányú, visszafejthetetlen kivonatát (SHA-256 hash) legfeljebb egy óráig használom a beküldések számának korlátozására. Jogalap: jogos érdek (GDPR 6. cikk (1) bekezdés f) pont).",
            "Szervernaplók: a tárhelyszolgáltató a működés biztosítása érdekében technikai naplót vezet (például IP-cím, időpont, megnyitott oldal). Megőrzési idő: [TODO: a tárhelyszolgáltató szerinti időtartam].",
            "Betűtípusok: a weboldal betűtípusait saját szerverről töltöm be, így az oldal megnyitásakor nem jut adat külső betűtípus-szolgáltatóhoz.",
          ],
        },
      ],
    },
    {
      id: "sutik",
      title: "Sütik és látogatottságmérés",
      blocks: [
        "A weboldal jelenleg nem használ sem látogatottságmérő, sem marketing célú sütiket.",
        "A jövőben a Google Analytics szolgáltatással mérhetem az oldal látogatottságát (szolgáltató: Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Írország). Erre kizárólag akkor kerül sor, ha a megjelenő süti tájékoztatóban kifejezetten hozzájárulsz (GDPR 6. cikk (1) bekezdés a) pont). A mérés álnevesített adatokkal dolgozik (például eszköz típusa, megnyitott oldalak, látogatás időtartama), az adatokat [TODO: 2 vagy 14 hónap] után törli a rendszer. A hozzájárulásodat a süti beállításoknál bármikor visszavonhatod.",
        "[TODO: a süti tájékoztató bevezetésekor ezt a részt a ténylegesen használt sütik listájával kell kiegészíteni.]",
      ],
    },
    {
      id: "adatfeldolgozok",
      title: "Adatfeldolgozók és adattovábbítás",
      blocks: [
        "Személyes adataidat nem adom el és nem adom át harmadik félnek marketing célra. Az alábbi szolgáltatók a működéshez szükséges mértékben, a megbízásom alapján férhetnek hozzá:",
        {
          list: [
            "Tárhelyszolgáltató: [TODO: név, cím, weboldal]",
            "E-mail szolgáltató: [TODO: név, cím, weboldal]",
            "Könyvelő / számlázó program: [TODO: ha van]",
          ],
        },
      ],
    },
    {
      id: "jogok",
      title: "Az érintett jogai",
      blocks: [
        "Az adataiddal kapcsolatban az alábbi jogok illetnek meg:",
        {
          list: [
            "Hozzáférés: tájékoztatást kérhetsz arról, milyen adataidat kezelem.",
            "Helyesbítés: kérheted a pontatlan adatok javítását.",
            "Törlés: kérheted az adataid törlését, ha azokra már nincs szükség, vagy visszavontad a hozzájárulásodat.",
            "Korlátozás: kérheted, hogy az adataidat átmenetileg csak tároljam, de ne használjam.",
            "Adathordozhatóság: kérheted, hogy a megadott adataidat géppel olvasható formában kiadjam.",
            "Tiltakozás: tiltakozhatsz a jogos érdeken alapuló adatkezelés ellen.",
          ],
        },
        `Kérésedet a ${operator.email} címre küldheted. Legkésőbb egy hónapon belül válaszolok.`,
      ],
    },
    {
      id: "jogorvoslat",
      title: "Jogorvoslat",
      blocks: [
        "Ha úgy érzed, hogy megsértettem az adatvédelmi jogaidat, kérlek, először keress meg, hogy közösen rendezzük. Panaszt tehetsz a felügyeleti hatóságnál is:",
        {
          list: [
            "Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH)",
            "Cím: 1055 Budapest, Falk Miksa utca 9–11.",
            "Postacím: 1363 Budapest, Pf. 9.",
            "Telefon: +36 1 391 1400",
            "E-mail: ugyfelszolgalat@naih.hu",
            "Weboldal: www.naih.hu",
          ],
        },
        "Jogaid megsértése esetén bírósághoz is fordulhatsz. A per – választásod szerint – a lakóhelyed vagy tartózkodási helyed szerinti törvényszék előtt is megindítható.",
      ],
    },
    {
      id: "modositas",
      title: "A tájékoztató módosítása",
      blocks: [
        "A tájékoztatót a jogszabályok vagy a működés változása esetén frissítem. A mindenkor hatályos változat ezen az oldalon érhető el.",
      ],
    },
  ],
};

export const terms: LegalDocument = {
  slug: "aszf",
  title: "Általános Szerződési Feltételek",
  description: "A CicaŐr cicaszitter szolgáltatás igénybevételének feltételei: foglalás, árak, lemondás és felelősség.",
  intro:
    "Az Általános Szerződési Feltételek (ÁSZF) a CicaŐr cicaszitter szolgáltatás igénybevételének szabályait tartalmazzák. A foglalás megerősítésével a megrendelő elfogadja ezeket a feltételeket.",
  sections: [
    {
      id: "szolgaltato",
      title: "A szolgáltató adatai",
      blocks: [{ list: operatorList }],
    },
    {
      id: "szolgaltatas",
      title: "A szolgáltatás tartalma",
      blocks: [
        "A szolgáltatás a megrendelő otthonában, a megrendelő távollétében végzett cicagondozás. A látogatások tartalma a választott csomagtól függ, és jellemzően magában foglalja az etetést, a friss víz biztosítását, az alom tisztítását, a játékot és a törődést, valamint fotós beszámolót a megrendelő részére.",
        "A csomagok, a látogatások időtartama és a kiegészítő szolgáltatások leírása a weboldal Árak szekciójában található. Az egyedi igényeket a foglaláskor egyeztetjük.",
        "Szolgáltatási terület: [TODO: település(ek), kerületek].",
      ],
    },
    {
      id: "foglalas",
      title: "Foglalás és ismerkedő találkozó",
      blocks: [
        {
          list: [
            "A foglalás a weboldal kapcsolati űrlapján, e-mailben vagy telefonon kezdeményezhető. Az ajánlatkérés még nem jelent szerződéskötést.",
            "Az első látogatás előtt ingyenes ismerkedő találkozót tartunk, ahol megismerem a cicát, átbeszéljük a teendőket, és átveszem a kulcsot.",
            "A szerződés akkor jön létre, amikor a foglalást e-mailben vagy írásban visszaigazolom. [TODO: írásos megállapodás vagy visszaigazoló e-mail]",
          ],
        },
      ],
    },
    {
      id: "arak",
      title: "Árak és fizetés",
      blocks: [
        {
          list: [
            "A szolgáltatás díja a weboldalon közzétett, illetve az egyedi ajánlatban szereplő ár. A weboldalon feltüntetett árak tájékoztató jellegűek, a végleges díjat a foglaláskor rögzítjük.",
            "Az árak [TODO: alanyi adómentesség esetén: \"az ÁFA-t nem tartalmazzák, alanyi adómentesség miatt\" / egyébként: \"bruttó árak\"].",
            "Fizetési mód: [TODO: készpénz, banki átutalás].",
            "Fizetési határidő: [TODO: pl. az első látogatáskor / előre / a szolgáltatás végén].",
            "[TODO: előleg, ha van: összege és visszatérítése lemondás esetén].",
          ],
        },
      ],
    },
    {
      id: "lemondas",
      title: "Lemondás és módosítás",
      blocks: [
        {
          list: [
            "A foglalást a megrendelő az első látogatás előtt [TODO: pl. 48 órával] díjmentesen lemondhatja vagy módosíthatja.",
            "Ennél későbbi lemondás esetén [TODO: lemondási díj mértéke, pl. az első látogatás díja].",
            "Ha a szolgáltató betegség vagy elháríthatatlan ok miatt nem tudja teljesíteni a látogatást, erről haladéktalanul értesíti a megrendelőt, és – egyeztetés szerint – megbízható helyettesről gondoskodik, vagy a ki nem fizetett látogatás díját nem számítja fel, illetve visszatéríti.",
          ],
        },
        "[TODO: jogásszal egyeztetendő] Távollévők között (e-mailben, telefonon) kötött szerződés esetén a fogyasztót a 45/2014. (II. 26.) Korm. rendelet szerint elállási jog illetheti meg. Ha a megrendelő kifejezett kérésére a szolgáltatás az elállási határidő lejárta előtt megkezdődik, a már teljesített szolgáltatás arányos díját meg kell fizetni.",
      ],
    },
    {
      id: "kulcs",
      title: "A kulcs kezelése",
      blocks: [
        {
          list: [
            "A kulcsot az ismerkedő találkozón veszem át, és a szolgáltatás végén a megbeszélt módon adom vissza.",
            "A kulcson és a tárolásánál nem tüntetem fel a megrendelő nevét vagy címét, és harmadik személynek nem adom át.",
            "A kulcs elvesztése esetén a megrendelőt haladéktalanul értesítem, és viselem a zárcsere igazolt költségét.",
          ],
        },
      ],
    },
    {
      id: "felelosseg",
      title: "Felelősség és egészségügyi helyzetek",
      blocks: [
        {
          list: [
            "A megrendelő köteles a foglaláskor tájékoztatni a cica egészségi állapotáról, gyógyszereiről, szokásairól, valamint az állatorvos elérhetőségéről, és biztosítani az eledelt, az almot és a szükséges felszerelést.",
            "Ha a látogatás során a cica rosszul van vagy megsérül, haladéktalanul értesítem a megrendelőt, és szükség esetén állatorvoshoz viszem. Az állatorvosi ellátás költsége a megrendelőt terheli.",
            "Nem felelek azokért a károkért, amelyek a megrendelő által elhallgatott információkból, a cica előzetesen fennálló betegségéből vagy a lakás állapotából erednek.",
            "[TODO: felelősségbiztosítás, ha van.]",
          ],
        },
      ],
    },
    {
      id: "panasz",
      title: "Panaszkezelés",
      blocks: [
        `Panaszaidat a ${operator.email} címen vagy a ${operator.phone} telefonszámon jelezheted. Az írásban beérkezett panaszra 30 napon belül írásban válaszolok.`,
        "Ha a panasz rendezése nem sikerül, fogyasztóként a lakóhelyed szerint illetékes békéltető testülethez fordulhatsz, vagy bírósági eljárást kezdeményezhetsz.",
        "Békéltető testület: [TODO: a szolgáltató székhelye szerint illetékes megyei / fővárosi békéltető testület neve és elérhetősége].",
      ],
    },
    {
      id: "zaro",
      title: "Záró rendelkezések",
      blocks: [
        "Az ÁSZF-ben nem szabályozott kérdésekben a Polgári Törvénykönyvről szóló 2013. évi V. törvény rendelkezései az irányadók.",
        "A szolgáltató jogosult az ÁSZF-et módosítani. A módosítás a már visszaigazolt foglalásokat nem érinti.",
      ],
    },
  ],
};
