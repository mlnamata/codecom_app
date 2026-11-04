import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTema } from '@/tema'
import { useZdroj } from '@/zdroj'
import { useRelace } from '@/stav/relace'
import { Pole, Tlacitko, Karta } from '@/ui'
import type { StavZavadyVerejny } from '@codekom/typy'
import { nazevKategorieZavady } from '@/zdroj/kategorieZavad'

const KLIC_MOJE_HLASENI = 'codekom.ukazka.moje_hlaseni'

const STAV_POJMENOVANI: Record<string, string> = {
  nove: 'Nové',
  prijato: 'Přijato',
  v_reseni: 'V řešení',
  vyrizeno: 'Vyřízeno',
  zamitnuto: 'Zamítnuto',
}

export default function SledovaniZavadyScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ kod?: string }>()
  const { barvy, pismo } = useTema()
  const { zdroj } = useZdroj()
  const { relace } = useRelace()

  const [kod, setKod] = useState(typeof params.kod === 'string' ? params.kod.toUpperCase() : '')
  const [mojeKody, setMojeKody] = useState<string[]>([])
  const [vysledek, setVysledek] = useState<StavZavadyVerejny | null>(null)
  const [hledano, setHledano] = useState(false)
  const [nacitaSe, setNacitaSe] = useState(false)
  const [chyba, setChyba] = useState<string | null>(null)

  const nactiUlozeneKody = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' || typeof navigator !== 'undefined') {
        const ulozene = await AsyncStorage.getItem(KLIC_MOJE_HLASENI)
        if (ulozene) {
          const arr = JSON.parse(ulozene) as string[]
          if (Array.isArray(arr)) {
            setMojeKody(arr)
          }
        }
      }
    } catch {
      // Ignoruj chyby úložiště
    }
  }, [])

  const vyhledatKod = useCallback(
    async (hledanyKod: string) => {
      const cisty = hledanyKod.trim().toUpperCase()
      if (!cisty) {
        setChyba('Zadejte prosím osmimístný sledovací kód.')
        setVysledek(null)
        setHledano(false)
        return
      }

      setChyba(null)
      setNacitaSe(true)
      setHledano(true)

      try {
        const slug = relace.obec || 'javori-lhota'
        const res = await zdroj.stavZavady(slug, cisty)
        setVysledek(res)
      } catch (err) {
        console.warn('Chyba při zjišťování stavu závady:', err)
        setChyba('Nepodařilo se ověřit stav hlášení. Zkontrolujte připojení.')
        setVysledek(null)
      } finally {
        setNacitaSe(false)
      }
    },
    [zdroj, relace.obec],
  )

  useEffect(() => {
    void nactiUlozeneKody()
  }, [nactiUlozeneKody])

  useEffect(() => {
    if (params.kod && typeof params.kod === 'string') {
      const pKod = params.kod.toUpperCase()
      setKod(pKod)
      void vyhledatKod(pKod)
    }
  }, [params.kod, vyhledatKod])

  const formatDatum = (iso: string) => {
    try {
      const d = new Date(iso)
      return `${d.toLocaleDateString('cs-CZ')} v ${d.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}`
    } catch {
      return iso
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
        Sledování stavu hlášení
      </Text>
      <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
        Zadejte osmimístný sledovací kód, který jste obdrželi při odeslání hlášení závady.
      </Text>

      <View style={styles.formular}>
        <Pole
          popisek="Sledovací kód"
          value={kod}
          onChangeText={(t: string) => setKod(t.toUpperCase())}
          placeholder="Např. 3K8B7X2M"
          autoCapitalize="characters"
          chyba={chyba ?? undefined}
          napoveda="Kód má 8 znaků (čísla a velká písmena)."
        />

        <Tlacitko
          nazev={nacitaSe ? 'Vyhledávám…' : 'Vyhledat stav'}
          onPress={() => void vyhledatKod(kod)}
          zakazano={nacitaSe}
          style={styles.tlacitkoHledat}
        />
      </View>

      {/* Rychlá volba z historie */}
      {mojeKody.length > 0 && (
        <View style={styles.sekceHistorie}>
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
            Vaše nedávná hlášení v tomto prohlížeči:
          </Text>
          <View style={styles.cipySeznam}>
            {mojeKody.map((k) => (
              <Pressable
                key={k}
                onPress={() => {
                  setKod(k)
                  void vyhledatKod(k)
                }}
                accessibilityRole="button"
                accessibilityLabel={`Vyhledat hlášení s kódem ${k}`}
                style={({ pressed }) => [
                  styles.cip,
                  {
                    backgroundColor: kod === k ? barvy.primary : barvy.surface,
                    borderColor: barvy.line,
                    opacity: pressed ? 0.75 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.cipText,
                    {
                      color: kod === k ? barvy.onPrimary : barvy.ink,
                      fontFamily: pismo.rodina,
                      fontWeight: pismo.vahy.polotucne,
                    },
                  ]}
                >
                  {k}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Výsledek vyhledávání */}
      {hledano && !nacitaSe && (
        <View style={styles.sekceVysledek}>
          {vysledek ? (
            <Karta style={styles.vysledekKarta}>
              <View style={styles.vysledekRadek}>
                <Text style={[styles.polozkaStitek, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                  Číslo hlášení:
                </Text>
                <Text
                  style={[
                    styles.polozkaHodnota,
                    {
                      color: barvy.ink,
                      fontFamily: pismo.rodina,
                      fontWeight: pismo.vahy.polotucne,
                    },
                  ]}
                >
                  {vysledek.cislo}
                </Text>
              </View>

              <View style={styles.vysledekRadek}>
                <Text style={[styles.polozkaStitek, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                  Kategorie:
                </Text>
                <Text style={[styles.polozkaHodnota, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                  {nazevKategorieZavady(vysledek.kategorie)}
                </Text>
              </View>

              <View style={styles.vysledekRadek}>
                <Text style={[styles.polozkaStitek, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                  Stav:
                </Text>
                <View style={[styles.stavStitek, { backgroundColor: barvy.surface, borderColor: barvy.line }]}>
                  <Text
                    style={[
                      styles.stavText,
                      {
                        color: barvy.primary,
                        fontFamily: pismo.rodina,
                        fontWeight: pismo.vahy.polotucne,
                      },
                    ]}
                  >
                    {vysledek.stavNazev || STAV_POJMENOVANI[vysledek.stav] || vysledek.stav}
                  </Text>
                </View>
              </View>

              <View style={styles.vysledekRadek}>
                <Text style={[styles.polozkaStitek, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                  Vytvořeno:
                </Text>
                <Text style={[styles.polozkaHodnota, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                  {formatDatum(vysledek.vytvoreno)}
                </Text>
              </View>

              <View style={styles.odpovedSekce}>
                <Text
                  style={[
                    styles.odpovedNadpis,
                    {
                      color: barvy.ink,
                      fontFamily: pismo.rodina,
                      fontWeight: pismo.vahy.polotucne,
                    },
                  ]}
                >
                  Veřejná odpověď úřadu:
                </Text>
                {vysledek.verejnaOdpoved ? (
                  <View
                    style={[
                      styles.odpovedBox,
                      {
                        backgroundColor: barvy.surface,
                        borderColor: barvy.line,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.odpovedText,
                        { color: barvy.ink, fontFamily: pismo.rodina },
                      ]}
                    >
                      {vysledek.verejnaOdpoved}
                    </Text>
                  </View>
                ) : (
                  <Text style={[styles.bezOdpovedi, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                    Zatím bez veřejné odpovědi. Úřad hlášení eviduje a postupuje podle běžných postupů.
                  </Text>
                )}
              </View>
            </Karta>
          ) : (
            <Karta style={styles.chybaKarta}>
              <Text
                style={[
                  styles.nenalezenoText,
                  {
                    color: barvy.ink,
                    fontFamily: pismo.rodina,
                    fontWeight: pismo.vahy.polotucne,
                  },
                ]}
              >
                Hlášení nenalezeno
              </Text>
              <Text style={[styles.nenalezenoPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                Pro kód „{kod}“ nebylo v systému nalezeno žádné hlášení. Zkontrolujte prosím správnost
                zadaného kódu.
              </Text>
            </Karta>
          )}
        </View>
      )}

      {/* Fallback úřadu podle pravidla 6 */}
      <View
        style={[
          styles.uradFallback,
          {
            backgroundColor: barvy.surface,
            borderColor: barvy.line,
          },
        ]}
      >
        <Text
          style={[
            styles.uradNadpis,
            {
              color: barvy.ink,
              fontFamily: pismo.rodina,
              fontWeight: pismo.vahy.polotucne,
            },
          ]}
        >
          Potřebujete pomoc s hlášením?
        </Text>
        <Text style={[styles.uradText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
          Obecní úřad Javoří Lhota{'\n'}
          Telefon: +420 379 000 111{'\n'}
          Úřední hodiny: Po, St 8:00–17:00
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
    fontSize: 30,
    letterSpacing: -0.6,
    lineHeight: 36,
    marginBottom: 8,
  },
  podtitul: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  formular: {
    marginBottom: 16,
  },
  tlacitkoHledat: {
    marginTop: 12,
  },
  sekceHistorie: {
    marginBottom: 20,
  },
  sekceNadpis: {
    fontSize: 14,
    marginBottom: 8,
  },
  cipySeznam: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cipText: {
    fontSize: 14,
  },
  sekceVysledek: {
    marginBottom: 20,
  },
  vysledekKarta: {
    padding: 16,
    gap: 12,
  },
  vysledekRadek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  polozkaStitek: {
    fontSize: 14,
  },
  polozkaHodnota: {
    fontSize: 15,
  },
  stavStitek: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  stavText: {
    fontSize: 14,
  },
  odpovedSekce: {
    marginTop: 8,
    gap: 6,
  },
  odpovedNadpis: {
    fontSize: 15,
  },
  odpovedBox: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  odpovedText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bezOdpovedi: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  chybaKarta: {
    padding: 16,
  },
  nenalezenoText: {
    fontSize: 16,
    marginBottom: 6,
  },
  nenalezenoPopis: {
    fontSize: 14,
    lineHeight: 20,
  },
  uradFallback: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 8,
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
