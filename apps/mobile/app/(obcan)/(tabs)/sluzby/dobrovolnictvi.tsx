import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { useRelace } from '@/stav/relace'
import { Karta, Tlacitko } from '@/ui'

interface Brigada {
  id: string
  nazev: string
  organizator: string
  termin: string
  misto: string
  popis: string
  potrebnePomucky: string
  odmena: string
  kapacita: number
  prihlaseno: number
}

const VYCHOZI_BRIGADY: Brigada[] = [
  {
    id: 'brigada-1',
    nazev: 'Výsadba aleje starých odrůd jabloní a třešní',
    organizator: 'Obec Javoří Lhota a Český svaz ochránců přírody',
    termin: 'Sobota 14. listopadu 2026 od 09:00',
    misto: 'Polní cesta z Podjavoří k Mlýnskému rybníku',
    popis: 'Vysadíme celkem 40 stromků s opěrnými kůly a ochranou proti okusu zvěří. Vhodné pro celé rodiny i děti.',
    potrebnePomucky: 'Rýče, rukavice a dobrá nálada (nářadí máme i k zapůjčení).',
    odmena: 'Občerstvení a teplý čaj / polévka pro všechny účastníky + 200 občanských bodů',
    kapacita: 25,
    prihlaseno: 14,
  },
  {
    id: 'brigada-2',
    nazev: 'Velký podzimní úklid černých skládek a lesa',
    organizator: 'Sbor dobrovolných hasičů Javoří Lhota',
    termin: 'Sobota 21. listopadu 2026 od 08:30',
    misto: 'Sraz před hasičskou zbrojnicí',
    popis: 'Projdeme lesní rokle pod Javorníkem a podél potoka. Pytle a odvoz odpadu traktorem zajištěn.',
    potrebnePomucky: 'Pevná nepromokavá obuv, pracovní rukavice.',
    odmena: 'Tradiční hasičský guláš a limo/pivo v hasičárně + 250 občanských bodů',
    kapacita: 30,
    prihlaseno: 22,
  },
  {
    id: 'brigada-3',
    nazev: 'Příprava dřeva a topení pro osamělé seniory v obci',
    organizator: 'Spolek sousedské pomoci Javoří Lhota',
    termin: 'Sobota 28. listopadu 2026 od 13:00',
    misto: 'Domy č. p. 22 a č. p. 45',
    popis: 'Naštípání a složení palivového dřeva do dřevníků pro dvě babičky před zimou.',
    potrebnePomucky: 'Pracovní oděv, štípačky a pily zajištěny z obecní půjčovny.',
    odmena: 'Domácí bábovka a káva od sousedů + 150 občanských bodů',
    kapacita: 10,
    prihlaseno: 7,
  },
]

