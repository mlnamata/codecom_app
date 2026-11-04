import { z } from 'zod'

/** Kalendářní den `YYYY-MM-DD` (Europe/Prague). */
export const Den = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Očekávám den ve tvaru RRRR-MM-DD')
/** Okamžik v ISO 8601 (UTC). */
export const Okamzik = z.string().refine((v) => v.includes('T') && !Number.isNaN(Date.parse(v)), 'Očekávám okamžik ISO 8601')
/** Čas dne `HH:MM`. */
export const CasDne = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Očekávám čas HH:MM')
const Text = z.string().min(1)

export const UROVNE_EDITORU = ['zaklad', 'pokrocily', 'advance'] as const
export const MODULY = ['web', 'aplikace', 'urad', 'iot', 'ai'] as const
export const ROLE = ['superadmin', 'spravce', 'redaktor'] as const
export type Role = (typeof ROLE)[number]

export const CastObce = z.object({ nazev: Text, slug: Text, obyvatel: z.number().int().nonnegative() })
export const UredniHodiny = z.object({ den: z.number().int().min(1).max(7), od: CasDne, do: CasDne })
export const Kontakt = z.object({
  id: Text,
  jmeno: z.string().nullable(),
  funkce: Text,
  agenda: Text,
  kancelar: z.string().nullable(),
  kdy: Text,
  email: Text,
  telefon: Text,
})

export const Obec = z.object({
  nazev: Text,
  slug: Text,
  vLokale: Text,
  okres: Text,
  kraj: Text,
  orp: Text,
  obyvatel: z.number().int().positive(),
  adresa: z.object({ ulice: Text, psc: Text, obec: Text }),
  ico: Text,
  dic: Text,
  datovaSchranka: Text,
  cisloUctu: Text,
  email: Text,
  telefon: Text,
  uredniHodiny: z.array(UredniHodiny),
  uredniHodinyText: Text,
  castiObce: z.array(CastObce).min(1),
  kontakty: z.array(Kontakt),
  poverenec: z.object({ jmeno: Text, email: Text, telefon: Text }),
  znakUrl: z.string().nullable(),
  sablona: Text,
  paleta: z.number().int().min(0).max(2),
  urovenEditoru: z.enum(UROVNE_EDITORU),
  moduly: z.array(z.enum(MODULY)),
  popis: Text,
  spravceWebu: z.object({ jmeno: Text, funkce: Text, aktualizovano: Den }),
  ukazka: z.boolean(),
})
export type Obec = z.infer<typeof Obec>

export const ObecVerejna = z.object({
  slug: Text,
  nazev: Text,
  okres: Text,
  znakUrl: z.string(),
  castiObce: z.array(z.object({ nazev: Text, slug: Text })),
})
export type ObecVerejna = z.infer<typeof ObecVerejna>

export const RUBRIKY = ['zpravy', 'oznameni', 'kultura', 'zpravodaj'] as const
export const Aktualita = z.object({
  id: Text,
  slug: Text,
  titulek: Text,
  perex: Text,
  obsah: z.array(Text),
  rubrika: z.enum(RUBRIKY),
  autor: Text,
  publikovano: Okamzik,
  obrazek: z.object({ url: Text, alt: Text }).nullable(),
  dokumentyDesky: z.array(Text),
})
export type Aktualita = z.infer<typeof Aktualita>

export const Akce = z.object({
  id: Text,
  slug: Text,
  nazev: Text,
  den: Den,
  od: CasDne.nullable(),
  do: CasDne.nullable(),
  misto: Text,
  poradatel: Text,
  kategorie: z.enum(['obec', 'spolky', 'kultura']),
  popis: Text,
  casti: z.array(Text),
})
export type Akce = z.infer<typeof Akce>

export const KategorieDesky = z.object({ id: Text, nazev: Text, slug: Text, poradi: z.number().int() })
export type KategorieDesky = z.infer<typeof KategorieDesky>

export const VerzeDokumentu = z.object({
  cislo: z.number().int().positive(),
  cas: Okamzik,
  zmena: z.enum(['vyveseno', 'zmeneno']),
  popis: z.string(),
})
export type VerzeDokumentu = z.infer<typeof VerzeDokumentu>

export const SouborDokumentu = z.object({
  nazev: Text,
  url: Text,
  typ: Text,
  velikost: z.number().int().nonnegative().nullable(),
})

