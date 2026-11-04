import React from 'react'
import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { KrizovyBanner } from '../src/ui/KrizovyBanner'
import { TemaProvider } from '../src/tema'
import type { KrizoveHlaseni } from '@codekom/typy'

describe('KrizovyBanner a pravidla', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
  })

  it('Krizovou situaci (emergency) nejde skrýt – tlačítko zavření se nezobrazí', () => {
    const krizoveHlaseni: KrizoveHlaseni = {
      id: 'krize-1',
      uroven: 'emergency',
      titulek: 'Evakuace dolní části obce',
      text: 'Z důvodu hrozící povodně nařiďte okamžitou evakuaci.',
      odkazText: null,
      odkazUrl: null,
      casti: [],
      platiOd: '2026-11-04T10:00:00.000Z',
      platiDo: null,
      updatedAt: '2026-11-04T10:00:00.000Z',
    }

    render(
      <TemaProvider>
        <KrizovyBanner hlavni={krizoveHlaseni} />
      </TemaProvider>,
    )

    // Úroveň je slovem
    expect(screen.getByText('Krizová situace')).toBeDefined()
    expect(screen.getByText('Evakuace dolní části obce')).toBeDefined()
    expect(screen.getByText('Hlášení nenahrazuje varovný systém IZS.')).toBeDefined()

    // Tlačítko pro skrytí nesmí existovat
    expect(screen.queryByLabelText('Skrýt toto hlášení')).toBeNull()
  })

  it('Výstrahu (warning) lze skrýt a po kliknutí zmizí', async () => {
    const vystrahaHlaseni: KrizoveHlaseni = {
      id: 'krize-2',
      uroven: 'warning',
      titulek: 'Nebezpečí pádu stromů',
      text: 'Při silném větru nevstupujte do obecního parku.',
      odkazText: null,
      odkazUrl: null,
      casti: [],
      platiOd: '2026-11-04T10:00:00.000Z',
      platiDo: null,
      updatedAt: '2026-11-04T10:00:00.000Z',
    }

    render(
      <TemaProvider>
        <KrizovyBanner hlavni={vystrahaHlaseni} />
      </TemaProvider>,
    )

    expect(screen.getByText('Výstraha')).toBeDefined()

    // Tlačítko pro skrytí existuje
    const zavritBtn = screen.getByLabelText('Skrýt toto hlášení')
    expect(zavritBtn).toBeDefined()

    fireEvent.click(zavritBtn)

    // Po zavření banner zmizí
    expect(screen.queryByText('Nebezpečí pádu stromů')).toBeNull()
  })
})
