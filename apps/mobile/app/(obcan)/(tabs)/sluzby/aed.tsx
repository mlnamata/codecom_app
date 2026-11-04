import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { Karta, Tlacitko } from '@/ui'

interface AedZarizeni {
  id: string
  nazev: string
  umisteni: string
  dostupnost: string
  budovaOtevrena: boolean
  pristupnostPopis: string
  model: string
  posledniKontrola: string
}

const AED_SEZNAM: AedZarizeni[] = [
  {
    id: 'aed-urad',
    nazev: 'AED 1 – Budova obecního úřadu',
    umisteni: 'Náves 1, vnější vyhřívaný zelený box vlevo od hlavního vchodu',
    dostupnost: 'Přístupno 24/7 (zvenku budovy)',
    budovaOtevrena: true,
    pristupnostPopis: 'Není nutný klíč ani PIN. Po zatažení za páku zazní lokální alarm a schránka se odemkne.',
    model: 'Philips HeartStart FRx s hlasovým naváděním v češtině',
    posledniKontrola: '2026-10-15 (baterie i elektrody v pořádku)',
  },
  {
    id: 'aed-hasicarna',
    nazev: 'AED 2 – Hasičská zbrojnice',
    umisteni: 'U Rybníka 3, na fasádě zbrojnice u výjezdových vrat',
    dostupnost: 'Přístupno 24/7 (zvenku budovy)',
    budovaOtevrena: false,
    pristupnostPopis: 'Vyhřívaný venkovní box napojený na dispečink hasičů. Volně přístupný všem občanům.',
    model: 'Zoll AED Plus s vyhodnocením kvality masáže srdce',
    posledniKontrola: '2026-10-28 (v pořádku)',
  },
]

export default function AedScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()

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
        AED defibrilátory a první pomoc
      </Text>
      <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
        Umístění automatických externích defibrilátorů v Javoří Lhotě a postup záchrany života.
      </Text>

      {/* Tísňové varování */}
      <View
        style={[styles.varovaniBox, { backgroundColor: '#FEE2E2', borderColor: '#EF4444' }]}
        role="alert"
      >
        <Text
          style={[
            styles.varovaniNadpis,
            { color: '#991B1B', fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
          ]}
        >
          Při bezvědomí a zástavě dechu volejte 155!
        </Text>
        <Text style={[styles.varovaniText, { color: '#7F1D1D', fontFamily: pismo.rodina }]}>
          Okamžitě zahajte nepřímou masáž srdce (stlačování středu hrudníku frekvencí 100–120/min).
          Druhý zachránce běží pro nejbližší AED.
        </Text>
      </View>

      {/* Seznam AED */}
      <Text
        style={[
          styles.sekceNadpis,
          {
            color: barvy.ink,
            fontFamily: pismo.rodina,
            fontWeight: pismo.vahy.polotucne,
          },
        ]}
      >
        Dostupná zařízení v obci
      </Text>

      <View style={styles.seznam}>
        {AED_SEZNAM.map((aed) => (
          <Karta key={aed.id} style={styles.aedKarta}>
            <View style={styles.aedHlavicka}>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.aedNazev,
                    {
                      color: barvy.ink,
                      fontFamily: pismo.rodina,
                      fontWeight: pismo.vahy.polotucne,
                    },
                  ]}
                >
                  {aed.nazev}
                </Text>
                <Text style={[styles.aedDostupnost, { color: '#166534', fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne }]}>
                  ● {aed.dostupnost}
                </Text>
              </View>
              <View
                style={[
                  styles.boxOdznak,
                  { backgroundColor: '#DCFCE7', borderColor: '#22C55E' },
                ]}
              >
                <Text style={[styles.boxOdznakText, { color: '#166534', fontFamily: pismo.rodina }]}>
                  Venkovní box
                </Text>
              </View>
            </View>

            <Text style={[styles.umisteniText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
              <Text style={{ fontWeight: '600' }}>Přesné umístění: </Text>
              {aed.umisteni}
            </Text>

            <Text style={[styles.popisText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
              {aed.pristupnostPopis}
            </Text>

            <View style={styles.paticka}>
              <Text style={[styles.technickeInfo, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                Model: {aed.model}{'\n'}
                Poslední revize: {aed.posledniKontrola}
              </Text>
            </View>
          </Karta>
        ))}
      </View>

      {/* Postup použití AED */}
      <Text
        style={[
          styles.sekceNadpis,
          {
            color: barvy.ink,
            fontFamily: pismo.rodina,
            fontWeight: pismo.vahy.polotucne,
          },
        ]}
      >
        Jak použít AED přístroj (Zvládne každý)
      </Text>

      <Karta style={styles.navodKarta}>
        <View style={styles.krokRadek}>
          <Text
            style={[
              styles.krokCislo,
              { color: barvy.primary, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            1.
          </Text>
          <Text style={[styles.krokText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            Otevřete zelený box u vchodu a vyjměte brašnu s přístrojem.
          </Text>
        </View>

        <View style={styles.krokRadek}>
          <Text
            style={[
              styles.krokCislo,
              { color: barvy.primary, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            2.
          </Text>
          <Text style={[styles.krokText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            Stiskněte zelené tlačítko ZAPNOUT (nebo otevřete víko). Přístroj začne mluvit česky.
          </Text>
        </View>

        <View style={styles.krokRadek}>
          <Text
            style={[
              styles.krokCislo,
              { color: barvy.primary, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            3.
          </Text>
          <Text style={[styles.krokText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            Nalepte elektrody na holý hrudník zraněného přesně podle obrázků na obalu elektrod.
          </Text>
        </View>

        <View style={styles.krokRadek}>
          <Text
            style={[
              styles.krokCislo,
              { color: barvy.primary, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            4.
          </Text>
          <Text style={[styles.krokText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            AED sám analyzuje srdeční rytmus. Pokud doporučí výboj, nikdo se nesmí dotýkat pacienta.
            Přístroj sám určí, zda výboj podat – nikomu nemůžete ublížit!
          </Text>
        </View>
      </Karta>
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
    fontSize: 30,
    letterSpacing: -0.6,
    lineHeight: 36,
    marginBottom: 4,
  },
  podtitul: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  varovaniBox: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
    marginBottom: 16,
  },
  varovaniNadpis: {
    fontSize: 16,
  },
  varovaniText: {
    fontSize: 14,
    lineHeight: 20,
  },
  sekceNadpis: {
    fontSize: 17,
    marginTop: 8,
    marginBottom: 12,
  },
  seznam: {
    gap: 14,
    marginBottom: 20,
  },
  aedKarta: {
    padding: 14,
    gap: 10,
  },
  aedHlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  aedNazev: {
    fontSize: 16,
    lineHeight: 22,
  },
  aedDostupnost: {
    fontSize: 13,
    marginTop: 2,
  },
  boxOdznak: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  boxOdznakText: {
    fontSize: 12,
    fontWeight: '600',
  },
  umisteniText: {
    fontSize: 14,
    lineHeight: 20,
  },
  popisText: {
    fontSize: 14,
    lineHeight: 20,
  },
  paticka: {
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  technickeInfo: {
    fontSize: 12,
    lineHeight: 18,
  },
  navodKarta: {
    padding: 16,
    gap: 12,
  },
  krokRadek: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  krokCislo: {
    fontSize: 18,
    width: 24,
  },
  krokText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
})
