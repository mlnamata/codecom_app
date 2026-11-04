import React from 'react'
import { describe, expect, it, beforeEach, vi } from 'vitest'
import { renderHook, act, render, screen } from '@testing-library/react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { RelaceProvider, useRelace } from '../src/stav/relace'
import { TemaProvider } from '../src/tema'
import RoleScreen from '../app/(uvod)/role'

// Mock expo-router
vi.mock('expo-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}))

describe('relace a uvod', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
  })
  it('správně spravuje stav relace uživatele', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RelaceProvider>{children}</RelaceProvider>
    )

    const { result } = renderHook(() => useRelace(), { wrapper })

    expect(result.current.relace.role).toBeNull()
    expect(result.current.relace.prihlasen).toBe(false)

    await act(async () => {
      await result.current.nastavRoli('obcan')
    })
    expect(result.current.relace.role).toBe('obcan')

    await act(async () => {
      await result.current.nastavObec('javori-lhota')
    })
    expect(result.current.relace.obec).toBe('javori-lhota')

    await act(async () => {
      await result.current.prihlasit()
    })
    expect(result.current.relace.prihlasen).toBe(true)

    await act(async () => {
      await result.current.odhlasit()
    })
    expect(result.current.relace.prihlasen).toBe(false)
  })

  it('pro roli úřad umožňuje nastavit správce a redaktora', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RelaceProvider>{children}</RelaceProvider>
    )

    const { result } = renderHook(() => useRelace(), { wrapper })

    await act(async () => {
      await result.current.nastavRoli('urad')
      await result.current.nastavRoleUradu('redaktor')
    })
    expect(result.current.relace.role).toBe('urad')
    expect(result.current.relace.roleUradu).toBe('redaktor')

    await act(async () => {
      await result.current.nastavRoleUradu('spravce')
    })
    expect(result.current.relace.roleUradu).toBe('spravce')
  })

  it('vykreslí obrazovku výběru role s možnostmi Občan a Úřad', () => {
    render(
      <RelaceProvider>
        <TemaProvider>
          <RoleScreen />
        </TemaProvider>
      </RelaceProvider>,
    )

    expect(screen.getByRole('heading', { level: 1 })).toBeDefined()
    expect(screen.getByText('Občan')).toBeDefined()
    expect(screen.getByText('Úřad')).toBeDefined()
    expect(screen.getByText('▸ Co je to ukázka?')).toBeDefined()
  })
})