export default function DobrovolnictviScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()
  const { relace } = useRelace()

  const [brigady, setBrigady] = useState<Brigada[]>(VYCHOZI_BRIGADY)
  const [mojePrihlasky, setMojePrihlasky] = useState<string[]>([])
  const [potvrzeni, setPotvrzeni] = useState<string | null>(null)

  const prihlasitNaBrigadu = (b: Brigada) => {
    if (!relace.prihlasen) {
      router.push('/(uvod)/prihlaseni')
      return
    }

    if (mojePrihlasky.includes(b.id)) {
      // Odhlášení
      setMojePrihlasky(mojePrihlasky.filter((id) => id !== b.id))
      setBrigady(
        brigady.map((item) =>
          item.id === b.id ? { ...item, prihlaseno: Math.max(0, item.prihlaseno - 1) } : item,
        ),
      )
      setPotvrzeni(`Vaše přihláška na akci „${b.nazev}“ byla zrušena.`)
    } else {
      // Přihlášení
      setMojePrihlasky([...mojePrihlasky, b.id])
      setBrigady(
        brigady.map((item) =>
          item.id === b.id ? { ...item, prihlaseno: item.prihlaseno + 1 } : item,
        ),
      )
      setPotvrzeni(
        `Děkujeme! Jste přihlášeni na akci „${b.nazev}“. Organizátor vám pošle podrobnosti. Získané body se připíší po skončení.`,
      )
    }
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
        Burza dobrovolnictví a brigád
      </Text>
      <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
        Pomozte zlepšit naši obec. Zapojte se do brigád pořádaných obcí, hasiči a spolky.
      </Text>

      {potvrzeni && (
        <Karta style={styles.potvrzeniBox}>
          <Text
            style={[
              styles.potvrzeniNadpis,
              { color: '#166534', fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            Aktualizace přihlášky
          </Text>
          <Text style={[styles.potvrzeniText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            {potvrzeni}
          </Text>
          <Tlacitko
            nazev="Rozumím"
            varianta="ghost"
            onPress={() => setPotvrzeni(null)}
            style={{ marginTop: 6 }}
          />
        </Karta>
      )}

      <View style={styles.seznam}>
        {brigady.map((brigada) => {
          const jePrihlasen = mojePrihlasky.includes(brigada.id)
          return (
            <Karta key={brigada.id} style={styles.brigadaKarta}>
              <View style={styles.hlavicka}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.organizator, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                    Pořádá: {brigada.organizator}
                  </Text>
                  <Text
                    style={[
                      styles.brigadaNazev,
                      {
                        color: barvy.ink,
                        fontFamily: pismo.rodina,
                        fontWeight: pismo.vahy.polotucne,
                      },
                    ]}
                  >
                    {brigada.nazev}
                  </Text>
                </View>
                <View
                  style={[
                    styles.kapacitaOdznak,
                    {
                      backgroundColor: barvy.surface,
                      borderColor: barvy.line,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.kapacitaText,
                      {
                        color: barvy.primary,
                        fontFamily: pismo.rodina,
                        fontWeight: pismo.vahy.polotucne,
                      },
                    ]}
                  >
                    {brigada.prihlaseno} / {brigada.kapacita} lidí
                  </Text>
                </View>
              </View>

              <View style={styles.parametry}>
                <Text style={[styles.parametrRadek, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                  <Text style={{ fontWeight: '600' }}>Termín: </Text>
                  {brigada.termin}
                </Text>
                <Text style={[styles.parametrRadek, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                  <Text style={{ fontWeight: '600' }}>Místo srazu: </Text>
                  {brigada.misto}
                </Text>
                <Text style={[styles.parametrRadek, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                  <Text style={{ fontWeight: '600' }}>Pomůcky: </Text>
                  {brigada.potrebnePomucky}
                </Text>
              </View>

              <Text style={[styles.brigadaPopis, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                {brigada.popis}
              </Text>

              <View
                style={[
                  styles.odmenaBox,
                  { backgroundColor: barvy.surface, borderColor: barvy.line },
                ]}
              >
                <Text style={[styles.odmenaText, { color: barvy.primary, fontFamily: pismo.rodina }]}>
                  Odměna a body: {brigada.odmena}
                </Text>
              </View>

              <Tlacitko
                nazev={jePrihlasen ? '✓ Jsem přihlášen(a) – odhlásit' : 'Chci pomoct (Přihlásit se)'}
                varianta={jePrihlasen ? 'secondary' : 'primary'}
                onPress={() => prihlasitNaBrigadu(brigada)}
                style={styles.akceTlacitko}
              />
            </Karta>
          )
        })}
      </View>

      <View style={[styles.uradFallback, { backgroundColor: barvy.surface, borderColor: barvy.line }]}>
        <Text
          style={[
            styles.uradNadpis,
            { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
          ]}
        >
          Máte nápad na brigádu?
        </Text>
        <Text style={[styles.uradText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
          Místní spolky a aktivní občané mohou navrhnout brigádu nebo dobrovolnickou pomoc přes
          obecní úřad na e-mailu starostky nebo v úředních hodinách.
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
    padding: 14,
    marginBottom: 16,
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
  },
  potvrzeniNadpis: {
    fontSize: 15,
    marginBottom: 2,
  },
  potvrzeniText: {
    fontSize: 14,
    lineHeight: 20,
  },
  seznam: {
    gap: 16,
    marginBottom: 20,
  },
  brigadaKarta: {
    padding: 14,
    gap: 10,
  },
  hlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  organizator: {
    fontSize: 12,
  },
  brigadaNazev: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 2,
  },
  kapacitaOdznak: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  kapacitaText: {
    fontSize: 12,
  },
  parametry: {
    gap: 4,
    paddingVertical: 2,
  },
  parametrRadek: {
    fontSize: 13,
    lineHeight: 18,
  },
  brigadaPopis: {
    fontSize: 14,
    lineHeight: 20,
  },
  odmenaBox: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  odmenaText: {
    fontSize: 13,
  },
  akceTlacitko: {
    minHeight: 44,
    marginTop: 4,
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
