import React from 'react'
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native'
import { useTema } from '../tema'

export type VariantaTlacitka = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'

export interface TlacitkoProps {
  nazev: string
  onPress?: () => void
  varianta?: VariantaTlacitka
  zakazano?: boolean
  nacitani?: boolean
  popisekProCtecku?: string
  napovedaProCtecku?: string
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  ikonaPred?: React.ReactNode
  ikonaZa?: React.ReactNode
}

export function Tlacitko({
  nazev,
  onPress,
  varianta = 'primary',
  zakazano = false,
  nacitani = false,
  popisekProCtecku,
  napovedaProCtecku,
  style,
  textStyle,
  ikonaPred,
  ikonaZa,
}: TlacitkoProps) {
  const tema = useTema()
  const { barvy, pismo } = tema

  const jeNeaktivni = zakazano || nacitani

  const ziskejBarvyPodleVarianty = () => {
    switch (varianta) {
      case 'primary':
        return {
          bg: barvy.primary,
          text: barvy.onPrimary,
          border: 'transparent',
        }
      case 'secondary':
        return {
          bg: barvy.surface,
          text: barvy.ink,
          border: barvy.line,
        }
      case 'outline':
        return {
          bg: 'transparent',
          text: barvy.ink,
          border: barvy.line,
        }
      case 'ghost':
        return {
          bg: 'transparent',
          text: barvy.link,
          border: 'transparent',
        }
      case 'danger':
        return {
          bg: '#B00A0D',
          text: '#FFFFFF',
          border: 'transparent',
        }
    }
  }

  const barvyVarianty = ziskejBarvyPodleVarianty()
  const [zaostreno, setZaostreno] = React.useState(false)

  return (
    <Pressable
      role="button"
      accessibilityRole="button"
      accessibilityLabel={popisekProCtecku || nazev}
      accessibilityHint={napovedaProCtecku}
      accessibilityState={{
        disabled: jeNeaktivni,
        busy: nacitani,
      }}
      aria-disabled={jeNeaktivni}
      aria-busy={nacitani}
      disabled={jeNeaktivni}
      onPress={onPress}
      onFocus={() => setZaostreno(true)}
      onBlur={() => setZaostreno(false)}
      style={({ pressed }) => [
        styles.tlacitko,
        {
          backgroundColor: barvyVarianty.bg,
          borderColor: barvyVarianty.border,
          borderWidth: barvyVarianty.border !== 'transparent' ? 1 : 0,
          opacity: jeNeaktivni ? 0.5 : pressed ? 0.8 : 1,
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
      {nacitani ? (
        <ActivityIndicator
          size="small"
          color={barvyVarianty.text}
          accessibilityLabel="Načítání"
        />
      ) : (
        <React.Fragment>
          {ikonaPred}
          <Text
            style={[
              styles.text,
              {
                color: barvyVarianty.text,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
                fontSize: pismo.velikosti.zaklad,
              },
              ikonaPred ? { marginLeft: 8 } : null,
              ikonaZa ? { marginRight: 8 } : null,
              textStyle,
            ]}
          >
            {nazev}
          </Text>
          {ikonaZa}
        </React.Fragment>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  tlacitko: {
    minHeight: 44,
    minWidth: 44,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  text: {
    textAlign: 'center',
  },
})
