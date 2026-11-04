import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTema } from '@/tema'

export default function SluzbyPlaceholder() {
  const { barvy, pismo } = useTema()

  return (
    <View style={[styles.kontejner, { backgroundColor: barvy.bg }]}>
      <Text
        role="heading"
        aria-level={1}
        accessibilityRole="header"
        style={[styles.titulek, { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne }]}
      >
        Služby obce
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  kontejner: { flex: 1, padding: 16 },
  titulek: { fontSize: 24, marginBottom: 16 },
})
