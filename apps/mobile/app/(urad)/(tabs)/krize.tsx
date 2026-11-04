import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTema } from '@/tema'
import { useRelace } from '@/stav/relace'
import { useZdroj } from '@/zdroj'
import { useOznameni } from '@/stav/oznameni'
import { Karta, Tlacitko, Pole, KrizovyBanner } from '@/ui'
import { bezpecnyOdkaz, type Uroven } from '@codekom/typy/pravidla'
import type { KrizoveHlaseni, VstupKrize } from '@codekom/typy'

const KLIC_KONCEPTY = 'codekom.ukazka.koncepty_krize'
const MAX_TITULEK = 90
const MAX_TEXT = 300

interface KonceptKrize extends VstupKrize {
  id: string
  vytvoreno: string
  autor: string
}

export default function UradKrizeScreen() {
  const { barvy, krize, pismo } = useTema()
  const { relace } = useRelace()
  const { zdroj } = useZdroj()
  const { zobrazitOznameni } = useOznameni()

  // Druh oznámení
  const [druh, setDruh] = useState<'krize' | 'rozhlas'>('krize')

  // Krizové hlášení - formulář
  const [uroven, setUroven] = useState<Uroven>('warning')
  const [titulek, setTitulek] = useState('')
  const [text, setText] = useState('')
  const [odkazText, setOdkazText] = useState('')
  const [odkazUrl, setOdkazUrl] = useState('')
  const [vybraneCasti, setVybraneCasti] = useState<string[]>([])
  const [chyba, setChyba] = useState<string | null>(null)

  // Rozhlas - formulář
  const [rozhlasText, setRozhlasText] = useState('')

  // Koncepty a aktivní hlášení
  const [koncepty, setKoncepty] = useState<KonceptKrize[]>([])
  const [aktivniHlaseniList, setAktivniHlaseniList] = useState<KrizoveHlaseni[]>([])

  // Dialogy
  const [modalPotvrzeniVydat, setModalPotvrzeniVydat] = useState(false)
  const [modalPotvrzeniUkoncit, setModalPotvrzeniUkoncit] = useState<KrizoveHlaseni | null>(null)
  const [zpravaUspech, setZpravaUspech] = useState<string | null>(null)

  const nactiKoncepty = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' || typeof navigator !== 'undefined') {
        const ulozene = await AsyncStorage.getItem(KLIC_KONCEPTY)
        if (ulozene) {
          setKoncepty(JSON.parse(ulozene) as KonceptKrize[])
        }
      }
    } catch {
      // Ignoruj chyby úložiště
    }
  }, [])

  const nactiAktivniKrize = useCallback(async () => {
    try {
      const slug = relace.obec || 'javori-lhota'
      const res = await zdroj.krizeAktivni(slug)
      if (res.hlavni) {
        setAktivniHlaseniList([res.hlavni])
      } else {
        setAktivniHlaseniList([])
      }
    } catch {
      // Ignoruj síťové chyby
    }
  }, [zdroj, relace.obec])

  useEffect(() => {
    void nactiKoncepty()
    void nactiAktivniKrize()
  }, [nactiKoncepty, nactiAktivniKrize])

  const zbyvaZnakuTitulek = MAX_TITULEK - titulek.length
  const zbyvaZnakuText = MAX_TEXT - text.length
  const zbyvaZnakuRozhlas = MAX_TEXT - rozhlasText.length

  const prepnoutCast = (cast: string) => {
    if (vybraneCasti.includes(cast)) {
      setVybraneCasti(vybraneCasti.filter((c) => c !== cast))
    } else {
      setVybraneCasti([...vybraneCasti, cast])
    }
  }

  // Uložení konceptu (Redaktor i Správce)
  const ulozitKoncept = async () => {
    if (druh === 'krize') {
      if (!titulek.trim() || !text.trim()) {
        setChyba('Vyplňte prosím titulek i text krizového hlášení.')
        return
      }
    } else {
      if (!rozhlasText.trim()) {
        setChyba('Zadejte prosím text oznámení rozhlasu.')
        return
      }
    }
    setChyba(null)

    const novyKoncept: KonceptKrize = {
      id: `koncept-${Date.now()}`,
      uroven,
      titulek: druh === 'krize' ? titulek.trim() : 'Hlášení obecního rozhlasu',
      text: druh === 'krize' ? text.trim() : rozhlasText.trim(),
      odkazText: odkazText.trim() || undefined,
      odkazUrl: odkazUrl.trim() || undefined,
      casti: vybraneCasti.length > 0 ? vybraneCasti : undefined,
      vytvoreno: new Date().toISOString(),
      autor: relace.roleUradu === 'spravce' ? 'Správce' : 'Redaktor',
    }

    const aktualizovane = [novyKoncept, ...koncepty]
    setKoncepty(aktualizovane)
    try {
      if (typeof window !== 'undefined' || typeof navigator !== 'undefined') {
        await AsyncStorage.setItem(KLIC_KONCEPTY, JSON.stringify(aktualizovane))
      }
    } catch {
      // Ignoruj
    }

    setZpravaUspech(
      relace.roleUradu === 'redaktor'
        ? 'Koncept byl uložen. Krizové hlášení vydává správce obce.'
        : 'Koncept byl uložen do seznamu konceptů.',
    )
    if (druh === 'krize') {
      setTitulek('')
      setText('')
      setOdkazText('')
      setOdkazUrl('')
    } else {
      setRozhlasText('')
    }
  }

  // Otevření potvrzovacího dialogu pro vydání (jen Správce)
  const zahajitVydani = () => {
    if (relace.roleUradu !== 'spravce') {
      setChyba('Krizové hlášení smí vydat pouze správce obce.')
      return
    }

    if (druh === 'krize') {
      if (!titulek.trim() || !text.trim()) {
        setChyba('Vyplňte prosím titulek i text hlášení.')
        return
      }
      if (odkazUrl.trim() && !bezpecnyOdkaz(odkazUrl.trim())) {
        setChyba('Adresa odkazu musí začínat https:// nebo interní cestou /.')
        return
      }
    } else {
      if (!rozhlasText.trim()) {
        setChyba('Zadejte prosím text oznámení rozhlasu.')
        return
      }
    }
    setChyba(null)
    setModalPotvrzeniVydat(true)
  }

  // Potvrzení a reálné odeslání (Správce)
  const potvrditVydani = async () => {
    try {
      const slug = relace.obec || 'javori-lhota'
      if (druh === 'krize') {
        const vydane = await zdroj.urad.vydatKrizi(
          slug,
          {
            uroven,
            titulek: titulek.trim(),
            text: text.trim(),
            odkazText: odkazText.trim() || undefined,
            odkazUrl: odkazUrl.trim() || undefined,
            casti: vybraneCasti.length > 0 ? vybraneCasti : undefined,
          },
          'spravce',
        )
        zobrazitOznameni(vydane.titulek, vydane.uroven, 'krize')
      } else {
        const vydane = await zdroj.urad.vydatRozhlas(
          slug,
          {
            text: rozhlasText.trim(),
            casti: vybraneCasti.length > 0 ? vybraneCasti : undefined,
          },
          'spravce',
        )
        zobrazitOznameni(vydane.text, 'info', 'informace')
      }

      setModalPotvrzeniVydat(false)
      setZpravaUspech(
        'Hlášení bylo úspěšně vydáno a je okamžitě viditelné občanům v aplikaci i na webu.',
      )
      setTitulek('')
      setText('')
      setRozhlasText('')
      setOdkazText('')
      setOdkazUrl('')
      void nactiAktivniKrize()
    } catch (err) {
      console.warn('Chyba při vydávání krize:', err)
      setChyba('Vydání hlášení selhalo. Zkontrolujte oprávnění správce.')
      setModalPotvrzeniVydat(false)
    }
  }

  // Ukončení platnosti hlášení (Správce)
  const potvrditUkonceni = async () => {
    if (!modalPotvrzeniUkoncit) return
    try {
      const slug = relace.obec || 'javori-lhota'
      await zdroj.urad.ukoncitKrizi(slug, String(modalPotvrzeniUkoncit.id), 'spravce')
      setModalPotvrzeniUkoncit(null)
      setZpravaUspech('Platnost krizového hlášení byla ukončena. Hlášení zůstává archivováno.')
      void nactiAktivniKrize()
    } catch (err) {
      console.warn('Chyba při ukončení platnosti:', err)
      setChyba('Ukončení platnosti selhalo.')
      setModalPotvrzeniUkoncit(null)
    }
  }

  // Vydání konceptu správcem
  const vydatKoncept = async (koncept: KonceptKrize) => {
    if (relace.roleUradu !== 'spravce') return
    try {
      const slug = relace.obec || 'javori-lhota'
      const vydane = await zdroj.urad.vydatKrizi(slug, koncept, 'spravce')
      zobrazitOznameni(vydane.titulek, vydane.uroven, 'krize')

      // Odstranění z konceptů
      const zbyle = koncepty.filter((k) => k.id !== koncept.id)
      setKoncepty(zbyle)
      try {
        if (typeof window !== 'undefined' || typeof navigator !== 'undefined') {
          await AsyncStorage.setItem(KLIC_KONCEPTY, JSON.stringify(zbyle))
        }
      } catch {
        // Ignoruj
      }

      setZpravaUspech(`Koncept „${koncept.titulek}“ byl úspěšně vydán.`)
      void nactiAktivniKrize()
    } catch (err) {
      console.warn('Chyba při vydání konceptu:', err)
      setChyba('Vydání konceptu selhalo.')
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
        Krize a rozhlas
      </Text>
      <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
        Vydávání varovných krizových hlášení a obecního rozhlasu. Vydat hlášení smí pouze správce
        obce.
      </Text>

      {zpravaUspech && (
        <Karta style={styles.uspechBox}>
          <Text
            style={[
              styles.uspechNadpis,
              { color: '#166534', fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            Úspěšně provedeno
          </Text>
          <Text style={[styles.uspechText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            {zpravaUspech}
          </Text>
          <Tlacitko
            nazev="Zavřít"
            varianta="ghost"
            onPress={() => setZpravaUspech(null)}
            style={{ marginTop: 6 }}
          />
        </Karta>
      )}

      {/* Volba druhu oznámení */}
      <View style={styles.druhPrepinac}>
        <Pressable
          onPress={() => setDruh('krize')}
          style={[
            styles.druhTlacitko,
            {
              backgroundColor: druh === 'krize' ? barvy.primary : barvy.surface,
              borderColor: druh === 'krize' ? barvy.primary : barvy.line,
            },
          ]}
        >
          <Text
            style={[
              styles.druhText,
              {
                color: druh === 'krize' ? barvy.onPrimary : barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Krizové hlášení
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setDruh('rozhlas')}
          style={[
            styles.druhTlacitko,
            {
              backgroundColor: druh === 'rozhlas' ? barvy.primary : barvy.surface,
              borderColor: druh === 'rozhlas' ? barvy.primary : barvy.line,
            },
          ]}
        >
          <Text
            style={[
              styles.druhText,
              {
                color: druh === 'rozhlas' ? barvy.onPrimary : barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Oznámení rozhlasu
          </Text>
        </Pressable>
      </View>

      {/* Formulář Krizového hlášení */}
      {druh === 'krize' ? (
        <View style={styles.formular}>
          <Text
            style={[
              styles.sekceNadpis,
              { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            Úroveň závažnosti hlášení (slovem)
          </Text>
          <View style={styles.urovenSkupina}>
            <Pressable
              onPress={() => setUroven('info')}
              style={[
                styles.urovenKarta,
                {
                  backgroundColor: uroven === 'info' ? '#DCFCE7' : barvy.surface,
                  borderColor: uroven === 'info' ? '#22C55E' : barvy.line,
                  borderWidth: uroven === 'info' ? 2 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.urovenNazev,
                  { color: '#166534', fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
                ]}
              >
                Informace obce
              </Text>
              <Text style={[styles.urovenPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                Odstávky vody, svoz odpadu, běžná upozornění.
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setUroven('warning')}
              style={[
                styles.urovenKarta,
                {
                  backgroundColor: uroven === 'warning' ? '#FEF6D8' : barvy.surface,
                  borderColor: uroven === 'warning' ? '#CA8504' : barvy.line,
                  borderWidth: uroven === 'warning' ? 2 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.urovenNazev,
                  { color: '#2A1B00', fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
                ]}
              >
                Výstraha
              </Text>
              <Text style={[styles.urovenPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                Zhoršené počasí, silný vítr, náledí.
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setUroven('emergency')}
              style={[
                styles.urovenKarta,
                {
                  backgroundColor: uroven === 'emergency' ? '#FEE2E2' : barvy.surface,
                  borderColor: uroven === 'emergency' ? '#EF4444' : barvy.line,
                  borderWidth: uroven === 'emergency' ? 2 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.urovenNazev,
                  { color: '#991B1B', fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
                ]}
              >
                Krizová situace
              </Text>
              <Text style={[styles.urovenPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                Povodně, požár, evakuace. Nelze skrýt!
              </Text>
            </Pressable>
          </View>

          <View style={styles.poleBlok}>
            <Pole
              popisek="Titulek hlášení (max 90 znaků)"
              value={titulek}
              onChangeText={setTitulek}
              maxLength={MAX_TITULEK}
              placeholder="Např. Přerušení dodávky pitné vody"
            />
            <Text style={[styles.pocitadlo, { color: barvy.muted, fontFamily: pismo.rodina }]}>
              {zbyvaZnakuTitulek >= 0
                ? `Zbývá ${zbyvaZnakuTitulek} znaků`
                : `Překročeno o ${-zbyvaZnakuTitulek} znaků`}
            </Text>
          </View>

          <View style={styles.poleBlok}>
            <Pole
              popisek="Podrobný text hlášení (max 300 znaků)"
              value={text}
              onChangeText={setText}
              maxLength={MAX_TEXT}
              multiline
              placeholder="Popište situaci, doporučení občanům a předpokládanou dobu trvání..."
            />
            <Text style={[styles.pocitadlo, { color: barvy.muted, fontFamily: pismo.rodina }]}>
              {zbyvaZnakuText >= 0
                ? `Zbývá ${zbyvaZnakuText} znaků`
                : `Překročeno o ${-zbyvaZnakuText} znaků`}
            </Text>
          </View>

          <Pole
            popisek="Text odkazu (volitelné)"
            value={odkazText}
            onChangeText={setOdkazText}
            placeholder="Více informací na webu obce"
            volitelne
          />

          <Pole
            popisek="Adresa odkazu (jen https:// nebo cesta /...)"
            value={odkazUrl}
            onChangeText={setOdkazUrl}
            placeholder="https://javorilhota.cz/odstavka"
            volitelne
          />

          {/* Výběr částí obce */}
          <Text
            style={[
              styles.sekceNadpis,
              { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            Části obce, kterých se hlášení týká:
          </Text>
          <Text style={[styles.poleNapoveda, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Nevyberete-li žádnou část, hlášení platí pro celou obec.
          </Text>
          <View style={styles.castiSeznam}>
            {['Javoří Lhota', 'Podjavoří', 'Hájek', 'Na Rovném'].map((cast) => {
              const vybrana = vybraneCasti.includes(cast)
              return (
                <Pressable
                  key={cast}
                  onPress={() => prepnoutCast(cast)}
                  style={[
                    styles.castCip,
                    {
                      backgroundColor: vybrana ? barvy.primary : barvy.surface,
                      borderColor: vybrana ? barvy.primary : barvy.line,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.castText,
                      {
                        color: vybrana ? barvy.onPrimary : barvy.ink,
                        fontFamily: pismo.rodina,
                        fontWeight: pismo.vahy.polotucne,
                      },
                    ]}
                  >
                    {vybrana ? `✓ ${cast}` : cast}
                  </Text>
                </Pressable>
              )
            })}
          </View>

          {/* Živý náhled banneru */}
          <Text
            style={[
              styles.sekceNadpis,
              { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            Náhled banneru (takto jej uvidí občan):
          </Text>
          <KrizovyBanner
            hlavni={{
              id: 'nahled',
              uroven,
              titulek: titulek.trim() || 'Titulek krizového hlášení',
              text: text.trim() || 'Zde se zobrazí text hlášení pro občany.',
              odkazText: odkazText.trim() || null,
              odkazUrl: odkazUrl.trim() || null,
              casti: vybraneCasti,
              platiOd: new Date().toISOString(),
              platiDo: null,
              updatedAt: new Date().toISOString(),
            }}
          />

          {chyba && (
            <Text style={[styles.chybovaZprava, { color: krize.warning.ink, fontFamily: pismo.rodina }]}>
              {chyba}
            </Text>
          )}

          {/* Tlačítka podle role */}
          <View style={styles.tlacitkaAkci}>
            {relace.roleUradu === 'spravce' ? (
              <Tlacitko
                nazev="Vydat krizové hlášení"
                onPress={zahajitVydani}
                style={styles.hlavniTlacitko}
              />
            ) : (
              <View style={styles.redaktorBlok}>
                <Tlacitko
                  nazev="Uložit koncept"
                  onPress={ulozitKoncept}
                  style={styles.hlavniTlacitko}
                />
                <Text style={[styles.redaktorPoznamka, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                  Krizové hlášení vydává správce obce. Koncept se uloží k jeho posouzení.
                </Text>
              </View>
            )}
            {relace.roleUradu === 'spravce' && (
              <Tlacitko
                nazev="Uložit jako koncept"
                varianta="ghost"
                onPress={ulozitKoncept}
              />
            )}
          </View>
        </View>
      ) : (
        /* Formulář Rozhlasu */
        <View style={styles.formular}>
          <View style={styles.poleBlok}>
            <Pole
              popisek="Text hlášení rozhlasu (max 300 znaků)"
              value={rozhlasText}
              onChangeText={setRozhlasText}
              maxLength={MAX_TEXT}
              multiline
              placeholder="Vyhlášení obecního rozhlasu: zítra proběhne svoz nebezpečného odpadu..."
            />
            <Text style={[styles.pocitadlo, { color: barvy.muted, fontFamily: pismo.rodina }]}>
              {zbyvaZnakuRozhlas >= 0
                ? `Zbývá ${zbyvaZnakuRozhlas} znaků`
                : `Překročeno o ${-zbyvaZnakuRozhlas} znaků`}
            </Text>
          </View>

          {chyba && (
            <Text style={[styles.chybovaZprava, { color: krize.warning.ink, fontFamily: pismo.rodina }]}>
              {chyba}
            </Text>
          )}

          <View style={styles.tlacitkaAkci}>
            {relace.roleUradu === 'spravce' ? (
              <Tlacitko
                nazev="Vydat do obecního rozhlasu"
                onPress={zahajitVydani}
                style={styles.hlavniTlacitko}
              />
            ) : (
              <View style={styles.redaktorBlok}>
                <Tlacitko
                  nazev="Uložit koncept rozhlasu"
                  onPress={ulozitKoncept}
                  style={styles.hlavniTlacitko}
                />
                <Text style={[styles.redaktorPoznamka, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                  Oznámení rozhlasu vydává správce obce.
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Seznam konceptů (vidí správce i redaktor) */}
      {koncepty.length > 0 && (
        <View style={styles.sekceKoncepty}>
          <Text
            style={[
              styles.sekceNadpis,
              { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            Uložené koncepty k vydání ({koncepty.length})
          </Text>

          <View style={styles.konceptySeznam}>
            {koncepty.map((koncept) => (
              <Karta key={koncept.id} style={styles.konceptKarta}>
                <View style={styles.konceptHlavicka}>
                  <Text
                    style={[
                      styles.konceptTitulek,
                      { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
                    ]}
                  >
                    {koncept.titulek}
                  </Text>
                  <Text style={[styles.konceptAutor, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                    Autor: {koncept.autor}
                  </Text>
                </View>
                <Text style={[styles.konceptText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                  {koncept.text}
                </Text>
                {relace.roleUradu === 'spravce' && (
                  <Tlacitko
                    nazev="Vydat tento koncept"
                    varianta="secondary"
                    onPress={() => void vydatKoncept(koncept)}
                    style={{ marginTop: 6 }}
                  />
                )}
              </Karta>
            ))}
          </View>
        </View>
      )}

      {/* Aktivní vydaná hlášení s možností ukončit platnost */}
      {aktivniHlaseniList.length > 0 && (
        <View style={styles.sekceAktivni}>
          <Text
            style={[
              styles.sekceNadpis,
              { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
            ]}
          >
            Právě aktivní hlášení
          </Text>

          {aktivniHlaseniList.map((h) => (
            <Karta key={h.id} style={styles.aktivniKarta}>
              <Text
                style={[
                  styles.aktivniTitulek,
                  { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
                ]}
              >
                {h.titulek}
              </Text>
              <Text style={[styles.aktivniText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
                {h.text}
              </Text>
              <Text style={[styles.nemazatPoznamka, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                Hlášení nejde smazat z důvodu právní auditovatelnosti. Lze pouze ukončit jeho platnost.
              </Text>

              {relace.roleUradu === 'spravce' && (
                <Tlacitko
                  nazev="Ukončit platnost hlášení"
                  varianta="ghost"
                  onPress={() => setModalPotvrzeniUkoncit(h)}
                  style={{ marginTop: 6 }}
                />
              )}
            </Karta>
          ))}
        </View>
      )}

      {/* Dialog potvrzení vydání (Správce) */}
      <Modal
        visible={modalPotvrzeniVydat}
        transparent
        animationType="fade"
        onRequestClose={() => setModalPotvrzeniVydat(false)}
      >
        <View style={styles.modalZatemneni}>
          <View style={[styles.modalObsah, { backgroundColor: barvy.surface, borderColor: barvy.line }]}>
            <Text
              style={[
                styles.modalNadpis,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              Potvrdit vydání hlášení
            </Text>
            <Text style={[styles.modalPopis, { color: barvy.ink, fontFamily: pismo.rodina }]}>
              Opravdu si přejete okamžitě vydat toto hlášení pro všechny občany?{'\n\n'}
              Titulek: {druh === 'krize' ? titulek : 'Rozhlas'}{'\n'}
              Úroveň: {uroven === 'emergency' ? 'Krizová situace' : uroven === 'warning' ? 'Výstraha' : 'Informace obce'}{'\n'}
              Rozsah: {vybraneCasti.length > 0 ? vybraneCasti.join(', ') : 'Celá obec'}
            </Text>
            <View style={styles.modalTlacitka}>
              <Tlacitko nazev="Ano, vydat hlášení" onPress={potvrditVydani} />
              <Tlacitko nazev="Zpět k úpravám" varianta="ghost" onPress={() => setModalPotvrzeniVydat(false)} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Dialog potvrzení ukončení platnosti */}
      <Modal
        visible={modalPotvrzeniUkoncit !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setModalPotvrzeniUkoncit(null)}
      >
        <View style={styles.modalZatemneni}>
          <View style={[styles.modalObsah, { backgroundColor: barvy.surface, borderColor: barvy.line }]}>
            <Text
              style={[
                styles.modalNadpis,
                { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.polotucne },
              ]}
            >
              Ukončit platnost hlášení?
            </Text>
            <Text style={[styles.modalPopis, { color: barvy.ink, fontFamily: pismo.rodina }]}>
              Hlášení „{modalPotvrzeniUkoncit?.titulek}“ bude okamžitě staženo z horního banneru
              občanů. Zůstane uloženo v historii pro případný audit.
            </Text>
            <View style={styles.modalTlacitka}>
              <Tlacitko nazev="Ano, ukončit platnost" onPress={potvrditUkonceni} />
              <Tlacitko nazev="Ponechat aktivní" varianta="ghost" onPress={() => setModalPotvrzeniUkoncit(null)} />
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
  druhPrepinac: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  druhTlacitko: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  druhText: {
    fontSize: 14,
  },
  formular: {
    gap: 16,
    marginBottom: 20,
  },
  sekceNadpis: {
    fontSize: 16,
  },
  urovenSkupina: {
    gap: 8,
  },
  urovenKarta: {
    padding: 12,
    borderRadius: 8,
    gap: 4,
    minHeight: 44,
  },
  urovenNazev: {
    fontSize: 15,
  },
  urovenPopis: {
    fontSize: 12,
  },
  poleBlok: {
    gap: 4,
  },
  pocitadlo: {
    fontSize: 12,
    textAlign: 'right',
  },
  poleNapoveda: {
    fontSize: 13,
  },
  castiSeznam: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  castCip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  castText: {
    fontSize: 13,
  },
  chybovaZprava: {
    fontSize: 14,
  },
  tlacitkaAkci: {
    gap: 8,
    marginTop: 8,
  },
  hlavniTlacitko: {
    minHeight: 44,
  },
  redaktorBlok: {
    gap: 6,
  },
  redaktorPoznamka: {
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  sekceKoncepty: {
    gap: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  konceptySeznam: {
    gap: 10,
  },
  konceptKarta: {
    padding: 14,
    gap: 6,
  },
  konceptHlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  konceptTitulek: {
    fontSize: 15,
  },
  konceptAutor: {
    fontSize: 12,
  },
  konceptText: {
    fontSize: 13,
    lineHeight: 18,
  },
  sekceAktivni: {
    gap: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  aktivniKarta: {
    padding: 14,
    gap: 6,
  },
  aktivniTitulek: {
    fontSize: 15,
  },
  aktivniText: {
    fontSize: 13,
    lineHeight: 18,
  },
  nemazatPoznamka: {
    fontSize: 12,
    fontStyle: 'italic',
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
    gap: 10,
  },
  modalNadpis: {
    fontSize: 18,
    marginBottom: 4,
  },
  modalPopis: {
    fontSize: 14,
    lineHeight: 20,
  },
  modalTlacitka: {
    gap: 8,
    marginTop: 8,
  },
})
