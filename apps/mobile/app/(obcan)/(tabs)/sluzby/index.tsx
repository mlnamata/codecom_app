import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { Karta } from '@/ui'
import { Ikona, type NazevIkony } from '@/ui/Ikony'

interface PolozkaSluzbyProps {
  cil: string
  ikona: NazevIkony
  /** Barva ikony a tónované pozadí dlaždice (kontrast ikony ≥ 3 : 1). */
  barva: string
  pozadi: string
  nazev: string
  popis: string
  popisekProCtecku: string
}

/** Řádek služby: barevná dlaždice s ikonou, název, popis a šipka. */
function PolozkaSluzby({
  cil,
  ikona,
  barva,
  pozadi,
  nazev,
  popis,
  popisekProCtecku,
}: PolozkaSluzbyProps) {
  const router = useRouter()
  const { barvy, pismo } = useTema()
  return (
    <Karta
      onPress={() => router.push(cil as never)}
      popisekProCtecku={popisekProCtecku}
      style={styles.polozka}
    >
      <View style={styles.polozkaRadek}>
        <View style={[styles.dlazdice, { backgroundColor: pozadi }]}>
          <Ikona nazev={ikona} barva={barva} velikost={22} />
        </View>
        <View style={styles.polozkaText}>
          <Text
            style={[
              styles.sluzbaNazev,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.tucne,
              },
            ]}
          >
            {nazev}
          </Text>
          <Text
            style={[styles.sluzbaPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}
            numberOfLines={2}
          >
            {popis}
          </Text>
        </View>
        <Ikona nazev="sipka" barva={barvy.muted} velikost={18} />
      </View>
    </Karta>
  )
}