export const DokumentDesky = z.object({
  id: Text,
  nazev: Text,
  kategorie: Text,
  cisloJednaci: Text,
  puvodce: Text,
  vyvesenoOd: Den,
  vyvesenoDo: Den.nullable(),
  skrytPoSejmuti: z.boolean(),
  anotace: Text,
  text: z.array(Text).min(1),
  soubor: SouborDokumentu,
  verze: z.array(VerzeDokumentu).optional(),
})
export type DokumentDesky = z.infer<typeof DokumentDesky>

export const UredniDeska = z.object({ kategorie: z.array(KategorieDesky), dokumenty: z.array(DokumentDesky) })

export const UROVNE_KRIZE = ['info', 'warning', 'emergency'] as const
export const KrizoveHlaseni = z.object({
  id: Text,
  uroven: z.enum(UROVNE_KRIZE),
  titulek: Text,
  text: Text,
  odkazText: z.string().nullable(),
  odkazUrl: z.string().nullable(),
  casti: z.array(Text),
  platiOd: Okamzik,
  platiDo: Okamzik.nullable(),
  updatedAt: Okamzik,
})
export type KrizoveHlaseni = z.infer<typeof KrizoveHlaseni>

export const HlaseniRozhlasu = z.object({
  id: Text,
  cas: Okamzik,
  titulek: Text,
  text: Text,
  casti: z.array(Text),
  audioUrl: z.string().nullable(),
})
export type HlaseniRozhlasu = z.infer<typeof HlaseniRozhlasu>

export const Zastupitel = z.object({
  id: Text,
  titulPred: z.string().nullable(),
  jmeno: Text,
  titulZa: z.string().nullable(),
  funkce: z.enum(['starosta', 'mistostarosta', 'radni', 'zastupitel']),
  funkceText: Text,
  vybory: z.string().nullable(),
  zvolenZa: z.string().nullable(),
  email: z.string().nullable(),
  telefon: z.string().nullable(),
  uredniHodiny: z.string().nullable(),
  foto: z.string().nullable(),
  obdobi: Text,
  poradi: z.number().int(),
  aktivni: z.boolean(),
})
export type Zastupitel = z.infer<typeof Zastupitel>

export const ZPUSOBY = ['online', 'urad', 'samo'] as const
export const ZivotniSituace = z.object({
  id: Text,
  slug: Text,
  nazev: Text,
  kratkyNazev: Text,
  kdoPoradi: Text,
  kroky: z.array(
    z.object({
      poradi: z.number().int(),
      nazev: Text,
      zpusob: z.enum(ZPUSOBY),
      text: Text,
      sluzba: z.string().nullable(),
    }),
  ),
  uradCesta: Text,
})
export type ZivotniSituace = z.infer<typeof ZivotniSituace>

export const Sluzba = z.object({
  id: Text,
  slug: Text,
  nazev: Text,
  popis: Text,
  zpusob: z.enum(['online', 'urad']),
  odkaz: z.string().nullable(),
  uradCesta: Text,
  klicovaSlova: z.array(Text),
})
export type Sluzba = z.infer<typeof Sluzba>

export const Poplatek = z.object({
  id: Text,
  nazev: Text,
  castka: z.number().positive(),
  mena: z.literal('CZK'),
  jednotka: Text,
  splatnost: z.string().regex(/^\d{2}-\d{2}$/),
  splatnostText: Text,
  kdoPlati: Text,
  ulevy: z.string().nullable(),
  poradiVs: z.number().int().min(0).max(99),
  zpusobyPlatby: z.array(z.enum(['qr', 'prevod', 'hotove'])),
  uradCesta: Text,
  vyhlaska: z.string().optional(),
})
export type Poplatek = z.infer<typeof Poplatek>

export const Sluzby = z.object({ sluzby: z.array(Sluzba), poplatky: z.array(Poplatek) })

export const Prostor = z.object({
  id: Text,
  slug: Text,
  nazev: Text,
  adresa: Text,
  budova: Text,
  kapacita: z.number().int().positive(),
  cenaZaBlok: z.number().nonnegative(),
  kauce: z.number().nonnegative(),
  mena: z.literal('CZK'),
  bloky: z.array(z.object({ id: Text, od: CasDne, do: CasDne })),
  popis: Text,
  uradCesta: Text,
})
export type Prostor = z.infer<typeof Prostor>

