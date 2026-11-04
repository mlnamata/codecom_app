import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { TemaProvider } from '../src/tema'
import { ZdrojProvider } from '../src/zdroj'
import { RelaceProvider } from '../src/stav/relace'
import { Ramec, PruhUkazky } from '../src/ui'

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
      <ZdrojProvider>
        <RelaceProvider>
          <TemaProvider>
            <Ramec>
              <StatusBar style="auto" />
              <PruhUkazky />
              <Slot />
            </Ramec>
          </TemaProvider>
        </RelaceProvider>
      </ZdrojProvider>
    </QueryClientProvider>
  )
}
