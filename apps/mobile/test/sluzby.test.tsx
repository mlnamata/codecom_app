import React from 'react'
import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { sestavSpd, jePlatnyIban } from '@codekom/typy/pravidla'
import { QrPlatba } from '../src/ui/QrPlatba'
import { TemaProvider } from '../src/tema'
import { vestaveneZdroj } from '../src/zdroj/vestavene'

describe('Služby, platby a rezervace (M4)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
  })

  it('SPD pravidla: validní IBAN generuje správný řetězec, neplatný vrací null', () => {
    // Fiktivní, ale kontrolním součtem validní český IBAN
    // CZ6508000000192000145399 (Česká spořitelna 19-2000145399/0800)
    const validniIban = 'CZ6508000000192000145399'
    expect(jePlatnyIban(validniIban)).toBe(true)

    const spd = sestavSpd({
      iban: validniIban,
      castka: 900,
      variabilniSymbol: '1341001',
      zprava: 'Poplatek za odpad',
    })
    expect(spd).toBeDefined()
    expect(spd).toContain('SPD*1.0')
    expect(spd).toContain(`ACC:${validniIban}`)
    expect(spd).toContain('AM:900.00')
    expect(spd).toContain('CC:CZK')
    expect(spd).toContain('X-VS:1341001')

    // Ukázkový účet z dat
    expect(jePlatnyIban('[ČÍSLO ÚČTU]')).toBe(false)
    expect(sestavSpd({ iban: '[ČÍSLO ÚČTU]', castka: 900 })).toBeNull()
  })

  it('QrPlatba: u ukázkového účtu zobrazí vysvětlení a vždy nese varování „Ukázka, neplaťte“', () => {
    render(
      <TemaProvider>
        <QrPlatba
          iban="[ČÍSLO ÚČTU]"
          castka={900}
          variabilniSymbol="1341001"
          nazevPoplatku="Poplatek za odpad"
        />
      </TemaProvider>,
    )

    // U neplatného účtu se zobrazí vysvětlení
    expect(screen.getByText('Ukázkový účet, QR platba se v ukázce nevytváří.')).toBeDefined()
    // Vždy viditelně varování „Ukázka, neplaťte“
    expect(screen.getByText('Ukázka, neplaťte')).toBeDefined()
  })

  it('Závady: odeslání vygeneruje osmimístný kód a stavZavady jej dohledá', async () => {
    const vysledek = await vestaveneZdroj.odeslatZavadu('javori-lhota', {
      kategorie: 'Výmol',
      popis: 'Velká díra v silnici u rybníka',
      popisMista: 'U Mlýnského rybníka',
    })

    expect(vysledek.cislo).toMatch(/^HZ-2026-\d{4}$/)
    expect(vysledek.sledovaciKod).toHaveLength(8)
    expect(vysledek.sledovaciKod).toMatch(/^[2-9A-HJKMNP-Z]{8}$/)

    // Zpětné dohledání
    const dohledano = await vestaveneZdroj.stavZavady('javori-lhota', vysledek.sledovaciKod)
    expect(dohledano).not.toBeNull()
    expect(dohledano?.cislo).toBe(vysledek.cislo)
    expect(dohledano?.stav).toBe('nove')
  })

  it('Rezervace: zadání vytvoří záznam se stavem „ceka“', async () => {
    const rez = await vestaveneZdroj.zadatRezervaci('javori-lhota', {
      prostorId: 'sal-uradu',
      den: '2026-11-20',
      casOd: '14:00',
      casDo: '18:00',
      ucel: 'Oslava 50. narozenin',
      jmeno: 'Jan Novák',
      email: 'jan.novak@example.cz',
      telefon: '+420 777 123 456',
    })

    expect(rez.id).toBeDefined()
    expect(rez.stav).toBe('ceka')
    expect(rez.prostor).toBe('sal-uradu')

    // Zkontroluj že je v seznamu služeb
    const sluzby = await vestaveneZdroj.sluzby('javori-lhota')
    const nalezena = sluzby.rezervace.find((r) => r.id === rez.id)
    expect(nalezena).toBeDefined()
    expect(nalezena?.stav).toBe('ceka')
  })
})
