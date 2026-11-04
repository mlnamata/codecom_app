import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Modal } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { useRelace } from '@/stav/relace'
import { Karta, Tlacitko, Pole } from '@/ui'

interface Naradi {
  id: string
  nazev: string
  popis: string
  cena: number
  kauce: number
  dostupne: boolean
  kategorie: string
}

const NABIDKA_NARADI: Naradi[] = [
  {
    id: 'stipacka',
    nazev: 'Benzínová štípačka na dřevo Scheppach HL 1200',
    popis: 'Štípací tlak 12 tun, na polena do délky 107 cm. Provoz na benzín Natural 95.',
    cena: 250,
    kauce: 2000,
    dostupne: true,
    kategorie: 'Zahrada a les',
  },
  {
    id: 'elektrocentrala',
    nazev: 'Elektrocentrála Honda EU22i (2,2 kW)',
    popis: 'Tichý invertorový generátor pro citlivou elektroniku i ruční nářadí.',
    cena: 300,
    kauce: 3000,
    dostupne: true,
    kategorie: 'Stavba a energie',
  },
  {
    id: 'stan-sety',
    nazev: 'Nůžkový párty stan 6×3 m + 2 pivní sety',
    popis: 'Vodotěsný stan na rodinné oslavy včetně dvou stolů a čtyř lavic.',
    cena: 350,
    kauce: 1500,
    dostupne: true,
    kategorie: 'Akce a oslavy',
  },
  {
    id: 'krovinorez',
    nazev: 'Motorový křovinořez Stihl FS 240',
    popis: 'Profesionální vyžínač s popruhem a trojcípým nožem i strunovou hlavou.',
    cena: 180,
    kauce: 1000,
    dostupne: false,
    kategorie: 'Zahrada a les',
  },
  {
    id: 'vibromotor',
    nazev: 'Vibrační deska Scheppach HP 1300',
    popis: 'Hutnění zeminy a zámkové dlažby včetně gumové podložky.',
    cena: 250,
    kauce: 2000,
    dostupne: true,
    kategorie: 'Stavba a energie',
  },
]

