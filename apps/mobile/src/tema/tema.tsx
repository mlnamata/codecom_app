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
}

export interface Tema {
  sablona: string
  paletaIndex: number
  paletaNazev: string
  barvy: BarvyTemy
  krize: Record<Uroven, UrovenInfo>
  pismo: typeof pismo
}

export function vytvorTemu(sablonaKlic = 'naves', paletaIndex = 0): Tema {
  const p = ziskejPaletu(sablonaKlic, paletaIndex)
  return {
    sablona: sablonaKlic,
    paletaIndex,
    paletaNazev: p.nazev,
    barvy: {
      bg: p.bg,
      surface: p.surface,
      ink: p.ink,
      muted: p.muted,
      line: p.line,
      primary: p.primary,
      onPrimary: p.onPrimary,
      link: p.link,
    },
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
