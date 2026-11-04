import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
} from 'react-native'
import { useTema } from '@/tema'
import { useRelace } from '@/stav/relace'
import { useZdroj } from '@/zdroj'
import { Karta, Tlacitko, Pole } from '@/ui'
import type { HlaseniZavady, StavZavady } from '@codekom/typy'
import { nazevKategorieZavady } from '@/zdroj/kategorieZavad'

const STAVY: { id: StavZavady; nazev: string }[] = [
  { id: 'nove', nazev: 'Nové' },
  { id: 'prijato', nazev: 'Převzato' },
  { id: 'v_reseni', nazev: 'Řeší se' },
  { id: 'vyrizeno', nazev: 'Vyřízeno' },
  { id: 'zamitnuto', nazev: 'Zamítnuto' },
]

export default function UradZavadyScreen() {
  const { barvy, krize, pismo } = useTema()
  const { relace } = useRelace()
  const { zdroj } = useZdroj()

  const [zavady, setZavady] = useState<HlaseniZavady[]>([])
  const [aktivniFiltr, setAktivniFiltr] = useState<StavZavady | 'vse'>('vse')
  const [vybranaZavada, setVybranaZavada] = useState<HlaseniZavady | null>(null)
  const [novyStav, setNovyStav] = useState<StavZavady>('nove')
  const [verejnaOdpoved, setVerejnaOdpoved] = useState('')
  const [chyba, setChyba] = useState<string | null>(null)
  const [uspech, setUspech] = useState<string | null>(null)
  const [ukladani, setUkladani] = useState(false)

  const nactiZavady = useCallback(async () => {
    try {
      const slug = relace.obec || 'javori-lhota'
      const list = await zdroj.urad.zavady(slug)
      // Nejstarší nahoře pro nové, jak vyžaduje zadání
      const serazene = [...list].sort(
        (a, b) => new Date(a.vytvoreno).getTime() - new Date(b.vytvoreno).getTime(),
      )
      setZavady(serazene)
    } catch (err) {
      console.warn('Chyba při načítání závad úřadu:', err)
    }
  }, [zdroj, relace.obec])

  useEffect(() => {
    void nactiZavady()
  }, [nactiZavady])

  const filtrovaneZavady = zavady.filter((z) => {
    if (aktivniFiltr === 'vse') return true
    return z.stav === aktivniFiltr
  })

  const otevritDetail = (zavada: HlaseniZavady) => {
    setVybranaZavada(zavada)
    setNovyStav(zavada.stav)
    setVerejnaOdpoved(zavada.verejnaOdpoved ?? '')
    setChyba(null)
  }

  const ulozitZmenuStavu = async () => {
    if (!vybranaZavada) return

    // Povinná veřejná odpověď při Vyřízeno a Zamítnuto
    if ((novyStav === 'vyrizeno' || novyStav === 'zamitnuto') && !verejnaOdpoved.trim()) {
      setChyba('Při označení hlášení jako „Vyřízeno“ nebo „Zamítnuto“ je povinné uvést veřejnou odpověď občanovi.')
      return
    }

    setChyba(null)
    setUkladani(true)

    try {
      const slug = relace.obec || 'javori-lhota'
      await zdroj.urad.zmenitStavZavady(slug, vybranaZavada.id, {
        stav: novyStav,
        verejnaOdpoved: verejnaOdpoved.trim() || undefined,
      })

      setUspech(`Stav hlášení ${vybranaZavada.cislo} byl změněn na „${STAVY.find((s) => s.id === novyStav)?.nazev}“.`)
      setVybranaZavada(null)
      void nactiZavady()
    } catch (err) {
      console.warn('Chyba při ukládání stavu závady:', err)
      setChyba('Změna stavu selhala. Zkuste to prosím znovu.')
    } finally {
      setUkladani(false)
    }
  }

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
        Správa hlášení závad
      </Text>
      <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
        Evidence hlášení od občanů, změna stavu a odesílání veřejných odpovědí ke sledovacím kódům.
      </Text>

      {uspech && (
        <Karta style={styles.uspechBox}>
          <Text
            style={[
              styles.uspechNadpis,
              { color: '#166534', fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            Změna uložena
          </Text>
          <Text style={[styles.uspechText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            {uspech}
          </Text>
          <Tlacitko
            nazev="Zavřít"
            varianta="ghost"
            onPress={() => setUspech(null)}
            style={{ marginTop: 6 }}
          />
        </Karta>
      )}

      {/* Filtry stavu */}
      <View style={styles.filtrySeznam}>
        <Pressable
          onPress={() => setAktivniFiltr('vse')}
          style={[
            styles.filtrCip,
            {
              backgroundColor: aktivniFiltr === 'vse' ? barvy.primary : barvy.surface,
              borderColor: aktivniFiltr === 'vse' ? barvy.primary : barvy.line,
            },
          ]}
        >
          <Text
            style={[
              styles.filtrText,
              {
                color: aktivniFiltr === 'vse' ? barvy.onPrimary : barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Vše ({zavady.length})
          </Text>
        </Pressable>

        {STAVY.map((s) => {
          const pocet = zavady.filter((z) => z.stav === s.id).length
          const vybrany = aktivniFiltr === s.id
          return (
            <Pressable
              key={s.id}
              onPress={() => setAktivniFiltr(s.id)}
              style={[
                styles.filtrCip,
                {
                  backgroundColor: vybrany ? barvy.primary : barvy.surface,
                  borderColor: vybrany ? barvy.primary : barvy.line,
                },
              ]}
            >
              <Text
                style={[
                  styles.filtrText,
                  {
                    color: vybrany ? barvy.onPrimary : barvy.ink,
                    fontFamily: pismo.rodina,
                    fontWeight: pismo.vahy.polotucne,
                  },
                ]}
              >
                {s.nazev} ({pocet})
              </Text>
            </Pressable>
          )
        })}
      </View>

      {/* Seznam hlášení */}
      <View style={styles.seznam}>
        {filtrovaneZavady.length > 0 ? (
          filtrovaneZavady.map((zavada) => {
            const stavNazev = STAVY.find((s) => s.id === zavada.stav)?.nazev || zavada.stav
            return (
              <Karta
                key={zavada.id}
                onPress={() => otevritDetail(zavada)}
                style={styles.zavadaKarta}
                popisekProCtecku={`Hlášení ${zavada.cislo}, stav ${stavNazev}, kategorie ${nazevKategorieZavady(zavada.kategorie)}. Klepnutím otevřete detail a vyřízení.`}
              >
                <View style={styles.zavadaHlavicka}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.kategorieText, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                      {zavada.cislo} • {nazevKategorieZavady(zavada.kategorie)} • {formatDatum(zavada.vytvoreno)}
                    </Text>
                    <Text
                      style={[
                        styles.popisStrucny,
                        {
                          color: barvy.ink,
                          fontFamily: pismo.rodina,
                          fontWeight: pismo.vahy.polotucne,
                        },
                      ]}
                      numberOfLines={2}
                    >
                      {zavada.popis}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.stavOdznak,
                      {
                        backgroundColor:
                          zavada.stav === 'vyrizeno'
                            ? '#DCFCE7'
                            : zavada.stav === 'nove'
                              ? '#FEE2E2'
                              : '#FEF6D8',
                        borderColor:
                          zavada.stav === 'vyrizeno'
                            ? '#22C55E'
                            : zavada.stav === 'nove'
                              ? '#EF4444'
                              : '#CA8504',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.stavText,
                        {
                          color:
                            zavada.stav === 'vyrizeno'
                              ? '#166534'
                              : zavada.stav === 'nove'
                                ? '#991B1B'
                                : '#2A1B00',
                          fontFamily: pismo.rodina,
                          fontWeight: '600',
                        },
                      ]}
                    >
                      {stavNazev}
                    </Text>
                  </View>
                </View>

                {zavada.misto ? (
                  <Text style={[styles.mistoText, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                    Místo: {zavada.misto}
                  </Text>
                ) : null}

                <View style={styles.zavadaPaticka}>
                  <Text style={[styles.kodText, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                    Sledovací kód: <Text style={{ fontWeight: '600' }}>{zavada.sledovaciKod}</Text>
                  </Text>
                  <Text style={[styles.upravitOdkaz, { color: barvy.primary, fontFamily: pismo.rodina }]}>
                    Vyřídit / Změnit stav →
                  </Text>
                </View>
              </Karta>
            )
          })
        ) : (
          <Text style={[styles.prazdnoText, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Žádná hlášení závad v této kategorii nebyla nalezena.
          </Text>
        )}
      </View>

      {/* Modální okno pro detail a změnu stavu */}
      <Modal
        visible={vybranaZavada !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setVybranaZavada(null)}
      >
        <View style={styles.modalZatemneni}>
          <View style={[styles.modalObsah, { backgroundColor: barvy.surface, borderColor: barvy.line }]}>
            <Text
              style={[
                styles.modalNadpis,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              Detail hlášení {vybranaZavada?.cislo}
            </Text>

            <ScrollView style={styles.modalScroll}>
              <View style={styles.infoSekce}>
                <Text style={[styles.infoRadek, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                  <Text style={{ fontWeight: '600' }}>Kategorie: </Text>
                  {vybranaZavada ? nazevKategorieZavady(vybranaZavada.kategorie) : ''}
                </Text>
                <Text style={[styles.infoRadek, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                  <Text style={{ fontWeight: '600' }}>Sledovací kód: </Text>
                  {vybranaZavada?.sledovaciKod}
                </Text>
                <Text style={[styles.infoRadek, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                  <Text style={{ fontWeight: '600' }}>Datum podání: </Text>
                  {vybranaZavada ? formatDatum(vybranaZavada.vytvoreno) : ''}
                </Text>
                {vybranaZavada?.misto ? (
                  <Text style={[styles.infoRadek, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                    <Text style={{ fontWeight: '600' }}>Místo: </Text>
                    {vybranaZavada.misto}
                  </Text>
                ) : null}
                {vybranaZavada?.poloha ? (
                  <Text style={[styles.infoRadek, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                    <Text style={{ fontWeight: '600' }}>GPS: </Text>
                    {vybranaZavada.poloha.lat.toFixed(4)}, {vybranaZavada.poloha.lng.toFixed(4)}
                  </Text>
                ) : null}
                <Text style={[styles.infoRadek, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                  <Text style={{ fontWeight: '600' }}>Fotografie: </Text>
                  {vybranaZavada?.pocetFotek ? `${vybranaZavada.pocetFotek} přiložených fotek` : 'Bez fotografií'}
                </Text>

                <View style={styles.popisKrabice}>
                  <Text style={[styles.popisKrabiceNadpis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                    Popis závady od občana:
                  </Text>
                  <Text style={[styles.popisKrabiceText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                    {vybranaZavada?.popis}
                  </Text>
                </View>
              </View>

              {/* Změna stavu */}
              <Text
                style={[
                  styles.sekceNadpisModal,
                  { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
                ]}
              >
                Nastavit nový stav:
              </Text>
              <View style={styles.volbaStavuSeznam}>
                {STAVY.map((s) => {
                  const vybrana = novyStav === s.id
                  return (
                    <Pressable
                      key={s.id}
                      onPress={() => setNovyStav(s.id)}
                      style={[
                        styles.stavTlacitko,
                        {
                          backgroundColor: vybrana ? barvy.primary : barvy.bg,
                          borderColor: vybrana ? barvy.primary : barvy.line,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.stavTlacitkoText,
                          {
                            color: vybrana ? barvy.onPrimary : barvy.ink,
                            fontFamily: pismo.rodina,
                            fontWeight: pismo.vahy.polotucne,
                          },
                        ]}
                      >
                        {s.nazev}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>

              {/* Veřejná odpověď */}
              <View style={styles.odpovedBlok}>
                <Pole
                  popisek="Veřejná odpověď občanovi (max 500 znaků)"
                  value={verejnaOdpoved}
                  onChangeText={setVerejnaOdpoved}
                  maxLength={500}
                  multiline
                  placeholder="Informace o postupu řešení, termínu opravy nebo důvodu zamítnutí..."
                  napoveda={
                    novyStav === 'vyrizeno' || novyStav === 'zamitnuto'
                      ? 'Povinné pole při vyřízení nebo zamítnutí.'
                      : 'Volitelné pole. Zobrazí se občanovi po zadání sledovacího kódu.'
                  }
                />
              </View>

              {chyba && (
                <Text style={[styles.chybaText, { color: krize.warning.ink, fontFamily: pismo.rodina }]}>
                  {chyba}
                </Text>
              )}
            </ScrollView>

            <View style={styles.modalTlacitka}>
              <Tlacitko
                nazev={ukladani ? 'Ukládám…' : 'Uložit změny hlášení'}
                zakazano={ukladani}
                onPress={() => void ulozitZmenuStavu()}
              />
              <Tlacitko
                nazev="Zavřít bez uložení"
                varianta="ghost"
                onPress={() => setVybranaZavada(null)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  kontejner: {
    padding: 16,
    paddingBottom: 40,
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
  uspechBox: {
    padding: 14,
    marginBottom: 16,
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
  },
  uspechNadpis: {
    fontSize: 15,
    marginBottom: 2,
  },
  uspechText: {
    fontSize: 14,
    lineHeight: 20,
  },
  filtrySeznam: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filtrCip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtrText: {
    fontSize: 13,
  },
  seznam: {
    gap: 12,
  },
  zavadaKarta: {
    padding: 14,
    gap: 8,
  },
  zavadaHlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  kategorieText: {
    fontSize: 12,
  },
  popisStrucny: {
    fontSize: 15,
    marginTop: 2,
    lineHeight: 20,
  },
  stavOdznak: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  stavText: {
    fontSize: 12,
  },
  mistoText: {
    fontSize: 13,
  },
  zavadaPaticka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  kodText: {
    fontSize: 12,
  },
  upravitOdkaz: {
    fontSize: 13,
    fontWeight: '600',
  },
  prazdnoText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginVertical: 16,
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
    maxWidth: 420,
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    gap: 10,
    maxHeight: '85%',
  },
  modalNadpis: {
    fontSize: 18,
    marginBottom: 4,
  },
  modalScroll: {
    maxHeight: 380,
  },
  infoSekce: {
    gap: 4,
    marginBottom: 12,
  },
  infoRadek: {
    fontSize: 13,
    lineHeight: 18,
  },
  popisKrabice: {
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    marginTop: 6,
    gap: 2,
  },
  popisKrabiceNadpis: {
    fontSize: 11,
  },
  popisKrabiceText: {
    fontSize: 13,
    lineHeight: 18,
  },
  sekceNadpisModal: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 6,
  },
  volbaStavuSeznam: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  stavTlacitko: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stavTlacitkoText: {
    fontSize: 13,
  },
  odpovedBlok: {
    marginBottom: 8,
  },
  chybaText: {
    fontSize: 13,
    marginBottom: 8,
  },
  modalTlacitka: {
    gap: 8,
    marginTop: 6,
  },
})
