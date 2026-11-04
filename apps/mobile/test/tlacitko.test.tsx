import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Tlacitko } from '../src/ui/Tlacitko'
import { TemaProvider } from '../src/tema'

describe('Tlacitko', () => {
  it('vykreslí tlačítko s přístupností a správným názvem', () => {
    const handleClick = vi.fn()
    render(
      <TemaProvider>
        <Tlacitko nazev="Odeslat hlášení" onPress={handleClick} />
      </TemaProvider>,
    )

    const btn = screen.getByRole('button', { name: 'Odeslat hlášení' })
    expect(btn).toBeDefined()

    fireEvent.click(btn)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('respektuje stav zakázáno a nereaguje na kliknutí', () => {
    const handleClick = vi.fn()
    render(
      <TemaProvider>
        <Tlacitko nazev="Nedostupné" zakazano onPress={handleClick} />
      </TemaProvider>,
    )

    const btn = screen.getByRole('button', { name: 'Nedostupné' })
    fireEvent.click(btn)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('při načítání zobrazuje indikátor a má accessibilityState busy', () => {
    render(
      <TemaProvider>
        <Tlacitko nazev="Uložit" nacitani />
      </TemaProvider>,
    )

    const btn = screen.getByRole('button')
    expect(btn.getAttribute('aria-busy')).toBe('true')
  })
})
