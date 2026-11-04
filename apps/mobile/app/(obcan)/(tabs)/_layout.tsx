import React from 'react'
import { View } from 'react-native'
import { Tabs } from 'expo-router'
import { useTema } from '@/tema'
import { Ikona, type NazevIkony } from '@/ui/Ikony'

const IKONY: Record<string, NazevIkony> = {
  prehled: 'domu',
  deska: 'deska',
  zpravy: 'zpravy',
  sluzby: 'sluzby',
  vice: 'vice',
}

export default function ObcanTabsLayout() {
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
          height: 92,
          paddingTop: 10,
          paddingBottom: 14,
        },
        tabBarActiveTintColor: barvy.primary,
        tabBarInactiveTintColor: barvy.muted,
        tabBarLabelStyle: {
          fontFamily: pismo.rodina,
          fontSize: 12,
          fontWeight: pismo.vahy.polotucne,
          marginTop: 4,
        },
        tabBarIcon: ({ color, focused }) => (
          // Aktivní záložka má ikonu v tónované „pilulce“ (Material 3).
          <View
            style={{
              paddingHorizontal: 18,
              paddingVertical: 3,
              borderRadius: 999,
              backgroundColor: focused ? barvy.primarySoft : 'transparent',
            }}
          >
            <Ikona
              nazev={IKONY[route.name] ?? 'domu'}
              barva={typeof color === 'string' ? color : barvy.muted}
              velikost={22}
            />
          </View>
        ),
      })}
    >
      <Tabs.Screen name="prehled" options={{ title: 'Přehled' }} />
      <Tabs.Screen name="deska" options={{ title: 'Deska' }} />
      <Tabs.Screen name="zpravy" options={{ title: 'Zprávy' }} />
      <Tabs.Screen name="sluzby" options={{ title: 'Služby' }} />
      <Tabs.Screen name="vice" options={{ title: 'Více' }} />
    </Tabs>
  )
}
