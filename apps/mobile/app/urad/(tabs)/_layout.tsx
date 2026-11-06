import React from 'react'
import { Tabs } from 'expo-router'
import { useTema } from '@/tema'
import { type NazevIkony } from '@/ui/Ikony'
import { PlovouciLista } from '@/ui'

const IKONY: Record<string, NazevIkony> = {
  prehled: 'domu',
  krize: 'krize',
  zavady: 'zavada',
  budovy: 'budovy',
}

export default function UradTabsLayout() {
  const { barvy } = useTema()

  return (
    <Tabs
      tabBar={(props) => <PlovouciLista {...props} ikony={IKONY} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: barvy.bg },
      }}
    >
      <Tabs.Screen name="prehled" options={{ title: 'Přehled' }} />
      <Tabs.Screen name="krize" options={{ title: 'Krize' }} />
      <Tabs.Screen name="zavady" options={{ title: 'Závady' }} />
      <Tabs.Screen name="budovy" options={{ title: 'Budovy' }} />
    </Tabs>
  )
}
