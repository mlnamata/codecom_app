import React from 'react'
import { Tabs } from 'expo-router'
import { useTema } from '@/tema'
import { Ikona, type NazevIkony } from '@/ui/Ikony'

const IKONY: Record<string, NazevIkony> = {
  prehled: 'domu',
  krize: 'krize',
  zavady: 'zavada',
  budovy: 'budovy',
}

export default function UradTabsLayout() {
  const { barvy, pismo } = useTema()

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: { backgroundColor: barvy.bg },
        tabBarStyle: {
          backgroundColor: barvy.surface,
          borderTopColor: barvy.line,
          borderTopWidth: 1,
          height: 80,
          paddingTop: 8,
          paddingBottom: 16,
        },
        tabBarActiveTintColor: barvy.primary,
        tabBarInactiveTintColor: barvy.muted,
        tabBarLabelStyle: {
          fontFamily: pismo.rodina,
          fontSize: 12,
          fontWeight: pismo.vahy.polotucne,
          marginTop: 2,
        },
        tabBarIcon: ({ color }) => (
          <Ikona
            nazev={IKONY[route.name] ?? 'domu'}
            barva={typeof color === 'string' ? color : barvy.muted}
            velikost={24}
          />
        ),
      })}
    >
      <Tabs.Screen name="prehled" options={{ title: 'Přehled' }} />
      <Tabs.Screen name="krize" options={{ title: 'Krize' }} />
      <Tabs.Screen name="zavady" options={{ title: 'Závady' }} />
      <Tabs.Screen name="budovy" options={{ title: 'Budovy' }} />
    </Tabs>
  )
}
