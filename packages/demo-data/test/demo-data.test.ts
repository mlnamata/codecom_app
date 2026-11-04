import { KrizoveHlaseni } from '@codekom/typy'
import { stavDokumentu } from '@codekom/typy/pravidla'
import { describe, expect, it } from 'vitest'
import * as d from '../src'

describe('demo-data', () => {
  it('načte a ověří všechny soubory ukázkové obce', () => {
    expect(d.obec.slug).toBe('javori-lhota')
    expect(d.aktuality).toHaveLength(12)
    expect(d.akce).toHaveLength(9)
    expect(d.krizovaHlaseni).toHaveLength(3)
    expect(d.rozhlas).toHaveLength(6)
    expect(d.zastupitele).toHaveLength(7)
    expect(d.uredniDeska.kategorie).toHaveLength(6)
    expect(d.hlaseniZavad.hlaseni).toHaveLength(7)
    expect(d.budovy.budovy).toHaveLength(5)
    expect(d.asistentUkazka.otazky).toHaveLength(3)
  })

  it('k DEMO_DNES visí 13 dokumentů a 7 je sejmutých, z toho 3 skryté', () => {
    const dnes = '2026-11-04'
    const stavy = d.uredniDeska.dokumenty.map((x) => ({
      s: stavDokumentu(x.vyvesenoOd, x.vyvesenoDo, dnes),
      skryt: x.skrytPoSejmuti,
    }))
    expect(stavy.filter((x) => x.s === 'visi')).toHaveLength(13)
    const sejmute = stavy.filter((x) => x.s === 'sejmuto')
    expect(sejmute).toHaveLength(7)
    expect(sejmute.filter((x) => x.skryt)).toHaveLength(3)
  })

  it('chyba obsahu vypíše soubor a pole', () => {
    const spatne = [{ ...d.krizovaHlaseni[0], uroven: 'poplach' }]
    expect(() => d.nacti('krizova-hlaseni.json', KrizoveHlaseni.array(), spatne)).toThrowError(
      /krizova-hlaseni\.json[\s\S]*0\.uroven/,
    )
  })

  it('demoTed je pevný okamžik 4. 11. 2026 ve 12:00 v Praze', () => {
    delete process.env.CODEKOM_DEMO_DNES
    expect(d.demoTed().toISOString()).toBe('2026-11-04T11:00:00.000Z')
    process.env.CODEKOM_DEMO_DNES = '2026-07-01'
    expect(d.demoTed().toISOString()).toBe('2026-07-01T10:00:00.000Z')
    process.env.CODEKOM_DEMO_DNES = '2026-11-05T08:30:00.000Z'
    expect(d.demoTed().toISOString()).toBe('2026-11-05T08:30:00.000Z')
    delete process.env.CODEKOM_DEMO_DNES
  })
})
