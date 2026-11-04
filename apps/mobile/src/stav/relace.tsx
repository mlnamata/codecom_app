import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { RoleUradu } from '@codekom/typy'

export const KLIC_RELACE = 'codekom.ukazka.relace'

export type RoleUkazky = 'obcan' | 'urad'

export interface Relace {
  role: RoleUkazky | null
  obec: string | null
  roleUradu: RoleUradu
  prihlasen: boolean
}

export interface RelaceKontextu {
  relace: Relace
  nacteno: boolean
  nastavRoli: (role: RoleUkazky) => Promise<void>
  nastavObec: (obec: string) => Promise<void>
  nastavRoleUradu: (roleUradu: RoleUradu) => Promise<void>
  prihlasit: (roleUradu?: RoleUradu) => Promise<void>
  odhlasit: () => Promise<void>
  vymazatRelaci: () => Promise<void>
}

const VYCHOZI_RELACE: Relace = {
  role: null,
  obec: 'javori-lhota',
  roleUradu: 'spravce',
  prihlasen: false,
}

const RelaceContext = createContext<RelaceKontextu | null>(null)

export function RelaceProvider({ children }: { children: React.ReactNode }) {
  const [relace, setRelace] = useState<Relace>(VYCHOZI_RELACE)
  const [nacteno, setNacteno] = useState(false)
  const relaceRef = useRef<Relace>(VYCHOZI_RELACE)

  // Načtení z AsyncStorage
  useEffect(() => {
    let aktivni = true
    async function nacti() {
      try {
        if (typeof window !== 'undefined' || typeof navigator !== 'undefined') {
          const ulozene = await AsyncStorage.getItem(KLIC_RELACE)
          if (ulozene && aktivni) {
            const parsovane = JSON.parse(ulozene) as Partial<Relace>
            const spojena: Relace = {
              ...relaceRef.current,
              ...parsovane,
            }
            relaceRef.current = spojena
            setRelace(spojena)
          }
        }
      } catch (err) {
        console.warn('Nepodařilo se načíst relaci z AsyncStorage:', err)
      } finally {
        if (aktivni) setNacteno(true)
      }
    }
    void nacti()
    return () => {
      aktivni = false
    }
  }, [])

  const aktualizuj = useCallback(async (fn: (predchozi: Relace) => Relace) => {
    const nova = fn(relaceRef.current)
    relaceRef.current = nova
    setRelace(nova)

    try {
      if (typeof window !== 'undefined' || typeof navigator !== 'undefined') {
        await AsyncStorage.setItem(KLIC_RELACE, JSON.stringify(nova))
      }
    } catch (err) {
      console.warn('Nepodařilo se uložit relaci do AsyncStorage:', err)
    }
  }, [])

  const nastavRoli = useCallback(
    async (role: RoleUkazky) => {
      await aktualizuj((predchozi) => ({ ...predchozi, role }))
    },
    [aktualizuj],
  )

  const nastavObec = useCallback(
    async (obec: string) => {
      await aktualizuj((predchozi) => ({ ...predchozi, obec }))
    },
    [aktualizuj],
  )

  const nastavRoleUradu = useCallback(
    async (roleUradu: RoleUradu) => {
      await aktualizuj((predchozi) => ({ ...predchozi, roleUradu }))
    },
    [aktualizuj],
  )

  const prihlasit = useCallback(
    async (roleUradu?: RoleUradu) => {
      await aktualizuj((predchozi) => ({
        ...predchozi,
        prihlasen: true,
        ...(roleUradu ? { roleUradu } : {}),
      }))
    },
    [aktualizuj],
  )

  const odhlasit = useCallback(async () => {
    await aktualizuj((predchozi) => ({
      ...predchozi,
      prihlasen: false,
    }))
  }, [aktualizuj])

  const vymazatRelaci = useCallback(async () => {
    relaceRef.current = VYCHOZI_RELACE
    setRelace(VYCHOZI_RELACE)
    try {
      if (typeof window !== 'undefined' || typeof navigator !== 'undefined') {
        await AsyncStorage.removeItem(KLIC_RELACE)
      }
    } catch (err) {
      console.warn('Nepodařilo se vymazat relaci z AsyncStorage:', err)
    }
  }, [])

  const hodnota: RelaceKontextu = useMemo(
    () => ({
      relace,
      nacteno,
      nastavRoli,
      nastavObec,
      nastavRoleUradu,
      prihlasit,
      odhlasit,
      vymazatRelaci,
    }),
    [relace, nacteno, nastavRoli, nastavObec, nastavRoleUradu, prihlasit, odhlasit, vymazatRelaci],
  )

  return <RelaceContext.Provider value={hodnota}>{children}</RelaceContext.Provider>
}

export function useRelace(): RelaceKontextu {
  const ctx = useContext(RelaceContext)
  if (!ctx) throw new Error('useRelace musí být použit uvnitř RelaceProvider')
  return ctx
}
