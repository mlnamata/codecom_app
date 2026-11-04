import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTema } from '../src/tema'
import { Tlacitko } from '../src/ui'

export default function IndexPage() {
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
        CodeKom Javoří Lhota
      </Text>
      <Text
        style={[
          styles.podtitul,
          {
            color: barvy.muted,
            fontFamily: pismo.rodina,
          },
        ]}
      >
        Ukázková aplikace pro občana a úřad
      </Text>
      <Tlacitko
        nazev="Vstoupit do aplikace"
        onPress={() => {}}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  kontejner: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulek: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  podtitul: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
})
