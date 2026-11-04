import React from 'react'
import { Tabs } from 'expo-router'
import { useTema } from '@/tema'

export default function ObcanTabsLayout() {
  const { barvy } = useTema()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: barvy.surface,
          borderTopColor: barvy.line,
        },
        tabBarActiveTintColor: barvy.primary,
        tabBarInactiveTintColor: barvy.muted,
      }}
    >
      <Tabs.Screen name="prehled" options={{ title: 'Přehled' }} />
    </Tabs>
  )
}
