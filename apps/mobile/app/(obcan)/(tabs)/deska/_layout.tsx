import React from 'react'
import { Stack } from 'expo-router'

export default function DeskaLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  )
}
