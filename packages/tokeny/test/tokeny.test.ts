import { describe, expect, it } from 'vitest'
import { cssPromenneText, jeKlicSablony, paleta, SABLONY, sablona, zkontrolujTokeny } from '../src'

/** Stejný postup jako `vars` v JS prototypů (design/generator/build.py). */
function varsJakoPrototyp(c: Record<string, unknown>): string {
  const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())
  let vars = ''
  Object.keys(c).forEach((k) => {
    if (k !== 'name' && k !== 'x') vars += '--' + kebab(k) + ': ' + String(c[k]) + '; '
  })
  const x = (c.x ?? {}) as Record<string, string>
  Object.keys(x).forEach((k) => {
    vars += '--' + k + ': ' + x[k] + '; '
  })
  return vars
}

describe('tokeny', () => {
  it('má 20 šablon po 3 paletách v pořadí 01 až 20', () => {
    expect(SABLONY).toHaveLength(20)
    expect(SABLONY.map((s) => s.cislo)).toEqual(Array.from({ length: 20 }, (_, i) => String(i + 1).padStart(2, '0')))
    for (const s of SABLONY) expect(s.palety).toHaveLength(3)
  })

  it('cssPromenne odpovídá řetězci vars z prototypu pro všech 60 kombinací', () => {
    let n = 0
    for (const s of SABLONY) {
      for (const p of s.palety) {
        const { nazev, extra, ...tokeny } = p
        const c = { ...tokeny, name: nazev, x: extra }
        expect(cssPromenneText(p)).toBe(varsJakoPrototyp(c))
        n++
      }
    }
    expect(n).toBe(60)
  })

  it('všech 60 palet projde kontrolami kontrastu z palettes.py', () => {
    const nalezy = SABLONY.flatMap((s) => s.palety.flatMap((p) => zkontrolujTokeny(s, p)))
    expect(nalezy).toEqual([])
  })

  it('najde šablonu a paletu podle klíče', () => {
    expect(sablona('lupa').velikostTextu).toBe('20px')
    expect(paleta('naves', 1).nazev).toBe('Modrotisk')
    expect(jeKlicSablony('urad')).toBe(true)
    expect(jeKlicSablony('neexistuje')).toBe(false)
    expect(() => paleta('naves', 3)).toThrow()
  })
})
