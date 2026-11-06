import React, { useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useRelace } from '../src/stav/relace'
import { useTema } from '../src/tema'

export default function IndexPage() {
  const router = useRouter()
  const { barvy } = useTema()
  const { relace, nacteno } = useRelace()

  useEffect(() => {
    if (!nacteno) return

    if (!relace.role) {
      router.replace('/(uvod)/role')
    } else if (relace.role === 'urad') {
      router.replace('/urad/(tabs)/prehled')
    } else {
      router.replace('/(obcan)/(tabs)/prehled')
    }
  }, [nacteno, relace.role, router])

  return (
    <View style={[styles.kontejner, { backgroundColor: barvy.bg }]}>
      <ActivityIndicator size="large" color={barvy.primary} accessibilityLabel="Načítání aplikace" />
    </View>
  )
}

const styles = StyleSheet.create({
  kontejner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
