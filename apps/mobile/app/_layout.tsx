import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { TemaProvider } from '../src/tema'
import { ZdrojProvider } from '../src/zdroj'
import { RelaceProvider } from '../src/stav/relace'
import { OznameniProvider } from '../src/stav/oznameni'
import { Ramec, PruhUkazky, PruhOznameni } from '../src/ui'

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
          <OznameniProvider>
            <TemaProvider>
              <Ramec>
                <StatusBar style="auto" />
                <PruhUkazky />
                <PruhOznameni />
                <Slot />
              </Ramec>
            </TemaProvider>
          </OznameniProvider>
        </RelaceProvider>
      </ZdrojProvider>
    </QueryClientProvider>
  )
}
