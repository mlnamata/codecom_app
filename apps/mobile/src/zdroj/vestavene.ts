import {
  obec as demoObec,
  aktuality as demoAktuality,
  akce as demoAkce,
  uredniDeska as demoDeska,
  sluzby as demoSluzby,
  prostory as demoProstory,
  budovy as demoBudovy,
  DEMO_DNES,
} from '@codekom/demo-data'
import {
  vyberBanner,
  filtrujDesku,
} from '@codekom/typy/pravidla'
import type {
  Akce,
  Aktualita,
  Budova,
  DokumentDesky,
  FiltrDesky,
  KategorieDesky,
  HlaseniRozhlasu,
  HlaseniZavady,
  KrizoveHlaseni,
  ObecVerejna,
  Poplatek,
  Prehled,
  PrehledUradu,
  Prostor,
  Rezervace,
  RoleUradu,
  StavZavady,
  StavZavadyVerejny,
  VstupKrize,
  VstupRezervace,
  VstupRozhlasu,
  VstupZavady,
} from '@codekom/typy'
import type { ZdrojAplikace } from './typy'
import { nactiStav, ulozStav, resetujUloziste } from './uloziste'

const DEN = '2026-11-04'
const DNES_DATUM = new Date(DEMO_DNES)

const CROCKFORD_CHARS = '23456789ABCDEFGHJKMNPQRSTVWXYZ'

function generujSledovaciKod(): string {
  let kod = ''
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * CROCKFORD_CHARS.length)
    kod += CROCKFORD_CHARS[randomIndex] ?? 'A'
  }
  return kod
}

