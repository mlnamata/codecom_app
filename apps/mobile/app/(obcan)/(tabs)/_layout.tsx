import React from 'react'
import { Tabs, useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { type NazevIkony } from '@/ui/Ikony'
import { PlovouciLista } from '@/ui'

const IKONY: Record<string, NazevIkony> = {
  prehled: 'domu',
  deska: 'deska',
  zpravy: 'zpravy',
  sluzby: 'sluzby',
  vice: 'vice',
}

export default function ObcanTabsLayout() {
  const { barvy } = useTema()
  const router = useRouter()

  return (
    <Tabs
      tabBar={(props) => (
        <PlovouciLista
          {...props}
          ikony={IKONY}
          stredniAkce={{
            popisek: 'Nahlásit závadu v obci',
            onPress: () => router.push('/(obcan)/(tabs)/sluzby/zavada'),
          }}
        />
      )}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: barvy.bg },
      }}
    >
      <Tabs.Screen name="prehled" options={{ title: 'Přehled' }} />
      <Tabs.Screen name="deska" options={{ title: 'Deska' }} />
      <Tabs.Screen name="zpravy" options={{ title: 'Zprávy' }} />
      <Tabs.Screen name="sluzby" options={{ title: 'Služby' }} />
      <Tabs.Screen name="vice" options={{ title: 'Více' }} />
    </Tabs>
  )
}
