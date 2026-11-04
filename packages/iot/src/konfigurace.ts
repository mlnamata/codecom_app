import { z } from 'zod'
import { METRIKY } from './zpravy'

/**
 * Konfigurace brány: seznam připojení (každé jedním protokolem) a body, které z něj čteme.
 * Bod = jedna metrika jednoho prvku. Hesla a tokeny se zadávají odkazem na proměnnou prostředí
 * (`env:NAZEV`), nikdy přímo v souboru.
 */

const metrika = z.enum(METRIKY)
const tajemstvi = z.string().regex(/^env:[A-Z0-9_]+$/, 'Tajné hodnoty zadávejte jako env:NAZEV_PROMENNE')

/** Přepočet surové hodnoty: hodnota * nasobek + posun. */
const prevod = { nasobek: z.number().default(1), posun: z.number().default(0) }

const bodZaklad = {
  id: z.string().min(1),
  prvekId: z.string().min(1),
  metrika,
  /** Smí brána do bodu zapisovat (topit, spínat)? */
  zapis: z.boolean().default(false),
  ...prevod,
}

export const haBodSchema = z.object({ ...bodZaklad, entita: z.string().regex(/^[a-z_]+\.[a-z0-9_]+$/), atribut: z.string().optional() })

export const haPripojeniSchema = z.object({
  id: z.string().min(1),
  protokol: z.literal('homeassistant'),
  /** Uvnitř doplňku HA: ws://supervisor/core/websocket */
  url: z.string().url(),
  token: tajemstvi,
  body: z.array(haBodSchema),
})

export const PREDVOLBY_MQTT = ['obecna', 'zigbee2mqtt', 'zwave-js-ui', 'tasmota', 'esphome', 'shelly', 'homie', 'chirpstack', 'ttn', 'wmbusmeters'] as const

export const mqttBodSchema = z.object({
  ...bodZaklad,
  /** Pro předvolby: krátké jméno zařízení, ze kterého se odvodí téma (viz apps/brana/src/adaptery/mqtt-predvolby.ts). */
  zarizeni: z.string().optional(),
  /** Vlastnost v JSON zprávě nebo část tématu podle předvolby. */
  vlastnost: z.string().optional(),
  /** Pro předvolbu `obecna`: přesné téma a cesta v JSON (tečková notace, prázdná = celá zpráva). */
  tema: z.string().optional(),
  cesta: z.string().optional(),
  zapisTema: z.string().optional(),
})

export const mqttPripojeniSchema = z.object({
  id: z.string().min(1),
  protokol: z.literal('mqtt'),
  url: z.string().regex(/^mqtts?:\/\//),
  uzivatel: z.string().optional(),
  heslo: tajemstvi.optional(),
  predvolba: z.enum(PREDVOLBY_MQTT).default('obecna'),
  /** Kořen témat předvolby (např. `zigbee2mqtt`, `zwave`, id aplikace ChirpStack). */
  koren: z.string().optional(),
  body: z.array(mqttBodSchema),
})

export const FORMATY_MODBUS = ['int16', 'uint16', 'int32', 'uint32', 'float32', 'bool'] as const

export const modbusBodSchema = z.object({
  ...bodZaklad,
  tabulka: z.enum(['holding', 'input', 'coil', 'discrete']),
  adresa: z.number().int().min(0).max(65535),
  format: z.enum(FORMATY_MODBUS).default('uint16'),
  /** Pořadí 16bitových slov u 32bitových hodnot: be = vyšší slovo první. */
  poradiSlov: z.enum(['be', 'le']).default('be'),
})

export const modbusPripojeniSchema = z.object({
  id: z.string().min(1),
  protokol: z.literal('modbus-tcp'),
  host: z.string().min(1),
  port: z.number().int().default(502),
  jednotka: z.number().int().min(0).max(255).default(1),
  intervalMs: z.number().int().min(500).default(10_000),
  timeoutMs: z.number().int().min(100).default(3_000),
  body: z.array(modbusBodSchema),
})

export const shellyBodSchema = z.object({
  ...bodZaklad,
  /** Komponenta ze Shelly.GetStatus, např. `switch:0`, `em:0`, `temperature:0`. */
  komponenta: z.string().regex(/^[a-z_]+:\d+$/),
  /** Pole komponenty, např. `apower`, `output`, `tC`. */
  pole: z.string().min(1),
})

export const shellyPripojeniSchema = z.object({
  id: z.string().min(1),
  protokol: z.literal('shelly-rpc'),
  host: z.string().min(1),
  intervalMs: z.number().int().min(500).default(10_000),
  body: z.array(shellyBodSchema),
})

export const httpBodSchema = z.object({ ...bodZaklad, cesta: z.string().min(1) })

export const httpPripojeniSchema = z.object({
  id: z.string().min(1),
  protokol: z.literal('http-json'),
  url: z.string().url(),
  intervalMs: z.number().int().min(1000).default(30_000),
  hlavicky: z.record(z.string(), z.string()).default({}),
  body: z.array(httpBodSchema),
})

export const pripojeniSchema = z.discriminatedUnion('protokol', [haPripojeniSchema, mqttPripojeniSchema, modbusPripojeniSchema, shellyPripojeniSchema, httpPripojeniSchema])
export type Pripojeni = z.infer<typeof pripojeniSchema>
export type PripojeniDle<P extends Pripojeni['protokol']> = Extract<Pripojeni, { protokol: P }>

export const mrazPravidloSchema = z.object({
  /** Bod s teplotou místnosti. */
  teplotaBod: z.string().min(1),
  /** Bod hlavice nebo termostatu (cílová teplota), do kterého se zapisuje. */
  cilBod: z.string().min(1),
  prahC: z.number().default(5),
  hystereze: z.number().positive().default(1),
  teplotaMrazC: z.number().default(8),
})

export const konfiguraceSchema = z
  .object({
    branaId: z.string().regex(/^[a-z0-9][a-z0-9-]{1,62}$/),
    cloud: z
      .object({
        url: z.string().regex(/^mqtts?:\/\//),
        /** Cesty k certifikátům mTLS (vývoj může běžet bez TLS). */
        ca: z.string().optional(),
        certifikat: z.string().optional(),
        klic: z.string().optional(),
        davka: z.number().int().min(1).max(1000).default(100),
      })
      .optional(),
    fronta: z.object({ soubor: z.string().default('data/fronta.sqlite'), maxVzorku: z.number().int().min(100).default(500_000) }).default({ soubor: 'data/fronta.sqlite', maxVzorku: 500_000 }),
    pripojeni: z.array(pripojeniSchema),
    mraz: z.array(mrazPravidloSchema).default([]),
  })
  .superRefine((k, ctx) => {
    const ids = new Set<string>()
    for (const p of k.pripojeni)
      for (const b of p.body) {
        if (ids.has(b.id)) ctx.addIssue({ code: 'custom', message: `Bod ${b.id} je v konfiguraci dvakrát` })
        ids.add(b.id)
      }
    for (const m of k.mraz)
      for (const id of [m.teplotaBod, m.cilBod]) if (!ids.has(id)) ctx.addIssue({ code: 'custom', message: `Pravidlo mrazu odkazuje na neznámý bod ${id}` })
  })
export type Konfigurace = z.infer<typeof konfiguraceSchema>
