import { describe, expect, it } from 'vitest'
import {
  aktivniHlaseni,
  bezpecnyOdkaz,
  dayKeyOf,
  deskaHref,
  filtrujDesku,
  formatDay,
  formatVelikost,
  jeAktivni,
  jeVerejny,
  klicSkryti,
  lzeSkryt,
  noonUtc,
  obsahujeText,
  parseDeskaParams,
  pocetDokumentu,
  stavDokumentu,
  toStoredDay,
  tykaSe,
  vyberBanner,
  type KrizoveHlaseni,
} from '../src/pravidla'

describe('datum', () => {
  it('ukládá kalendářní den jako 12:00 UTC a čte ho zpět v Praze', () => {
    expect(noonUtc('2026-11-04')).toBe('2026-11-04T12:00:00.000Z')
    expect(toStoredDay('2026-11-04T23:30:00.000Z')).toBe('2026-11-05T12:00:00.000Z')
    expect(dayKeyOf('2026-03-29T00:30:00.000Z')).toBe('2026-03-29')
    expect(dayKeyOf('')).toBeNull()
    expect(formatDay('2026-11-04')).toBe('4. 11. 2026')
    expect(() => noonUtc('4. 11. 2026')).toThrow(RangeError)
  })
})

describe('deska', () => {
  it('stav dokumentu na hranách dne', () => {
    expect(stavDokumentu('2026-11-04', '2026-11-05', '2026-11-03')).toBe('pripraveno')
    expect(stavDokumentu('2026-11-04', '2026-11-05', '2026-11-04')).toBe('visi')
    expect(stavDokumentu('2026-11-04', '2026-11-05', '2026-11-05')).toBe('visi')
    expect(stavDokumentu('2026-11-04', '2026-11-05', '2026-11-06')).toBe('sejmuto')
    expect(stavDokumentu('2026-10-01', null, '2030-01-01')).toBe('visi')
  })

  it('parsuje URL a zahodí neplatné hodnoty', () => {
    expect(parseDeskaParams({ kategorie: 'doprava', stav: 'sejmuto', q: '  most  ', strana: '2' }, ['doprava'])).toEqual({
      kategorie: 'doprava',
      stav: 'sejmuto',
      q: 'most',
      strana: 2,
    })
    expect(parseDeskaParams({ kategorie: 'x', stav: 'y', strana: '-1' }, [])).toEqual({
      kategorie: null,
      stav: 'visi',
      q: '',
      strana: 1,
    })
    expect(deskaHref({ kategorie: null, stav: 'visi', q: '', strana: 1 })).toBe('/uredni-deska')
    expect(deskaHref({ kategorie: 'doprava', stav: 'visi', q: 'most', strana: 3 })).toBe(
      '/uredni-deska?kategorie=doprava&q=most&strana=3',
    )
  })

  const D = [
    { nazev: 'Visí do zítřka', cisloJednaci: 'OU/1', kategorie: 'a', vyvesenoOd: '2026-11-01', vyvesenoDo: '2026-11-05', skrytPoSejmuti: true },
    { nazev: 'Visí poslední den', cisloJednaci: 'OU/2', kategorie: 'b', vyvesenoOd: '2026-11-01', vyvesenoDo: '2026-11-04', skrytPoSejmuti: true },
    { nazev: 'Sejmuto včera, archiv', cisloJednaci: 'OU/3', kategorie: 'a', vyvesenoOd: '2026-10-01', vyvesenoDo: '2026-11-03', skrytPoSejmuti: false },
    { nazev: 'Sejmuto včera, skryté', cisloJednaci: 'OU/4', kategorie: 'a', vyvesenoOd: '2026-10-01', vyvesenoDo: '2026-11-03', skrytPoSejmuti: true },
    { nazev: 'Vyvěsí se zítra', cisloJednaci: 'OU/5', kategorie: 'a', vyvesenoOd: '2026-11-05', vyvesenoDo: null, skrytPoSejmuti: false },
    { nazev: 'Do odvolání', cisloJednaci: 'MOST/6', kategorie: 'b', vyvesenoOd: '2026-01-01', vyvesenoDo: null, skrytPoSejmuti: true },
  ]
  const nazvy = (s: 'visi' | 'sejmuto' | 'vse', extra: { kategorie?: string; q?: string } = {}) =>
    filtrujDesku(D, { kategorie: extra.kategorie ?? null, stav: s, q: extra.q ?? '' }, '2026-11-04').map((d) => d.nazev)

  it('filtrujDesku na hranách dne odpovídá sémantice deskaWhere', () => {
    expect(nazvy('visi')).toEqual(['Visí do zítřka', 'Visí poslední den', 'Do odvolání'])
    expect(nazvy('sejmuto')).toEqual(['Sejmuto včera, archiv'])
    expect(nazvy('vse')).toEqual(['Visí do zítřka', 'Visí poslední den', 'Sejmuto včera, archiv', 'Do odvolání'])
    expect(nazvy('visi', { kategorie: 'b' })).toEqual(['Visí poslední den', 'Do odvolání'])
    expect(nazvy('vse', { q: 'most' })).toEqual(['Do odvolání'])
    expect(nazvy('visi', { q: 'ZÍTŘKA' })).toEqual(['Visí do zítřka'])
  })

  it('skrytý dokument po sejmutí není veřejný', () => {
    expect(jeVerejny(D[2]!, '2026-11-04')).toBe(true)
    expect(jeVerejny(D[3]!, '2026-11-04')).toBe(false)
    expect(jeVerejny(D[4]!, '2026-11-04')).toBe(false)
  })

  it('popisky v češtině', () => {
    expect(pocetDokumentu(1)).toBe('1 dokument')
    expect(pocetDokumentu(3)).toBe('3 dokumenty')
    expect(pocetDokumentu(5)).toBe('5 dokumentů')
    expect(formatVelikost(84_000)).toBe('82 kB')
    expect(formatVelikost(null)).toBeNull()
    expect(obsahujeText('Úřední deska', 'uredni')).toBe(true)
    expect(obsahujeText('Úřední deska', ' ')).toBe(false)
  })
})

