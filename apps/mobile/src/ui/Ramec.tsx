import React from 'react'
import { View, StyleSheet } from 'react-native'

export interface RamecProps {
  children: React.ReactNode
}

/**
 * Nativní varianta rámu: průchozí kontejner přes celou obrazovku.
 */
export function Ramec({ children }: RamecProps) {
  return <View style={styles.kontejner}>{children}</View>
}

const styles = StyleSheet.create({
  kontejner: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
})
