import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useTema } from '@/tema'
import { Karta } from '@/ui'

export default function SluzbyIndexScreen() {
  const router = useRouter()
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
        <Karta
          onPress={() => router.push('/(obcan)/(tabs)/sluzby/zavada')}
          popisekProCtecku="Nahlásit závadu v obci: výmoly, osvětlení, zeleň nebo odpad."
        >
          <Text
            style={[
              styles.sluzbaNazev,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Nahlásit závadu
          </Text>
          <Text style={[styles.sluzbaPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Vyfoťte nebo popište problém v obci (nesvítící lampa, výmol, přeplněný kontejner).
          </Text>
        </Karta>

        <Karta
          onPress={() => router.push('/(obcan)/(tabs)/sluzby/sledovani')}
          popisekProCtecku="Sledovat stav nahlášené závady podle sledovacího kódu."
        >
          <Text
            style={[
              styles.sluzbaNazev,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Sledovat stav hlášení
          </Text>
          <Text style={[styles.sluzbaPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Zkontrolujte průběh vyřizování hlášení a veřejnou odpověď úřadu podle kódu.
          </Text>
        </Karta>

        <Karta
          onPress={() => router.push('/(obcan)/(tabs)/sluzby/poplatky')}
          popisekProCtecku="Místní poplatky: poplatek za komunální odpad, psy a platba QR kódem."
        >
          <Text
            style={[
              styles.sluzbaNazev,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Místní poplatky
          </Text>
          <Text style={[styles.sluzbaPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Přehled sazeb za odpad a psy s platebními údaji a ukázkovou QR platbou.
          </Text>
        </Karta>

        <Karta
          onPress={() => router.push('/(obcan)/(tabs)/sluzby/rezervace')}
          popisekProCtecku="Rezervace obecních prostor: společenský sál a hasičárna."
        >
          <Text
            style={[
              styles.sluzbaNazev,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Rezervace prostor
          </Text>
          <Text style={[styles.sluzbaPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Žádost o rezervaci společenského sálu nebo hasičárny na rodinné a spolkové akce.
          </Text>
        </Karta>
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
        1. Senzorika, IoT a živá data
      </Text>

      <View style={styles.seznam}>
        <Karta
          onPress={() => router.push('/(obcan)/(tabs)/sluzby/senzory')}
          popisekProCtecku="Živá data ze senzorů LoRaWAN, hladinoměr potoka, sypače v terénu a odjezdy spojů."
        >
          <Text
            style={[
              styles.sluzbaNazev,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Senzorika, hladina potoka a spoje
          </Text>
          <Text style={[styles.sluzbaPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Stav Mlýnského potoka, kvalita ovzduší AQI, teplota vozovky, GPS poloha sypačů, parkoviště a
            živé odjezdy autobusů a vlaků.
          </Text>
        </Karta>
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
        2. Komunitní sdílení a sousedé
      </Text>

      <View style={styles.seznam}>
        <Karta
          onPress={() => router.push('/(obcan)/(tabs)/sluzby/pujcovna')}
          popisekProCtecku="Obecní půjčovna: štípačky na dřevo, elektrocentrály a párty stany."
        >
          <Text
            style={[
              styles.sluzbaNazev,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Obecní půjčovna nářadí
          </Text>
          <Text style={[styles.sluzbaPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Sdílené vybavení a nářadí obce (štípačka, elektrocentrála, vibrační deska, párty stany).
          </Text>
        </Karta>

        <Karta
          onPress={() => router.push('/(obcan)/(tabs)/sluzby/bazar')}
          popisekProCtecku="Sousedský bazar a darovna: přebytky ze zahrady a věci za odvoz."
        >
          <Text
            style={[
              styles.sluzbaNazev,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Sousedský bazar a darovna
          </Text>
          <Text style={[styles.sluzbaPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Nabídka přebytků ze zahrady (jablka, ořechy), stavební materiál po rekonstrukci a věci za
            odvoz.
          </Text>
        </Karta>

        <Karta
          onPress={() => router.push('/(obcan)/(tabs)/sluzby/spolujizda')}
          popisekProCtecku="Sousedská spolujízda carpooling: sdílení cest do práce a do škol."
        >
          <Text
            style={[
              styles.sluzbaNazev,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Sousedská spolujízda (Carpooling)
          </Text>
          <Text style={[styles.sluzbaPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Ověřená nástěnka spolujízdy do Klatov, Sušice a Plzně pro úsporu nákladů a paliva.
          </Text>
        </Karta>

        <Karta
          onPress={() => router.push('/(obcan)/(tabs)/sluzby/dobrovolnictvi')}
          popisekProCtecku="Burza dobrovolnictví a brigád: výsadba stromů a úklid lesa."
        >
          <Text
            style={[
              styles.sluzbaNazev,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Burza dobrovolnictví a brigád
          </Text>
          <Text style={[styles.sluzbaPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Zapojte se do brigád pořádaných obcí, hasiči a spolky a získejte občanské body.
          </Text>
        </Karta>
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
        3. Správa majetku a infrastruktura
      </Text>

      <View style={styles.seznam}>
        <Karta
          onPress={() => router.push('/(obcan)/(tabs)/sluzby/nemovitosti')}
          popisekProCtecku="Obecní nemovitosti, byty a stavební parcely k prodeji."
        >
          <Text
            style={[
              styles.sluzbaNazev,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Obecní nemovitosti a byty
          </Text>
          <Text style={[styles.sluzbaPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Pořadník na startovací a obecní byty a nabídka zasíťovaných stavebních parcel.
          </Text>
        </Karta>

        <Karta
          onPress={() => router.push('/(obcan)/(tabs)/sluzby/energetika')}
          popisekProCtecku="Komunitní energetika: solární elektrárny na škole a odběr přebytků."
        >
          <Text
            style={[
              styles.sluzbaNazev,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Komunitní energetika (FVE)
          </Text>
          <Text style={[styles.sluzbaPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Živá výroba obecních solárních elektráren na škole a úřadě a registrace do komunity EDC.
          </Text>
        </Karta>

        <Karta
          onPress={() => router.push('/(obcan)/(tabs)/sluzby/hrbitov')}
          popisekProCtecku="Hřbitov 2.0: pasport hrobů, platnost smluv a virtuální svíčka."
        >
          <Text
            style={[
              styles.sluzbaNazev,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Hřbitov 2.0 a pasport
          </Text>
          <Text style={[styles.sluzbaPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Digitální pasport hrobových míst, kontrola nájemních smluv a uctění památky osobností obce.
          </Text>
        </Karta>
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
        4. Bezpečnost a krizové situace
      </Text>

      <View style={styles.seznam}>
        <Karta
          onPress={() => router.push('/(obcan)/(tabs)/sluzby/aed')}
          popisekProCtecku="AED defibrilátory a první pomoc v obci."
        >
          <Text
            style={[
              styles.sluzbaNazev,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            AED a první pomoc
          </Text>
          <Text style={[styles.sluzbaPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Přesné umístění venkovních 24/7 defibrilátorů v obci a návod záchrany života krok za krokem.
          </Text>
        </Karta>

        <Karta
          onPress={() => router.push('/(obcan)/(tabs)/sluzby/ztraty-a-nalezy')}
          popisekProCtecku="Ztráty a nálezy 2.0: nalezené věci a zaběhnutá zvířata."
        >
          <Text
            style={[
              styles.sluzbaNazev,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Ztráty a nálezy 2.0
          </Text>
          <Text style={[styles.sluzbaPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Registr nalezených věcí a zvířat s GPS místem odchytu a napojením na smluvní útulek.
          </Text>
        </Karta>

        <Karta
          onPress={() => router.push('/(obcan)/(tabs)/sluzby/kamery')}
          popisekProCtecku="Veřejné webkamery: pohled na náves a hladinu potoka."
        >
          <Text
            style={[
              styles.sluzbaNazev,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Veřejné webkamery obce
          </Text>
          <Text style={[styles.sluzbaPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Snímky počasí na návsi, sněhové pokrývky a stavu vody na Mlýnském rybníku v souladu s GDPR.
          </Text>
        </Karta>
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
        5. Zákulisní portály a odměny
      </Text>

      <View style={styles.seznam}>
        <Karta
          onPress={() => router.push('/(obcan)/(tabs)/sluzby/body')}
          popisekProCtecku="Občanské body: odměny za aktivitu v obci a slevy."
        >
          <Text
            style={[
              styles.sluzbaNazev,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Občanské body a odměny
          </Text>
          <Text style={[styles.sluzbaPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Získejte kredity za hlášení závad a brigády a vyměňte je za vstup na koupaliště nebo slevy.
          </Text>
        </Karta>

        <Karta
          onPress={() => router.push('/(obcan)/(tabs)/sluzby/zastupitelstvo')}
          popisekProCtecku="Zastupitelský extranet: interní podklady pro členy zastupitelstva."
        >
          <Text
            style={[
              styles.sluzbaNazev,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Zastupitelský extranet
          </Text>
          <Text style={[styles.sluzbaPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Pracovní materiály na jednání zastupitelstva, rozpočet a interní podklady pro radní.
          </Text>
        </Karta>

        <Karta
          onPress={() => router.push('/(obcan)/(tabs)/sluzby/developer')}
          popisekProCtecku="Developer portál: otevřená data REST API a webhooky."
        >
          <Text
            style={[
              styles.sluzbaNazev,
              {
                color: barvy.ink,
                fontFamily: pismo.rodina,
                fontWeight: pismo.vahy.polotucne,
              },
            ]}
          >
            Developer portál a API
          </Text>
          <Text style={[styles.sluzbaPopis, { color: barvy.muted, fontFamily: pismo.rodina }]}>
            Veřejná REST API, otevřená data úřední desky, webhooky krizových hlášení a IoT integrace.
          </Text>
        </Karta>
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
    gap: 12,
    marginBottom: 16,
  },
  sluzbaNazev: {
    fontSize: 16,
    marginBottom: 4,
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
