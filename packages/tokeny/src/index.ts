import { kontrast } from './kontrast'
import { KONTROLY_KONTRASTU, SABLONY } from './sablony'
import { KLICE_TOKENU, type Paleta, type Sablona } from './typy'

export * from './krize'
export * from './kontrast'
export * from './typy'
export { KONTROLY_KONTRASTU, SABLONY }

const kebab = (s: string): string => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)

/** CSS proměnné palety v pořadí a tvaru jako `vars` v prototypech (build.py). */
export function cssPromenne(p: Paleta): Record<string, string> {
  const out: Record<string, string> = {}
  for (const k of KLICE_TOKENU) out[`--${kebab(k)}`] = p[k]
  for (const [k, v] of Object.entries(p.extra)) out[`--${k}`] = v
  return out
}

/** Stejné proměnné jako jeden řetězec `--bg: #FFF; --surface: …; `. */
export function cssPromenneText(p: Paleta): string {
  return Object.entries(cssPromenne(p))
    .map(([k, v]) => `${k}: ${v}; `)
    .join('')
}

export type KlicSablony = string

export const jeKlicSablony = (v: unknown): v is KlicSablony => typeof v === 'string' && SABLONY.some((s) => s.klic === v)

export function sablona(klic: string): Sablona {
  const s = SABLONY.find((x) => x.klic === klic)
  if (!s) throw new RangeError(`Neznámá šablona: ${klic}`)
  return s
}

export function paleta(klic: string, index: number): Paleta {
  const p = sablona(klic).palety[index]
  if (!p) throw new RangeError(`Šablona ${klic} nemá paletu ${index}`)
  return p
}

export interface NalezKontrastu {
  sablona: string
  paleta: string
  dvojice: string
  pomer: number
  minimum: number
}

/** Kontroly z CHECKS v palettes.py plus text na barevných stužkách (r1 až r4). */
export function zkontrolujTokeny(s: Sablona, p: Paleta): NalezKontrastu[] {
  const out: NalezKontrastu[] = []
  for (const { a, b, min } of KONTROLY_KONTRASTU) {
    const pomer = kontrast(p[a as keyof Paleta] as string, p[b as keyof Paleta] as string)
    if (pomer < min) out.push({ sablona: s.klic, paleta: p.nazev, dvojice: `${a}/${b}`, pomer, minimum: min })
  }
  for (const k of ['r1', 'r2', 'r3', 'r4']) {
    const bg = p.extra[k]
    const ink = p.extra[`${k}i`]
    if (bg && ink) {
      const pomer = kontrast(ink, bg)
      if (pomer < 4.5) out.push({ sablona: s.klic, paleta: p.nazev, dvojice: `${k} text`, pomer, minimum: 4.5 })
    }
  }
  return out
}