export default function PujcovnaScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()
  const { relace } = useRelace()

  const [vybraneNaradi, setVybraneNaradi] = useState<Naradi | null>(null)
  const [denOd, setDenOd] = useState('2026-11-20')
  const [pocetDni, setPocetDni] = useState('2')
  const [poznamka, setPoznamka] = useState('')
  const [potvrzeno, setPotvrzeno] = useState<string | null>(null)

  const potvrditRezervaci = () => {
    if (!relace.prihlasen) {
      router.push('/(uvod)/prihlaseni')
      return
    }
    setPotvrzeno(
      `Rezervace vybavení „${vybraneNaradi?.nazev}“ na ${pocetDni} dny od ${denOd} byla úspěšně zaznamenána. Vyzvednutí je možné v obecních dílnách (U Rybníka 3).`,
    )
    setVybraneNaradi(null)
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
        Obecní půjčovna nářadí
      </Text>
      <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
        Sdílené vybavení a profesionální nářadí pro občany Javoří Lhoty s výpůjčkou v obecní dílně.
      </Text>

      {potvrzeno && (
        <Karta style={styles.potvrzeniBox}>
          <Text
            style={[
              styles.potvrzeniNadpis,
              { color: '#166534', fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            Žádost o výpůjčku odeslána
          </Text>
          <Text style={[styles.potvrzeniText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            {potvrzeno}
          </Text>
          <Tlacitko
            nazev="Zavřít potvrzení"
            varianta="ghost"
            onPress={() => setPotvrzeno(null)}
            style={{ marginTop: 8 }}
          />
        </Karta>
      )}

      <View style={styles.seznam}>
        {NABIDKA_NARADI.map((naradi) => (
          <Karta key={naradi.id} style={styles.polozkaKarta}>
            <View style={styles.hlavicka}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.kategorie, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                  {naradi.kategorie}
                </Text>
                <Text
                  style={[
                    styles.naradiNazev,
                    {
                      color: barvy.ink,
                      fontFamily: pismo.rodina,
                      fontWeight: pismo.vahy.polotucne,
                    },
                  ]}
                >
                  {naradi.nazev}
                </Text>
              </View>
              <View
                style={[
                  styles.dostupnostOdznak,
                  {
                    backgroundColor: naradi.dostupne ? '#DCFCE7' : '#FEE2E2',
                    borderColor: naradi.dostupne ? '#22C55E' : '#EF4444',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dostupnostText,
                    { color: naradi.dostupne ? '#166534' : '#991B1B', fontFamily: pismo.rodina },
                  ]}
                >
                  {naradi.dostupne ? 'K dispozici' : 'Vypůjčeno'}
                </Text>
              </View>
            </View>

            <Text style={[styles.naradiPopis, { color: barvy.ink, fontFamily: pismo.rodina }]}>
              {naradi.popis}
            </Text>

            <View style={styles.paticka}>
              <View>
                <Text
                  style={[
                    styles.cena,
                    {
                      color: barvy.primary,
                      fontFamily: pismo.rodina,
                      fontWeight: pismo.vahy.polotucne,
                    },
                  ]}
                >
                  {naradi.cena} Kč / den
                </Text>
                <Text style={[styles.kauce, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                  Vratná kauce: {naradi.kauce} Kč
                </Text>
              </View>

              <Tlacitko
                nazev={naradi.dostupne ? 'Rezervovat' : 'Nedostupné'}
                zakazano={!naradi.dostupne}
                varianta={naradi.dostupne ? 'primary' : 'ghost'}
                onPress={() => setVybraneNaradi(naradi)}
                style={styles.rezervovatTlacitko}
              />
            </View>
          </Karta>
        ))}
      </View>

      {/* Modální okno rezervace */}
      <Modal
        visible={vybraneNaradi !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setVybraneNaradi(null)}
      >
        <View style={styles.modalZatemneni}>
          <View style={[styles.modalObsah, { backgroundColor: barvy.surface, borderColor: barvy.line }]}>
            <Text
              style={[
                styles.modalNadpis,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              Rezervace výpůjčky
            </Text>
            <Text style={[styles.modalPolozka, { color: barvy.ink, fontFamily: pismo.rodina }]}>
              {vybraneNaradi?.nazev} ({vybraneNaradi?.cena} Kč/den, kauce {vybraneNaradi?.kauce} Kč)
            </Text>

            <Pole
              popisek="Datum vyzvednutí"
              value={denOd}
              onChangeText={setDenOd}
              placeholder="YYYY-MM-DD"
            />
            <Pole
              popisek="Počet dní výpůjčky"
              value={pocetDni}
              onChangeText={setPocetDni}
              keyboardType="numeric"
              placeholder="2"
            />
            <Pole
              popisek="Poznámka / účel práce (volitelné)"
              value={poznamka}
              onChangeText={setPoznamka}
              placeholder="Štípání dřeva na zimu"
              volitelne
            />

            <View style={styles.modalTlacitka}>
              <Tlacitko nazev="Odeslat rezervaci" onPress={potvrditRezervaci} />
              <Tlacitko nazev="Zrušit" varianta="ghost" onPress={() => setVybraneNaradi(null)} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Fallback úřadu */}
      <View style={[styles.uradFallback, { backgroundColor: barvy.surface, borderColor: barvy.line }]}>
        <Text
          style={[
            styles.uradNadpis,
            { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
          ]}
        >
          Pravidla půjčovny
        </Text>
        <Text style={[styles.uradText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
          Nářadí se půjčuje občanům s trvalým pobytem v Javoří Lhotě. Výdej a vrácení probíhá po
          předchozí domluvě v obecní dílně (vedle hasičárny).{'\n'}
          Správce půjčovny: Josef Horejš (technik obce), tel.: +420 379 000 114.
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
  titulek: {
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 4,
  },
  podtitul: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  potvrzeniBox: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
  },
  potvrzeniNadpis: {
    fontSize: 16,
    marginBottom: 4,
  },
  potvrzeniText: {
    fontSize: 14,
    lineHeight: 20,
  },
  seznam: {
    gap: 14,
    marginBottom: 20,
  },
  polozkaKarta: {
    padding: 14,
    gap: 8,
  },
  hlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  kategorie: {
    fontSize: 12,
  },
  naradiNazev: {
    fontSize: 16,
    lineHeight: 22,
  },
  dostupnostOdznak: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  dostupnostText: {
    fontSize: 12,
    fontWeight: '600',
  },
  naradiPopis: {
    fontSize: 14,
    lineHeight: 20,
  },
  paticka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  cena: {
    fontSize: 16,
  },
  kauce: {
    fontSize: 12,
  },
  rezervovatTlacitko: {
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
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    gap: 12,
  },
  modalNadpis: {
    fontSize: 18,
  },
  modalPolozka: {
    fontSize: 14,
    marginBottom: 4,
  },
  modalTlacitka: {
    gap: 8,
    marginTop: 8,
  },
  uradFallback: {
    padding: 16,
    borderRadius: 8,
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
