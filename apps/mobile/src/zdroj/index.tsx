import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import type { RezimZdroje, ZdrojAplikace } from './typy'
import { vestaveneZdroj } from './vestavene'
import { apiZdroj } from './api'
import { overitPripojeniApi } from './pripojeni'

export * from './typy'
export * from './uloziste'
export * from './pripojeni'
export * from './vestavene'
export * from './api'

export interface ZdrojKontextu {
  rezim: RezimZdroje
  zdroj: ZdrojAplikace
  overujeSe: boolean
  zkusitZnovuPripojit: () => Promise<void>
  obnovitUkazku: () => Promise<void>
  bylPrepadNaVestavene: boolean
}

const ZdrojContext = createContext<ZdrojKontextu | null>(null)

export function ZdrojProvider({ children }: { children: React.ReactNode }) {
  const [rezim, setRezim] = useState<RezimZdroje>('vestavene')
  const [overujeSe, setOverujeSe] = useState(false)
  const [bylPrepadNaVestavene, setBylPrepadNaVestavene] = useState(false)

  const zkontrolujPripojeni = useCallback(async () => {
    setOverujeSe(true)
    try {
      const vysledek = await overitPripojeniApi()
      setRezim(vysledek)
    } finally {
      setOverujeSe(false)
    }
  }, [])

  useEffect(() => {
    void zkontrolujPripojeni()

    // Periodická kontrola každých 30 sekund v režimu vestavene
    const interval = setInterval(() => {
      if (rezim === 'vestavene') {
        void zkontrolujPripojeni()
      }
    }, 30_000)

    return () => clearInterval(interval)
  }, [rezim, zkontrolujPripojeni])

  // Obalení API zdroje s automatickým přepadem na vestavěná data
  const aktivniZdroj = useMemo<ZdrojAplikace>(() => {
    if (rezim === 'vestavene') {
      return vestaveneZdroj
    }

    const prepad = (err: unknown) => {
      console.warn('API selhalo, přepínám na vestavěná data:', err)
      setRezim('vestavene')
      setBylPrepadNaVestavene(true)
    }

    return {
      rezim: 'api',
      async obce() {
        try {
          return await apiZdroj.obce()
        } catch (e) {
          prepad(e)
          return vestaveneZdroj.obce()
        }
      },
      async prehled(obec) {
        try {
          return await apiZdroj.prehled(obec)
        } catch (e) {
          prepad(e)
          return vestaveneZdroj.prehled(obec)
        }
      },
      async krizeAktivni(obec) {
        try {
          return await apiZdroj.krizeAktivni(obec)
        } catch (e) {
          prepad(e)
          return vestaveneZdroj.krizeAktivni(obec)
        }
      },
      async deska(obec, filtr) {
        try {
          return await apiZdroj.deska(obec, filtr)
        } catch (e) {
          prepad(e)
          return vestaveneZdroj.deska(obec, filtr)
        }
      },
      async kategorieDesky(obec) {
        try {
          return await apiZdroj.kategorieDesky(obec)
        } catch (e) {
          prepad(e)
          return vestaveneZdroj.kategorieDesky(obec)
        }
      },
      async dokument(obec, id) {
        try {
          return await apiZdroj.dokument(obec, id)
        } catch (e) {
          prepad(e)
          return vestaveneZdroj.dokument(obec, id)
        }
      },
      async aktuality(obec) {
        try {
          return await apiZdroj.aktuality(obec)
        } catch (e) {
          prepad(e)
          return vestaveneZdroj.aktuality(obec)
        }
      },
      async akce(obec) {
        try {
          return await apiZdroj.akce(obec)
        } catch (e) {
          prepad(e)
          return vestaveneZdroj.akce(obec)
        }
      },
      async sluzby(obec) {
        try {
          return await apiZdroj.sluzby(obec)
        } catch (e) {
          prepad(e)
          return vestaveneZdroj.sluzby(obec)
        }
      },
      async odeslatZavadu(obec, v) {
        try {
          return await apiZdroj.odeslatZavadu(obec, v)
        } catch (e) {
          prepad(e)
          return vestaveneZdroj.odeslatZavadu(obec, v)
        }
      },
      async stavZavady(obec, kod) {
        try {
          return await apiZdroj.stavZavady(obec, kod)
        } catch (e) {
          prepad(e)
          return vestaveneZdroj.stavZavady(obec, kod)
        }
      },
      async zadatRezervaci(obec, v) {
        try {
          return await apiZdroj.zadatRezervaci(obec, v)
        } catch (e) {
          prepad(e)
          return vestaveneZdroj.zadatRezervaci(obec, v)
        }
      },
      urad: {
        async prehled(obec) {
          try {
            return await apiZdroj.urad.prehled(obec)
          } catch (e) {
            prepad(e)
            return vestaveneZdroj.urad.prehled(obec)
          }
        },
        async zavady(obec, filtrStav) {
          try {
            return await apiZdroj.urad.zavady(obec, filtrStav)
          } catch (e) {
            prepad(e)
            return vestaveneZdroj.urad.zavady(obec, filtrStav)
          }
        },
        async zmenitStavZavady(obec, id, v) {
          try {
            return await apiZdroj.urad.zmenitStavZavady(obec, id, v)
          } catch (e) {
            prepad(e)
            return vestaveneZdroj.urad.zmenitStavZavady(obec, id, v)
          }
        },
        async vydatKrizi(obec, v, role) {
          try {
            return await apiZdroj.urad.vydatKrizi(obec, v, role)
          } catch (e) {
            prepad(e)
            return vestaveneZdroj.urad.vydatKrizi(obec, v, role)
          }
        },
        async ukoncitKrizi(obec, id, role) {
          try {
            return await apiZdroj.urad.ukoncitKrizi(obec, id, role)
          } catch (e) {
            prepad(e)
            return vestaveneZdroj.urad.ukoncitKrizi(obec, id, role)
          }
        },
        async vydatRozhlas(obec, v, role) {
          try {
            return await apiZdroj.urad.vydatRozhlas(obec, v, role)
          } catch (e) {
            prepad(e)
            return vestaveneZdroj.urad.vydatRozhlas(obec, v, role)
          }
        },
        async budovy(obec) {
          try {
            return await apiZdroj.urad.budovy(obec)
          } catch (e) {
            prepad(e)
            return vestaveneZdroj.urad.budovy(obec)
          }
        },
      },
      async obnovitUkazku() {
        await apiZdroj.obnovitUkazku()
      },
    }
  }, [rezim])

  const hodnota: ZdrojKontextu = useMemo(
    () => ({
      rezim,
      zdroj: aktivniZdroj,
      overujeSe,
      zkusitZnovuPripojit: zkontrolujPripojeni,
      obnovitUkazku: async () => {
        await aktivniZdroj.obnovitUkazku()
      },
      bylPrepadNaVestavene,
    }),
    [rezim, aktivniZdroj, overujeSe, zkontrolujPripojeni, bylPrepadNaVestavene],
  )

  return <ZdrojContext.Provider value={hodnota}>{children}</ZdrojContext.Provider>
}

export function useZdroj(): ZdrojKontextu {
  const ctx = useContext(ZdrojContext)
  if (!ctx) throw new Error('useZdroj musí být použit uvnitř ZdrojProvider')
  return ctx
}
