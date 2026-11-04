import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '../../src/tema'
import { useRelace } from '../../src/stav/relace'
import { Karta, Logo } from '../../src/ui'
import { Ikona, type NazevIkony } from '../../src/ui/Ikony'

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
        <View style={styles.logo}>
          <Logo velikost={64} />
          <Text style={[styles.znacka, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            Code<Text style={{ color: barvy.primary }}>Kom</Text>
          </Text>
        </View>
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
          <View style={styles.roleRadek}>
            <View style={[styles.roleIkona, { backgroundColor: '#E7F5EE' }]}>
              <Ikona nazev={'lide' satisfies NazevIkony} barva="#0B7A4B" velikost={26} />
            </View>
            <View style={styles.roleText}>
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
            </View>
            <Ikona nazev="sipka" barva={barvy.muted} velikost={20} />
          </View>
        </Karta>

        <Karta
          onPress={() => void vyberRoli('urad')}
          popisekProCtecku="Vstoupit jako Úřad. Správa hlášení, vydávání krizových oznámení a přehled budov."
          style={styles.kartaRole}
        >
          <View style={styles.roleRadek}>
            <View style={[styles.roleIkona, { backgroundColor: '#E8EFFE' }]}>
              <Ikona nazev={'budovy' satisfies NazevIkony} barva="#1D4ED8" velikost={26} />
            </View>
            <View style={styles.roleText}>
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
            </View>
            <Ikona nazev="sipka" barva={barvy.muted} velikost={20} />
          </View>
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
              <Text
                style={[styles.vysvetlivkaText, { color: barvy.ink, fontFamily: pismo.rodina }]}
              >
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
    fontSize: 30,
    letterSpacing: -0.6,
    lineHeight: 36,
    marginBottom: 8,
    textAlign: 'center',
  },
  podtitul: {
    fontSize: 15,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  logo: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
  },
  znacka: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  kartaRole: {
    marginVertical: 8,
    padding: 18,
  },
  roleRadek: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  roleIkona: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleText: {
    flex: 1,
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
    borderRadius: 14,
  },
  vysvetlivkaText: {
    fontSize: 13,
    lineHeight: 18,
  },
})
