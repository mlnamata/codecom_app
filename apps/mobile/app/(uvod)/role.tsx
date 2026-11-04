import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '../../src/tema'
import { useRelace } from '../../src/stav/relace'
import { Karta } from '../../src/ui'

export default function RoleScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()
  const { nastavRoli } = useRelace()
  const [coJeUkazkaOtevreno, setCoJeUkazkaOtevreno] = useState(false)

  const vyberRoli = async (role: 'obcan' | 'urad') => {
    await nastavRoli(role)
    router.push('/(uvod)/obec')
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.kontejner, { backgroundColor: barvy.bg }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.obsah}>
        <Text
          role="heading"
          aria-level={1}
          accessibilityRole="header"
          style={[
            styles.titulek,
            {
              color: barvy.ink,
              fontFamily: pismo.rodina,
              fontWeight: pismo.vahy.polotucne,
            },
          ]}
        >
          Zvolte roli pro ukázku
        </Text>
        <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
          Aplikace CodeKom nabízí pohled z pohledu občana i vedení úřadu obce.
        </Text>

        <Karta
          onPress={() => void vyberRoli('obcan')}
          popisekProCtecku="Vstoupit jako Občan. Prohlížení zpráv, úřední desky, hlášení závad a rezervace."
          style={styles.kartaRole}
        >
          <Text
            style={[
              styles.nazevRole,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Občan
          </Text>
          <Text style={[styles.popisRole, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Přehled obce, aktivní krizová hlášení, úřední deska, hlášení závad se sledováním a
            místní poplatky s QR platbou.
          </Text>
        </Karta>

        <Karta
          onPress={() => void vyberRoli('urad')}
          popisekProCtecku="Vstoupit jako Úřad. Správa hlášení, vydávání krizových oznámení a přehled budov."
          style={styles.kartaRole}
        >
          <Text
            style={[
              styles.nazevRole,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Úřad
          </Text>
          <Text style={[styles.popisRole, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Přehled úřadu, vyřizování závad s veřejnou odpovědí, vydání krizového hlášení nebo
            rozhlasu a kontrola obecních budov.
          </Text>
        </Karta>

        <View style={styles.vysvetlivkaKontejner}>
          <Pressable
            role="button"
            accessibilityRole="button"
            accessibilityLabel="Co je to ukázka"
            accessibilityState={{ expanded: coJeUkazkaOtevreno }}
            onPress={() => setCoJeUkazkaOtevreno(!coJeUkazkaOtevreno)}
            style={styles.odkazTlacitko}
          >
            <Text
              style={[
                styles.odkazText,
                {
                  color: barvy.link,
                  fontFamily: pismo.rodina,
                  fontWeight: pismo.vahy.stredni,
                },
              ]}
            >
              {coJeUkazkaOtevreno ? '▾ Skrýt podrobnosti o ukázce' : '▸ Co je to ukázka?'}
            </Text>
          </Pressable>

          {coJeUkazkaOtevreno && (
            <View
              style={[
                styles.vysvetlivkaObsah,
                {
                  backgroundColor: barvy.surface,
                  borderColor: barvy.line,
                },
              ]}
            >
              <Text style={[styles.vysvetlivkaText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                Tato aplikace je funkční ukázka systému CodeKom. Všechna data v aplikaci jsou
                fiktivní (obec Javoří Lhota). Žádné e-maily ani SMS se neodesílají a žádné platby se
                neprovádějí.
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  kontejner: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  obsah: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  titulek: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  podtitul: {
    fontSize: 15,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  kartaRole: {
    marginVertical: 8,
    padding: 18,
  },
  nazevRole: {
    fontSize: 18,
    marginBottom: 6,
  },
  popisRole: {
    fontSize: 14,
    lineHeight: 19,
  },
  vysvetlivkaKontejner: {
    marginTop: 24,
  },
  odkazTlacitko: {
    paddingVertical: 8,
    alignSelf: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  odkazText: {
    fontSize: 14,
  },
  vysvetlivkaObsah: {
    marginTop: 8,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  vysvetlivkaText: {
    fontSize: 13,
    lineHeight: 18,
  },
})