export const STAVY_REZERVACE = ['ceka', 'schvaleno', 'zamitnuto'] as const
export const Rezervace = z.object({
  id: Text,
  prostor: Text,
  den: Den,
  od: CasDne,
  do: CasDne,
  ucel: Text,
  zadatel: z.object({ jmeno: Text, kontakt: Text }),
  stav: z.enum(STAVY_REZERVACE),
  vytvoreno: Okamzik,
})
export type Rezervace = z.infer<typeof Rezervace>

export const Prostory = z.object({ prostory: z.array(Prostor), rezervace: z.array(Rezervace) })

export const STAVY_ZAVADY = ['nove', 'prijato', 'v_reseni', 'vyrizeno', 'zamitnuto'] as const
export type StavZavady = (typeof STAVY_ZAVADY)[number]
export const KontaktZavady = z.object({
  jmeno: z.string().nullable(),
  email: z.string().nullable(),
  telefon: z.string().nullable(),
})
export const HlaseniZavad = z.object({
  id: Text,
  cislo: z.string().regex(/^HZ-\d{4}-\d{4}$/),
  sledovaciKod: z.string().regex(/^[2-9A-HJKMNP-Z]{8}$/),
  stav: z.enum(STAVY_ZAVADY),
  verejnaOdpoved: z.string().nullable(),
  kategorie: Text,
  popis: Text,
  misto: Text,
  poloha: z.object({ lat: z.number(), lng: z.number() }).nullable(),
  kontakt: KontaktZavady.nullable(),
  pocetFotek: z.number().int().nonnegative(),
  vytvoreno: Okamzik,
  zmeneno: Okamzik,
})
export type HlaseniZavad = z.infer<typeof HlaseniZavad>

export const HlaseniZavadSoubor = z.object({
  kategorie: z.array(z.object({ id: Text, nazev: Text })),
  stavy: z.array(z.object({ id: z.enum(STAVY_ZAVADY), nazev: Text })),
  hlaseni: z.array(HlaseniZavad),
})

export const Mistnost = z.object({
  id: Text,
  nazev: Text,
  teplota: z.number(),
  cilovaTeplota: z.number(),
  cilText: Text,
  okno: z.enum(['zavreno', 'otevreno']),
  poznamka: z.string().optional(),
})
export const Budova = z.object({
  id: Text,
  nazev: Text,
  adresa: Text,
  stav: z.enum(['ok', 'varovani', 'alarm']),
  souhrn: Text,
  rezimTopeni: z.enum(['auto', 'komfort', 'utlum']),
  brana: z.object({ online: z.boolean(), posledniZprava: Okamzik }),
  kdoMaKlic: Text,
  mistnosti: z.array(Mistnost),
  plan: z.array(z.object({ nazev: Text, od: Text, do: Text })),
  dvere: z.array(
    z.object({
      id: Text,
      nazev: Text,
      stav: z.enum(['zamceno', 'odemceno']),
      posledniVstup: z.object({ cas: Okamzik, kdo: Text, zpusob: z.enum(['PIN', 'karta']) }),
    }),
  ),
  upozorneni: z.array(
    z.object({ id: Text, uroven: z.enum(['alarm', 'varovani']), text: Text, od: Text, prevzal: z.string().nullable() }),
  ),
  energie: z.array(z.object({ den: Den, kWh: z.number().nonnegative() })),
})
export type Budova = z.infer<typeof Budova>
export const PrvekBudovy = z.object({
  id: Text,
  budova: Text,
  mistnost: z.string().nullable(),
  typ: z.enum(['brana', 'hlavice', 'zamek', 'elektromer']),
  nazev: Text,
  baterie: z.number().min(0).max(100).nullable(),
  stav: Text,
})
export type PrvekBudovy = z.infer<typeof PrvekBudovy>
export const Budovy = z.object({ stavKDni: Okamzik, budovy: z.array(Budova), prvky: z.array(PrvekBudovy) })

export const AsistentUkazka = z.object({
  upozorneni: Text,
  otazky: z.array(
    z.object({ id: Text, otazka: Text, odpoved: Text, zdroje: z.array(z.object({ dokument: Text, nazev: Text })) }),
  ),
})
export type AsistentUkazka = z.infer<typeof AsistentUkazka>

/* Odpovědi a vstupy endpointů. Stejná schémata používá server i testy. */