export const vestaveneZdroj: ZdrojAplikace = {
  rezim: 'vestavene',

  async obce(): Promise<ObecVerejna[]> {
    return [
      {
        slug: demoObec.slug,
        nazev: demoObec.nazev,
        okres: demoObec.okres,
        znakUrl: demoObec.znakUrl ?? '/demo/znak.svg',
        castiObce: demoObec.castiObce.map((c) => ({ nazev: c.nazev, slug: c.slug })),
      },
    ]
  },

  async prehled(_obec: string): Promise<Prehled> {
    const stav = await nactiStav()
    const { hlavni, dalsich } = vyberBanner(stav.krizovaHlaseni, DNES_DATUM)
    const visiciDokumenty = filtrujDesku(
      demoDeska.dokumenty,
      { kategorie: null, stav: 'visi', q: '' },
      DEN,
    ).slice(0, 5)

    return {
      obec: {
        slug: demoObec.slug,
        nazev: demoObec.nazev,
        okres: demoObec.okres,
        znakUrl: demoObec.znakUrl ?? '/demo/znak.svg',
        castiObce: demoObec.castiObce.map((c) => ({ nazev: c.nazev, slug: c.slug })),
      },
      krize: {
        hlavni: hlavni
          ? {
              ...hlavni,
              urovenNazev:
                hlavni.uroven === 'emergency'
                  ? 'Krizová situace'
                  : hlavni.uroven === 'warning'
                    ? 'Výstraha'
                    : 'Informace obce',
              castiNazvy: hlavni.casti
                ? demoObec.castiObce
                    .filter((c) => hlavni.casti?.includes(c.slug))
                    .map((c) => c.nazev)
                : [],
            }
          : null,
        dalsich,
      },
      aktuality: demoAktuality.slice(0, 5).map((a) => ({
        id: a.id,
        slug: a.slug,
        titulek: a.titulek,
        perex: a.perex,
        publikovano: a.publikovano,
        url: `/aktuality/${a.slug}`,
      })),
      deska: visiciDokumenty.map((d) => ({
        id: d.id,
        nazev: d.nazev,
        kategorie: d.kategorie,
        vyvesenoOd: d.vyvesenoOd,
        vyvesenoDo: d.vyvesenoDo,
        url: `/uredni-deska/${d.id}`,
      })),
      rozhlas: stav.rozhlas.slice(0, 5),
    }
  },

  async krizeAktivni(_obec: string): Promise<{ hlavni: KrizoveHlaseni | null; dalsich: number }> {
    const stav = await nactiStav()
    const { hlavni, dalsich } = vyberBanner(stav.krizovaHlaseni, DNES_DATUM)
    return { hlavni, dalsich }
  },

  async deska(_obec: string, filtr?: FiltrDesky): Promise<DokumentDesky[]> {
    return filtrujDesku(
      demoDeska.dokumenty,
      {
        kategorie: filtr?.kategorie ?? null,
        stav: filtr?.archiv ? 'sejmuto' : 'visi',
        q: filtr?.hledani ?? '',
      },
      DEN,
    )
  },

  async kategorieDesky(_obec: string): Promise<KategorieDesky[]> {
    return [...demoDeska.kategorie].sort((a, b) => a.poradi - b.poradi)
  },

  async dokument(_obec: string, id: string): Promise<DokumentDesky | null> {
    const d = demoDeska.dokumenty.find((item) => item.id === id)
    return d ?? null
  },

  async aktuality(_obec: string): Promise<Aktualita[]> {
    return demoAktuality
  },

  async akce(_obec: string): Promise<Akce[]> {
    return demoAkce
  },

  async sluzby(
    _obec: string,
  ): Promise<{ poplatky: Poplatek[]; prostory: Prostor[]; rezervace: Rezervace[] }> {
    const stav = await nactiStav()
    return {
      poplatky: demoSluzby.poplatky,
      prostory: demoProstory.prostory,
      rezervace: stav.rezervace,
    }
  },

  async odeslatZavadu(
    _obec: string,
    v: VstupZavady,
  ): Promise<{ cislo: string; sledovaciKod: string }> {
    const stav = await nactiStav()
    const index = stav.hlaseniZavad.length + 1
    const cislo = `HZ-2026-${String(index).padStart(4, '0')}`
    const sledovaciKod = generujSledovaciKod()

    const noveHlaseni: HlaseniZavady = {
      id: `zavada-${Date.now()}`,
      cislo,
      sledovaciKod,
      stav: 'nove',
      kategorie: v.kategorie,
      popis: v.popis,
      misto: v.popisMista ?? '',
      poloha: v.poloha ?? null,
      kontakt: null,
      verejnaOdpoved: null,
      pocetFotek: v.pocetFotek ?? 0,
      vytvoreno: new Date().toISOString(),
      zmeneno: new Date().toISOString(),
    }

    await ulozStav({
      hlaseniZavad: [noveHlaseni, ...stav.hlaseniZavad],
    })

    return { cislo, sledovaciKod }
  },

  async stavZavady(_obec: string, kod: string): Promise<StavZavadyVerejny | null> {
    const stav = await nactiStav()
    const h = stav.hlaseniZavad.find((item) => item.sledovaciKod === kod)
    if (!h) return null

    const stavyNazvy: Record<StavZavady, string> = {
      nove: 'Nové',
      prijato: 'Přijato',
      v_reseni: 'V řešení',
      vyrizeno: 'Vyřízeno',
      zamitnuto: 'Zamítnuto',
    }

    return {
      cislo: h.cislo,
      kategorie: h.kategorie,
      stav: h.stav,
      stavNazev: stavyNazvy[h.stav] ?? h.stav,
      verejnaOdpoved: h.verejnaOdpoved,
      vytvoreno: h.vytvoreno,
    }
  },

  async zadatRezervaci(_obec: string, v: VstupRezervace): Promise<Rezervace> {
    const stav = await nactiStav()
    const novaRezervace: Rezervace = {
      id: `rez-${Date.now()}`,
      prostor: v.prostorId,
      den: v.den,
      od: v.casOd,
      do: v.casDo,
      ucel: v.ucel,
      zadatel: {
        jmeno: v.jmeno,
        kontakt: `${v.email}, ${v.telefon}`,
      },
      stav: 'ceka',
      vytvoreno: new Date().toISOString(),
    }

    await ulozStav({
      rezervace: [...stav.rezervace, novaRezervace],
    })

    return novaRezervace
  },

  urad: {
    async prehled(_obec: string): Promise<PrehledUradu> {
      const stav = await nactiStav()
      const { hlavni } = vyberBanner(stav.krizovaHlaseni, DNES_DATUM)
      const novaHlaseni = stav.hlaseniZavad.filter((h) => h.stav === 'nove').length
      const rezervaceCekajici = stav.rezervace.filter((r) => r.stav === 'ceka').length
      const celkemBudov = demoBudovy.budovy.length
      const budovSVyhradou = demoBudovy.budovy.filter((b) => b.stav !== 'ok').length

      return {
        novaHlaseniZavad: novaHlaseni,
        rezervaceKeSchvaleni: rezervaceCekajici,
        aktivniKrize: hlavni,
        budovSVyhradou,
        celkemBudov,
      }
    },

    async zavady(_obec: string, filtrStav?: StavZavady): Promise<HlaseniZavady[]> {
      const stav = await nactiStav()
      if (!filtrStav) return stav.hlaseniZavad
      return stav.hlaseniZavad.filter((h) => h.stav === filtrStav)
    },

    async zmenitStavZavady(
      _obec: string,
      id: string,
      v: { stav: StavZavady; verejnaOdpoved?: string },
    ): Promise<HlaseniZavady> {
      const stav = await nactiStav()
      const zavada = stav.hlaseniZavad.find((h) => h.id === id)
      if (!zavada) throw new Error('Hlášení závady nenalezeno.')

      const aktualizovana: HlaseniZavady = {
        ...zavada,
        stav: v.stav,
        verejnaOdpoved: v.verejnaOdpoved ?? zavada.verejnaOdpoved,
        zmeneno: new Date().toISOString(),
      }

      await ulozStav({
        hlaseniZavad: stav.hlaseniZavad.map((h) => (h.id === id ? aktualizovana : h)),
      })

      return aktualizovana
    },

    async vydatKrizi(
      _obec: string,
      v: VstupKrize,
      role: RoleUradu,
    ): Promise<KrizoveHlaseni> {
      if (role !== 'spravce') {
        throw new Error('Krizové hlášení smí vydat pouze správce obce.')
      }

      const stav = await nactiStav()
      const noveHlaseni: KrizoveHlaseni = {
        id: `krize-${Date.now()}`,
        uroven: v.uroven,
        titulek: v.titulek,
        text: v.text,
        odkazText: v.odkazText ?? null,
        odkazUrl: v.odkazUrl ?? null,
        casti: v.casti ?? [],
        // Ukázka běží v pevném čase DEMO_DNES; skutečné „teď“ by hlášení
        // posunulo do budoucnosti a občan by ho neviděl.
        platiOd: DNES_DATUM.toISOString(),
        platiDo: v.platiDo ?? null,
        updatedAt: new Date().toISOString(),
      }

      await ulozStav({
        krizovaHlaseni: [noveHlaseni, ...stav.krizovaHlaseni],
      })

      return noveHlaseni
    },

    async ukoncitKrizi(
      _obec: string,
      id: string,
      role: RoleUradu,
    ): Promise<KrizoveHlaseni> {
      if (role !== 'spravce') {
        throw new Error('Ukončit krizové hlášení smí pouze správce obce.')
      }

      const stav = await nactiStav()
      const krize = stav.krizovaHlaseni.find((k) => String(k.id) === String(id))
      if (!krize) throw new Error('Krizové hlášení nenalezeno.')

      const aktualizovana: KrizoveHlaseni = {
        ...krize,
        // Konec v čase ukázky, jinak by hlášení v ukázce zůstalo aktivní.
        platiDo: DNES_DATUM.toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await ulozStav({
        krizovaHlaseni: stav.krizovaHlaseni.map((k) =>
          String(k.id) === String(id) ? aktualizovana : k,
        ),
      })

      return aktualizovana
    },

    async vydatRozhlas(
      _obec: string,
      v: VstupRozhlasu,
      role: RoleUradu,
    ): Promise<HlaseniRozhlasu> {
      if (role !== 'spravce') {
        throw new Error('Hlášení rozhlasu smí vydat pouze správce obce.')
      }

      const stav = await nactiStav()
      const noveHlaseni: HlaseniRozhlasu = {
        id: `rozhlas-${Date.now()}`,
        cas: new Date().toISOString(),
        titulek: v.text.length > 30 ? v.text.slice(0, 30) + '...' : v.text,
        text: v.text,
        casti: v.casti ?? [],
        audioUrl: null,
      }

      await ulozStav({
        rozhlas: [noveHlaseni, ...stav.rozhlas],
      })

      return noveHlaseni
    },

    async budovy(_obec: string): Promise<Budova[]> {
      return demoBudovy.budovy
    },
  },

  async obnovitUkazku(): Promise<void> {
    await resetujUloziste()
  },
}
