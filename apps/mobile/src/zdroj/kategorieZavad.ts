import { hlaseniZavad } from '@codekom/demo-data'

/**
 * Kategorie hlášení závad z obsahu ukázkové obce. Hlášení ukládají `id`
 * (např. `vymol`), uživatel vidí `nazev` (např. Výmol).
 * [OVĚŘIT] Ostré API kategorie zatím samostatně nevydává.
 */
export const KATEGORIE_ZAVAD: readonly { id: string; nazev: string }[] = hlaseniZavad.kategorie

/** Čitelný název kategorie; neznámou hodnotu (třeba starší uložené hlášení) vrátí beze změny. */
export function nazevKategorieZavady(id: string): string {
  return KATEGORIE_ZAVAD.find((k) => k.id === id)?.nazev ?? id
}
