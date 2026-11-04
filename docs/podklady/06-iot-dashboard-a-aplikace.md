# IoT dashboard a mobilní aplikace

## Co řeší a pro koho

Obec přestane předávat klíče a zbytečně vytápět prázdné budovy. O poruše se dozví dřív, než na ni někdo zavolá. Webový dashboard slouží k práci u stolu, mobilní aplikace k rychlé reakci v terénu a pro občany.

| Kdo | Co potřebuje | Kde |
|---|---|---|
| Starosta | přehled budov, alarmy, schvalování rezervací, krizové zprávy | aplikace, dashboard |
| Správce budov (údržbář) | alarmy, stav zařízení, baterie, ruční ovládání topení a dveří | aplikace |
| Účetní a energetický manažer | spotřeba po budovách, srovnání rok k roku, podklady pro dotace | dashboard |
| Občan a nájemce sálu | rezervace, PIN do budovy, zprávy, platby, hlášení závad | aplikace, web |
| Škola a spolky | své místnosti, rozvrh topení, vstupy členů | aplikace |

## Hardware

Stavíme na běžných zařízeních s otevřenými protokoly (Zigbee, Matter, LoRaWAN, HTTP API), ne na jednom výrobci. Obec tak není závislá na nás ani na dodavateli hardwaru. Srdcem budovy je naše brána. V první verzi je to průmyslový mini počítač s Linuxem, vlastní DPS až ve fázi B3.

