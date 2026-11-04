import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native'
import { useTema } from '@/tema'
import { useRelace } from '@/stav/relace'
import { useZdroj } from '@/zdroj'
import { Karta } from '@/ui'
import type { Budova } from '@codekom/typy'

function formatDatumCas(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString('cs-CZ', {
      day: 'numeric',
      month: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function slovniStavBudovy(stav: Budova['stav']): string {
  switch (stav) {
    case 'ok':
      return 'V pořádku'
    case 'varovani':
      return 'Varování'
    case 'alarm':
      return 'Alarm'
    default:
      return stav
  }
}

function slovniRezimTopeni(rezim: Budova['rezimTopeni']): string {
  switch (rezim) {
    case 'auto':
      return 'Automatický (časový plán)'
    case 'komfort':
      return 'Komfortní vytápění'
    case 'utlum':
      return 'Noční / útlumový režim'
    default:
      return rezim
  }
}

export default function UradBudovyScreen() {
  const { barvy, krize, pismo } = useTema()
  const { relace } = useRelace()
  const { zdroj } = useZdroj()

  const [budovy, setBudovy] = useState<Budova[]>([])
  const [nacitaSe, setNacitaSe] = useState(true)
  const [rozbalene, setRozbalene] = useState<Record<string, boolean>>({})

  const nactiBudovy = useCallback(async () => {
    try {
      const slug = relace.obec || 'javori-lhota'
      const data = await zdroj.urad.budovy(slug)
      setBudovy(data)
      // Standardně rozbalíme budovu s alarmem nebo varováním
      const vychozi: Record<string, boolean> = {}
      for (const b of data) {
        if (b.stav !== 'ok') {
          vychozi[b.id] = true
        }
      }
      setRozbalene(vychozi)
    } catch (err) {
      console.warn('Chyba při načítání budov úřadu:', err)
    } finally {
      setNacitaSe(false)
    }
  }, [zdroj, relace.obec])

  useEffect(() => {
    void nactiBudovy()
  }, [nactiBudovy])

  const prepnoutRozbaleni = (id: string) => {
    setRozbalene((predchozi) => ({
      ...predchozi,
      [id]: !predchozi[id],
    }))
  }

  const stylStavuBudovy = (stav: Budova['stav']) => {
    switch (stav) {
      case 'ok':
        return {
          bg: '#E7F4EC',
          ink: '#155C34',
        }
      case 'varovani':
        return {
          bg: krize.warning.bg,
          ink: krize.warning.ink,
        }
      case 'alarm':
        return {
          bg: krize.emergency.bg,
          ink: krize.emergency.ink,
        }
    }
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.kontejner, { backgroundColor: barvy.bg }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.hlavicka} accessibilityRole="header">
        <Text
          style={[
            styles.nadpis,
            {
              color: barvy.ink,
              fontFamily: pismo.rodina,
              fontSize: pismo.velikosti.nadpis,
              fontWeight: pismo.vahy.polotucne,
            },
          ]}
        >
          Budovy a technologie
        </Text>
        <Text
          style={[
            styles.podnadpis,
            {
              color: barvy.muted,
              fontFamily: pismo.rodina,
              fontSize: pismo.velikosti.popisek,
            },
          ]}
        >
          Přehled obecních objektů, vytápění, zámků a provozu. V prototypu je správa pouze ke čtení.
        </Text>
      </View>

      {/* Povinné upozornění podle pravidla 5 */}
      <View
        style={[
          styles.upozorneniPanel,
          {
            backgroundColor: barvy.surface,
            borderColor: barvy.line,
          },
        ]}
      >
        <Text
          style={[
            styles.upozorneniTitul,
            {
              color: barvy.ink,
              fontFamily: pismo.rodina,
              fontSize: pismo.velikosti.zaklad,
              fontWeight: pismo.vahy.polotucne,
            },
          ]}
        >
          Režim pouze ke čtení
        </Text>
        <Text
          style={[
            styles.upozorneniText,
            {
              color: barvy.muted,
              fontFamily: pismo.rodina,
              fontSize: pismo.velikosti.popisek,
            },
          ]}
        >
          Ovládání budov přibude v další verzi a bude vyžadovat zvláštní oprávnění.
        </Text>
        <Text
          style={[
            styles.upozorneniArchitektura,
            {
              color: barvy.ink,
              fontFamily: pismo.rodina,
              fontSize: pismo.velikosti.popisek,
            },
          ]}
        >
          Ochrana proti mrazu běží v bráně nezávisle na cloudu.
        </Text>
      </View>

      {nacitaSe ? (
        <Text
          style={[
            styles.nacitani,
            {
              color: barvy.muted,
              fontFamily: pismo.rodina,
              fontSize: pismo.velikosti.zaklad,
            },
          ]}
        >
          Načítám stav budov…
        </Text>
      ) : budovy.length === 0 ? (
        <Text
          style={[
            styles.prazdno,
            {
              color: barvy.muted,
              fontFamily: pismo.rodina,
              fontSize: pismo.velikosti.zaklad,
            },
          ]}
        >
          V evidenci nejsou žádné budovy.
        </Text>
      ) : (
        <View style={styles.seznam}>
          {budovy.map((budova) => {
            const jeRozbaleno = !!rozbalene[budova.id]
            const odznak = stylStavuBudovy(budova.stav)
            const slovniStav = slovniStavBudovy(budova.stav)

            return (
              <Karta key={budova.id} style={styles.budovaKarta}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${budova.nazev}, stav: ${slovniStav}. ${jeRozbaleno ? 'Klepnutím sbalit detaily' : 'Klepnutím rozbalit detaily'}`}
                  accessibilityState={{ expanded: jeRozbaleno }}
                  onPress={() => prepnoutRozbaleni(budova.id)}
                  style={styles.budovaHlavicka}
                >
                  <View style={styles.budovaZaklad}>
                    <Text
                      style={[
                        styles.budovaNazev,
                        {
                          color: barvy.ink,
                          fontFamily: pismo.rodina,
                          fontSize: pismo.velikosti.zaklad,
                          fontWeight: pismo.vahy.polotucne,
                        },
                      ]}
                    >
                      {budova.nazev}
                    </Text>
                    <Text
                      style={[
                        styles.budovaAdresa,
                        {
                          color: barvy.muted,
                          fontFamily: pismo.rodina,
                          fontSize: pismo.velikosti.popisek,
                        },
                      ]}
                    >
                      {budova.adresa}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.odznakStavu,
                      {
                        backgroundColor: odznak.bg,
                        borderColor: barvy.line,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.odznakText,
                        {
                          color: odznak.ink,
                          fontFamily: pismo.rodina,
                          fontSize: pismo.velikosti.male,
                          fontWeight: pismo.vahy.polotucne,
                        },
                      ]}
                    >
                      {slovniStav}
                    </Text>
                  </View>
                </Pressable>

                <View style={styles.souhrnRadek}>
                  <Text
                    style={[
                      styles.souhrnText,
                      {
                        color: barvy.ink,
                        fontFamily: pismo.rodina,
                        fontSize: pismo.velikosti.popisek,
                        fontWeight: pismo.vahy.stredni,
                      },
                    ]}
                  >
                    {budova.souhrn}
                  </Text>
                </View>

                {/* Brána a vytápění */}
                <View style={[styles.inforadek, { borderTopColor: barvy.line }]}>
                  <View style={styles.infoSloupec}>
                    <Text
                      style={[
                        styles.infoStitek,
                        {
                          color: barvy.muted,
                          fontFamily: pismo.rodina,
                          fontSize: pismo.velikosti.male,
                        },
                      ]}
                    >
                      Režim vytápění
                    </Text>
                    <Text
                      style={[
                        styles.infoHodnota,
                        {
                          color: barvy.ink,
                          fontFamily: pismo.rodina,
                          fontSize: pismo.velikosti.popisek,
                          fontWeight: pismo.vahy.polotucne,
                        },
                      ]}
                    >
                      {slovniRezimTopeni(budova.rezimTopeni)}
                    </Text>
                  </View>
                  <View style={styles.infoSloupec}>
                    <Text
                      style={[
                        styles.infoStitek,
                        {
                          color: barvy.muted,
                          fontFamily: pismo.rodina,
                          fontSize: pismo.velikosti.male,
                        },
                      ]}
                    >
                      IoT Brána
                    </Text>
                    <Text
                      style={[
                        styles.infoHodnota,
                        {
                          color: barvy.ink,
                          fontFamily: pismo.rodina,
                          fontSize: pismo.velikosti.popisek,
                          fontWeight: pismo.vahy.polotucne,
                        },
                      ]}
                    >
                      {budova.brana.online ? 'Online' : 'Offline'}
                    </Text>
                  </View>
                </View>

                {/* Klíče */}
                <View style={styles.klicRadek}>
                  <Text
                    style={[
                      styles.klicText,
                      {
                        color: barvy.muted,
                        fontFamily: pismo.rodina,
                        fontSize: pismo.velikosti.male,
                      },
                    ]}
                  >
                    Klíče od budovy: <Text style={{ color: barvy.ink }}>{budova.kdoMaKlic}</Text>
                  </Text>
                </View>

                {/* Upozornění / alarmy, pokud existují */}
                {budova.upozorneni.length > 0 && (
                  <View style={styles.upozorneniBlok}>
                    {budova.upozorneni.map((u) => {
                      const uStav = u.uroven === 'alarm' ? 'Alarm' : 'Varování'
                      return (
                        <View
                          key={u.id}
                          style={[
                            styles.upozorneniPolozka,
                            {
                              backgroundColor:
                                u.uroven === 'alarm' ? krize.emergency.bg : krize.warning.bg,
                              borderColor: barvy.line,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.upozorneniUroven,
                              {
                                color:
                                  u.uroven === 'alarm'
                                    ? krize.emergency.ink
                                    : krize.warning.ink,
                                fontFamily: pismo.rodina,
                                fontSize: pismo.velikosti.popisek,
                                fontWeight: pismo.vahy.polotucne,
                              },
                            ]}
                          >
                            {uStav}: {u.text}
                          </Text>
                          <Text
                            style={[
                              styles.upozorneniCas,
                              {
                                color: barvy.muted,
                                fontFamily: pismo.rodina,
                                fontSize: pismo.velikosti.male,
                              },
                            ]}
                          >
                            Od: {formatDatumCas(u.od)}{' '}
                            {u.prevzal ? `· Převzal: ${u.prevzal}` : '· Nepřevzato'}
                          </Text>
                        </View>
                      )
                    })}
                  </View>
                )}

                {/* Tlačítko pro detailní rozbalení */}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={jeRozbaleno ? 'Skrýt místnosti a vstupy' : 'Zobrazit místnosti a vstupy'}
                  onPress={() => prepnoutRozbaleni(budova.id)}
                  style={[styles.rozbalitTlacitko, { borderTopColor: barvy.line }]}
                >
                  <Text
                    style={[
                      styles.rozbalitText,
                      {
                        color: barvy.primary,
                        fontFamily: pismo.rodina,
                        fontSize: pismo.velikosti.popisek,
                        fontWeight: pismo.vahy.polotucne,
                      },
                    ]}
                  >
                    {jeRozbaleno ? 'Skrýt podrobnosti ▲' : 'Zobrazit místnosti, vstupy a plán ▼'}
                  </Text>
                </Pressable>

                {jeRozbaleno && (
                  <View style={styles.detailySekce}>
                    {/* Místnosti */}
                    <Text
                      style={[
                        styles.sekceNadpis,
                        {
                          color: barvy.ink,
                          fontFamily: pismo.rodina,
                          fontSize: pismo.velikosti.popisek,
                          fontWeight: pismo.vahy.polotucne,
                        },
                      ]}
                    >
                      Místnosti a teploty
                    </Text>
                    <View style={styles.mistnostiMrizka}>
                      {budova.mistnosti.map((m) => (
                        <View
                          key={m.id}
                          style={[
                            styles.mistnostKarta,
                            {
                              backgroundColor: barvy.bg,
                              borderColor: barvy.line,
                            },
                          ]}
                        >
                          <View style={styles.mistnostHorni}>
                            <Text
                              style={[
                                styles.mistnostNazev,
                                {
                                  color: barvy.ink,
                                  fontFamily: pismo.rodina,
                                  fontSize: pismo.velikosti.popisek,
                                  fontWeight: pismo.vahy.polotucne,
                                },
                              ]}
                            >
                              {m.nazev}
                            </Text>
                            <Text
                              style={[
                                styles.mistnostTeplota,
                                {
                                  color: barvy.ink,
                                  fontFamily: pismo.rodina,
                                  fontSize: pismo.velikosti.zaklad,
                                  fontWeight: pismo.vahy.polotucne,
                                },
                              ]}
                            >
                              {m.teplota.toLocaleString('cs-CZ', { minimumFractionDigits: 1 })} °C
                            </Text>
                          </View>
                          <Text
                            style={[
                              styles.mistnostCil,
                              {
                                color: barvy.muted,
                                fontFamily: pismo.rodina,
                                fontSize: pismo.velikosti.male,
                              },
                            ]}
                          >
                            Cíl: {m.cilText || `${m.cilovaTeplota} °C`}
                          </Text>
                          <Text
                            style={[
                              styles.mistnostOkno,
                              {
                                color: barvy.muted,
                                fontFamily: pismo.rodina,
                                fontSize: pismo.velikosti.male,
                              },
                            ]}
                          >
                            Okno: {m.okno === 'zavreno' ? 'Zavřeno' : 'Otevřeno'}
                          </Text>
                          {m.poznamka ? (
                            <Text
                              style={[
                                styles.mistnostPoznamka,
                                {
                                  color: barvy.muted,
                                  fontFamily: pismo.rodina,
                                  fontSize: pismo.velikosti.male,
                                },
                              ]}
                            >
                              {m.poznamka}
                            </Text>
                          ) : null}
                        </View>
                      ))}
                    </View>

                    {/* Dveře a přístupy */}
                    <Text
                      style={[
                        styles.sekceNadpis,
                        {
                          color: barvy.ink,
                          fontFamily: pismo.rodina,
                          fontSize: pismo.velikosti.popisek,
                          fontWeight: pismo.vahy.polotucne,
                          marginTop: 14,
                        },
                      ]}
                    >
                      Vstupy a dveře
                    </Text>
                    <View style={styles.dvereSeznam}>
                      {budova.dvere.map((dv) => {
                        const jeZamceno = dv.stav === 'zamceno'
                        return (
                          <View
                            key={dv.id}
                            style={[
                              styles.dverePolozka,
                              {
                                backgroundColor: barvy.bg,
                                borderColor: barvy.line,
                              },
                            ]}
                          >
                            <View style={styles.dvereInfo}>
                              <Text
                                style={[
                                  styles.dvereNazev,
                                  {
                                    color: barvy.ink,
                                    fontFamily: pismo.rodina,
                                    fontSize: pismo.velikosti.popisek,
                                    fontWeight: pismo.vahy.polotucne,
                                  },
                                ]}
                              >
                                {dv.nazev}
                              </Text>
                              <Text
                                style={[
                                  styles.dvereVstup,
                                  {
                                    color: barvy.muted,
                                    fontFamily: pismo.rodina,
                                    fontSize: pismo.velikosti.male,
                                  },
                                ]}
                              >
                                Poslední vstup: {formatDatumCas(dv.posledniVstup.cas)} · {dv.posledniVstup.kdo} ({dv.posledniVstup.zpusob})
                              </Text>
                            </View>
                            <View
                              style={[
                                styles.dvereStavOdznak,
                                {
                                  backgroundColor: jeZamceno ? '#E7F4EC' : krize.warning.bg,
                                  borderColor: barvy.line,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.dvereStavText,
                                  {
                                    color: jeZamceno ? '#155C34' : krize.warning.ink,
                                    fontFamily: pismo.rodina,
                                    fontSize: pismo.velikosti.male,
                                    fontWeight: pismo.vahy.polotucne,
                                  },
                                ]}
                              >
                                {jeZamceno ? 'Zamčeno' : 'Odemčeno'}
                              </Text>
                            </View>
                          </View>
                        )
                      })}
                    </View>

                    {/* Dnešní časový plán */}
                    {budova.plan.length > 0 && (
                      <>
                        <Text
                          style={[
                            styles.sekceNadpis,
                            {
                              color: barvy.ink,
                              fontFamily: pismo.rodina,
                              fontSize: pismo.velikosti.popisek,
                              fontWeight: pismo.vahy.polotucne,
                              marginTop: 14,
                            },
                          ]}
                        >
                          Časový plán
                        </Text>
                        <View style={styles.planSeznam}>
                          {budova.plan.map((p, idx) => (
                            <View
                              key={idx}
                              style={[
                                styles.planPolozka,
                                {
                                  backgroundColor: barvy.bg,
                                  borderColor: barvy.line,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.planCas,
                                  {
                                    color: barvy.primary,
                                    fontFamily: pismo.rodina,
                                    fontSize: pismo.velikosti.popisek,
                                    fontWeight: pismo.vahy.polotucne,
                                  },
                                ]}
                              >
                                {p.od}–{p.do}
                              </Text>
                              <Text
                                style={[
                                  styles.planNazev,
                                  {
                                    color: barvy.ink,
                                    fontFamily: pismo.rodina,
                                    fontSize: pismo.velikosti.popisek,
                                  },
                                ]}
                              >
                                {p.nazev}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </>
                    )}

                    {/* Spotřeba energie */}
                    {budova.energie.length > 0 && (
                      <>
                        <Text
                          style={[
                            styles.sekceNadpis,
                            {
                              color: barvy.ink,
                              fontFamily: pismo.rodina,
                              fontSize: pismo.velikosti.popisek,
                              fontWeight: pismo.vahy.polotucne,
                              marginTop: 14,
                            },
                          ]}
                        >
                          Spotřeba elektřiny (poslední dny)
                        </Text>
                        <View style={styles.energieMrizka}>
                          {budova.energie.slice(-5).map((e) => (
                            <View
                              key={e.den}
                              style={[
                                styles.energiePolozka,
                                {
                                  backgroundColor: barvy.bg,
                                  borderColor: barvy.line,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.energieDen,
                                  {
                                    color: barvy.muted,
                                    fontFamily: pismo.rodina,
                                    fontSize: pismo.velikosti.male,
                                  },
                                ]}
                              >
                                {e.den.slice(5)}
                              </Text>
                              <Text
                                style={[
                                  styles.energieKwh,
                                  {
                                    color: barvy.ink,
                                    fontFamily: pismo.rodina,
                                    fontSize: pismo.velikosti.popisek,
                                    fontWeight: pismo.vahy.polotucne,
                                  },
                                ]}
                              >
                                {e.kWh} kWh
                              </Text>
                            </View>
                          ))}
                        </View>
                      </>
                    )}
                  </View>
                )}
              </Karta>
            )
          })}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  kontejner: {
    padding: 16,
    paddingBottom: 48,
  },
  hlavicka: {
    marginBottom: 16,
  },
  nadpis: {
    marginBottom: 4,
  },
  podnadpis: {
    lineHeight: 20,
  },
  upozorneniPanel: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 18,
    gap: 4,
  },
  upozorneniTitul: {},
  upozorneniText: {
    lineHeight: 18,
  },
  upozorneniArchitektura: {
    lineHeight: 18,
    marginTop: 2,
    fontStyle: 'italic',
  },
  nacitani: {
    paddingVertical: 24,
    textAlign: 'center',
  },
  prazdno: {
    paddingVertical: 24,
    textAlign: 'center',
  },
  seznam: {
    gap: 14,
  },
  budovaKarta: {
    padding: 14,
  },
  budovaHlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    minHeight: 44,
  },
  budovaZaklad: {
    flex: 1,
  },
  budovaNazev: {},
  budovaAdresa: {
    marginTop: 2,
  },
  odznakStavu: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  odznakText: {},
  souhrnRadek: {
    marginTop: 8,
    marginBottom: 6,
  },
  souhrnText: {},
  inforadek: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 8,
    marginTop: 6,
    gap: 12,
  },
  infoSloupec: {
    flex: 1,
  },
  infoStitek: {},
  infoHodnota: {
    marginTop: 1,
  },
  klicRadek: {
    marginTop: 6,
  },
  klicText: {
    lineHeight: 16,
  },
  upozorneniBlok: {
    marginTop: 10,
    gap: 6,
  },
  upozorneniPolozka: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  upozorneniUroven: {},
  upozorneniCas: {
    marginTop: 2,
  },
  rozbalitTlacitko: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  rozbalitText: {},
  detailySekce: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ECEBE6',
    paddingTop: 12,
  },
  sekceNadpis: {
    marginBottom: 8,
  },
  mistnostiMrizka: {
    gap: 8,
  },
  mistnostKarta: {
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  mistnostHorni: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mistnostNazev: {},
  mistnostTeplota: {},
  mistnostCil: {
    marginTop: 2,
  },
  mistnostOkno: {
    marginTop: 1,
  },
  mistnostPoznamka: {
    marginTop: 2,
    fontStyle: 'italic',
  },
  dvereSeznam: {
    gap: 8,
  },
  dverePolozka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    gap: 8,
  },
  dvereInfo: {
    flex: 1,
  },
  dvereNazev: {},
  dvereVstup: {
    marginTop: 2,
  },
  dvereStavOdznak: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  dvereStavText: {},
  planSeznam: {
    gap: 6,
  },
  planPolozka: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    gap: 10,
  },
  planCas: {
    minWidth: 85,
  },
  planNazev: {
    flex: 1,
  },
  energieMrizka: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  energiePolozka: {
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    minWidth: 64,
    alignItems: 'center',
  },
  energieDen: {},
  energieKwh: {
    marginTop: 1,
  },
})
