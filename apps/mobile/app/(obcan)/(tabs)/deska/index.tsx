import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { useZdroj } from '@/zdroj'
import { useRelace } from '@/stav/relace'
import { Pole, Karta } from '@/ui'
import type { DokumentDesky, KategorieDesky } from '@codekom/typy'
import { formatDay } from '@codekom/typy/pravidla'

export default function DeskaSeznamScreen() {
  const router = useRouter()
  const { barvy, pismo } = useTema()
  const { zdroj } = useZdroj()
  const { relace } = useRelace()

  const [dokumenty, setDokumenty] = useState<DokumentDesky[]>([])
  const [archiv, setArchiv] = useState(false)
  const [vybranaKategorie, setVybranaKategorie] = useState<string | null>(null)
  const [hledani, setHledani] = useState('')
  const [nacitaSe, setNacitaSe] = useState(true)
  const [kategorieDesky, setKategorieDesky] = useState<KategorieDesky[]>([])

  useEffect(() => {
    let aktivni = true
    zdroj
      .kategorieDesky(relace.obec || 'javori-lhota')
      .then((k) => {
        if (aktivni) setKategorieDesky(k)
      })
      .catch((err: unknown) => console.warn('Chyba při načítání kategorií desky:', err))
    return () => {
      aktivni = false
    }
  }, [zdroj, relace.obec])

  const filtry = [{ id: 'vse', nazev: 'Vše' }, ...kategorieDesky]
  const nazevKategorie = (id: string) => kategorieDesky.find((k) => k.id === id)?.nazev ?? id

  const nactiDokumenty = useCallback(async () => {
    setNacitaSe(true)
    try {
      const slug = relace.obec || 'javori-lhota'
      const polozky = await zdroj.deska(slug, {
        kategorie: vybranaKategorie,
        hledani: hledani.trim(),
        archiv,
      })
      setDokumenty(polozky)
    } catch (err) {
      console.warn('Chyba při načítání desky:', err)
    } finally {
      setNacitaSe(false)
    }
  }, [zdroj, relace.obec, vybranaKategorie, hledani, archiv])

  useEffect(() => {
    void nactiDokumenty()
  }, [nactiDokumenty])

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
        Úřední deska
      </Text>

      {/* Přepínač vyvěšené / archiv */}
      <View
        style={[styles.prepinar, { backgroundColor: barvy.surface, borderColor: barvy.line }]}
        role="tablist"
      >
        <Pressable
          role="tab"
          accessibilityRole="tab"
          accessibilityLabel="Vyvěšené dokumenty"
          accessibilityState={{ selected: !archiv }}
          onPress={() => setArchiv(false)}
          style={[
            styles.prepinarTlacitko,
            !archiv && { backgroundColor: barvy.primary },
          ]}
        >
          <Text
            style={[
              styles.prepinarText,
              {
                color: !archiv ? barvy.onPrimary : barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Aktuálně vyvěšené
          </Text>
        </Pressable>

        <Pressable
          role="tab"
          accessibilityRole="tab"
          accessibilityLabel="Archiv sejmutých dokumentů"
          accessibilityState={{ selected: archiv }}
          onPress={() => setArchiv(true)}
          style={[
            styles.prepinarTlacitko,
            archiv && { backgroundColor: barvy.primary },
          ]}
        >
          <Text
            style={[
              styles.prepinarText,
              {
                color: archiv ? barvy.onPrimary : barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Archiv
          </Text>
        </Pressable>
      </View>

      {/* Vyhledávací pole */}
      <Pole
        popisek="Hledat na desce"
        placeholder="Název nebo číslo jednací..."
        value={hledani}
        onChangeText={setHledani}
      />

      {/* Kategorie */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.kategorieSeznam}
      >
        {filtry.map((kat) => {
          const jeVybrana =
            kat.id === 'vse' ? vybranaKategorie === null : vybranaKategorie === kat.id
          return (
            <Pressable
              key={kat.id}
              role="button"
              accessibilityRole="button"
              accessibilityLabel={`Filtrovat kategorii ${kat.nazev}`}
              accessibilityState={{ selected: jeVybrana }}
              onPress={() => setVybranaKategorie(kat.id === 'vse' ? null : kat.id)}
              style={({ pressed }) => [
                styles.kategorieStitek,
                {
                  backgroundColor: jeVybrana ? barvy.primary : barvy.surface,
                  borderColor: jeVybrana ? barvy.primary : barvy.line,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.kategorieNazev,
                  {
                    color: jeVybrana ? barvy.onPrimary : barvy.ink,
                    fontFamily: pismo.rodina,
                    fontWeight: pismo.vahy.stredni,
                  },
                ]}
              >
                {kat.nazev}
              </Text>
            </Pressable>
          )
        })}
      </ScrollView>

      {/* Seznam dokumentů */}
      {nacitaSe ? (
        <ActivityIndicator
          size="large"
          color={barvy.primary}
          style={styles.nacitac}
          accessibilityLabel="Načítání dokumentů"
        />
      ) : dokumenty.length > 0 ? (
        <View style={styles.seznam}>
          {dokumenty.map((dok) => (
            <Karta
              key={dok.id}
              onPress={() => router.push(`/(obcan)/(tabs)/deska/${dok.id}`)}
              popisekProCtecku={`Dokument: ${dok.nazev}, vyvěšeno od ${formatDay(dok.vyvesenoOd)}`}
            >
              <Text
                style={[
                  styles.dokNazev,
                  {
                    color: barvy.ink,
                    fontFamily: pismo.rodina,
                    fontWeight: pismo.vahy.polotucne,
                  },
                ]}
              >
                {dok.nazev}
              </Text>
              <Text style={[styles.dokCislo, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                Č.j.: {dok.cisloJednaci}
              </Text>
              <View style={styles.dokPata}>
                <Text
                  style={[
                    styles.dokKategorie,
                    {
                      color: barvy.primary,
                      fontFamily: pismo.rodina,
                    },
                  ]}
                >
                  {nazevKategorie(dok.kategorie)}
                </Text>
                <Text style={[styles.dokDatum, { color: barvy.muted, fontFamily: pismo.rodina }]}>
                  {archiv
                    ? `Sejmuto ${dok.vyvesenoDo ? formatDay(dok.vyvesenoDo) : '–'}`
                    : `Vyvěšeno ${formatDay(dok.vyvesenoOd)}`}
                </Text>
              </View>
            </Karta>
          ))}
        </View>
      ) : (
        <View style={styles.prazdno}>
          <Text style={[styles.prazdnoText, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Nebyly nalezeny žádné dokumenty odpovídající zadaným filtrům.
          </Text>
        </View>
      )}
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
    marginBottom: 16,
  },
  prepinar: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    padding: 2,
    marginBottom: 12,
  },
  prepinarTlacitko: {
    flex: 1,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  prepinarText: {
    fontSize: 14,
  },
  kategorieSeznam: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
    marginBottom: 8,
  },
  kategorieStitek: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kategorieNazev: {
    fontSize: 13,
  },
  nacitac: {
    marginVertical: 40,
  },
  seznam: {
    marginTop: 8,
  },
  dokNazev: {
    fontSize: 16,
    marginBottom: 4,
    lineHeight: 21,
  },
  dokCislo: {
    fontSize: 13,
    marginBottom: 6,
  },
  dokPata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dokKategorie: {
    fontSize: 12,
    fontWeight: '600',
  },
  dokDatum: {
    fontSize: 12,
  },
  prazdno: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  prazdnoText: {
    fontSize: 14,
    textAlign: 'center',
  },
})
