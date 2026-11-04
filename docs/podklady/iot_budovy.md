# CodeKom IoT modul pro obecní budovy (stav 3. 11. 2026)

Poznámka k rozsahu: výzkum byl omezen na cca 20 volání nástrojů; řada otázek (ceny v CZ, Modbus/M-Bus, KNX, Salto lokální API, úspory v českých obcích, aktuální dotační výzvy) zůstala nepokryta a je uvedena v Gaps. Co není citováno, v Cited Findings není.

## Software brány (HA / Node-RED / ThingsBoard Edge / vlastní agent), flotila, konektivita, offline

### Takeaway
Jediný ověřený fakt: Home Assistant Supervisor je podporován jen na Home Assistant OS, jiné instalace (Supervised na Debianu apod.) jsou označeny jako nepodporované. Pro flotilu bran je proto rozumné zvolit buď HA OS, nebo HA Container + vlastní agent; k Node-RED a ThingsBoard Edge jsem nic nesehnal.

### Cited Findings
- „The Home Assistant Supervisor is only supported on Home Assistant OS“; instalace mimo HA OS je označena jako nepodporovaná, doporučená cesta je přeinstalace na HA OS a obnova ze zálohy — [HA: Unsupported OS](https://www.home-assistant.io/more-info/unsupported/os)
- Diskuze o podporovaných typech instalace HA (4 typy) existuje v architecture repozitáři — [HA architecture discussion #1198](https://github.com/home-assistant/architecture/discussions/1198) (obsah jsem nečetl)

### Inferences
- Pokud CodeKom bude HA používat jako headless „driver vrstvu“ (Zigbee/Matter/Shelly integrace) a přes REST/WebSocket API ho řídit vlastním agentem, je nejnižší riziko HA OS na mini PC, nebo HA Container s vlastním systémovým správcem (nutno ověřit, co Container ztrácí: add-ony, Supervisor zálohy). Toto je úsudek, ne ověřený fakt.
- Pravidla a automatizace kritické pro bezpečnost (mráz, ruční režim) nesmí záviset na HA ani cloudu, viz sekce Fail-safe.

### Gaps
- Nenalezeno/nečteno: HA REST/WebSocket API dokumentace, Node-RED, ThingsBoard Edge, Tailscale/WireGuard, MQTT TLS, OTA/fleet nástroje (Balena, Mender, Ansible), offline architektura. Nutný další průzkum.

## Protokoly a konkrétní zařízení (CZ ceny, lokální API)

### Takeaway
Ověřeno: Danfoss Ally TRV je Zigbee 3.0, ale oficiálně vyžaduje Danfoss Ally Gateway a internet pro uvedení do provozu; Shelly BLU TRV lze řídit lokálně přes RPC (HTTP) brány BLU Gateway Gen3. Nuki a Salto KS jsou v API integracích závislé na cloudu/předplatném.

### Cited Findings
- Danfoss Ally Radiator Thermostat: „Zigbee 3.0 certified product, compatible with Danfoss Ally Gateway and with third party systems using Zigbee protocol“; Danfoss poskytuje firmware partnerům pro integraci do cizích hubů — [Danfoss Ally support](https://www.danfoss.com/en/products/dhs/smart-heating/solutions/danfoss-ally/danfoss-ally-support/)
- Tamtéž: „The internet connection is a must for commissioning process and full system control“ (u Ally Gateway); při ztrátě spojení hlavice dál reguluje na nastavenou teplotu, ale ovládání z aplikace není dostupné
- Tamtéž: funkce hlavice: až 3 komfortní periody denně, detekce otevřeného okna (vypnutí topení na 30 min), Pre-Heat podle posledních 7 dní, upozornění na slabou baterii cca měsíc předem, Room Sensor jako referenční teplota, max. 32 zařízení na Ally Gateway; Danfoss nabízí Cloud API a Open API přes Developer Portal, „does not support private API solutions“
- Shelly BLU Gateway Gen3: lokální RPC přes HTTP — `BluTrv.Call` (např. `TRV.SetTarget`), `GetRemoteStatus`, `UpdateFirmware`; webhooky `blutrv.temperature_change` (>0,5 °C) a `blutrv.position_change` (>5 %); komponenty MQTT a Outbound Websocket, až 10 skriptů; párování BLU H&T a Door/Window senzorů přes TRV — [Shelly API: BLU Gateway Gen3](https://shelly-api-docs.shelly.cloud/gen2/Devices/Gen3/ShellyBluGwG3)
- Shelly Pro EM-50 (50A, EM Gen3) existuje jako produktová řada — [Shelly Pro EM-50](https://www.shelly.com/pl/products/shelly-50a-current-transf-pro-em-50) (specifikace a cenu jsem nečetl)
- Nuki Smart Lock Pro (5. gen.) přes API integrátora Seam: vzdálené odemknutí/zamknutí, online přístupové kódy, rozvrhy, časově omezené kódy vázané na rezervaci; offline kódy nejsou; pro Nuki API je nutné aktivní předplatné Nuki SmartHosting (cena dle země); kódy vyžadují externí klávesnici (Keypad); připojení Wi-Fi, Bluetooth, Thread, Matter — [Seam: Nuki Smart Lock Pro 5th Gen](https://www.seam.co/smartlocks/nuki_smart-lock-pro-5th-gen)
- Salto KS (přes integraci Booking Experts): přístupové skupiny vytvářeny automaticky pro potvrzené rezervace, platnost check-in až check-out s 30 min rezervou, vyžaduje aktivní předplatné Salto KS a bezdrátové zámky Salto; vzdálený přístup vyžaduje Salto KS IQ; chování offline není popsáno — [Booking Experts: Salto KS](https://help.bookingexperts.com/en/articles/6844022-salto-ks-installation-and-settings)
- Ceny Nuki Pro 5 + Keypad 2 jsou v německých obchodech (např. Tink), v CZ jsem cenu neověřil — [Tink: Nuki Pro 5 + Keypad 2](https://www.tink.de/p/nuki-smart-lock-pro-5-gen-keypad-2-0)

### Inferences
- Nuki i Salto KS v popsaných integracích jsou cloud-first (předplatné). To je v rozporu s požadavkem „bez závislosti na cloudu“; pro halu pronajímanou občanům je nutné ověřit lokální Nuki Bridge HTTP API (stránka vývojářské dokumentace se nepodařilo načíst) a Nuki Web API (ztráta spojení = nelze vytvořit nový kód). Alternativa k ověření: klávesnice s offline časovými kódy (např. generované lokálně) nebo ovladač relé s Shelly.
- Pro TRV je lokálně nejlépe doložená cesta Shelly BLU TRV přes BLU Gateway (HTTP RPC + webhooky). Danfoss Ally přes cizí Zigbee koordinátor (Zigbee2MQTT/ZHA) je pravděpodobně možná na základě „Zigbee 3.0 + third party“, ale konkrétní lokální chování nebylo ověřeno.

### Gaps
- Ceny v Kč (Danfoss Ally, Shelly TRV, Bosch, Eurotronic, Eastron, Shelly Pro EM, Nuki, Keypad) — nenalezeno.
- Nuki Bridge HTTP API / Web API detail (načtení stránky selhalo), Salto KS API a lokální provoz, OpenTherm/kotle, Modbus/M-Bus, KNX, LoRaWAN, Z-Wave, Thread/Matter v praxi — nepokryto.
- CO2/teplota senzory, čidla úniku vody — nepokryto.

## Telemetrie v Postgres/Supabase (TimescaleDB 2026, partitioning, command/ack, audit, GDPR)

### Takeaway
TimescaleDB je na Supabase na Postgres 17 deprecated; extension je „Apache 2 Edition“ bez Community funkcí (tj. bez kompresní/kontinuální agregace z Community edice). Supabase doporučuje nativní partitioning s pg_partman. Návrh telemetrie proto stavět na nativním partitioningu + pg_partman + pg_cron + vlastních rollup tabulkách.

### Cited Findings
- „TimescaleDB … deprecated in projects using Postgres 17“; podporováno na Postgres 15, před upgradem na 17 je nutné extension odstranit; nabízí se pouze „TimescaleDB Apache 2 Edition“, funkce jen z Community Edition nejsou dostupné; u hypertabulek Supabase doporučuje převod na nativní partitioning spravovaný `pg_partman` — [Supabase docs: timescaledb](https://supabase.com/docs/guides/database/extensions/timescaledb)
- Supabase ukončuje podporu Postgres 14 k 1. 7. 2026 — [Supabase changelog](https://supabase.com/changelog/45827-deprecation-notice-support-for-postgres-14-ending-on-1st-july-2026)

### Inferences
- Nové projekty běží na PG17, takže TimescaleDB není pro CodeKom použitelné; plán: tabulka `telemetry_raw` partitionovaná po dnech/týdnech přes pg_partman, rollupy 15 min / hodina / den přes pg_cron do samostatných tabulek, retence raw dat (např. 90 dní) odpojením partic. Konkrétní retence jsou návrh, ne zdroj.
- Alternativa pro velké objemy: samostatná Timescale Cloud/ClickHouse instance v EU (nepokryto).
- Command/ack vzor (tabulka `device_commands` se stavy queued/sent/acked/failed, idempotency key, TTL, potvrzení ze stavu zařízení) a audit log otevření dveří (append-only, RLS, retence) jsou návrhové doporučení bez externího zdroje.

### Gaps
- Nezkontrolováno: dostupnost pg_partman/pg_cron na Supabase v 2026 (pouze nepřímo zmíněno doporučením pg_partman), limity Supabase Realtime pro telemetrii, ceny.
- GDPR k audit logu vstupů (právní základ, retence, DPIA, zpracovatelská smlouva obce–CodeKom) — nepokryto; použít nástroje/skills mimo tento výzkum.

## Fail-safe (mechanický klíč, mráz bez cloudu, ruční override)

### Takeaway
Podpůrné fakty jsou jen částečné: hlavice Danfoss Ally drží nastavenou teplotu i bez spojení s bránou.

### Cited Findings
- Danfoss Ally hlavice při ztrátě spojení s bránou dále reguluje na nastavenou teplotu a má ruční kolečko — [Danfoss Ally support](https://www.danfoss.com/en/products/dhs/smart-heating/solutions/danfoss-ally/danfoss-ally-support/)
- Nuki Smart Lock Pro 5 se montuje na vnitřní stranu cylindru bez vrtání, tj. mechanický klíč zůstává funkční — [Seam: Nuki Pro 5](https://www.seam.co/smartlocks/nuki_smart-lock-pro-5th-gen)

### Inferences
- Doporučená vrstvení: (1) zařízení s lokálním protimrazovým minimem v samotné hlavici/termostatu, (2) lokální pravidla na bráně, (3) cloud jen plánování a reporting. Zámky: mechanický cylindr + klíč u starosty/hasičů/trezor s klíčem; pro bezpečnostní schopnost nesmí být jediné rozhraní zámku cloud. Toto je návrhové doporučení.

### Gaps
- Chybí zdroje k požárním/únikovým požadavkům na zámky (únikové cesty, EN 179/1125), pojištění; protimrazové chování Shelly/Bosch/Eurotronic hlavic.

## Regulace: zákon 264/2025 Sb. (NIS2), CRA, RED/EN 18031

### Takeaway
Zákon 264/2025 Sb. platí od 1. 11. 2025; obce s rozšířenou působností spadají do „nižšího režimu“ (vyhl. 410/2025 Sb.) pro službu „Výkon svěřených pravomocí“; malé obce zřejmě přímo ne. CRA: hlášení zranitelností a incidentů výrobci platí od 11. 9. 2026, plná použitelnost od 11. 12. 2027. Pro CodeKom to znamená především povinnosti dodavatelského řetězce a zdokumentovanou bezpečnost.

### Cited Findings
- Zákon 264/2025 Sb. účinný od 1. 11. 2025, implementuje NIS2; vyhlášky 408/2025 (regulované služby), 409/2025 (vyšší režim), 410/2025 (nižší režim); postup: registrace služby na Portálu NÚKIB, určení rozsahu řízení kybernetické bezpečnosti, zavádění opatření a hlášení incidentů v následujícím roce — [SPČR / NÚKIB přehled](https://www.spcr.cz/sites/default/files/2025-10/Prehledne-novy-zakon-o-kyberneticke-bezpecnosti.pdf)
- NÚKIB podpůrný materiál pro obce: zaměřen na obce s rozšířenou působností (nižší režim, vyhl. 410/2025), regulovaná služba „Výkon svěřených pravomocí“; podpůrná aktiva zahrnují dodavatele, hardware, software i budovy; fyzická ochrana spadá do řízení přístupu; při smlouvách s dodavateli se mají zohlednit bezpečnostní oblasti z přílohy vyhlášky; opatření lze zavádět postupně — [NÚKIB: podpůrný materiál obce](https://portal.nukib.gov.cz/storage/uploads/2026/01/05/podpurny-material-obce_v1-1_uid_695bc95eab8c0.pdf); [Lupa.cz titulek: obce se papírování nevyhnou, nákladnější opatření mohou zavádět postupně](https://www.lupa.cz/clanky/regulace-podle-nis2-papirovani-se-obce-nevyhnou-nakladnejsi-opatreni-ale-mohou-zavadet-postupne/)
- CRA: 11. 6. 2026 použitelná kapitola IV (notifikované orgány); 11. 9. 2026 začíná hlášení podle čl. 14 (aktivně zneužívané zranitelnosti a závažné incidenty, 24h lhůta, přes ENISA Single Reporting Platform) pro všechny produkty v rozsahu již na trhu; 11. 12. 2027 plná použitelnost (základní požadavky, posuzování shody, CE) — [Espressif: CRA obligations and deadlines](https://developer.espressif.com/blog/2026/09/esp32-cra-obligations-and-deadlines/); potvrzení také [McCann FitzGerald](https://www.mccannfitzgerald.com/knowledge/data-privacy-and-cyber-risk/cyber-resilience-act-reporting-obligations-apply-from-11-september-2026)
- Espressif zmiňuje RED delegovaný akt a EN 18031, ale datum použitelnosti neuvádí — stejný zdroj

### Inferences
- CodeKom jako výrobce/poskytovatel softwaru + bránu (mini PC s vlastním softwarem) může být „výrobcem produktu s digitálními prvky“ podle CRA. Hardware mini PC od třetí strany je samostatný produkt; je třeba prověřit, zda CodeKom skládá „vlastní produkt“ (pak výrobce) nebo prodává službu SaaS (SaaS sám CRA nepokrývá, ale vzdálené zpracování dat k produktu ano). Právní kvalifikace není ověřena, nutná konzultace.
- Malé obce bez statutu ORP pravděpodobně nejsou přímo povinnými osobami, ale CodeKom je pro ORP/obce s regulovanou službou dodavatel a mělo by mít připravené bezpečnostní dokumentace (MFA, logování, správa zranitelností, SBOM, hlášení incidentů).

### Gaps
- Datum použitelnosti RED DA (obvykle uváděno 1. 8. 2025) a obsah EN 18031-1/2/3 nebyly ověřeny; text eur-lex nebyl čten; zda IoT brány obcí spadají pod RED (rádiová zařízení: ano pro Zigbee/Wi-Fi) nevyjasněno.
- NIS2 u dodavatelů „významných“ obcí: přesný text povinností dodavatele (§ zákona) nečten.

## Důkazy úspor, dotace 2026, konkurence a ceny

### Takeaway
Nepodařilo se doložit konkrétní české obecní případové studie ani aktuální 2026 dotační výzvy; nalezené zdroje jsou starší nebo obecné.

### Cited Findings
- Starší výzva OPŽP/MŽP z 2015–2016 pro veřejné budovy (alokace cca 3 mld. Kč dotace, příjemci obce a organizace) — [TZB-info (2016)](https://www.tzb-info.cz/dotace/13700-dotace-3-miliardy-na-projekty-energetickych-uspor-verejnych-budov); nejde o aktuální stav, zmiňuje zateplení, výměnu oken a zdrojů, neuvádí MaR.
- Výsledky vyhledávání odkazují na 2026 přehledy dotací (např. [Brno: Dotační možnosti pro BMO 2026](https://metropolitni.brno.cz/wp-content/uploads/2026/06/2026_c.15-Dotacni-moznosti-pro-BMO.pdf), [MSK: ZP energetika 2026](https://hrajemskrajem.msk.cz/tml/files/2026/03/ZP_ENERG.pdf)), obsah nebyl čten.
- Danfoss uvádí případovou studii bytového domu s AI a dynamickým vyvažováním — [Danfoss case story](https://www.danfoss.com/cs-cz/service-and-support/case-stories/dhs/apartment-block-saves-energy-and-money-with-ai-and-dynamic-balancing/) (čísla nečtena, vendor zdroj)

### Inferences
- Prezentovat úspory obcím jen jako rozsah s uvedeným zdrojem; zatím nemáme ověřené procento pro budovy v ČR. Nepoužívat marketingová čísla výrobců bez označení.

### Gaps
- Chybí: ověřené úspory v českých obcích, aktuální výzvy 2026 (OPŽP, Modernizační fond, NPO, IROP, programy MPO), konkurenční řešení a ceny v CZ (např. Loxone, Siemens Desigo, Danfoss Ally Pro, Mikrovlny/Smart city platformy) — nepokryto, vyžaduje další průzkum SFŽP a MPO.
