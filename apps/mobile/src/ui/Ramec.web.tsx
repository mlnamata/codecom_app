import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { useTema } from '../tema'

export interface RamecProps {
  children: React.ReactNode
}

/**
 * Webová varianta rámu. Na širokém okně kreslí obrys telefonu uprostřed
 * a na úzkém zabere celou šířku. Obrys je jemný stín, ne tvrdá hrana.
 */
const ADRESA_PISMA =
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'

/** Jednou vloží do hlavičky stránky písmo Plus Jakarta Sans (umí češtinu). */
function nactiPismo() {
  if (typeof document === 'undefined') return
  if (document.getElementById('codekom-pismo')) return
  const odkaz = document.createElement('link')
  odkaz.id = 'codekom-pismo'
  odkaz.rel = 'stylesheet'
  odkaz.href = ADRESA_PISMA
  document.head.appendChild(odkaz)
}

export function Ramec({ children }: RamecProps) {
  useEffect(nactiPismo, [])

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
      <View style={[styles.telefon, { backgroundColor: barvy.bg }]}>{children}</View>
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
    backgroundColor: '#E6EBE2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  telefon: {
    width: '100%',
    maxWidth: 412,
    height: '100%',
    maxHeight: 892,
    borderRadius: 36,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 24px 60px rgba(30, 42, 34, 0.18), 0 2px 6px rgba(30, 42, 34, 0.08)',
  },
})
