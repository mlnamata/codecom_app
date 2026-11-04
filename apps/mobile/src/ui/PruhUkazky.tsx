import React, { useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '../tema'
import { useZdroj } from '../zdroj'

export interface PruhUkazkyProps {
  onZmenitRoli?: () => void
}

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

  return (
    <View
      style={[
        styles.pruh,
        {
          backgroundColor: barvy.surface,
          borderBottomColor: barvy.line,
        },
      ]}
      accessibilityRole="toolbar"
      accessibilityLabel="Ovládání ukázky CodeKom"
    >
      <View style={styles.hlavicka}>
        <View style={styles.vlevo}>
          <Text
            style={[
              styles.nazevUkazky,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Ukázka CodeKom
          </Text>
          <Text
            style={[
              styles.stavPripojeni,
              {
                color: jeOffline ? '#CA8504' : '#007A3D',
                fontFamily: pismo.rodina,
              },
            ]}
          >
            {jeOffline ? 'Offline ukázka' : 'Připojeno k ukázkovému webu'}
          </Text>
        </View>

        <View style={styles.tlacitka}>
          {jeOffline && (
            <Pressable
              role="button"
              accessibilityRole="button"
              accessibilityLabel="Zkusit znovu připojit"
              onPress={() => void zkusitZnovuPripojit()}
              disabled={overujeSe}
              style={({ pressed }) => [
                styles.malaVolba,
                { borderColor: barvy.line, opacity: pressed || overujeSe ? 0.6 : 1 },
              ]}
            >
              <Text style={[styles.textVolby, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                {overujeSe ? 'Ověřuji...' : 'Znovu připojit'}
              </Text>
            </Pressable>
          )}

          <Pressable
            role="button"
            accessibilityRole="button"
            accessibilityLabel="Obnovit ukázku"
            onPress={() => void handleObnovit()}
            disabled={obnovuji}
            style={({ pressed }) => [
              styles.malaVolba,
              { borderColor: barvy.line, opacity: pressed || obnovuji ? 0.6 : 1 },
            ]}
          >
            <Text style={[styles.textVolby, { color: barvy.ink, fontFamily: pismo.rodina }]}>
              {obnovuji ? 'Obnovuji...' : 'Obnovit'}
            </Text>
          </Pressable>

          <Pressable
            role="button"
            accessibilityRole="button"
            accessibilityLabel="Změnit roli"
            onPress={handleZmenitRoli}
            style={({ pressed }) => [
              styles.malaVolba,
              { borderColor: barvy.line, opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Text style={[styles.textVolby, { color: barvy.ink, fontFamily: pismo.rodina }]}>
              Změnit roli
            </Text>
          </Pressable>
        </View>
      </View>

      {jeOffline && (
        <Text style={[styles.offlinePoznamka, { color: barvy.muted, fontFamily: pismo.rodina }]}>
          {bylPrepadNaVestavene
            ? 'Připojení k webu selhalo. Aplikace přešla na vestavěná data, změny zůstanou jen zde.'
            : 'Ukázkový web neběží, aplikace používá vestavěná data. Změny zůstanou jen v tomto prohlížeči.'}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  pruh: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  hlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  vlevo: {
    flexDirection: 'column',
  },
  nazevUkazky: {
    fontSize: 13,
  },
  stavPripojeni: {
    fontSize: 12,
    fontWeight: '500',
  },
  tlacitka: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  malaVolba: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textVolby: {
    fontSize: 12,
  },
  offlinePoznamka: {
    fontSize: 11,
    marginTop: 4,
  },
})
