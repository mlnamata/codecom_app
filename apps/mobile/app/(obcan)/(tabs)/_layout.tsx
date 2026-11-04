import React from 'react'
import { Tabs } from 'expo-router'
import { useTema } from '@/tema'

export default function ObcanTabsLayout() {
  const { barvy, pismo } = useTema()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: barvy.surface,
          borderTopColor: barvy.line,
          minHeight: 56,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarActiveTintColor: barvy.primary,
        tabBarInactiveTintColor: barvy.muted,
        tabBarLabelStyle: {
          fontFamily: pismo.rodina,
          fontSize: 12,
          fontWeight: '500',
        },
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
