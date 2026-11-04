import React, { useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '../tema'
import { useZdroj } from '../zdroj'

export interface PruhUkazkyProps {
  onZmenitRoli?: () => void
}

/**
 * Tenký pruh nad aplikací, který jasně říká, že jde o ukázku.
 * Stav spojení je jedna věta, ovládání jsou textové odkazy.
 */
export function PruhUkazky({ onZmenitRoli }: PruhUkazkyProps) {
  const router = useRouter()
  const { barvy, pismo } = useTema()
  const { rezim, overujeSe, zkusitZnovuPripojit, obnovitUkazku, bylPrepadNaVestavene } = useZdroj()
  const [obnovuji, setObnovuji] = useState(false)

  const handleObnovit = async () => {
    setObnovuji(true)
    try {
      await obnovitUkazku()
    } finally {
      setObnovuji(false)
    }
  }

  const handleZmenitRoli = () => {
    if (onZmenitRoli) {
      onZmenitRoli()
    } else {
      router.push('/(uvod)/role')
    }
  }

  const jeOffline = rezim === 'vestavene'
  const barvaStavu = jeOffline ? barvy.muted : barvy.primary
  const tecka = jeOffline ? '#B7791F' : barvy.primary

  return (
    <View
      style={[styles.pruh, { backgroundColor: barvy.surface, borderBottomColor: barvy.line }]}
      accessibilityRole="toolbar"
      accessibilityLabel="Ovládání ukázky CodeKom"
    >
      <View style={styles.radek}>
        <View style={styles.vlevo}>
          <View style={[styles.tecka, { backgroundColor: tecka }]} />
          <Text
            style={[styles.stav, { color: barvaStavu, fontFamily: pismo.rodina }]}
            numberOfLines={1}
          >
            {jeOffline ? 'Ukázka · vestavěná data' : 'Ukázka · připojeno'}
          </Text>
        </View>

        <View style={styles.vpravo}>
          {jeOffline && (
            <Pressable
              role="button"
              accessibilityRole="button"
              accessibilityLabel="Zkusit znovu připojit"
              onPress={() => void zkusitZnovuPripojit()}
              disabled={overujeSe}
              hitSlop={8}
              style={({ pressed }) => [styles.odkaz, { opacity: pressed || overujeSe ? 0.6 : 1 }]}
            >
              <Text style={[styles.odkazText, { color: barvy.link, fontFamily: pismo.rodina }]}>
                {overujeSe ? 'Ověřuji…' : 'Znovu připojit'}
              </Text>
            </Pressable>
          )}

          <Pressable
            role="button"
            accessibilityRole="button"
            accessibilityLabel="Obnovit ukázku"
            onPress={() => void handleObnovit()}
            disabled={obnovuji}
            hitSlop={8}
            style={({ pressed }) => [styles.odkaz, { opacity: pressed || obnovuji ? 0.6 : 1 }]}
          >
            <Text style={[styles.odkazText, { color: barvy.link, fontFamily: pismo.rodina }]}>
              {obnovuji ? 'Obnovuji…' : 'Obnovit'}
            </Text>
          </Pressable>

          <Pressable
            role="button"
            accessibilityRole="button"
            accessibilityLabel="Změnit roli"
            onPress={handleZmenitRoli}
            hitSlop={8}
            style={({ pressed }) => [styles.odkaz, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Text style={[styles.odkazText, { color: barvy.link, fontFamily: pismo.rodina }]}>
              Změnit roli
            </Text>
          </Pressable>
        </View>
      </View>

      {jeOffline && (
        <Text style={[styles.poznamka, { color: barvy.muted, fontFamily: pismo.rodina }]}>
          {bylPrepadNaVestavene
            ? 'Připojení k webu selhalo, změny zůstanou jen v tomto prohlížeči.'
            : 'Ukázkový web neběží, změny zůstanou jen v tomto prohlížeči.'}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  pruh: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  radek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  vlevo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  tecka: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stav: {
    fontSize: 13,
    fontWeight: '600',
  },
  vpravo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  odkaz: {
    minHeight: 32,
    justifyContent: 'center',
  },
  odkazText: {
    fontSize: 13,
    fontWeight: '600',
  },
  poznamka: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
})
