import { hlaseniZavad } from '@codekom/demo-data'
import type { NazevIkony } from '../ui/Ikony'

/**
 * Kategorie hlášení závad z obsahu ukázkové obce. Hlášení ukládají `id`
 * (např. `vymol`), uživatel vidí `nazev` (např. Výmol v silnici).
 * [OVĚŘIT] Ostré API kategorie zatím samostatně nevydává.
 */
export const KATEGORIE_ZAVAD: readonly { id: string; nazev: string }[] = hlaseniZavad.kategorie

/** Čitelný název kategorie; neznámou hodnotu (třeba starší uložené hlášení) vrátí beze změny. */
export function nazevKategorieZavady(id: string): string {
  return KATEGORIE_ZAVAD.find((k) => k.id === id)?.nazev ?? id
}

export interface VzhledKategorie {
  ikona: NazevIkony
  /** Barva ikony (kontrast ≥ 3 : 1 na pozadí). */
  barva: string
  pozadi: string
}

const ODPAD: Omit<VzhledKategorie, 'ikona'> = { barva: '#9A3412', pozadi: '#FFEDD5' }
const ZELEN: Omit<VzhledKategorie, 'ikona'> = { barva: '#3D6B00', pozadi: '#EEF8C6' }
const CESTY: Omit<VzhledKategorie, 'ikona'> = { barva: '#1E40AF', pozadi: '#E0E9FF' }
const OBEC: Omit<VzhledKategorie, 'ikona'> = { barva: '#6B21A8', pozadi: '#F3E8FF' }
const OSTATNI: Omit<VzhledKategorie, 'ikona'> = { barva: '#374151', pozadi: '#ECEEF0' }

const VZHLED: Record<string, VzhledKategorie> = {
  'kos-nevyvezeny': { ikona: 'kos', ...ODPAD },
  'kos-neuklizeny': { ikona: 'pytel', ...ODPAD },
  neporadek: { ikona: 'pytel', ...ODPAD },
  odpad: { ikona: 'kos', ...ODPAD },
  'vysoka-trava': { ikona: 'trava', ...ZELEN },
  zelen: { ikona: 'strom', ...ZELEN },
  vymol: { ikona: 'krize', ...CESTY },
  chodnik: { ikona: 'dlazba', ...CESTY },
  osvetleni: { ikona: 'zarovka', ...CESTY },
  znaceni: { ikona: 'znacka', ...CESTY },
  kanal: { ikona: 'kanal', ...CESTY },
  snih: { ikona: 'vlocka', ...CESTY },
  mobiliar: { ikona: 'lavicka', ...OBEC },
  vandalismus: { ikona: 'sprej', ...OBEC },
  psi: { ikona: 'tlapka', ...OBEC },
  jine: { ikona: 'vice', ...OSTATNI },
}

/** Ikona a barvy dlaždice kategorie; neznámá kategorie dostane vzhled „Jiné“. */
export function vzhledKategorieZavady(id: string): VzhledKategorie {
  return VZHLED[id] ?? { ikona: 'vice', ...OSTATNI }
}
