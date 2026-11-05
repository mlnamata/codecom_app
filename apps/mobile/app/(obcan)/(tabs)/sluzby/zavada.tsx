import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { useZdroj } from '@/zdroj'
import { useRelace } from '@/stav/relace'
import { useOznameni } from '@/stav/oznameni'
import { Pole, Tlacitko, Karta } from '@/ui'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { KATEGORIE_ZAVAD, vzhledKategorieZavady } from '@/zdroj/kategorieZavad'
import { Ikona } from '@/ui/Ikony'

const MAX_POPIS = 1000
const KLIC_MOJE_HLASENI = 'codekom.ukazka.moje_hlaseni'

export default function NahlasitZavaduScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()
  const { zdroj } = useZdroj()
  const { relace } = useRelace()
  const { zobrazitOznameni } = useOznameni()

  // Kategorii lze předvybrat z přehledu (?kategorie=vysoka-trava).
  const { kategorie: predvybrana } = useLocalSearchParams<{ kategorie?: string }>()
  const [vybranaKategorie, setVybranaKategorie] = useState<string>(
    KATEGORIE_ZAVAD.some((k) => k.id === predvybrana)
      ? (predvybrana as string)
      : (KATEGORIE_ZAVAD[0]?.id ?? 'jine'),
  )
  const [popis, setPopis] = useState('')
  const [popisMista, setPopisMista] = useState('')
  const [poloha, setPoloha] = useState<{ lat: number; lng: number } | null>(null)
  const [pocetFotek, setPocetFotek] = useState(0)
  const [odesilaSe, setOdesilaSe] = useState(false)
  const [chyba, setChyba] = useState<string | null>(null)
  const [vysledek, setVysledek] = useState<{ cislo: string; sledovaciKod: string } | null>(null)

  const zbyvaZnaku = MAX_POPIS - popis.length

  const pouzitPolohu = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPoloha({
            lat: Math.round(pos.coords.latitude * 10000) / 10000,
            lng: Math.round(pos.coords.longitude * 10000) / 10000,
          })
        },
        () => {
          // Fallback na vzorové souřadnice Javoří Lhoty
          setPoloha({ lat: 49.3951, lng: 13.2952 })
        },
      )
    } else {
      setPoloha({ lat: 49.3951, lng: 13.2952 })
    }
  }

  const pridatUkazkovouFotku = () => {
    setPocetFotek((p) => Math.min(3, p + 1))
  }

  const odeslatHlaseni = async () => {
    if (!popis.trim()) {
      setChyba('Zadejte prosím popis závady.')
      return
    }
    setChyba(null)
    setOdesilaSe(true)

    try {
      const slug = relace.obec || 'javori-lhota'
      const res = await zdroj.odeslatZavadu(slug, {
        kategorie: vybranaKategorie,
        popis: popis.trim(),
        popisMista: popisMista.trim() || undefined,
        poloha: poloha || undefined,
        pocetFotek,
      })

      // Uložení sledovacího kódu do seznamu „Moje hlášení“
      try {
        if (typeof window !== 'undefined' || typeof navigator !== 'undefined') {
          const ulozene = await AsyncStorage.getItem(KLIC_MOJE_HLASENI)
          const kody = ulozene ? (JSON.parse(ulozene) as string[]) : []
          if (!kody.includes(res.sledovaciKod)) {
            await AsyncStorage.setItem(
              KLIC_MOJE_HLASENI,
              JSON.stringify([res.sledovaciKod, ...kody]),
            )
          }
        }
      } catch {
        // Ignoruj chybu při ukládání do AsyncStorage
      }

      setVysledek(res)
      zobrazitOznameni(`Hlášení závady ${res.cislo} bylo úspěšně odesláno.`, 'info', 'mojeHlaseni')
    } catch (err) {
      console.warn('Chyba při odesílání závady:', err)
      setChyba('Odeslání hlášení selhalo. Zkuste to prosím znovu.')
    } finally {
      setOdesilaSe(false)
    }
  }

  if (vysledek) {
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
          Hlášení bylo odesláno
        </Text>

        <Karta style={styles.vysledekKarta}>
          <Text style={[styles.vysledekStitek, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Číslo hlášení:
          </Text>
          <Text
            style={[
              styles.vysledekHodnota,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            {vysledek.cislo}
          </Text>

          <Text
            style={[
              styles.vysledekStitek,
              { color: barvy.muted, fontFamily: pismo.rodina, marginTop: 12 },
            ]}
          >
            Sledovací kód pro kontrolu stavu:
          </Text>
          <Text
            style={[
              styles.vysledekKod,
              {
                color: barvy.primary,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            {vysledek.sledovaciKod}
          </Text>

          <Text style={[styles.stavText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
            Stav: <Text style={{ fontWeight: '600' }}>Přijato (nové)</Text>
          </Text>
        </Karta>

        <Text style={[styles.ukazkaPoznamka, { color: barvy.muted, fontFamily: pismo.rodina }]}>
          Ukázka: fotka ani osobní údaje se na server neukládají. Sledovací kód byl uložen do tohoto
          prohlížeče.
        </Text>

        <View style={styles.tlacitka}>
          <Tlacitko
            nazev="Sledovat stav hlášení"
            onPress={() =>
              router.push({
                pathname: '/(obcan)/(tabs)/sluzby/sledovani',
                params: { kod: vysledek.sledovaciKod },
              })
            }
          />
          <Tlacitko
            nazev="Zpět na služby"
            varianta="ghost"
            onPress={() => router.replace('/(obcan)/(tabs)/sluzby')}
          />
        </View>
      </ScrollView>
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
        Nahlásit závadu
      </Text>

      {/* Tísňové varování */}
      <View
        style={[styles.varovaniBox, { backgroundColor: '#FEF6D8', borderColor: '#CA8504' }]}
        role="note"
        aria-label="Upozornění k tísňovému volání"
      >
        <Text
          style={[
            styles.varovaniText,
            {
              color: '#2A1B00',
              fontFamily: pismo.rodina,
              fontWeight: pismo.vahy.stredni,
            },
          ]}
        >
          Nouzi nehlaste, volejte 112, 150, 155 nebo 158.
        </Text>
      </View>

      <Text style={[styles.soukromiUpozorneni, { color: barvy.muted, fontFamily: pismo.rodina }]}>
        V ukázce nepište skutečné osobní údaje.
      </Text>

      {/* Volba kategorie */}
      <Text
        style={[
          styles.poleNadpis,
          {
            color: barvy.ink,
            fontFamily: pismo.rodina,
            fontWeight: pismo.vahy.polotucne,
          },
        ]}
      >
        Co se děje?
      </Text>
      <View style={styles.kategorieWrap} role="radiogroup" aria-label="Kategorie závady">
        {KATEGORIE_ZAVAD.map((kat) => {
          const vybrana = vybranaKategorie === kat.id
          const vzhled = vzhledKategorieZavady(kat.id)
          return (
            <Pressable
              key={kat.id}
              role="radio"
              accessibilityRole="radio"
              accessibilityLabel={kat.nazev}
              accessibilityState={{ checked: vybrana }}
              aria-checked={vybrana}
              onPress={() => setVybranaKategorie(kat.id)}
              style={({ pressed }) => [
                styles.kategorieDlazdice,
                {
                  backgroundColor: barvy.surface,
                  borderColor: vybrana ? barvy.ink : 'transparent',
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <View style={[styles.kategorieIkona, { backgroundColor: vzhled.pozadi }]}>
                <Ikona nazev={vzhled.ikona} barva={vzhled.barva} velikost={24} />
              </View>
              <Text
                numberOfLines={2}
                style={[
                  styles.kategorieText,
                  {
                    color: barvy.ink,
                    fontFamily: pismo.rodina,
                    fontWeight: vybrana ? pismo.vahy.tucne : pismo.vahy.stredni,
                  },
                ]}
              >
                {kat.nazev}
              </Text>
              {vybrana && (
                <View style={[styles.kategorieFajfka, { backgroundColor: barvy.accent }]}>
                  <Text style={{ color: barvy.onAccent, fontSize: 12, fontWeight: '800' }}>✓</Text>
                </View>
              )}
            </Pressable>
          )
        })}
      </View>

      {/* Popis závady */}
      <Pole
        popisek="Popis závady"
        napoveda="Uveďte co nejpřesnější popis problému."
        placeholder="Např. nesvítí pouliční lampa u domu č.p. 15..."
        multiline
        numberOfLines={4}
        maxLength={MAX_POPIS}
        value={popis}
        onChangeText={setPopis}
        chyba={chyba ?? undefined}
      />
      <Text style={[styles.pocitadloZnaku, { color: barvy.muted, fontFamily: pismo.rodina }]}>
        {zbyvaZnaku >= 0 ? `Zbývá ${zbyvaZnaku} znaků` : 'Překročen limit znaků'}
      </Text>

      {/* Místo a poloha */}
      <Pole
        popisek="Popis místa"
        placeholder="Ulice, číslo popisné, orientační bod..."
        value={popisMista}
        onChangeText={setPopisMista}
        volitelne
      />

      <View style={styles.polohaSekce}>
        <Tlacitko
          nazev={poloha ? `Poloha uložena (${poloha.lat}, ${poloha.lng})` : 'Použít moji polohu'}
          varianta="secondary"
          onPress={pouzitPolohu}
          popisekProCtecku="Získat aktuální GPS polohu pro hlášení"
        />
      </View>

      {/* Fotografie */}
      <Pressable
        role="button"
        accessibilityRole="button"
        accessibilityLabel={
          pocetFotek > 0 ? `Přidat další fotku, vybráno ${pocetFotek} ze 3` : 'Přidat fotku závady'
        }
        disabled={pocetFotek >= 3}
        onPress={pridatUkazkovouFotku}
        style={({ pressed }) => [
          styles.fotoSekce,
          {
            backgroundColor: barvy.primarySoft,
            borderColor: barvy.link,
            opacity: pocetFotek >= 3 ? 0.6 : pressed ? 0.85 : 1,
          },
        ]}
      >
        <View style={[styles.fotoIkona, { backgroundColor: barvy.accent }]}>
          <Ikona nazev="fotoaparat" barva={barvy.onAccent} velikost={28} />
        </View>
        <Text
          style={[
            styles.fotoNadpis,
            { color: barvy.ink, fontFamily: pismo.rodina, fontWeight: pismo.vahy.tucne },
          ]}
        >
          {pocetFotek > 0 ? `Vybráno fotek: ${pocetFotek} ze 3` : 'Vyfoťte závadu'}
        </Text>
        <Text style={[styles.fotoVarovani, { color: barvy.muted, fontFamily: pismo.rodina }]}>
          Volitelné. Nefoťte lidi ani registrační značky vozidel.
        </Text>
      </Pressable>

      {/* Odeslání */}
      <View style={styles.odeslatSekce}>
        <Tlacitko
          nazev="Odeslat hlášení závady"
          varianta="akcent"
          onPress={() => void odeslatHlaseni()}
          nacitani={odesilaSe}
        />
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
  },
  titulek: {
    fontSize: 30,
    letterSpacing: -0.6,
    lineHeight: 36,
    marginBottom: 8,
  },
  varovaniBox: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  varovaniText: {
    fontSize: 14,
  },
  soukromiUpozorneni: {
    fontSize: 12,
    marginBottom: 16,
  },
  poleNadpis: {
    fontSize: 15,
    marginBottom: 6,
  },
  kategorieWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  kategorieDlazdice: {
    // Tři dlaždice v řádku; poslední se neroztahuje přes celou šířku.
    width: '31.5%',
    minHeight: 108,
    borderRadius: 22,
    borderWidth: 2,
    padding: 12,
    gap: 8,
    alignItems: 'flex-start',
    shadowColor: '#111311',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  kategorieIkona: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kategorieText: {
    fontSize: 13.5,
    lineHeight: 17,
  },
  kategorieFajfka: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pocitadloZnaku: {
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 12,
  },
  polohaSekce: {
    marginVertical: 8,
  },
  fotoSekce: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    marginVertical: 12,
    alignItems: 'center',
    gap: 6,
  },
  fotoIkona: {
    width: 60,
    height: 60,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  fotoNadpis: {
    fontSize: 17,
  },
  fotoVarovani: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  odeslatSekce: {
    marginTop: 16,
  },
  vysledekKarta: {
    padding: 20,
    marginVertical: 16,
  },
  vysledekStitek: {
    fontSize: 13,
  },
  vysledekHodnota: {
    fontSize: 18,
    marginTop: 2,
  },
  vysledekKod: {
    fontSize: 24,
    letterSpacing: 2,
    marginTop: 2,
    marginBottom: 8,
  },
  stavText: {
    fontSize: 14,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  ukazkaPoznamka: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 20,
  },
  tlacitka: {
    gap: 8,
  },
})