export const KrizeVerejna = KrizoveHlaseni.extend({ urovenNazev: Text, castiNazvy: z.array(Text) })
export type KrizeVerejna = z.infer<typeof KrizeVerejna>
export const KrizeAktivniOdpoved = z.object({ hlavni: KrizeVerejna.nullable(), dalsich: z.number().int().nonnegative() })
export type KrizeAktivniOdpoved = z.infer<typeof KrizeAktivniOdpoved>

export const ObceSeznamOdpoved = z.object({ obce: z.array(ObecVerejna) })
export type ObceSeznamOdpoved = z.infer<typeof ObceSeznamOdpoved>

export const PrehledOdpoved = z.object({
  obec: ObecVerejna,
  krize: KrizeAktivniOdpoved,
  aktuality: z.array(z.object({ id: Text, slug: Text, titulek: Text, perex: Text, publikovano: Okamzik, url: Text })),
  deska: z.array(
    z.object({ id: Text, nazev: Text, kategorie: Text, vyvesenoOd: Den, vyvesenoDo: Den.nullable(), url: Text }),
  ),
  rozhlas: z.array(HlaseniRozhlasu),
})
export type PrehledOdpoved = z.infer<typeof PrehledOdpoved>

const volitelnyText = (max: number) => z.string().trim().max(max).optional()

export const NovaZavadaVstup = z.object({
  obec: z.string().trim().min(1, 'Chybí obec').max(64),
  kategorie: z.string().trim().min(1, 'Vyberte, čeho se závada týká').max(32),
  popis: z
    .string()
    .trim()
    .min(10, 'Popište závadu aspoň deseti znaky')
    .max(2000, 'Popis je delší než 2 000 znaků'),
  misto: z.string().trim().min(3, 'Napište, kde závada je').max(200, 'Místo je delší než 200 znaků'),
  poloha: z
    .object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) })
    .nullable()
    .optional(),
  kontakt: z
    .object({
      jmeno: volitelnyText(100),
      email: z
        .union([z.literal(''), z.string().trim().email('Zadejte e-mail ve tvaru jmeno@domena.cz')])
        .optional(),
      telefon: z
        .union([z.literal(''), z.string().trim().regex(/^\+?[0-9 ]{9,16}$/, 'Zadejte telefon, například 777 123 456')])
        .optional(),
    })
    .nullable()
    .optional(),
  pocetFotek: z.number().int().min(0).max(3).optional(),
})
export type NovaZavadaVstup = z.infer<typeof NovaZavadaVstup>

export const ZavadaOdpoved = z.object({ id: Text, cislo: Text, sledovaciKod: Text, stav: z.enum(STAVY_ZAVADY) })
export type ZavadaOdpoved = z.infer<typeof ZavadaOdpoved>

export const StavZavadyOdpoved = z.object({
  cislo: Text,
  stav: z.enum(STAVY_ZAVADY),
  stavNazev: Text,
  verejnaOdpoved: z.string().nullable(),
  kategorie: Text,
  misto: Text,
  vytvoreno: Okamzik,
  zmeneno: Okamzik,
})
export type StavZavadyOdpoved = z.infer<typeof StavZavadyOdpoved>

export const ZmenaZavadyVstup = z.object({
  stav: z.enum(STAVY_ZAVADY),
  verejnaOdpoved: z.string().trim().max(1000).nullable().optional(),
})
export type ZmenaZavadyVstup = z.infer<typeof ZmenaZavadyVstup>

export const NovaKrizeVstup = z.object({
  obec: Text,
  uroven: z.enum(UROVNE_KRIZE),
  titulek: z.string().trim().min(3, 'Titulek musí mít aspoň 3 znaky').max(120, 'Titulek je delší než 120 znaků'),
  text: z.string().trim().min(10, 'Text musí mít aspoň 10 znaků').max(600, 'Text je delší než 600 znaků'),
  odkazText: z.string().trim().max(60).nullable().optional(),
  odkazUrl: z.string().trim().max(300).nullable().optional(),
  casti: z.array(Text).optional(),
  platiOd: Okamzik.optional(),
  platiDo: Okamzik.nullable().optional(),
})
export type NovaKrizeVstup = z.infer<typeof NovaKrizeVstup>

export const ChybaOdpoved = z.object({ chyba: Text, pole: z.record(z.string(), z.array(z.string())).optional() })
export type ChybaOdpoved = z.infer<typeof ChybaOdpoved>
