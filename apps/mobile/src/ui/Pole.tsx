import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import { useTema } from '../tema'

export interface PoleProps extends Omit<TextInputProps, 'style'> {
  popisek: string
  chyba?: string
  napoveda?: string
  volitelne?: boolean
  kontejnerStyle?: StyleProp<ViewStyle>
}

export function Pole({
  popisek,
  chyba,
  napoveda,
  volitelne = false,
  kontejnerStyle,
  ...textInputProps
}: PoleProps) {
  const { barvy, pismo } = useTema()
  const [zaostreno, setZaostreno] = useState(false)

  return (
    <View style={[styles.kontejner, kontejnerStyle]}>
      <View style={styles.radekPopisku}>
        <Text
          style={[
            styles.popisek,
            {
              color: barvy.ink,
              fontFamily: pismo.rodina,
              fontWeight: pismo.vahy.polotucne,
            },
          ]}
        >
          {popisek}
        </Text>
        {volitelne && (
          <Text style={[styles.volitelne, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            (volitelné)
          </Text>
        )}
      </View>

      {napoveda && (
        <Text style={[styles.napoveda, { color: barvy.muted, fontFamily: pismo.rodina }]}>
          {napoveda}
        </Text>
      )}

      <TextInput
        {...textInputProps}
        onFocus={(e) => {
          setZaostreno(true)
          textInputProps.onFocus?.(e)
        }}
        onBlur={(e) => {
          setZaostreno(false)
          textInputProps.onBlur?.(e)
        }}
        accessibilityLabel={popisek}
        aria-invalid={Boolean(chyba)}
        style={[
          styles.vstup,
          {
            backgroundColor: barvy.surface,
            borderColor: chyba ? '#B00A0D' : barvy.line,
            color: barvy.ink,
            fontFamily: pismo.rodina,
            fontSize: pismo.velikosti.zaklad,
          },
          zaostreno && {
            outlineWidth: 2,
            outlineStyle: 'solid',
            outlineColor: chyba ? '#B00A0D' : barvy.primary,
            outlineOffset: 2,
            borderColor: chyba ? '#B00A0D' : barvy.primary,
          },
        ]}
      />

      {chyba && (
        <Text
          role="alert"
          accessibilityRole="alert"
          style={[styles.chyba, { color: '#B00A0D', fontFamily: pismo.rodina }]}
        >
          {chyba}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  kontejner: {
    marginVertical: 8,
    width: '100%',
  },
  radekPopisku: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  popisek: {
    fontSize: 15,
  },
  volitelne: {
    fontSize: 13,
  },
  napoveda: {
    fontSize: 13,
    marginBottom: 6,
  },
  vstup: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '100%',
  },
  chyba: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },
})
