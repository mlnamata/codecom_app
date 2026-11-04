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
  /** Doplňková teplá barva pro zvýraznění (body, odznaky). */
  accent: string
}

/**
 * Moderní vzhled aplikace: neutrální chladné pozadí, bílé karty, svěží
 * smaragdová. Kontrasty ověřuje test `tema.test.ts` (WCAG 2.2 AA).
 */
const MODERNI: BarvyTemy = {
  bg: '#F4F6F5',
  surface: '#FFFFFF',
  ink: '#0F1B16',
  muted: '#5A6862',
  line: '#E3E8E5',
  primary: '#0B7A4B',
  onPrimary: '#FFFFFF',
  link: '#0B7A4B',
  primarySoft: '#E7F5EE',
  surfaceAlt: '#EBEFED',
  accent: '#F2A93B',
}

/** Zaoblení rohů. */
export const zaobleni = {
  male: 10,
  stredni: 14,
  velke: 20,
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
