import React, { createContext, useContext, useMemo } from 'react'
import { paleta as ziskejPaletu, UROVNE, type Uroven, type UrovenInfo } from '@codekom/tokeny'
import { pismo } from './pismo'

export interface BarvyTemy {
  bg: string
  surface: string
  ink: string
  muted: string
  line: string
  primary: string
  onPrimary: string
  link: string
  /** Jemně tónovaná plocha hlavní barvy (aktivní záložka, ikony rychlých akcí). */
  primarySoft: string
  /** Druhá plocha pro skupiny a stopy přepínačů. */
  surfaceAlt: string
  /** Limetková barva pro hlavní výzvy (nahlášení závady, odeslání). */
  accent: string
  onAccent: string
  /** Tmavé plochy (hlavička přehledu, spodní lišta) a text na nich. */
  tmava: string
  tmavaPlocha: string
  naTmave: string
  naTmaveTlumene: string
}

/**
 * Moderní vzhled aplikace: černá a limetková, bílé karty na světle šedém
 * pozadí, výrazné tučné písmo. Kontrasty ověřuje test `tema.test.ts`
 * (WCAG 2.2 AA). Tmavé plochy používají `tmava` a `naTmave`.
 */
const MODERNI: BarvyTemy = {
  bg: '#F1F3EE',
  surface: '#FFFFFF',
  ink: '#111311',
  muted: '#5C6159',
  line: '#E2E5DE',
  primary: '#111311',
  onPrimary: '#FFFFFF',
  link: '#3D6B00',
  primarySoft: '#EEF8C6',
  surfaceAlt: '#E6E9E2',
  accent: '#D4F24A',
  onAccent: '#111311',
  tmava: '#111311',
  tmavaPlocha: '#1D201C',
  naTmave: '#FFFFFF',
  naTmaveTlumene: '#9AA196',
}

/** Zaoblení rohů. */
export const zaobleni = {
  male: 12,
  stredni: 18,
  velke: 26,
  plne: 999,
} as const

export interface Tema {
  sablona: string
  paletaIndex: number
  paletaNazev: string
  barvy: BarvyTemy
  /** Barvy z palety obce (znak, akcenty obce). */
  paletaObce: { primary: string; surface: string }
  krize: Record<Uroven, UrovenInfo>
  pismo: typeof pismo
}

export function vytvorTemu(sablonaKlic = 'naves', paletaIndex = 0): Tema {
  const p = ziskejPaletu(sablonaKlic, paletaIndex)
  return {
    sablona: sablonaKlic,
    paletaIndex,
    paletaNazev: p.nazev,
    barvy: MODERNI,
    paletaObce: { primary: p.primary, surface: p.surface },
    krize: UROVNE,
    pismo,
  }
}

export const VYCHOZI_TEMA: Tema = vytvorTemu('naves', 0)

const TemaContext = createContext<Tema>(VYCHOZI_TEMA)

export function TemaProvider({
  sablona = 'naves',
  paletaIndex = 0,
  children,
}: {
  sablona?: string
  paletaIndex?: number
  children: React.ReactNode
}) {
  const tema = useMemo(() => vytvorTemu(sablona, paletaIndex), [sablona, paletaIndex])
  return <TemaContext.Provider value={tema}>{children}</TemaContext.Provider>
}

export function useTema(): Tema {
  return useContext(TemaContext)
}