describe('krize', () => {
  const h = (id: string, uroven: KrizoveHlaseni['uroven'], platiOd: string, platiDo: string | null = null): KrizoveHlaseni => ({
    id,
    uroven,
    titulek: id,
    text: id,
    platiOd,
    platiDo,
    updatedAt: '2026-11-01T00:00:00.000Z',
  })
  const ted = new Date('2026-11-04T11:00:00.000Z')
  const seznam = [
    h('info', 'info', '2026-11-01T00:00:00.000Z'),
    h('vystraha', 'warning', '2026-11-04T07:00:00.000Z', '2026-11-05T21:00:00.000Z'),
    h('stara-krize', 'emergency', '2026-10-01T00:00:00.000Z', '2026-10-02T00:00:00.000Z'),
    h('budouci-krize', 'emergency', '2026-11-10T00:00:00.000Z'),
  ]

  it('okno platnosti: od včetně, do bez', () => {
    expect(jeAktivni({ platiOd: '2026-11-04T11:00:00.000Z', platiDo: null }, ted)).toBe(true)
    expect(jeAktivni({ platiOd: '2026-11-04T10:00:00.000Z', platiDo: '2026-11-04T11:00:00.000Z' }, ted)).toBe(false)
  })

  it('vybere jedno nejzávažnější aktivní hlášení', () => {
    expect(aktivniHlaseni(seznam, ted).map((x) => x.id)).toEqual(['vystraha', 'info'])
    expect(vyberBanner(seznam, ted)).toMatchObject({ hlavni: { id: 'vystraha' }, dalsich: 1 })
    expect(vyberBanner([], ted)).toEqual({ hlavni: null, dalsich: 0 })
  })

  it('krizi nejde skrýt a klíč skrytí obsahuje verzi', () => {
    expect(lzeSkryt({ uroven: 'emergency' })).toBe(false)
    expect(lzeSkryt({ uroven: 'warning' })).toBe(true)
    expect(klicSkryti({ id: 'x', updatedAt: '2026-11-01T00:00:00.000Z' })).toBe('krize:x:2026-11-01T00:00:00.000Z')
  })

  it('odkazy jen na web obce nebo http(s)', () => {
    expect(bezpecnyOdkaz('/voda')).toBe('/voda')
    expect(bezpecnyOdkaz('//zlo.cz')).toBeNull()
    expect(bezpecnyOdkaz('javascript:alert(1)')).toBeNull()
    expect(bezpecnyOdkaz('https://chmi.cz')).toBe('https://chmi.cz/')
    expect(bezpecnyOdkaz('')).toBeNull()
  })

  it('týká se částí obce', () => {
    const casti = [
      { slug: 'hajek', nazev: 'Hájek' },
      { slug: 'na-rovnem', nazev: 'Na Rovném' },
      { slug: 'podjavori', nazev: 'Podjavoří' },
    ]
    expect(tykaSe([], casti)).toBeNull()
    expect(tykaSe(['hajek'], casti)).toBe('Hájek')
    expect(tykaSe(['hajek', 'na-rovnem', 'podjavori'], casti)).toBe('Hájek, Na Rovném a Podjavoří')
  })
})
