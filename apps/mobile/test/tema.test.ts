import { describe, expect, it } from 'vitest'
import { vytvorTemu, zkontrolujKontrastyTemy } from '../src/tema'

describe('tema a kontrast', () => {
  it('správně vytvoří výchozí téma pro Javoří Lhotu (náves, paleta 0)', () => {
    const tema = vytvorTemu('naves', 0)
    expect(tema.sablona).toBe('naves')
    expect(tema.paletaIndex).toBe(0)
    expect(tema.barvy.bg).toBeDefined()
    expect(tema.barvy.surface).toBeDefined()
    expect(tema.barvy.ink).toBeDefined()
    expect(tema.barvy.muted).toBeDefined()
    expect(tema.barvy.line).toBeDefined()
    expect(tema.barvy.primary).toBeDefined()
    expect(tema.barvy.onPrimary).toBeDefined()
    expect(tema.barvy.link).toBeDefined()
    expect(tema.krize.emergency.bg).toBe('#B00A0D')
  })

  it('ověří kontrastní poměry pro všechny 3 palety šablony náves', () => {
    for (const index of [0, 1, 2]) {
      const tema = vytvorTemu('naves', index)
      const vysledky = zkontrolujKontrastyTemy(tema.barvy)

      for (const v of vysledky) {
        expect(
          v.vyhovuje,
          `Šablona naves, paleta ${index}: Dvojice ${v.dvojice} nesplňuje kontrast (${v.pomer.toFixed(2)} < ${v.minimum})`,
        ).toBe(true)
      }
    }
  })
})
