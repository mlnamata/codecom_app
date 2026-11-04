import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { UROVNE } from '@codekom/tokeny'
import { useOznameni } from '../stav/oznameni'
import { useTema } from '../tema'

export function PruhOznameni() {
  const { aktualniOznameni, zavritOznameni } = useOznameni()
  const { pismo } = useTema()

  if (!aktualniOznameni) return null

  const info = UROVNE[aktualniOznameni.uroven] ?? UROVNE.info
  const jeKrize = aktualniOznameni.uroven === 'emergency'

  return (
    <View
      role={jeKrize ? 'alert' : 'status'}
      accessibilityRole={jeKrize ? 'alert' : 'none'}
      accessibilityLiveRegion={jeKrize ? 'assertive' : 'polite'}
      style={[
        styles.pruh,
        {
          backgroundColor: info.bg,
          borderColor: info.edge,
        },
      ]}
    >
      <View style={styles.obsah}>
        <Text
          style={[
            styles.text,
            {
              color: info.ink,
              fontFamily: pismo.rodina,
              fontWeight: pismo.vahy.stredni,
            },
          ]}
        >
          {aktualniOznameni.text}
        </Text>
      </View>

      <Pressable
        role="button"
        accessibilityRole="button"
        accessibilityLabel="Zavřít oznámení"
        onPress={zavritOznameni}
        style={({ pressed }) => [
          styles.zavritTlacitko,
          { opacity: pressed ? 0.6 : 1 },
        ]}
      >
        <Text style={[styles.krizek, { color: info.ink, fontFamily: pismo.rodina }]}>✕</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  pruh: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
  },
  obsah: {
    flex: 1,
    paddingRight: 8,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
  },
  zavritTlacitko: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -8,
  },
  krizek: {
    fontSize: 16,
    fontWeight: 'bold',
  },
})
