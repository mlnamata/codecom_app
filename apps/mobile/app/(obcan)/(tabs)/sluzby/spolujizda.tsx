import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Modal } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { useRelace } from '@/stav/relace'
import { Karta, Tlacitko, Pole } from '@/ui'

interface Jizda {
  id: string
  odkud: string
  kam: string
  casOdjezdu: string
  casNavratu: string
  dny: string
  volnaMista: number
  ridic: string
  auto: string
  prispevek: string
}

const VYCHOZI_JIZDY: Jizda[] = [
  {
    id: 'jizda-1',
    odkud: 'Javoří Lhota (Náves)',
    kam: 'Klatovy (průmyslová zóna / nemocnice)',
    casOdjezdu: '06:45',
    casNavratu: '15:45',
    dny: 'Po–Pá',
    volnaMista: 2,
    ridic: 'Pavel Černý',
    auto: 'Škoda Octavia Combi (modrá)',
    prispevek: '35 Kč / jízda',
  },
  {
    id: 'jizda-2',
    odkud: 'Javoří Lhota (Podjavoří)',
    kam: 'Plzeň (Bory / ZČU)',
    casOdjezdu: '07:15',
    casNavratu: '16:30',
    dny: 'Út, Čt',
    volnaMista: 3,
    ridic: 'Kateřina Veselá',
    auto: 'Volkswagen Golf',
    prispevek: '60 Kč / jízda',
  },
  {
    id: 'jizda-3',
    odkud: 'Javoří Lhota',
    kam: 'Sušice (náměstí a poliklinika)',
    casOdjezdu: '08:00',
    casNavratu: '12:30',
    dny: 'Středa',
    volnaMista: 1,
    ridic: 'Milan Svoboda',
    auto: 'Dacia Duster',
    prispevek: '40 Kč / jízda',
  },
]

