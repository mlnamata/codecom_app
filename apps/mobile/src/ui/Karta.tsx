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
            borderColor: vybrano ? barvy.primary : barvy.line,
            borderWidth: vybrano ? 2 : 1,
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
          borderColor: barvy.line,
          borderWidth: 1,
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
    borderRadius: 8,
    padding: 16,
    marginVertical: 6,
    width: '100%',
  },
})