| Zařízení | K čemu | Doporučený typ | Protokol | Cena s DPH |
|---|---|---|---|---|
| Brána CodeKom | místní řízení, plány a PINy i bez internetu, LTE záloha | mini PC na DIN lištu + koordinátor [Home Assistant Connect ZBT-2](https://www.zbozi.cz/vyrobek/home-assistant-connect-zbt-2/) | Zigbee 3.0 / Thread, MQTT přes TLS ven | koordinátor 1 199–1 349 Kč; PC s LTE odhadem 4–6 tis. Kč |
| Termostatická hlavice | regulace každého radiátoru, detekce otevřeného okna | [Danfoss Ally eTRV](https://www.zbozi.cz/vyrobek/danfoss-ally-etrv-zigbee/) | Zigbee | 1 470–2 599 Kč |
| Řízení kotle a čerpadla | spínat zdroj tepla jen při potřebě | relé na DIN lištu (např. Shelly Pro) | Wi-Fi / LAN, lokální API | odhadem 1–2 tis. Kč |
| Měření elektřiny | spotřeba budovy po minutách, FVE | [Shelly Pro 3EM](https://www.hornbach.cz/p/meric-a-monitor-shelly-pro-3em-spotreby-elektricke-energie-wifi-bluetooth-lan-trifazovy/10707205/) (3 fáze, 120 A) | LAN / Wi-Fi | 2 345 Kč |
| Chytrý zámek (dveře s vložkou) | odemčení PINem nebo aplikací, záznam vstupů | [Nuki Smart Lock Pro 5. gen.](https://www.svetandroida.cz/nuki-smart-lock-pro-5th-gen-sleva-brezen-2026/) + Keypad 2.0 + vložka s nouzovou funkcí | Wi-Fi, Matter přes Thread | 6 749–7 499 Kč + vložka 1–2 tis. Kč |
| Přístupový terminál (sál, škola, hasiči) | PIN, karta, NFC i Bluetooth u dveří s elektrickým zámkem | [2N Access Unit 2.0](https://www.voltus.com/en/2n-9160347-access-unit-2-0-touch-keypad-bluetooth-rfid.html) (český výrobce) | PoE, dočasné PINy | podle nabídky distributora, + elektrický zámek a montáž |
| Čidla prostředí | teplota, vlhkost a CO₂ ve třídách a v sále | Milesight AM103 (LoRaWAN) nebo Zigbee čidla | LoRaWAN / Zigbee | podle nabídky distributora |
| Čidla poruch | únik vody, mráz, otevřené dveře a okna | Zigbee čidla | Zigbee | podle nabídky distributora |
| Vodoměr a plynoměr | spotřeba a únik vody | pulzní snímač nebo wM-Bus | wM-Bus / LoRaWAN | B2 |
| Venkovní čidla | hladina potoka, naplněnost kontejnerů, osvětlení | LoRaWAN uzly + brána pro celou obec | LoRaWAN | B3 |

**Typická budova** (sál a kancelář, 6 radiátorů, 1 vstup s vložkou) vyjde na hardware odhadem 30–35 tis. Kč bez montáže. Je to součet cen výše, kde u položek bez zdroje jde o odhad. K tomu se platí 390 Kč měsíčně za budovu. Na dotacích OPŽP na úspory veřejných budov (50–60 %, žádosti do 25. 9. 2026) jsem v podpořených opatřeních měření a regulaci výslovně nenašel ([SMS ČR](https://www.smscr.cz/o-sms-cr/aktuality/ministerstvo-zivotniho-prostredi-nabizi-dotace-na-energeticke-uspory-verejnych-budov-zadosti-lze-podavat-do-zari-2026-5128cs.html)). Modernizace vytápění tam ale podporovaná je, takže to je otázka pro dotačního poradce.

## Webový dashboard

Dashboard má 8 obrazovek. První z nich musí starostovi do 5 sekund říct, jestli je v pořádku všechno, nebo co ne.

1. **Přehled obce:** mapa budov s barvou stavu (v pořádku, varování, porucha), aktivní alarmy, dnešní rezervace a spotřeba za týden proti stejnému týdnu loni.
1. **Detail budovy:** místnosti s aktuální a cílovou teplotou a otevřenými okny, týdenní plán topení s výjimkami z rezervací, stav dveří a poslední vstupy, energie po 15 minutách a zařízení (baterie, signál).
1. **Plány a pravidla:** šablony provozu (Sál, Kancelář, Škola, Hasiči) a pravidla „když – pak“ bez programování, např. když je okno otevřené 10 minut, zavři hlavici.
1. **Přístupy:** kdo smí kam a kdy. Trvalé přístupy (hasiči, úklid), dočasné PINy pro nájemce a záznam vstupů.
1. **Energie:** spotřeba po budovách a měsících, srovnání rok k roku a export pro energetického manažera a dotační žádosti.
1. **Alarmy:** eskalace (push → SMS → další osoba po 15 minutách), převzetí alarmu, poznámka a historie.
1. **Zařízení:** inventář, firmware, baterie, servisní záznamy a výměny.
1. **Rezervace:** stejný kalendář jako v modulu Úřad, s náhledem, co rezervace spustí v budově.

Dashboard je součástí stejné administrace jako editor webu (jedno přihlášení). Grafy jsou z časové databáze (TimescaleDB) a živé stavy se aktualizují přes WebSocket.

## Mobilní aplikace

Je to jedna aplikace „CodeKom“ pro iOS a Android s rolemi občan a úřad. Občan si vybere svou obec a může sledovat i další (chalupaři, dojíždějící). Uživatel, který má v obci roli, vidí navíc záložku Úřad. Postavíme ji v React Native (Expo), aby sdílela TypeScript a datové typy s webem.

| Obrazovka | Role | Co umí |
|---|---|---|
| Domů | občan | krizový banner, poslední hlášení rozhlasu, zítřejší svoz, nejbližší akce, moje platby k úhradě |
| Zprávy | občan | aktuality a hlášení, odběr podle témat a ulice, audio verze |
| Nahlásit | občan | fotka, poloha a kategorie, stav řešení a odpověď |
| Zaplatit | občan | moje poplatky (odpad, pes, hrob), karta, Apple a Google Pay, QR, potvrzení |
| Rezervace | občan | volné termíny sálu a hřiště, platba, PIN do budovy, později otevření přes Bluetooth |
| Úřad | občan | životní situace, formuláře s přihlášením Identitou občana, stav podání, objednání termínu |
| Přehled | úřad | alarmy, dnešní rezervace, co čeká na schválení |
| Budovy | úřad | teploty, přepnutí režimu, otevření dveří na dálku (biometrie + důvod) |
| Poslat zprávu | úřad | text → push, SMS a e-mail podle ulic; AI zkrátí text na SMS |
| Podněty | úřad | přiřadit údržbáři, změnit stav, odpovědět občanovi |

Přihlášení občana je e-mailem nebo telefonem bez hesla. Identita občana se vyžaduje jen u podání a hlasování. Úřad se přihlašuje účtem CodeKom s 2FA a biometrií. Push notifikace jdou přes Expo (FCM a APNs). Obsah, PINy a poslední stav budov jsou dostupné i offline.

## Automatizace a scénáře

Hlavní scénář, kvůli kterému obce IoT koupí, je rezervace sálu bez klíčů a bez topení nadarmo:

> (obrázek: diagram nebo graf v původním dokumentu)

Doba předtopení se po prvních týdnech naučí podle skutečného náběhu místnosti. Topení končí půl hodiny před koncem akce, protože sál teplo ještě drží. Další scénáře jsou předpřipravené jako šablony pravidel:

| Scénář | Spouštěč | Akce | Fáze |
|---|---|---|---|
| Otevřené okno | hlavice pozná prudký pokles teploty | hlavice se zavře, po zavření okna se vrátí | B1 |
| Mráz v budově | teplota pod 5 °C | protimrazové topení + alarm správci | B1 |
| Únik vody | čidlo zaplavení | alarm správci, v B2 zavření ventilu | B1 |
| Nezamčené dveře | dveře otevřené po konci přístupu | push a SMS správci | B1 |
| Prázdniny a svátky | kalendář školy a státní svátky | útlum topení | B2 |
| Vydechnutá třída | CO₂ nad 1 500 ppm | upozornění učiteli | B2 |
| Spotřeba mimo provoz | v noci odběr nad limit | alarm na zapomenutý spotřebič | B2 |
| Stoupající potok | hladina nad 1. stupeň | krizový banner na webu + SMS ohroženým ulicím | B3 |
| Plné kontejnery | čidlo naplněnosti | úkol pro svoz, mapa pro občany | B3 |
| Veřejné osvětlení | soumrak a noční čas | zapnutí, noční útlum, hlášení vadných světel | B3 |

Limity (5 °C, 1 500 ppm, 10 minut) jsou výchozí hodnoty a obec je může změnit.

## Spolehlivost, offline režim a bezpečnost

Budova musí fungovat, i když spadne internet nebo náš cloud. A nikdo nesmí zvenku otevřít dveře, které otevřít nemá.

- **Lokální provoz:** brána drží plány topení, PINy na 30 dní dopředu a všechna pravidla. Bez internetu budova dál topí a pouští. LTE modem je záloha.
- **Potvrzení příkazů:** každý příkaz má potvrzení od zařízení. Nedoručený příkaz se zkusí znovu a potom spustí alarm.
- **Bezpečný stav při poruše:** hlavice bez spojení drží poslední plán. Dveře na únikové cestě jdou zevnitř vždy otevřít mechanicky. Jestli má elektrický zámek při výpadku proudu otevřít, nebo zůstat zamčený, určí požárně bezpečnostní řešení budovy. To musí potvrdit projektant.
- **Síť:** brána se připojuje jen ven (MQTT přes TLS s certifikátem pro každou bránu), do internetu nemá otevřený žádný port a zařízení jsou v oddělené síti. Aktualizace firmwaru jsou podepsané.
- **Kdo smí otevřít:** dálkové otevření jen pro roli s 2FA, v aplikaci s biometrií a zapsaným důvodem. Každá akce jde do auditního logu.
- **Osobní údaje:** záznam vstupů je osobní údaj. Uchovává se 90 dní (návrh k potvrzení advokátem), vidí ho jen správce a nájemce je o něm informován v podmínkách rezervace.
- **Dohled:** brána hlásí stav každou minutu. Při výpadku delším než 10 minut přijde alarm správci i nám. Zařízení s baterií pod 20 % se objeví v úkolech údržbáře.
- **Kybernetická bezpečnost:** u obcí s rozšířenou působností je IoT podpůrné aktivum podle zákona 264/2025 Sb. Bezpečnostní příloha smlouvy ho pokrývá.

## Prototyp

[CodeKom](https://claude.ai/artifact/WjE3jo3pCzCvTxhdxZboDH)[ – prototypy](https://claude.ai/artifact/WjE3jo3pCzCvTxhdxZboDH), stránky IoT dashboard a Mobilní aplikace:

- **Dashboard:** pět budov s různým stavem. Po kliknutí na budovu se zobrazí místnosti, dnešní plán, dveře a spotřeba. Jde přepnout režim topení, převzít alarm v Sokolovně a odemknout dveře na dálku se zapsaným důvodem.
- **Aplikace – občan:** domovská obrazovka s výpadkem vody a svozem, filtr zpráv, nahlášení závady, zaplacení poplatku a rezervace sálu, po které občan dostane PIN.
- **Aplikace – úřad:** převzetí alarmu, schválení rezervace, režim topení, odemčení s otiskem prstu, zpráva cílená na ulice s AI verzí pro SMS a přiřazení podnětu údržbáři.
