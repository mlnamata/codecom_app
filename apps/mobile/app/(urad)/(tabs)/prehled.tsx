import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTema } from '@/tema'

export default function UradPrehledScreen() {
  const { barvy, pismo } = useTema()

  return (
    <View style={[styles.kontejner, { backgroundColor: barvy.bg }]}>
      <Text
        role="heading"
        aria-level={1}
        accessibilityRole="header"
        style={[
          styles.titulek,
          {
            color: barvy.ink,
            fontFamily: pismo.rodina,
            fontWeight: pismo.vahy.polotucne,
          },
        ]}
      >
        Přehled úřadu
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  kontejner: {
    flex: 1,
    padding: 16,
  },
  titulek: {
    fontSize: 22,
    marginBottom: 12,
  },
})
