import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Svg, { Defs, LinearGradient, Stop, Rect, Path, Circle } from 'react-native-svg'
import { useTema } from '../tema'

export interface LogoProps {
  velikost?: number
  /** Zobrazí vedle značky i název CodeKom. */
  sNazvem?: boolean
}

/**
 * Značka CodeKom: střecha obecního domu a signál v zaobleném čtverci
 * v černém čtverci s limetkovým bodem. Dekorativní, název nese text vedle.
 */
export function Logo({ velikost = 40, sNazvem = false }: LogoProps) {
  const { barvy, pismo } = useTema()
  return (
    <View style={styles.radek}>
      <Svg width={velikost} height={velikost} viewBox="0 0 48 48" aria-hidden>
        <Defs>
          <LinearGradient id="codekomPrechod" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#2A2F28" />
            <Stop offset="1" stopColor="#111311" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="48" height="48" rx="14" fill="url(#codekomPrechod)" />
        <Path
          d="M12 25 L24 15 L36 25"
          stroke="#FFFFFF"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <Path
          d="M16 23.5 V34 H32 V23.5"
          stroke="#FFFFFF"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <Circle cx="24" cy="28.5" r="2.6" fill="#D4F24A" />
      </Svg>
      {sNazvem && (
        <Text
          style={[
            styles.nazev,
            { color: barvy.ink, fontFamily: pismo.rodina, fontSize: velikost * 0.5 },
          ]}
        >
          Code<Text style={{ color: barvy.link }}>Kom</Text>
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  radek: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nazev: { fontWeight: '800', letterSpacing: -0.5 },
})
