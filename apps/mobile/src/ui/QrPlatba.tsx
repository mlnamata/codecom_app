import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { sestavSpd, type ParametryPlatby } from '@codekom/typy/pravidla'
import { useTema } from '../tema'

export interface QrPlatbaProps extends ParametryPlatby {
  nazevPoplatku?: string
}

export function QrPlatba(props: QrPlatbaProps) {
  const { barvy, pismo } = useTema()
  const spd = sestavSpd(props)

  return (
    <View
      style={[
        styles.kontejner,
        {
          backgroundColor: barvy.surface,
          borderColor: barvy.line,
        },
      ]}
      role="region"
      aria-label="Informace k platbě a QR platba"
    >
      <View style={styles.udaje}>
        <View style={styles.radek}>
          <Text style={[styles.stitek, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Částka:
          </Text>
          <Text
            style={[
              styles.hodnotaCena,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            {props.castka} Kč
          </Text>
        </View>

        <View style={styles.radek}>
          <Text style={[styles.stitek, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Číslo účtu:
          </Text>
          <Text style={[styles.hodnota, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            {props.iban}
          </Text>
        </View>

        {props.variabilniSymbol && (
          <View style={styles.radek}>
            <Text style={[styles.stitek, { color: barvy.muted, fontFamily: pismo.rodina }]}>
              Variabilní symbol:
            </Text>
            <Text style={[styles.hodnota, { color: barvy.ink, fontFamily: pismo.rodina }]}>
              {props.variabilniSymbol}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.qrSekce}>
        {spd ? (
          <View
            style={[styles.qrRamec, { borderColor: barvy.line }]}
            accessibilityLabel="QR platba. Ukázka, neplaťte."
          >
            <View style={styles.qrPlaceholder}>
              <Text style={{ fontSize: 11, textAlign: 'center' }}>[QR KÓD]</Text>
            </View>
          </View>
        ) : (
          <View style={[styles.ukazkovyUcetBox, { backgroundColor: barvy.bg, borderColor: barvy.line }]}>
            <Text
              style={[
                styles.ukazkovyUcetText,
                { color: barvy.muted, fontFamily: pismo.rodina },
              ]}
            >
              Ukázkový účet, QR platba se v ukázce nevytváří.
            </Text>
          </View>
        )}

        <View
          style={[styles.varovaniStitek, { backgroundColor: '#FEF6D8', borderColor: '#CA8504' }]}
          role="note"
          aria-label="Upozornění"
        >
          <Text
            style={[
              styles.varovaniText,
              {
                color: '#2A1B00',
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Ukázka, neplaťte
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  kontejner: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 12,
  },
  udaje: {
    marginBottom: 16,
    gap: 8,
  },
  radek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  stitek: {
    fontSize: 14,
  },
  hodnota: {
    fontSize: 14,
  },
  hodnotaCena: {
    fontSize: 18,
  },
  qrSekce: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  qrRamec: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  qrPlaceholder: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  ukazkovyUcetBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
  },
  ukazkovyUcetText: {
    fontSize: 13,
    textAlign: 'center',
  },
  varovaniStitek: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 4,
  },
  varovaniText: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
})