export default function SpolujizdaScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()
  const { relace } = useRelace()

  const [jizdy, setJizdy] = useState<Jizda[]>(VYCHOZI_JIZDY)
  const [modalNovaJizda, setModalNovaJizda] = useState(false)
  const [pripojeno, setPripojeno] = useState<string | null>(null)

  // Formulář
  const [kam, setKam] = useState('')
  const [casOdjezdu, setCasOdjezdu] = useState('07:00')
  const [dny, setDny] = useState('Po–Pá')
  const [volnaMista, setVolnaMista] = useState('2')
  const [auto, setAuto] = useState('')
  const [prispevek, setPrispevek] = useState('40 Kč')

  const pridatJizdu = () => {
    if (!relace.prihlasen) {
      router.push('/(uvod)/prihlaseni')
      return
    }
    if (!kam.trim() || !auto.trim()) return

    const nova: Jizda = {
      id: `jizda-${Date.now()}`,
      odkud: 'Javoří Lhota',
      kam: kam.trim(),
      casOdjezdu: casOdjezdu.trim(),
      casNavratu: 'dle domluvy',
      dny: dny.trim(),
      volnaMista: parseInt(volnaMista, 10) || 2,
      ridic: 'Jan Novák',
      auto: auto.trim(),
      prispevek: prispevek.trim(),
    }
    setJizdy([nova, ...jizdy])
    setModalNovaJizda(false)
    setKam('')
    setAuto('')
  }

  const pripojitSe = (jizda: Jizda) => {
    if (!relace.prihlasen) {
      router.push('/(uvod)/prihlaseni')
      return
    }
    setPripojeno(
      `Spojení na řidiče (${jizda.ridic}, auto ${jizda.auto}): Zpráva s vaší žádostí o spolujízdu do ${jizda.kam} byla odeslána.`,
    )
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.kontejner, { backgroundColor: barvy.bg }]}
      keyboardShouldPersistTaps="handled"
    >
      <Tlacitko
        nazev="← Zpět na služby"
        varianta="ghost"
        onPress={() => router.back()}
        style={styles.zpetTlacitko}
      />

      <View style={styles.hlavicka}>
        <View style={{ flex: 1 }}>
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
            Sousedská spolujízda
          </Text>
          <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Sdílení cest do práce a do škol mezi obyvateli obce. Šetřete náklady a životní prostředí.
          </Text>
        </View>
        <Tlacitko
          nazev="+ Nabídnout jízdu"
          onPress={() => setModalNovaJizda(true)}
          style={styles.nabidnoutTlacitko}
        />
      </View>

      {pripojeno && (
        <Karta style={styles.pripojenoBox}>
          <Text
            style={[
              styles.pripojenoNadpis,
              { color: '#166534', fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            Žádost o spolujízdu odeslána
          </Text>
          <Text style={[styles.pripojenoText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            {pripojeno}
          </Text>
          <Tlacitko
            nazev="Zavřít"
            varianta="ghost"
            onPress={() => setPripojeno(null)}
            style={{ marginTop: 6 }}
          />
        </Karta>
      )}

      <View style={styles.seznam}>
        {jizdy.map((jizda) => (
          <Karta key={jizda.id} style={styles.jizdaKarta}>
            <View style={styles.jizdaHlavicka}>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.trasa,
                    {
                      color: barvy.ink,
                      fontFamily: pismo.rodina,
                      fontWeight: pismo.vahy.polotucne,
                    },
                  ]}
                >
                  {jizda.odkud} → {jizda.kam}
                </Text>
                <Text style={[styles.casDny, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                  {jizda.dny} • Odjezd v {jizda.casOdjezdu} (návrat cca {jizda.casNavratu})
                </Text>
              </View>
              <View
                style={[
                  styles.mistaOdznak,
                  {
                    backgroundColor: jizda.volnaMista > 0 ? '#DCFCE7' : '#FEE2E2',
                    borderColor: jizda.volnaMista > 0 ? '#22C55E' : '#EF4444',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.mistaText,
                    {
                      color: jizda.volnaMista > 0 ? '#166534' : '#991B1B',
                      fontFamily: pismo.rodina,
                    },
                  ]}
                >
                  {jizda.volnaMista} {jizda.volnaMista === 1 ? 'místo' : 'místa'}
                </Text>
              </View>
            </View>

            <View style={styles.ridicInfo}>
              <Text style={[styles.ridicText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                Řidič: <Text style={{ fontWeight: '600' }}>{jizda.ridic}</Text> • Vůz: {jizda.auto}
              </Text>
              <Text style={[styles.prispevekText, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                Příspěvek na benzín: {jizda.prispevek}
              </Text>
            </View>

            <Tlacitko
              nazev="Chci jet také"
              varianta="secondary"
              onPress={() => pripojitSe(jizda)}
              style={styles.chciJetTlacitko}
            />
          </Karta>
        ))}
      </View>

      {/* Modální okno pro nabídku jízdy */}
      <Modal
        visible={modalNovaJizda}
        transparent
        animationType="fade"
        onRequestClose={() => setModalNovaJizda(false)}
      >
        <View style={styles.modalZatemneni}>
          <View style={[styles.modalObsah, { backgroundColor: barvy.surface, borderColor: barvy.line }]}>
            <Text
              style={[
                styles.modalNadpis,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              Nabídnout novou spolujízdu
            </Text>

            <Pole
              popisek="Cíl cesty (kam jezdíte)"
              value={kam}
              onChangeText={setKam}
              placeholder="Např. Klatovy centrum nebo Plzeň Bory"
            />
            <Pole
              popisek="Čas odjezdu z Javoří Lhoty"
              value={casOdjezdu}
              onChangeText={setCasOdjezdu}
              placeholder="06:45"
            />
            <Pole
              popisek="Dny v týdnu"
              value={dny}
              onChangeText={setDny}
              placeholder="Po–Pá nebo Út, Čt"
            />
            <Pole
              popisek="Počet volných míst"
              value={volnaMista}
              onChangeText={setVolnaMista}
              keyboardType="numeric"
              placeholder="2"
            />
            <Pole
              popisek="Váš vůz (značka a model)"
              value={auto}
              onChangeText={setAuto}
              placeholder="Škoda Fabia"
            />
            <Pole
              popisek="Doporučený příspěvek na cestu"
              value={prispevek}
              onChangeText={setPrispevek}
              placeholder="30 Kč / cesta"
            />

            <View style={styles.modalTlacitka}>
              <Tlacitko nazev="Uložit nabídku" onPress={pridatJizdu} />
              <Tlacitko nazev="Zrušit" varianta="ghost" onPress={() => setModalNovaJizda(false)} />
            </View>
          </View>
        </View>
      </Modal>

      <View style={[styles.uradFallback, { backgroundColor: barvy.surface, borderColor: barvy.line }]}>
        <Text
          style={[
            styles.uradNadpis,
            { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
          ]}
        >
          Bezpečnost sousedské spolujízdy
        </Text>
        <Text style={[styles.uradText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
          Nástěnka je ověřena pro obyvatele obce Javoří Lhota. Doporučujeme vždy dodržovat
          domluvené časy odjezdu a vzájemnou ohleduplnost.
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  kontejner: {
    padding: 16,
    paddingBottom: 40,
  },
  zpetTlacitko: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    minHeight: 44,
  },
  hlavicka: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  titulek: {
    fontSize: 30,
    letterSpacing: -0.6,
    lineHeight: 36,
    marginBottom: 4,
  },
  podtitul: {
    fontSize: 14,
    lineHeight: 20,
  },
  nabidnoutTlacitko: {
    minHeight: 44,
  },
  pripojenoBox: {
    padding: 14,
    marginBottom: 16,
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
  },
  pripojenoNadpis: {
    fontSize: 15,
    marginBottom: 2,
  },
  pripojenoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  seznam: {
    gap: 14,
    marginBottom: 20,
  },
  jizdaKarta: {
    padding: 14,
    gap: 10,
  },
  jizdaHlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  trasa: {
    fontSize: 16,
    lineHeight: 22,
  },
  casDny: {
    fontSize: 13,
    marginTop: 2,
  },
  mistaOdznak: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  mistaText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ridicInfo: {
    gap: 3,
    paddingVertical: 2,
  },
  ridicText: {
    fontSize: 14,
  },
  prispevekText: {
    fontSize: 13,
  },
  chciJetTlacitko: {
    minHeight: 44,
  },
  modalZatemneni: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalObsah: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 10,
  },
  modalNadpis: {
    fontSize: 18,
    marginBottom: 4,
  },
  modalTlacitka: {
    gap: 8,
    marginTop: 8,
  },
  uradFallback: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  uradNadpis: {
    fontSize: 15,
  },
  uradText: {
    fontSize: 14,
    lineHeight: 22,
  },
})
