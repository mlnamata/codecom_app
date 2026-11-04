import React from 'react'
import { describe, expect, it, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TemaProvider } from '../src/tema'
import { RelaceProvider } from '../src/stav/relace'
import { ZdrojProvider } from '../src/zdroj'
import { vestaveneZdroj } from '../src/zdroj/vestavene'
import UradBudovyScreen from '../app/(urad)/(tabs)/budovy'

vi.mock('expo-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}))

describe('Role Úřad, oprávnění a správa (M5)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
    await vestaveneZdroj.obnovitUkazku()
  })

  it('Oprávnění: Redaktor nemůže vydat krizové hlášení, Správce ano', async () => {
    const novyVstup = {
      uroven: 'warning' as const,
      titulek: 'Zkouška sirén a rozhlasu',
      text: 'Pravidelná zkouška obecního rozhlasu.',
      casti: ['Javoří Lhota'],
    }

    // Redaktor -> vyhodí chybu (403 simulace)
    await expect(
      vestaveneZdroj.urad.vydatKrizi('javori-lhota', novyVstup, 'redaktor'),
    ).rejects.toThrow('Krizové hlášení smí vydat pouze správce obce.')

    // Správce -> úspěšně vydá
    const vydana = await vestaveneZdroj.urad.vydatKrizi('javori-lhota', novyVstup, 'spravce')
    expect(vydana).toBeDefined()
    expect(vydana.titulek).toBe('Zkouška sirén a rozhlasu')
    expect(vydana.uroven).toBe('warning')
  })

  it('Životní cyklus krize: ukončení platnosti vyřadí z aktivních, záznam se nikdy nemaže', async () => {
    // Vydáme krizovou situaci jako správce
    const vydana = await vestaveneZdroj.urad.vydatKrizi(
      'javori-lhota',
      {
        uroven: 'emergency',
        titulek: 'Blesková povodeň v obci',
        text: 'Mlýnský potok vystoupil z břehů.',
        casti: [],
      },
      'spravce',
    )

    // Redaktor ji nemůže ukončit
    await expect(
      vestaveneZdroj.urad.ukoncitKrizi('javori-lhota', vydana.id, 'redaktor'),
    ).rejects.toThrow('Ukončit krizové hlášení smí pouze správce obce.')

    // Správce ji ukončí
    const ukoncena = await vestaveneZdroj.urad.ukoncitKrizi('javori-lhota', vydana.id, 'spravce')
    expect(ukoncena.platiDo).toBeDefined()

    // Po ukončení již tato ukončená povodeň není hlavní aktivní krizí
    const aktivni = await vestaveneZdroj.krizeAktivni('javori-lhota')
    expect(aktivni.hlavni?.id).not.toBe(vydana.id)
  })

  it('Správa závad: změna stavu a uložení veřejné odpovědi', async () => {
    const zavady = await vestaveneZdroj.urad.zavady('javori-lhota')
    expect(zavady.length).toBeGreaterThan(0)
    const testovaciZavada = zavady[0]!

    // Změna na "Řeší se"
    const upravena = await vestaveneZdroj.urad.zmenitStavZavady('javori-lhota', testovaciZavada.id, {
      stav: 'v_reseni',
    })
    expect(upravena.stav).toBe('v_reseni')

    // Změna na "Vyřízeno" s veřejnou odpovědí
    const vyrizena = await vestaveneZdroj.urad.zmenitStavZavady('javori-lhota', testovaciZavada.id, {
      stav: 'vyrizeno',
      verejnaOdpoved: 'Lampa byla opravena elektrikářem dne 4. 11.',
    })
    expect(vyrizena.stav).toBe('vyrizeno')
    expect(vyrizena.verejnaOdpoved).toBe('Lampa byla opravena elektrikářem dne 4. 11.')
  })

  it('Budovy (pravidlo 5): načte budovy, zobrazí stavy slovem, povinný disclaimer a žádná ovládací tlačítka', async () => {
    const budovy = await vestaveneZdroj.urad.budovy('javori-lhota')
    expect(budovy.length).toBeGreaterThanOrEqual(2)

    render(
      <TemaProvider>
        <RelaceProvider>
          <ZdrojProvider>
            <UradBudovyScreen />
          </ZdrojProvider>
        </RelaceProvider>
      </TemaProvider>,
    )

    // Záhlaví a povinné upozornění
    expect(await screen.findByText('Budovy a technologie')).toBeDefined()
    expect(
      screen.getByText('Ovládání budov přibude v další verzi a bude vyžadovat zvláštní oprávnění.'),
    ).toBeDefined()
    expect(
      screen.getByText('Ochrana proti mrazu běží v bráně nezávisle na cloudu.'),
    ).toBeDefined()

    // Slovní stavy budov
    const vPoradkuPrvky = await screen.findAllByText('V pořádku')
    expect(vPoradkuPrvky.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Alarm')).toBeDefined()

    // Zkontrolujeme, že v prototypu NENÍ žádné tlačítko pro odemčení dveří
    expect(screen.queryByText('Odemknout')).toBeNull()
    expect(screen.queryByText('Odemknout dveře')).toBeNull()
    expect(screen.queryByText('Změnit režim')).toBeNull()
  })
})
