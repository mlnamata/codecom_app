import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  krizovaHlaseni as vychoziKrize,
  rozhlas as vychoziRozhlas,
  hlaseniZavad as vychoziZavady,
  prostory as vychoziProstory,
} from '@codekom/demo-data'
import type {
  HlaseniRozhlasu,
  HlaseniZavady,
  KrizoveHlaseni,
  Rezervace,
  VstupKrize,
  VstupRozhlasu,
} from '@codekom/typy'

export const KLIC_ULOZISTE = 'codekom.ukazka.uloziste'

export interface Koncept {
  id: string
  druh: 'krize' | 'rozhlas'
  vstup: VstupKrize | VstupRozhlasu
  vytvoreno: string
}

export interface StavUloziste {
  krizovaHlaseni: KrizoveHlaseni[]
  rozhlas: HlaseniRozhlasu[]
  hlaseniZavad: HlaseniZavady[]
  rezervace: Rezervace[]
  koncepty: Koncept[]
}

function vytvorSeminko(): StavUloziste {
  return {
    krizovaHlaseni: JSON.parse(JSON.stringify(vychoziKrize)) as KrizoveHlaseni[],
    rozhlas: JSON.parse(JSON.stringify(vychoziRozhlas)) as HlaseniRozhlasu[],
    hlaseniZavad: JSON.parse(JSON.stringify(vychoziZavady.hlaseni)) as HlaseniZavady[],
    rezervace: JSON.parse(JSON.stringify(vychoziProstory.rezervace)) as Rezervace[],
    koncepty: [],
  }
}

// Paměťový stav (in-memory)
let pametovyStav: StavUloziste = vytvorSeminko()
let inicializovano = false

export async function nactiStav(): Promise<StavUloziste> {
  if (inicializovano) return pametovyStav

  try {
    if (typeof window !== 'undefined' || typeof navigator !== 'undefined') {
      const ulozene = await AsyncStorage.getItem(KLIC_ULOZISTE)
      if (ulozene) {
        const parsovane = JSON.parse(ulozene) as Partial<StavUloziste>
        pametovyStav = {
          krizovaHlaseni: parsovane.krizovaHlaseni ?? vytvorSeminko().krizovaHlaseni,
          rozhlas: parsovane.rozhlas ?? vytvorSeminko().rozhlas,
          hlaseniZavad: parsovane.hlaseniZavad ?? vytvorSeminko().hlaseniZavad,
          rezervace: parsovane.rezervace ?? vytvorSeminko().rezervace,
          koncepty: parsovane.koncepty ?? [],
        }
      }
    }
  } catch (err) {
    console.warn('Nepodařilo se načíst stav ukázky z AsyncStorage:', err)
  }

  inicializovano = true
  return pametovyStav
}

export async function ulozStav(novyStav: Partial<StavUloziste>): Promise<StavUloziste> {
  await nactiStav()
  pametovyStav = {
    ...pametovyStav,
    ...novyStav,
  }

  try {
    if (typeof window !== 'undefined' || typeof navigator !== 'undefined') {
      await AsyncStorage.setItem(KLIC_ULOZISTE, JSON.stringify(pametovyStav))
    }
  } catch (err) {
    console.warn('Nepodařilo se uložit stav ukázky do AsyncStorage:', err)
  }

  return pametovyStav
}

export async function resetujUloziste(): Promise<void> {
  pametovyStav = vytvorSeminko()
  try {
    if (typeof window !== 'undefined' || typeof navigator !== 'undefined') {
      await AsyncStorage.removeItem(KLIC_ULOZISTE)
    }
  } catch (err) {
    console.warn('Nepodařilo se resetovat AsyncStorage:', err)
  }
}
