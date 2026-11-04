import React from 'react'
import {
  Pressable,
  View,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import { useTema } from '../tema'

export interface KartaProps {
  children: React.ReactNode
  onPress?: () => void
  vybrano?: boolean
  popisekProCtecku?: string
  style?: StyleProp<ViewStyle>
}

export function Karta({
  children,
  onPress,
  vybrano = false,
  popisekProCtecku,
  style,
}: KartaProps) {
  const { barvy } = useTema()
  const [zaostreno, setZaostreno] = React.useState(false)

  if (onPress) {
    return (
      <Pressable
        role="button"
        accessibilityRole="button"
        accessibilityLabel={popisekProCtecku}
        accessibilityState={{ selected: vybrano }}
        onPress={onPress}
        onFocus={() => setZaostreno(true)}
        onBlur={() => setZaostreno(false)}
        style={({ pressed }) => [
          styles.karta,
          {
            backgroundColor: barvy.surface,
            borderColor: vybrano ? barvy.primary : 'transparent',
            borderWidth: 2,
            opacity: pressed ? 0.8 : 1,
          },
          zaostreno && {
            outlineWidth: 2,
            outlineStyle: 'solid',
            outlineColor: barvy.ink,
            outlineOffset: 2,
          },
          style,
        ]}
      >
        {children}
      </Pressable>
    )
  }

  return (
    <View
      style={[
        styles.karta,
        {
          backgroundColor: barvy.surface,
          borderColor: 'transparent',
          borderWidth: 2,
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  karta: {
    borderRadius: 24,
    padding: 20,
    marginVertical: 6,
    width: '100%',
    // Měkký rozptýlený stín odliší bílou kartu od šedého pozadí.
    shadowColor: '#111311',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
})
