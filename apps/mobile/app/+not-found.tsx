import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { Logo, Tlacitko } from '@/ui'

/** Česká stránka pro neznámou adresu (místo výchozí anglické stránky Expo). */
export default function NenalezenoScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()
  return (
    <View style={[styles.kontejner, { backgroundColor: barvy.bg }]}>
      <Stack.Screen options={{ title: 'Stránka nenalezena' }} />
      <Logo velikost={56} />
      <Text
        role="heading"
        aria-level={1}
        style={[styles.nadpis, { color: barvy.ink, fontFamily: pismo.rodina }]}
      >
        Stránka nenalezena
      </Text>
      <Text style={[styles.text, { color: barvy.muted, fontFamily: pismo.rodina }]}>
        Tato adresa v aplikaci neexistuje. Obrazovky úřadu najdete pod /urad.
      </Text>
      <Tlacitko nazev="Zpět do aplikace" varianta="akcent" onPress={() => router.replace('/')} />
    </View>
  )
}

const styles = StyleSheet.create({
  kontejner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  nadpis: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: 8,
  },
})
