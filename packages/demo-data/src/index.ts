import {
  Akce,
  Aktualita,
  AsistentUkazka,
  Budovy,
  HlaseniRozhlasu,
  HlaseniZavadSoubor,
  KrizoveHlaseni,
  Obec,
  Prostory,
  Sluzby,
  UredniDeska,
  ZivotniSituace,
  Zastupitel,
} from '@codekom/typy'
import { z } from 'zod'
import akceJson from '../../../obsah/javori-lhota/akce.json'
import aktualityJson from '../../../obsah/javori-lhota/aktuality.json'
import asistentJson from '../../../obsah/javori-lhota/asistent-ukazka.json'
import budovyJson from '../../../obsah/javori-lhota/budovy.json'
import hlaseniZavadJson from '../../../obsah/javori-lhota/hlaseni-zavad.json'
import krizeJson from '../../../obsah/javori-lhota/krizova-hlaseni.json'
import obecJson from '../../../obsah/javori-lhota/obec.json'
import prostoryJson from '../../../obsah/javori-lhota/prostory.json'
import rozhlasJson from '../../../obsah/javori-lhota/rozhlas.json'
import sluzbyJson from '../../../obsah/javori-lhota/sluzby.json'
import deskaJson from '../../../obsah/javori-lhota/uredni-deska.json'
import zastupiteleJson from '../../../obsah/javori-lhota/zastupitele.json'
import situaceJson from '../../../obsah/javori-lhota/zivotni-situace.json'

/** Chyba obsahu ukázkové obce: říká, který soubor a které pole neodpovídá schématu. */
export class ChybaObsahu extends Error {
  constructor(
    readonly soubor: string,
    readonly problemy: string[],
  ) {
    super(`Obsah ${soubor} neodpovídá schématu:\n${problemy.map((p) => `  - ${p}`).join('\n')}`)
    this.name = 'ChybaObsahu'
  }
}

/** Ověří data schématem. Při chybě vyhodí `ChybaObsahu` s cestou k poli. */
export function nacti<S extends z.ZodType>(soubor: string, schema: S, data: unknown): z.infer<S> {
  const r = schema.safeParse(data)
  if (r.success) return r.data
  const problemy = r.error.issues.map((i) => `${i.path.length ? i.path.join('.') : '(kořen)'}: ${i.message}`)
  throw new ChybaObsahu(soubor, problemy)
}

const OBSAH = 'obsah/javori-lhota/'

export const obec = nacti(`${OBSAH}obec.json`, Obec, obecJson)
export const aktuality = nacti(`${OBSAH}aktuality.json`, z.array(Aktualita), aktualityJson)
export const akce = nacti(`${OBSAH}akce.json`, z.array(Akce), akceJson)
export const uredniDeska = nacti(`${OBSAH}uredni-deska.json`, UredniDeska, deskaJson)
export const krizovaHlaseni = nacti(`${OBSAH}krizova-hlaseni.json`, z.array(KrizoveHlaseni), krizeJson)
export const rozhlas = nacti(`${OBSAH}rozhlas.json`, z.array(HlaseniRozhlasu), rozhlasJson)
export const zastupitele = nacti(`${OBSAH}zastupitele.json`, z.array(Zastupitel), zastupiteleJson)
export const zivotniSituace = nacti(`${OBSAH}zivotni-situace.json`, z.array(ZivotniSituace), situaceJson)
export const sluzby = nacti(`${OBSAH}sluzby.json`, Sluzby, sluzbyJson)
export const prostory = nacti(`${OBSAH}prostory.json`, Prostory, prostoryJson)
export const hlaseniZavad = nacti(`${OBSAH}hlaseni-zavad.json`, HlaseniZavadSoubor, hlaseniZavadJson)
export const budovy = nacti(`${OBSAH}budovy.json`, Budovy, budovyJson)
export const asistentUkazka = nacti(`${OBSAH}asistent-ukazka.json`, AsistentUkazka, asistentJson)

/** Referenční „dnešek“ ukázky: středa 4. 11. 2026 ve 12:00 v Praze. */
export const DEMO_DNES = '2026-11-04T11:00:00.000Z'

const PRAHA = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Prague',
  hourCycle: 'h23',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

/** Okamžik pro den a čas v Praze, například `2026-11-04` a `12:00`. */
export function prazskyOkamzik(den: string, cas = '12:00'): Date {
  for (const posun of [1, 2]) {
    const [h, m] = cas.split(':').map(Number)
    const d = new Date(`${den}T00:00:00.000Z`)
    d.setUTCHours((h ?? 0) - posun, m ?? 0)
    const casti = Object.fromEntries(PRAHA.formatToParts(d).map((p) => [p.type, p.value]))
    if (`${casti.year}-${casti.month}-${casti.day}` === den && `${casti.hour}:${casti.minute}` === cas) return d
  }
  throw new RangeError(`Neplatný den nebo čas: ${den} ${cas}`)
}

/**
 * Pevný okamžik ukázky, nikdy hodiny stroje: obsah dává smysl i za rok a testy jsou
 * deterministické. Přepíše ho `CODEKOM_DEMO_DNES` (ISO datum, nebo datum a čas).
 */
export function demoTed(): Date {
  const env = typeof process !== 'undefined' ? process.env.CODEKOM_DEMO_DNES?.trim() : undefined
  if (env) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(env)) return prazskyOkamzik(env)
    const d = new Date(env)
    if (!Number.isNaN(d.getTime())) return d
  }
  return new Date(DEMO_DNES)
}
