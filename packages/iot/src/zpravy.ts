import { z } from 'zod'

/**
 * Zprávy mezi bránou a cloudem přes MQTT (QoS 1, JSON).
 * Témata mají prefix `codekom/v1/brany/<branaId>/`, viz prompty/04-iot-budovy.md v repozitáři codecom.
 */

export const PREFIX = 'codekom/v1/brany'
export const TEMATA = ['telemetrie', 'stav', 'udalost', 'prikaz', 'ack', 'plan', 'lwt'] as const
export type Tema = (typeof TEMATA)[number]

const BRANA_ID = /^[a-z0-9][a-z0-9-]{1,62}$/

export function tema(branaId: string, druh: Tema): string {
  if (!BRANA_ID.test(branaId)) throw new Error(`Neplatné id brány: ${branaId}`)
  return `${PREFIX}/${branaId}/${druh}`
}

/** Rozloží téma na id brány a druh. Vrátí null pro cizí téma. */
export function rozlozTema(t: string): { branaId: string; druh: Tema } | null {
  const casti = t.split('/')
  if (casti.length !== 5 || `${casti[0]}/${casti[1]}/${casti[2]}` !== PREFIX) return null
  const branaId = casti[3] ?? ''
  const druh = casti[4] as Tema
  if (!BRANA_ID.test(branaId) || !TEMATA.includes(druh)) return null
  return { branaId, druh }
}

export const METRIKY = [
  'teplota',
  'cilovaTeplota',
  'vlhkost',
  'co2',
  'polohaVentilu',
  'baterie',
  'signal',
  'energieKwh',
  'vykonW',
  'oknoOtevrene',
  'dverePolohy',
  'zaplaveni',
  'zamceno',
  'zapnuto',
  'napetiV',
  'proudA',
  'prutokM3',
  'objemM3',
] as const
export type Metrika = (typeof METRIKY)[number]

const iso = z.iso.datetime({ offset: true })

export const vzorekSchema = z.object({
  cas: iso,
  prvekId: z.string().min(1),
  metrika: z.enum(METRIKY),
  hodnota: z.number().finite(),
})
export type Vzorek = z.infer<typeof vzorekSchema>

export const telemetrieSchema = z.object({
  seq: z.number().int().nonnegative(),
  vzorky: z.array(vzorekSchema).min(1).max(1000),
})
export type Telemetrie = z.infer<typeof telemetrieSchema>

export const stavBranySchema = z.object({
  cas: iso,
  verze: z.string(),
  uptimeS: z.number().nonnegative(),
  delkaFronty: z.number().int().nonnegative(),
  pripojeni: z.record(z.string(), z.enum(['pripojeno', 'odpojeno', 'chyba'])),
  planVerze: z.number().int().nonnegative().nullable(),
})
export type StavBrany = z.infer<typeof stavBranySchema>

export const UDALOSTI = ['oknoZmena', 'dvereZmena', 'rucniZasah', 'pravidloMraz', 'pravidloMrazKonec', 'otevreniZamku', 'frontaPretekla', 'pripojeniZmena'] as const
export const udalostSchema = z.object({
  cas: iso,
  druh: z.enum(UDALOSTI),
  prvekId: z.string().optional(),
  data: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).default({}),
})
export type Udalost = z.infer<typeof udalostSchema>

export const TYPY_PRIKAZU = ['nastavTeplotu', 'nastavRezim', 'otevriDvere', 'zamkniDvere', 'vytvorKod', 'zrusKod', 'zapni', 'vypni'] as const
export const prikazSchema = z.object({
  id: z.string().min(1),
  typ: z.enum(TYPY_PRIKAZU),
  prvekId: z.string().min(1),
  parametry: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).default({}),
  platnoDo: iso,
  idempotencyKey: z.string().min(8),
})
export type Prikaz = z.infer<typeof prikazSchema>

export const ackSchema = z.object({
  prikazId: z.string().min(1),
  stav: z.enum(['provedeno', 'selhalo']),
  duvod: z.string().optional(),
  potvrzenoZeZarizeni: z.boolean(),
})
export type Ack = z.infer<typeof ackSchema>

/** Potvrzení dávky telemetrie z cloudu (brána smaže z fronty vše do `seq`). */
export const telemetrieAckSchema = z.object({ seq: z.number().int().nonnegative() })

export const intervalSchema = z.object({
  od: iso,
  do: iso,
  rezim: z.enum(['komfort', 'utlum', 'mraz']),
  mistnosti: z.array(z.string()),
  zdroj: z.enum(['urednihodiny', 'rezervace', 'rucni', 'sablona']),
})

export const planSchema = z.object({
  verze: z.number().int().nonnegative(),
  intervaly: z.array(intervalSchema),
  teploty: z.object({ komfort: z.number(), utlum: z.number(), mraz: z.number() }),
})
export type Plan = z.infer<typeof planSchema>
