export const KLICE_TOKENU = ['bg', 'surface', 'ink', 'muted', 'line', 'primary', 'onPrimary', 'link', 'accent', 'onAccent', 'deep', 'onDeep'] as const
export type KlicTokenu = (typeof KLICE_TOKENU)[number]

export type Paleta = { nazev: string; extra: Record<string, string> } & Record<KlicTokenu, string>

export interface RodinaPisma {
  rodina: string
  osy: string[]
  hodnoty: string
}

export interface Sablona {
  klic: string
  cislo: string
  nazev: string
  podtitul: string
  inspirace: string
  pismo: { googleFonts: string; family: string; popis: string; rodiny: RodinaPisma[] }
  velikostTextu: string
  radkovani: string
  vychoziKrize: 'off' | 'info' | 'warning' | 'emergency'
  prototyp: string
  zdroj: string
  interaktivni: boolean
  palety: Paleta[]
}
