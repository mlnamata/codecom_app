import { kontrast as vypoctiKontrast } from '@codekom/tokeny'
import type { BarvyTemy } from './tema'

export { vypoctiKontrast as kontrast }

export interface VysledekKontroly {
  dvojice: string
  barvaA: string
  barvaB: string
  pomer: number
  minimum: number
  vyhovuje: boolean
}

/**
 * Zkontroluje klíčové dvojice barev v tématu podle WCAG 2.2:
 * - text (běžný): 4,5 : 1
 * - ovládací prvky a grafika: 3,0 : 1
 */
export function zkontrolujKontrastyTemy(barvy: BarvyTemy): VysledekKontroly[] {
  const kontroly: { dvojice: string; a: string; b: string; min: number }[] = [
    { dvojice: 'ink na bg', a: barvy.ink, b: barvy.bg, min: 4.5 },
    { dvojice: 'ink na surface', a: barvy.ink, b: barvy.surface, min: 4.5 },
    { dvojice: 'muted na bg', a: barvy.muted, b: barvy.bg, min: 4.5 },
    { dvojice: 'muted na surface', a: barvy.muted, b: barvy.surface, min: 4.5 },
    { dvojice: 'onPrimary na primary', a: barvy.onPrimary, b: barvy.primary, min: 4.5 },
    { dvojice: 'link na bg', a: barvy.link, b: barvy.bg, min: 4.5 },
  ]

  return kontroly.map(({ dvojice, a, b, min }) => {
    const pomer = vypoctiKontrast(a, b)
    return {
      dvojice,
      barvaA: a,
      barvaB: b,
      pomer,
      minimum: min,
      vyhovuje: pomer >= min,
    }
  })
}
