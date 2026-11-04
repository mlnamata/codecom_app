import type { DokumentDesky } from '../schemata'

/** Which documents the list shows. */
export type DeskaStav = 'visi' | 'sejmuto' | 'vse'

/** State of a single document on a given day. */
export type StavDokumentu = 'pripraveno' | 'visi' | 'sejmuto'

export interface DeskaFiltry {
  /** Category slug, or null for all categories. */
  kategorie: string | null
  stav: DeskaStav
  /** Free-text search in title and reference number. Empty string when not searching. */
  q: string
  /** 1-based page number. */
  strana: number
}

export const NA_STRANU = 25
export const MAX_DELKA_HLEDANI = 100
export const VYCHOZI_FILTRY: DeskaFiltry = { kategorie: null, stav: 'visi', q: '', strana: 1 }

export const STAV_POPIS: Record<DeskaStav, string> = {
  visi: 'Visí na desce',
  sejmuto: 'Sejmuté (archiv)',
  vse: 'Všechny',
}

type SearchParams = Record<string, string | string[] | undefined>

const first = (v: string | string[] | undefined): string | undefined => (Array.isArray(v) ? v[0] : v)

/**
 * Reads filters from the URL. Anything unknown or malformed falls back to the default,
 * so a hand-edited or stale link always shows a sensible list instead of an error.
 */
export function parseDeskaParams(sp: SearchParams, kategorieSlugs: readonly string[]): DeskaFiltry {
  const kat = first(sp.kategorie)?.trim()
  const stav = first(sp.stav)
  const q = (first(sp.q) ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_DELKA_HLEDANI)
  const strana = Number.parseInt(first(sp.strana) ?? '1', 10)
  return {
    kategorie: kat && kategorieSlugs.includes(kat) ? kat : null,
    stav: stav === 'sejmuto' || stav === 'vse' ? stav : 'visi',
    q,
    strana: Number.isFinite(strana) && strana >= 1 && strana <= 10_000 ? strana : 1,
  }
}

/** Builds the query string for a filter state, leaving out defaults so URLs stay short. */
export function deskaHref(f: DeskaFiltry, path = '/uredni-deska'): string {
  const p = new URLSearchParams()
  if (f.kategorie) p.set('kategorie', f.kategorie)
  if (f.stav !== 'visi') p.set('stav', f.stav)
  if (f.q) p.set('q', f.q)
  if (f.strana > 1) p.set('strana', String(f.strana))
  const s = p.toString()
  return s ? `${path}?${s}` : path
}

export function jeVychozi(f: DeskaFiltry): boolean {
  return !f.kategorie && f.stav === 'visi' && !f.q
}

/**
 * `vyvesenoDo` is the last day the document hangs (inclusive). Null means "do odvolání".
 * All arguments are Prague calendar days as `YYYY-MM-DD`.
 */
export function stavDokumentu(vyvesenoOd: string, vyvesenoDo: string | null, dnes: string): StavDokumentu {
  if (dnes < vyvesenoOd) return 'pripraveno'
  if (vyvesenoDo !== null && dnes > vyvesenoDo) return 'sejmuto'
  return 'visi'
}

/** Sort order: newest posting first; archive by most recently taken down. */
export function deskaSort(f: DeskaFiltry): string[] {
  return f.stav === 'sejmuto' ? ['-vyvesenoDo', '-vyvesenoOd'] : ['-vyvesenoOd', 'nazev']
}

/** Czech plural: 1 dokument, 2 dokumenty, 5 dokumentů. */
export function pocetDokumentu(n: number): string {
  if (n === 1) return '1 dokument'
  if (n >= 2 && n <= 4) return `${n} dokumenty`
  return `${n.toLocaleString('cs-CZ').replace(/ /g, ' ')} dokumentů`
}

/** One-sentence summary of the active filters, used in the table caption and status line. */
export function popisFiltru(f: DeskaFiltry, kategorieNazev: string | null): string {
  const casti = [STAV_POPIS[f.stav]]
  if (kategorieNazev) casti.push(`kategorie ${kategorieNazev}`)
  if (f.q) casti.push(`hledáte „${f.q}“`)
  return casti.join(', ')
}

