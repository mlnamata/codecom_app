import { describe, expect, it, beforeEach, vi } from 'vitest'
import { vestaveneZdroj } from '../src/zdroj/vestavene'
import { overitPripojeniApi } from '../src/zdroj/pripojeni'

describe('vestaveneZdroj', () => {
  beforeEach(async () => {
    await vestaveneZdroj.obnovitUkazku()
  })

  it('vrací seznam obcí s Javoří Lhotou', async () => {
    const obce = await vestaveneZdroj.obce()
    expect(obce).toHaveLength(1)
    expect(obce[0]?.slug).toBe('javori-lhota')
    expect(obce[0]?.nazev).toBe('Javoří Lhota')
  })

  it('vrací přehled s krizí, aktualitami a deskou', async () => {
    const p = await vestaveneZdroj.prehled('javori-lhota')
    expect(p.obec.nazev).toBe('Javoří Lhota')
    expect(p.aktuality.length).toBeGreaterThan(0)
    expect(p.aktuality.length).toBeLessThanOrEqual(5)
    expect(p.deska.length).toBeLessThanOrEqual(5)
  })

  it('filtruje úřední desku a archiv', async () => {
    const visici = await vestaveneZdroj.deska('javori-lhota', { archiv: false })
    expect(visici.length).toBeGreaterThan(0)

    const archiv = await vestaveneZdroj.deska('javori-lhota', { archiv: true })
    // V archivu nesmí být dokumenty se skrytPoSejmuti = true
    for (const dok of archiv) {
      expect(dok.skrytPoSejmuti).not.toBe(true)
    }
  })

  it('odeslání závady vygeneruje jedinečné číslo a sledovací kód', async () => {
    const r1 = await vestaveneZdroj.odeslatZavadu('javori-lhota', {
      kategorie: 'Výmol',
      popis: 'Velká díra v silnici',
    })
    const r2 = await vestaveneZdroj.odeslatZavadu('javori-lhota', {
      kategorie: 'Osvětlení',
      popis: 'Nesvítí lampa',
    })

    expect(r1.cislo).toBeDefined()
    expect(r2.cislo).toBeDefined()
    expect(r1.cislo).not.toBe(r2.cislo)
    expect(r1.sledovaciKod).not.toBe(r2.sledovaciKod)

    const stav = await vestaveneZdroj.stavZavady('javori-lhota', r1.sledovaciKod)
    expect(stav).not.toBeNull()
    expect(stav?.cislo).toBe(r1.cislo)
    expect(stav?.stav).toBe('nove')
  })

  it('správce může změnit stav závady a vydat/ukončit krizové hlášení', async () => {
    const zavada = await vestaveneZdroj.odeslatZavadu('javori-lhota', {
      kategorie: 'Odpad',
      popis: 'Přeplněný kontejner',
    })

    const vsechnyZavady = await vestaveneZdroj.urad.zavady('javori-lhota')
    const z = vsechnyZavady.find((item) => item.cislo === zavada.cislo)
    expect(z).toBeDefined()

    const zmenena = await vestaveneZdroj.urad.zmenitStavZavady('javori-lhota', z!.id, {
      stav: 'v_reseni',
      verejnaOdpoved: 'Technické služby vyjíždí.',
    })
    expect(zmenena.stav).toBe('v_reseni')

    // Ověření, že občan vidí veřejnou odpověď
    const stavObcan = await vestaveneZdroj.stavZavady('javori-lhota', zavada.sledovaciKod)
    expect(stavObcan?.stav).toBe('v_reseni')
    expect(stavObcan?.verejnaOdpoved).toBe('Technické služby vyjíždí.')

    // Redaktor nesmí vydat krizi
    await expect(
      vestaveneZdroj.urad.vydatKrizi(
        'javori-lhota',
        {
          uroven: 'warning',
          titulek: 'Výstraha',
          text: 'Silný vítr na území obce.',
        },
        'redaktor',
      ),
    ).rejects.toThrow(/správce/)

    // Správce smí vydat krizi
    const novaKrize = await vestaveneZdroj.urad.vydatKrizi(
      'javori-lhota',
      {
        uroven: 'warning',
        titulek: 'Výstraha před větrem',
        text: 'Silný vítr na území obce.',
      },
      'spravce',
    )
    expect(novaKrize.id).toBeDefined()

    const aktivni = await vestaveneZdroj.krizeAktivni('javori-lhota')
    expect(aktivni.hlavni).not.toBeNull()
  })

  it('obnovitUkazku vrátí semínko do výchozího stavu', async () => {
    await vestaveneZdroj.odeslatZavadu('javori-lhota', {
      kategorie: 'Jiné',
      popis: 'Dočasná závada',
    })

    await vestaveneZdroj.obnovitUkazku()
    const zavadyPoResetu = await vestaveneZdroj.urad.zavady('javori-lhota')
    expect(zavadyPoResetu.some((item) => item.popis === 'Dočasná závada')).toBe(false)
  })
})

describe('pripojeniApi', () => {
  it('při chybějícím nebo nedostupném API vrací režim vestavene', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))
    const rezim = await overitPripojeniApi()
    expect(rezim).toBe('vestavene')
    vi.unstubAllGlobals()
  })

  it('při úspěšné odpovědi se schváleným schématem vrací režim api', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          obce: [
            {
              slug: 'javori-lhota',
              nazev: 'Javoří Lhota',
              okres: 'Klatovy',
              znakUrl: '/demo/znak.svg',
              castiObce: [{ nazev: 'Javoří Lhota', slug: 'javori-lhota' }],
            },
          ],
        }),
      }),
    )

    const rezim = await overitPripojeniApi()
    expect(rezim).toBe('api')
    vi.unstubAllGlobals()
  })
})
