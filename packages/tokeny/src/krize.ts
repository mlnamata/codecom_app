/** Krizové úrovně. Pořadí je od nejzávažnější, barvy podle Infobaru gov.cz. Úroveň se vždy píše slovem. */
export type Uroven = 'info' | 'warning' | 'emergency'

export interface UrovenInfo {
  nazev: string
  /** Krátký popisek do přepínačů. */
  kratce: string
  poradi: number
  bg: string
  ink: string
  edge: string
}

export const UROVNE: Record<Uroven, UrovenInfo> = {
  emergency: { nazev: 'Krizová situace', kratce: 'Krize', poradi: 0, bg: '#B00A0D', ink: '#FFFFFF', edge: '#6E0507' },
  warning: { nazev: 'Výstraha', kratce: 'Výstraha', poradi: 1, bg: '#FEF6D8', ink: '#2A1B00', edge: '#CA8504' },
  info: { nazev: 'Informace obce', kratce: 'Informace', poradi: 2, bg: '#F2F6FC', ink: '#0C1838', edge: '#00469B' },
}

export const PORADI_UROVNI: readonly Uroven[] = ['emergency', 'warning', 'info']

export const jeUroven = (v: unknown): v is Uroven => v === 'info' || v === 'warning' || v === 'emergency'
