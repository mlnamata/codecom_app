import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { TemaProvider } from '../src/tema'
import { Ramec } from '../src/ui/Ramec'

export default function RootLayout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10_000,
            retry: 1,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TemaProvider>
        <Ramec>
          <StatusBar style="auto" />
          <Slot />
        </Ramec>
      </TemaProvider>
    </QueryClientProvider>
  )
}
