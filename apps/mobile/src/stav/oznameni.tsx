import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { Uroven } from '@codekom/tokeny'
import { useZdroj } from '../zdroj'
import { useRelace } from './relace'

export interface SimulovaneOznameni {
  id: string
  text: string
  uroven: Uroven
  cas: string
}

export interface NastaveniOznameni {
  krize: boolean
  informace: boolean
  aktuality: boolean
  deska: boolean
  mojeHlaseni: boolean
  tichyRezim: boolean
}

const VYCHOZI_NASTAVENI: NastaveniOznameni = {
  krize: true,
  informace: true,
  aktuality: true,
  deska: true,
  mojeHlaseni: true,
  tichyRezim: false,
}

export interface OznameniKontextu {
  aktualniOznameni: SimulovaneOznameni | null
  nastaveni: NastaveniOznameni
  zobrazitOznameni: (text: string, uroven?: Uroven, kategorie?: keyof NastaveniOznameni) => void
  zavritOznameni: () => void
  zmenitNastaveni: (klic: keyof NastaveniOznameni, hodnota: boolean) => void
}

const OznameniContext = createContext<OznameniKontextu | null>(null)

export function OznameniProvider({ children }: { children: React.ReactNode }) {
  const { zdroj } = useZdroj()
  const { relace } = useRelace()

  const [aktualniOznameni, setAktualniOznameni] = useState<SimulovaneOznameni | null>(null)
  const [nastaveni, setNastaveni] = useState<NastaveniOznameni>(VYCHOZI_NASTAVENI)
  const predchoziKrizeIdRef = useRef<string | null>(null)

  const zavritOznameni = useCallback(() => {
    setAktualniOznameni(null)
  }, [])

  const zobrazitOznameni = useCallback(
    (text: string, uroven: Uroven = 'info', kategorie: keyof NastaveniOznameni = 'informace') => {
      // Tichý režim blokuje vše kromě emergency
      if (nastaveni.tichyRezim && uroven !== 'emergency') return
      // Uživatelské preference
      if (!nastaveni[kategorie] && uroven !== 'emergency') return

      setAktualniOznameni({
        id: `ozn-${Date.now()}`,
        text: `Simulované oznámení: ${text}`,
        uroven,
        cas: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }),
      })
    },
    [nastaveni],
  )

  const zmenitNastaveni = useCallback((klic: keyof NastaveniOznameni, hodnota: boolean) => {
    setNastaveni((prev) => ({
      ...prev,
      [klic]: hodnota,
    }))
  }, [])

  // Periodické obnovování každých 10 sekund pro zjištění nové krize
  useEffect(() => {
    if (!relace.obec) return

    const overKrizi = async () => {
      try {
        const aktivni = await zdroj.krizeAktivni(relace.obec!)
        const aktualniId = aktivni.hlavni ? String(aktivni.hlavni.id) : null

        if (
          aktualniId &&
          predchoziKrizeIdRef.current !== null &&
          predchoziKrizeIdRef.current !== aktualniId
        ) {
          const u = (aktivni.hlavni?.uroven ?? 'info') as Uroven
          zobrazitOznameni(
            `${aktivni.hlavni?.titulek ?? 'Nové krizové hlášení'}`,
            u,
            u === 'info' ? 'informace' : 'krize',
          )
        }
        predchoziKrizeIdRef.current = aktualniId
      } catch {
        // Ignoruj chybu při síťovém výpadku
      }
    }

    void overKrizi()
    const timer = setInterval(() => void overKrizi(), 10_000)
    return () => clearInterval(timer)
  }, [zdroj, relace.obec, zobrazitOznameni])

  const hodnota: OznameniKontextu = useMemo(
    () => ({
      aktualniOznameni,
      nastaveni,
      zobrazitOznameni,
      zavritOznameni,
      zmenitNastaveni,
    }),
    [aktualniOznameni, nastaveni, zobrazitOznameni, zavritOznameni, zmenitNastaveni],
  )

  return <OznameniContext.Provider value={hodnota}>{children}</OznameniContext.Provider>
}

export function useOznameni(): OznameniKontextu {
  const ctx = useContext(OznameniContext)
  if (!ctx) throw new Error('useOznameni musí být použit uvnitř OznameniProvider')
  return ctx
}
