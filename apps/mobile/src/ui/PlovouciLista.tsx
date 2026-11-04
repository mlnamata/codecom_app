import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import type { Tabs } from 'expo-router'
import { useTema } from '../tema'
import { Ikona, type NazevIkony } from './Ikony'

type PropsListy = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0]

export interface StredniAkce {
  popisek: string
  onPress: () => void
}

export interface PlovouciListaProps extends PropsListy {
  ikony: Record<string, NazevIkony>
  /** Velké bílé tlačítko uprostřed lišty (u občana nahlášení závady). */
  stredniAkce?: StredniAkce
}

/**
 * Plovoucí tmavá spodní lišta: ikony v černé „pilulce“, aktivní záložka
 * v limetkovém kruhu a volitelně velké tlačítko „+“ uprostřed.
 */
export function PlovouciLista({
  state,
  descriptors,
  navigateToTab,
  ikony,
  stredniAkce,
}: PlovouciListaProps) {
  const { barvy, pismo } = useTema()
  const polovina = Math.ceil(state.routes.length / 2)

  const polozky = state.routes.map((route, index) => {
    const popisek = descriptors[route.key]?.options.title ?? route.name
    const aktivni = state.index === index
    return (
      <Pressable
        key={route.key}
        role="tab"
        accessibilityRole="tab"
        accessibilityLabel={popisek}
        accessibilityState={{ selected: aktivni }}
        aria-selected={aktivni}
        onPress={() => {
          if (!aktivni) navigateToTab(route.key)
        }}
        style={styles.polozka}
      >
        <View style={[styles.ikona, aktivni && { backgroundColor: barvy.accent }]}>
          <Ikona
            nazev={ikony[route.name] ?? 'domu'}
            barva={aktivni ? barvy.onAccent : barvy.naTmaveTlumene}
            velikost={22}
          />
        </View>
        <Text
          numberOfLines={1}
          style={[
            styles.popisek,
            {
              color: aktivni ? barvy.naTmave : barvy.naTmaveTlumene,
              fontFamily: pismo.rodina,
              fontWeight: aktivni ? pismo.vahy.tucne : pismo.vahy.stredni,
            },
          ]}
        >
          {popisek}
        </Text>
      </Pressable>
    )
  })

  return (
    <View style={[styles.obal, { backgroundColor: barvy.bg }]}>
      <View role="tablist" style={[styles.pilulka, { backgroundColor: barvy.tmava }]}>
        {stredniAkce ? (
          <>
            {polozky.slice(0, polovina - (state.routes.length % 2))}
            <Pressable
              role="button"
              accessibilityRole="button"
              accessibilityLabel={stredniAkce.popisek}
              onPress={stredniAkce.onPress}
              style={({ pressed }) => [
                styles.stred,
                { backgroundColor: barvy.surface, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Ikona nazev="plus" barva={barvy.ink} velikost={28} />
            </Pressable>
            {polozky.slice(polovina - (state.routes.length % 2))}
          </>
        ) : (
          polozky
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  obal: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 12,
  },
  pilulka: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  polozka: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    minHeight: 48,
    justifyContent: 'center',
  },
  ikona: {
    width: 40,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popisek: {
    fontSize: 10.5,
  },
  stred: {
    width: 60,
    height: 60,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
})