export default function SluzbyIndexScreen() {
  const { barvy, pismo } = useTema()

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
        Služby a chytrá obec
      </Text>
      <Text style={[styles.podtitul, { color: barvy.muted, fontFamily: pismo.rodina }]}>
        Digitální služby obce Javoří Lhota, živá data senzorů, komunitní sdílení a agenda majetku.
      </Text>

      {/* 1. Základní služby úřadu */}
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
        Základní služby úřadu
      </Text>

      <View style={styles.seznam}>
        <PolozkaSluzby
          cil="/(obcan)/(tabs)/sluzby/zavada"
          ikona="zavada"
          barva="#C2410C"
          pozadi="#FFF1E6"
          popisekProCtecku="Nahlásit závadu v obci: výmoly, osvětlení, zeleň nebo odpad."
          nazev="Nahlásit závadu"
          popis="Vyfoťte nebo popište problém v obci (nesvítící lampa, výmol, přeplněný kontejner)."
        />

        <PolozkaSluzby
          cil="/(obcan)/(tabs)/sluzby/sledovani"
          ikona="lupa"
          barva="#0B7A4B"
          pozadi="#E7F5EE"
          popisekProCtecku="Sledovat stav nahlášené závady podle sledovacího kódu."
          nazev="Sledovat stav hlášení"
          popis="Zkontrolujte průběh vyřizování hlášení a veřejnou odpověď úřadu podle kódu."
        />

        <PolozkaSluzby
          cil="/(obcan)/(tabs)/sluzby/poplatky"
          ikona="platby"
          barva="#1D4ED8"
          pozadi="#E8EFFE"
          popisekProCtecku="Místní poplatky: poplatek za komunální odpad, psy a platba QR kódem."
          nazev="Místní poplatky"
          popis="Přehled sazeb za odpad a psy s platebními údaji a ukázkovou QR platbou."
        />

        <PolozkaSluzby
          cil="/(obcan)/(tabs)/sluzby/rezervace"
          ikona="rezervace"
          barva="#6D28D9"
          pozadi="#F1EAFE"
          popisekProCtecku="Rezervace obecních prostor: společenský sál a hasičárna."
          nazev="Rezervace prostor"
          popis="Žádost o rezervaci společenského sálu nebo hasičárny na rodinné a spolkové akce."
        />
      </View>

      {/* 2. Senzorika, IoT a Chytrá obec */}
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
        Senzorika, IoT a živá data
      </Text>

      <View style={styles.seznam}>
        <PolozkaSluzby
          cil="/(obcan)/(tabs)/sluzby/senzory"
          ikona="kapka"
          barva="#0369A1"
          pozadi="#E0F2FE"
          popisekProCtecku="Živá data ze senzorů LoRaWAN, hladinoměr potoka, sypače v terénu a odjezdy spojů."
          nazev="Senzorika, hladina potoka a spoje"
          popis="Stav Mlýnského potoka, kvalita ovzduší AQI, teplota vozovky, GPS poloha sypačů, parkoviště a živé odjezdy autobusů a vlaků."
        />
      </View>

      {/* 3. Komunitní sdílení a lokální ekonomika */}
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
        Komunitní sdílení a sousedé
      </Text>

      <View style={styles.seznam}>
        <PolozkaSluzby
          cil="/(obcan)/(tabs)/sluzby/pujcovna"
          ikona="klic"
          barva="#6D28D9"
          pozadi="#F1EAFE"
          popisekProCtecku="Obecní půjčovna: štípačky na dřevo, elektrocentrály a párty stany."
          nazev="Obecní půjčovna nářadí"
          popis="Sdílené vybavení a nářadí obce (štípačka, elektrocentrála, vibrační deska, párty stany)."
        />

        <PolozkaSluzby
          cil="/(obcan)/(tabs)/sluzby/bazar"
          ikona="taska"
          barva="#BE185D"
          pozadi="#FCE7F3"
          popisekProCtecku="Sousedský bazar a darovna: přebytky ze zahrady a věci za odvoz."
          nazev="Sousedský bazar a darovna"
          popis="Nabídka přebytků ze zahrady (jablka, ořechy), stavební materiál po rekonstrukci a věci za odvoz."
        />

        <PolozkaSluzby
          cil="/(obcan)/(tabs)/sluzby/spolujizda"
          ikona="auto"
          barva="#1D4ED8"
          pozadi="#E8EFFE"
          popisekProCtecku="Sousedská spolujízda carpooling: sdílení cest do práce a do škol."
          nazev="Sousedská spolujízda (Carpooling)"
          popis="Ověřená nástěnka spolujízdy do Klatov, Sušice a Plzně pro úsporu nákladů a paliva."
        />

        <PolozkaSluzby
          cil="/(obcan)/(tabs)/sluzby/dobrovolnictvi"
          ikona="ruka"
          barva="#0B7A4B"
          pozadi="#E7F5EE"
          popisekProCtecku="Burza dobrovolnictví a brigád: výsadba stromů a úklid lesa."
          nazev="Burza dobrovolnictví a brigád"
          popis="Zapojte se do brigád pořádaných obcí, hasiči a spolky a získejte občanské body."
        />
      </View>

      {/* 4. Pokročilá správa majetku a infrastruktury */}
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
        Správa majetku a infrastruktura
      </Text>

      <View style={styles.seznam}>
        <PolozkaSluzby
          cil="/(obcan)/(tabs)/sluzby/nemovitosti"
          ikona="budovy"
          barva="#475569"
          pozadi="#EEF2F6"
          popisekProCtecku="Obecní nemovitosti, byty a stavební parcely k prodeji."
          nazev="Obecní nemovitosti a byty"
          popis="Pořadník na startovací a obecní byty a nabídka zasíťovaných stavebních parcel."
        />

        <PolozkaSluzby
          cil="/(obcan)/(tabs)/sluzby/energetika"
          ikona="blesk"
          barva="#B45309"
          pozadi="#FEF3C7"
          popisekProCtecku="Komunitní energetika: solární elektrárny na škole a odběr přebytků."
          nazev="Komunitní energetika (FVE)"
          popis="Živá výroba obecních solárních elektráren na škole a úřadě a registrace do komunity EDC."
        />

        <PolozkaSluzby
          cil="/(obcan)/(tabs)/sluzby/hrbitov"
          ikona="kriz"
          barva="#475569"
          pozadi="#EEF2F6"
          popisekProCtecku="Hřbitov 2.0: pasport hrobů, platnost smluv a virtuální svíčka."
          nazev="Hřbitov 2.0 a pasport"
          popis="Digitální pasport hrobových míst, kontrola nájemních smluv a uctění památky osobností obce."
        />
      </View>

      {/* 5. Bezpečnost a krizové situace */}
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
        Bezpečnost a krizové situace
      </Text>

      <View style={styles.seznam}>
        <PolozkaSluzby
          cil="/(obcan)/(tabs)/sluzby/aed"
          ikona="srdce"
          barva="#B91C1C"
          pozadi="#FDECEC"
          popisekProCtecku="AED defibrilátory a první pomoc v obci."
          nazev="AED a první pomoc"
          popis="Přesné umístění venkovních 24/7 defibrilátorů v obci a návod záchrany života krok za krokem."
        />

        <PolozkaSluzby
          cil="/(obcan)/(tabs)/sluzby/ztraty-a-nalezy"
          ikona="mapa"
          barva="#C2410C"
          pozadi="#FFF1E6"
          popisekProCtecku="Ztráty a nálezy 2.0: nalezené věci a zaběhnutá zvířata."
          nazev="Ztráty a nálezy 2.0"
          popis="Registr nalezených věcí a zvířat s GPS místem odchytu a napojením na smluvní útulek."
        />

        <PolozkaSluzby
          cil="/(obcan)/(tabs)/sluzby/kamery"
          ikona="video"
          barva="#0369A1"
          pozadi="#E0F2FE"
          popisekProCtecku="Veřejné webkamery: pohled na náves a hladinu potoka."
          nazev="Veřejné webkamery obce"
          popis="Snímky počasí na návsi, sněhové pokrývky a stavu vody na Mlýnském rybníku v souladu s GDPR."
        />
      </View>

      {/* 6. Zákulisní portály a Gamifikace */}
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
        Zákulisní portály a odměny
      </Text>

      <View style={styles.seznam}>
        <PolozkaSluzby
          cil="/(obcan)/(tabs)/sluzby/body"
          ikona="hvezda"
          barva="#B45309"
          pozadi="#FEF3C7"
          popisekProCtecku="Občanské body: odměny za aktivitu v obci a slevy."
          nazev="Občanské body a odměny"
          popis="Získejte kredity za hlášení závad a brigády a vyměňte je za vstup na koupaliště nebo slevy."
        />

        <PolozkaSluzby
          cil="/(obcan)/(tabs)/sluzby/zastupitelstvo"
          ikona="lide"
          barva="#6D28D9"
          pozadi="#F1EAFE"
          popisekProCtecku="Zastupitelský extranet: interní podklady pro členy zastupitelstva."
          nazev="Zastupitelský extranet"
          popis="Pracovní materiály na jednání zastupitelstva, rozpočet a interní podklady pro radní."
        />

        <PolozkaSluzby
          cil="/(obcan)/(tabs)/sluzby/developer"
          ikona="kod"
          barva="#334155"
          pozadi="#EEF2F6"
          popisekProCtecku="Developer portál: otevřená data REST API a webhooky."
          nazev="Developer portál a API"
          popis="Veřejná REST API, otevřená data úřední desky, webhooky krizových hlášení a IoT integrace."
        />
      </View>

      {/* Zařídit přes úřad (Pravidlo 6) */}
      <View
        style={[
          styles.uradBox,
          {
            backgroundColor: barvy.surface,
            borderColor: barvy.line,
          },
        ]}
      >
        <Text
          role="heading"
          aria-level={2}
          accessibilityRole="header"
          style={[
            styles.uradNadpis,
            {
              color: barvy.ink,
              fontFamily: pismo.rodina,
              fontWeight: pismo.vahy.polotucne,
            },
          ]}
        >
          Zařídit přes úřad
        </Text>
        <Text style={[styles.uradText, { color: barvy.ink, fontFamily: pismo.rodina }]}>
          Každou službu můžete vždy vyřídit i osobně nebo telefonicky na obecním úřadě.
        </Text>
        <Text style={[styles.uradKontakt, { color: barvy.ink, fontFamily: pismo.rodina }]}>
          Adresa: Obecní úřad Javoří Lhota, Náves 1{'\n'}
          Telefon: +420 379 000 111{'\n'}
          Úřední hodiny: Po, St 8:00–17:00, Út, Čt 8:00–12:00
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
  titulek: {
    fontSize: 30,
    letterSpacing: -0.6,
    lineHeight: 36,
    marginBottom: 4,
  },
  podtitul: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  sekceNadpis: {
    fontSize: 17,
    marginTop: 12,
    marginBottom: 10,
  },
  seznam: {
    marginBottom: 16,
  },
  polozka: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginVertical: 5,
  },
  polozkaRadek: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  dlazdice: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  polozkaText: {
    flex: 1,
  },
  sluzbaNazev: {
    fontSize: 16,
    marginBottom: 2,
  },
  sluzbaPopis: {
    fontSize: 14,
    lineHeight: 20,
  },
  uradBox: {
    marginTop: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  uradNadpis: {
    fontSize: 16,
  },
  uradText: {
    fontSize: 14,
    lineHeight: 20,
  },
  uradKontakt: {
    fontSize: 14,
    lineHeight: 22,
  },
})