/** `84 kB`, `1,2 MB` */
export function formatVelikost(bytes: number | null | undefined): string | null {
  if (bytes == null || !Number.isFinite(bytes) || bytes < 0) return null
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} kB`
  return `${(bytes / (1024 * 1024)).toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} MB`
}

/** Short file type label from a MIME type. */
export function typSouboru(mime: string | null | undefined): string {
  if (!mime) return 'soubor'
  if (mime === 'application/pdf') return 'PDF'
  if (mime.includes('wordprocessingml') || mime === 'application/msword') return 'Word'
  if (mime.includes('spreadsheetml') || mime === 'application/vnd.ms-excel') return 'Excel'
  if (mime.startsWith('image/')) return 'obrázek'
  return 'soubor'
}

const bezDiakritiky = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

/** Smí se dokument po sejmutí ukázat v archivu? */
export const jeArchivovatelny = (d: Pick<DokumentDesky, 'skrytPoSejmuti'>): boolean => d.skrytPoSejmuti !== true

/** Je dokument veřejný v daný den (visí, nebo je sejmutý a smí do archivu)? */
export function jeVerejny(d: Pick<DokumentDesky, 'vyvesenoOd' | 'vyvesenoDo' | 'skrytPoSejmuti'>, dnes: string): boolean {
  const stav = stavDokumentu(d.vyvesenoOd, d.vyvesenoDo, dnes)
  return stav === 'visi' || (stav === 'sejmuto' && jeArchivovatelny(d))
}

/**
 * Stejná sémantika jako `deskaWhere` v apps/web, ale nad polem v paměti:
 * visí (včetně „do odvolání“), sejmuté bez skrytých po sejmutí, nebo obojí.
 * Hledá bez ohledu na velikost písmen v názvu a čísle jednacím. Řadí jako `deskaSort`.
 */
export function filtrujDesku<T extends Pick<DokumentDesky, 'nazev' | 'cisloJednaci' | 'kategorie' | 'vyvesenoOd' | 'vyvesenoDo' | 'skrytPoSejmuti'>>(
  dokumenty: readonly T[],
  f: Pick<DeskaFiltry, 'kategorie' | 'stav' | 'q'>,
  dnes: string,
): T[] {
  const q = f.q.toLowerCase()
  const vysledek = dokumenty.filter((d) => {
    if (d.vyvesenoOd > dnes) return false
    const stav = stavDokumentu(d.vyvesenoOd, d.vyvesenoDo, dnes)
    if (f.stav === 'visi' && stav !== 'visi') return false
    if (f.stav === 'sejmuto' && !(stav === 'sejmuto' && jeArchivovatelny(d))) return false
    if (f.stav === 'vse' && !(stav === 'visi' || jeArchivovatelny(d))) return false
    if (f.kategorie && d.kategorie !== f.kategorie) return false
    if (q && !d.nazev.toLowerCase().includes(q) && !d.cisloJednaci.toLowerCase().includes(q)) return false
    return true
  })
  const srovnej = (a: string | null, b: string | null): number => (a ?? '9999-12-31').localeCompare(b ?? '9999-12-31')
  return vysledek.sort((a, b) =>
    f.stav === 'sejmuto'
      ? srovnej(b.vyvesenoDo, a.vyvesenoDo) || b.vyvesenoOd.localeCompare(a.vyvesenoOd)
      : b.vyvesenoOd.localeCompare(a.vyvesenoOd) || a.nazev.localeCompare(b.nazev, 'cs'),
  )
}

/** Hledání bez diakritiky a velikosti písmen (pro /hledat). */
export function obsahujeText(text: string, dotaz: string): boolean {
  const q = bezDiakritiky(dotaz).trim()
  return q.length > 0 && bezDiakritiky(text).includes(q)
}

export { bezDiakritiky }
