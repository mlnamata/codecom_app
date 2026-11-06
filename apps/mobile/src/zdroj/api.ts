import {
  Akce,
  Aktualita,
  Budova,
  DokumentDesky,
  FiltrDesky,
  KategorieDesky,
  HlaseniRozhlasu,
  HlaseniZavady,
  KrizeAktivniOdpoved,
  KrizoveHlaseni,
  ObceSeznamOdpoved,
  ObecVerejna,
  Poplatek,
  PrehledOdpoved,
  PrehledUradu,
  Prostor,
  Rezervace,
  RoleUradu,
  StavZavady,
  StavZavadyOdpoved,
  StavZavadyVerejny,
  VstupKrize,
  VstupRezervace,
  VstupRozhlasu,
  VstupZavady,
  ZavadaOdpoved,
} from '@codekom/typy'
import type { ZdrojAplikace } from './typy'
import { vestaveneZdroj } from './vestavene'
import { adresaApi } from './pripojeni'
import { z } from 'zod'

const ZAKLAD_API = adresaApi()

async function volaniApi<T>(
  cesta: string,
  schema: z.ZodType<T>,
  init?: RequestInit,
  timeoutMs = 5000,
): Promise<T> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${ZAKLAD_API}${cesta}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    })

    if (!res.ok) {
      throw new Error(`Chyba API ${res.status}: ${res.statusText}`)
    }

    const data: unknown = await res.json()
    const parsed = schema.safeParse(data)
    if (!parsed.success) {
      throw new Error(`Neplatná odpověď API na ${cesta}: ${parsed.error.message}`)
    }

    return parsed.data
  } finally {
    clearTimeout(id)
  }
}

