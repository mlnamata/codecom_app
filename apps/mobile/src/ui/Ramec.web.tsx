import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { useTema } from '../tema'

export interface RamecProps {
  children: React.ReactNode
}

export function Ramec({ children }: RamecProps) {
  const { barvy } = useTema()
  const [sirkaOkna, setSirkaOkna] = useState(() => Dimensions.get('window').width)

  useEffect(() => {
    const handler = ({ window }: { window: { width: number; height: number } }) => {
      setSirkaOkna(window.width)
    }
    const sub = Dimensions.addEventListener('change', handler)
    return () => sub.remove()
  }, [])

  const jeDesktop = sirkaOkna > 480

  if (!jeDesktop) {
    return <View style={[styles.plnaSirka, { backgroundColor: barvy.bg }]}>{children}</View>
  }

  return (
    <View style={styles.webPozadi}>
      <View
        style={[
          styles.telefonRamec,
          {
            backgroundColor: barvy.bg,
            borderColor: barvy.line,
          },
        ]}
      >
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  plnaSirka: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  webPozadi: {
    flex: 1,
    width: '100%',
    height: '100%',
    minHeight: '100vh' as unknown as number,
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  telefonRamec: {
    width: '100%',
    maxWidth: 430,
    height: '100%',
    maxHeight: 932,
    borderWidth: 1,
    borderRadius: 24,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
})