export const apiZdroj: ZdrojAplikace = {
  rezim: 'api',

  async obce(): Promise<ObecVerejna[]> {
    const res = await volaniApi('/api/obce', ObceSeznamOdpoved)
    return res.obce
  },

  async prehled(obec: string): Promise<PrehledOdpoved> {
    return volaniApi(`/api/obce/${obec}/prehled`, PrehledOdpoved)
  },

  async krizeAktivni(obec: string): Promise<{ hlavni: KrizoveHlaseni | null; dalsich: number }> {
    const res = await volaniApi(`/api/krize/aktivni?obec=${obec}`, KrizeAktivniOdpoved)
    return res
  },

  async deska(obec: string, filtr?: FiltrDesky): Promise<DokumentDesky[]> {
    try {
      const q = new URLSearchParams()
      if (filtr?.kategorie) q.set('kategorie', filtr.kategorie)
      if (filtr?.hledani) q.set('q', filtr.hledani)
      if (filtr?.archiv) q.set('archiv', '1')
      return await volaniApi(
        `/api/ukazka/obce/${obec}/deska?${q.toString()}`,
        z.array(DokumentDesky),
      )
    } catch {
      return vestaveneZdroj.deska(obec, filtr)
    }
  },

  async kategorieDesky(obec: string): Promise<KategorieDesky[]> {
    // [OVĚŘIT] Veřejné API zatím nemá samostatný výpis kategorií desky,
    // proto se kategorie berou z vestavěných dat ukázkové obce.
    return vestaveneZdroj.kategorieDesky(obec)
  },

  async dokument(obec: string, id: string): Promise<DokumentDesky | null> {
    try {
      return await volaniApi(`/api/ukazka/obce/${obec}/deska/${id}`, DokumentDesky.nullable())
    } catch {
      return vestaveneZdroj.dokument(obec, id)
    }
  },

  async aktuality(obec: string): Promise<Aktualita[]> {
    try {
      return await volaniApi(`/api/ukazka/obce/${obec}/aktuality`, z.array(Aktualita))
    } catch {
      return vestaveneZdroj.aktuality(obec)
    }
  },

  async akce(obec: string): Promise<Akce[]> {
    try {
      return await volaniApi(`/api/ukazka/obce/${obec}/akce`, z.array(Akce))
    } catch {
      return vestaveneZdroj.akce(obec)
    }
  },

  async sluzby(
    obec: string,
  ): Promise<{ poplatky: Poplatek[]; prostory: Prostor[]; rezervace: Rezervace[] }> {
    try {
      const Schema = z.object({
        poplatky: z.array(Poplatek),
        prostory: z.array(Prostor),
        rezervace: z.array(Rezervace),
      })
      return await volaniApi(`/api/ukazka/obce/${obec}/sluzby`, Schema)
    } catch {
      return vestaveneZdroj.sluzby(obec)
    }
  },

  async odeslatZavadu(
    obec: string,
    v: VstupZavady,
  ): Promise<{ cislo: string; sledovaciKod: string }> {
    const res = await volaniApi(
      '/api/hlaseni-zavad',
      ZavadaOdpoved,
      {
        method: 'POST',
        body: JSON.stringify({
          obec,
          kategorie: v.kategorie,
          popis: v.popis,
          misto: {
            popis: v.popisMista,
            cast: v.cast,
            souradnice: v.poloha,
          },
        }),
      },
      8000,
    )
    return { cislo: res.cislo, sledovaciKod: res.sledovaciKod }
  },

  async stavZavady(obec: string, kod: string): Promise<StavZavadyVerejny | null> {
    try {
      const res = await volaniApi(
        `/api/hlaseni-zavad?obec=${obec}&kod=${kod}`,
        StavZavadyOdpoved,
      )
      return {
        cislo: res.cislo,
        kategorie: res.kategorie,
        stav: res.stav,
        stavNazev: res.stavNazev,
        verejnaOdpoved: res.verejnaOdpoved,
        vytvoreno: res.vytvoreno,
      }
    } catch {
      return null
    }
  },

  async zadatRezervaci(obec: string, v: VstupRezervace): Promise<Rezervace> {
    try {
      return await volaniApi(`/api/ukazka/obce/${obec}/rezervace`, Rezervace, {
        method: 'POST',
        body: JSON.stringify(v),
      })
    } catch {
      return vestaveneZdroj.zadatRezervaci(obec, v)
    }
  },

  urad: {
    async prehled(obec: string): Promise<PrehledUradu> {
      try {
        return await volaniApi(`/api/ukazka/urad/${obec}/prehled`, PrehledUradu)
      } catch {
        return vestaveneZdroj.urad.prehled(obec)
      }
    },

    async zavady(obec: string, filtrStav?: StavZavady): Promise<HlaseniZavady[]> {
      try {
        const url = filtrStav
          ? `/api/ukazka/urad/${obec}/hlaseni-zavad?stav=${filtrStav}`
          : `/api/ukazka/urad/${obec}/hlaseni-zavad`
        return await volaniApi(url, z.array(HlaseniZavady))
      } catch {
        return vestaveneZdroj.urad.zavady(obec, filtrStav)
      }
    },

    async zmenitStavZavady(
      obec: string,
      id: string,
      v: { stav: StavZavady; verejnaOdpoved?: string },
    ): Promise<HlaseniZavady> {
      try {
        const res = await volaniApi(
          `/api/hlaseni-zavad/${id}`,
          ZavadaOdpoved,
          {
            method: 'PATCH',
            headers: {
              'X-Ukazka-Role': 'spravce',
            },
            body: JSON.stringify({
              stav: v.stav,
              verejnaOdpoved: v.verejnaOdpoved,
            }),
          },
        )
        return {
          id: res.id,
          cislo: res.cislo,
          sledovaciKod: res.sledovaciKod,
          stav: res.stav,
          kategorie: '',
          popis: '',
          misto: '',
          poloha: null,
          pocetFotek: 0,
          kontakt: null,
          verejnaOdpoved: v.verejnaOdpoved ?? null,
          vytvoreno: new Date().toISOString(),
          zmeneno: new Date().toISOString(),
        }
      } catch {
        return vestaveneZdroj.urad.zmenitStavZavady(obec, id, v)
      }
    },

    async vydatKrizi(
      obec: string,
      v: VstupKrize,
      role: RoleUradu,
    ): Promise<KrizoveHlaseni> {
      return volaniApi(`/api/krize`, KrizoveHlaseni, {
        method: 'POST',
        headers: {
          'X-Ukazka-Role': role,
        },
        body: JSON.stringify({
          obec,
          uroven: v.uroven,
          titulek: v.titulek,
          text: v.text,
          odkazText: v.odkazText,
          odkazUrl: v.odkazUrl,
          casti: v.casti,
          platiDo: v.platiDo,
        }),
      })
    },

    async ukoncitKrizi(
      obec: string,
      id: string,
      role: RoleUradu,
    ): Promise<KrizoveHlaseni> {
      try {
        return await volaniApi(`/api/ukazka/urad/${obec}/krize/${id}/ukoncit`, KrizoveHlaseni, {
          method: 'POST',
          headers: {
            'X-Ukazka-Role': role,
          },
        })
      } catch {
        return vestaveneZdroj.urad.ukoncitKrizi(obec, id, role)
      }
    },

    async vydatRozhlas(
      obec: string,
      v: VstupRozhlasu,
      role: RoleUradu,
    ): Promise<HlaseniRozhlasu> {
      try {
        return await volaniApi(`/api/ukazka/urad/${obec}/rozhlas`, HlaseniRozhlasu, {
          method: 'POST',
          headers: {
            'X-Ukazka-Role': role,
          },
          body: JSON.stringify(v),
        })
      } catch {
        return vestaveneZdroj.urad.vydatRozhlas(obec, v, role)
      }
    },

    async budovy(obec: string): Promise<Budova[]> {
      try {
        return await volaniApi(`/api/ukazka/urad/${obec}/budovy`, z.array(Budova))
      } catch {
        return vestaveneZdroj.urad.budovy(obec)
      }
    },
  },

  async obnovitUkazku(): Promise<void> {
    try {
      await fetch(`${ZAKLAD_API}/api/ukazka/obnovit`, { method: 'POST' })
    } catch {
      // Ignoruj chybu a obnov vestavěný stav
    }
    await vestaveneZdroj.obnovitUkazku()
  },
}
