# Prompt: IoT obecních budov – brána, cloud a dashboard

Použití: vlož celý tento text do Claude Code v kořeni repozitáře `codecom`, nebo napiš: Proveď zadání v `prompty/04-iot-budovy.md`.
Závisí na: webu a CMS (kolekce `obce`, `users`, multi-tenant, administrace Payload), digitálním úřadu (`rezervace`, `prostory`; do jeho dokončení pracuj s rozhraním a fixturami popsanými níže), mobilní aplikaci (záložka Úřad: Budovy jen ke čtení staví prompt 02; otevření dveří v aplikaci přidává tento prompt jako samostatný milník 9 a dodá API a typy).

<kontext>
Obec s několika budovami (úřad se sálem, sokolovna, škola, zbrojnice) dnes topí prázdné prostory a předává klíče z ruky do ruky. CodeKom nabízí modul `iot`: malou bránu v každé budově, cloud, který plánuje a hlídá, a dashboard pro starostu, správce budov a účetní. Hlavní scénář: nájemce si rezervuje sál v digitálním úřadu, sál se předtopí, nájemce dostane časově omezený kód a po akci se vytápění utlumí. Do 5 sekund od otevření dashboardu musí být jasné, zda je vše v pořádku.

Přečti před začátkem: `CLAUDE.md` (pravidlo 5: zámek jde vždy otevřít klíčem, mráz nezávisí na cloudu, brána řídí budovu i bez internetu), `docs/rozhodnuti.md`, `docs/navrh-platformy/06-iot-dashboard-a-aplikace.md`, `research/poznamky/iot_budovy.md`, `research/zprava-podklady-pro-prompty.md` (sekce 4 a 7), `docs/pravni-dokumenty.md` (správa budov, audit vstupů, doba uložení [12] měsíců) a prototyp `design/prototypy/IoT-Dashboard.dc.html`.

Rozpory, které řeš takto: prototyp ukazuje fiktivní obec a 90 dní záznamu vstupů, tvůj výstup používá Javoří Lhotu a dobu uložení z konfigurace (výchozí [12] měsíců podle právních dokumentů, k potvrzení advokátem). Návrh platformy zmiňuje TimescaleDB, to neplatí (viz `docs/rozhodnuti.md`, 3. 11. 2026).
</kontext>

<cil>
Na konci funguje celý řetěz bez skutečného hardwaru, v simulátoru: agent v `apps/brana` mluví s falešným Home Assistantem, posílá telemetrii přes MQTT s TLS do cloudu, ten ji ukládá do partitionované tabulky `mereni`, dashboard v administraci ukazuje budovy, alarmy, plány a spotřebu a umožňuje bezpečně poslat příkaz s potvrzením. Potvrzená rezervace sálu v ukázkové obci Javoří Lhota sama vytvoří plán vytápění a kód pro nájemce. Výpadek internetu na 1 hodinu neztratí žádná data a budova během něj topí podle místního plánu. Hardware je popsaný a adaptéry jsou připravené, ale nic z toho nevyžaduje fyzické zařízení.
</cil>

<vychozi_stav>
- V repu je jen `apps/web` (Next.js 16, Payload 3, kolekce aktuality, uredni-deska, kategorie-desky, krizova-hlaseni, zastupitele, dokumenty, media, users; `src/access/roles.ts`, `src/lib/datum.ts`). `apps/brana`, `packages/typy`, `packages/tokeny` mohou ještě chybět. Zjisti, co existuje, a zbytek založ minimálně (pnpm workspace, Turborepo pipeline), bez přepisování cizího kódu.
- Kolekce `obce` s multi-tenant pluginem a polem `obec` tvoří prompt pro web. Pokud ještě není, použij jeho rozhraní ze společného zadání a v testech fixturu; nevymýšlej jiný model tenantů.
- Převezmi z `apps/web`: zásady přístupu z `src/access/roles.ts`, práci s časem z `src/lib/datum.ts`, způsob migrací Payloadu. Hotové migrace neměň.
- Prototyp `IoT-Dashboard.dc.html` je vzor rozvržení a obsahu přehledu a detailu budovy (stavy budov, místnosti s teplotou a cílem, plán dne, dveře s důvodem odemčení, spotřeba za 7 dní). Šablonové zástupky `{{...}}` v něm jsou jen ukázková data.
</vychozi_stav>

<rozsah>
Postav:
1. **apps/brana**: agent v TypeScriptu (Node 22) jako doplněk (add-on) Home Assistant OS, adaptéry zařízení, místní plánovač a pravidla, vyrovnávací fronta, MQTT klient s mTLS, simulátor brány pro testy, balení doplňku a dokumentaci instalace.
2. **Cloud v apps/web**: kolekce `budovy`, `prvky`, `planyVytapeni`, `pristupy`, `prikazy`, `alarmy`; schéma `iot` s tabulkami `mereni`, agregacemi a `audit_vstupu`; příjem telemetrie; příkazy s potvrzením; plánovač; odesílání upozornění a kódů; registrace brán.
3. **Dashboard**: osm obrazovek v administraci Payload (jedno přihlášení) a JSON API pro záložku Úřad v aplikaci. Kód záložky v `apps/mobile` piš jen tehdy, když tam už aplikace existuje, jinak dodej API, typy v `packages/typy` a kontraktní testy. Otevření dveří z aplikace (biometrie, důvod, právo `dvere`, audit) je samostatný milník 9 a nepatří do milníku Dashboard.
4. **Dokumenty**: `docs/iot/` (instalace brány, bezpečnostní příloha, hlášení zranitelností, soukromí a retence, seznam zařízení) a zápisy do `docs/rozhodnuti.md`.

Mimo rozsah: vlastní DPS brány (až fáze B3), LoRaWAN, venkovní čidla, vodoměry, KNX, Modbus, M-Bus, OpenTherm (jen rozhraní adaptérů a poznámka), obecný vizuální editor pravidel (jsou jen šablony s nastavitelnými parametry), učení doby předtopení (v první verzi pevná hodnota na místnost), skutečné zkoušky na hardwaru, výběr dodavatele SMS, produkční nasazení brokeru. Dálkové zavírání ventilu při úniku vody je fáze B2, nedělej ho.
</rozsah>

<architektura>
Složky:
```
apps/brana/
  addon/          config.yaml, Dockerfile, DOCS.md, překlady (doplněk HA)
  src/
    ha/           klient WebSocket API Home Assistantu
    adaptery/     zarizeni (hlavice, cidlo, energie, zamek, rele) + registr
    plan/         místní plánovač a pravidla (mráz, okno, ruční režim)
    fronta/       SQLite vyrovnávací fronta (better-sqlite3), dosynchronizace
    mqtt/         klient, témata, schémata zpráv
    stav/         heartbeat, verze, hodiny
  sim/            fake HA (WebSocket), tepelný model místnosti, ovladač scénářů
  tools/          registrace brány, generování certifikátu pro vývoj
apps/web/src/
  collections/iot/        budovy, prvky, planyVytapeni, pristupy, prikazy, alarmy
  lib/iot/                planovac, prikazy, telemetrie, alarmy, oznameni, zdroje/rezervace
  app/api/iot/            endpointy
  app/(payload)/.../iot/  vlastní pohledy administrace
  migrations/             Payload + ruční SQL pro schéma iot
packages/typy/src/iot/    zod schémata zpráv a API, čistá funkce planovace
```

**Brána v budově.** Mini PC s Home Assistant OS (Supervisor jen na HA OS; jiné instalace jsou nepodporované). Koordinátor Zigbee/Thread: Home Assistant Connect ZBT-2 podle návrhu; ověř, zda pracuje současně v Zigbee i Thread, jinak počítej s Zigbee pro hlavice a čidla. Zigbee přes integraci ZHA (vestavěná), pokud ověření ukáže problém s Danfoss Ally, použij Zigbee2MQTT jako doplněk. Agent CodeKom běží jako doplněk HA, mluví s HA přes WebSocket API (`ws://supervisor/core/websocket`, token ze `SUPERVISOR_TOKEN`; odběr `state_changed`, `call_service`, `get_states`) a ven přes MQTT s TLS. Agent nezná zařízení napřímo, jen entity HA; mapování entita na prvek je v konfiguraci stažené z cloudu (`prvky.haEntita`).

**Co kde běží, aby budova fungovala bez cloudu.** Vrstvy ochrany: (1) protimrazové minimum v samotné hlavici, (2) místní pravidla a plány na bráně, (3) cloud jen plánuje, vykazuje a posílá upozornění. Konkrétně na bráně běží vždy: vykonávání plánu, protimrazová ochrana, detekce otevřeného okna, ruční režim, platnost přístupových kódů, vyrovnávací fronta. Cloud nikdy nevydává příkaz „topit“ ani „nezamknout“ jako jedinou ochranu.

**Plán jako časové okamžiky, ne pravidla.** Čistá funkce `spocitejPlan(vstup): Interval[]` v `packages/typy` převádí úřední hodiny, provozní dobu budovy a potvrzené rezervace na seznam intervalů `{od, do, rezim, mistnosti[], zdroj}` v UTC okamžicích pro horizont 30 dní. Brána plán jen vykonává a nepočítá s časovými pásmy. Cloud i testy používají stejnou funkci. Cloud plán přepočítá při změně rezervace, hodin nebo nastavení a pošle ho jako uchovanou (retained) zprávu s `verze`; brána potvrdí `planVerze`.

**Témata MQTT** (QoS 1, JSON validovaný zod, prefix `codekom/v1/brany/<branaId>/`):

| Téma | Směr | Obsah |
|---|---|---|
| `telemetrie` | brána do cloudu | dávka `{seq, vzorky[{cas, prvekId, metrika, hodnota}]}` |
| `stav` | brána do cloudu | heartbeat každých 60 s: verze, uptime, délka fronty, stav HA, stav koordinátoru, `planVerze` |
| `udalost` | brána do cloudu | změna okna, dveří, ruční zásah, spuštění pravidla, otevření zámku (klíč, kód, příkaz) |
| `prikaz` | cloud do brány | `{id, typ, parametry, platnoDo, idempotencyKey}` |
| `ack` | brána do cloudu | `{prikazId, stav: provedeno or selhalo, duvod, potvrzenoZeZarizeni}` |
| `plan` | cloud do brány | uchovaná zpráva: intervaly, pravidla, kódy (šifrované) |
| `lwt` | broker | poslední vůle, stav offline |

Broker v EU s mTLS a ACL podle CN certifikátu (brána smí jen svůj prefix): [DOPLNIT: broker a hosting, např. EMQX nebo Mosquitto v EU]. Pro vývoj a testy použij Mosquitto v docker compose s `use_identity_as_username` a vložený broker (např. aedes) v jednotkových testech. Každá brána má vlastní klientský certifikát od CA CodeKom, jednorázový registrační token z dashboardu, klíč vzniká v bráně a ven jde jen CSR přes `POST /api/iot/brany/registrace`. Umístění klíče CA: [DOPLNIT: KMS nebo HSM]. Odvolání certifikátu odpojí bránu.

**Příjem telemetrie v cloudu.** Vercel funkce nedrží trvalé MQTT spojení. Broker proto volá `POST /api/iot/telemetrie` (webhook pravidla brokeru, podpis sdíleným tajemstvím, dávky), případně běží malý worker [OVĚŘIT, podle zvoleného brokeru]. Zápis je idempotentní: unikátní klíč `(prvek_id, metrika, cas)`. Příkazy z cloudu se publikují krátkým spojením nebo HTTP publish API brokeru. Rozhodnutí o variantě zapiš do `docs/rozhodnuti.md`.

**Rozhraní na ostatní části.** Moduly: vše pod `/api/iot` a v administraci se zobrazuje jen obcím s `moduly` obsahujícím `iot`. Rezervace: kolekce `rezervace` a `prostory` vzniká v digitálním úřadu. Pokud ještě neexistují, definuj v `lib/iot/zdroje/rezervace.ts` rozhraní `RezervaceZdroj` (`potvrzeneVOkne(budovaId, od, do)`, událost změny) s fixturou pro testy a s hákem `afterChange`, který se zapojí, jakmile kolekce existují. Předpoklad: `prostory.budova` je vztah na `budovy`. Oznámení: funkce `poslatOznameni({obec, prijemci, druh, text, kanaly})` v `lib/iot/oznameni.ts` posílá e-mail [DOPLNIT: e-mailová služba] a push přes registr z `POST /api/mobilni-zarizeni`, pokud existuje; SMS jen přes adaptér [DOPLNIT: SMS brána]. Žádný z nich nevolej napřímo z jiných míst.

**API pro dashboard a aplikaci** (session přihlášeného uživatele, vždy omezeno na jeho obce). Pro aplikaci vystav tenký adaptér `GET /api/mobilni/urad/budovy` (název vlastní prompt 02, ověřuje tokeny aplikace), který volá stejné funkce z `lib/iot` jako `GET /api/iot/obce/<slug>/prehled` a bez modulu `iot` vrací `{dostupne:false}`:

| Endpoint | Účel |
|---|---|
| `GET /api/iot/obce/<slug>/prehled` | budovy se stavem, aktivní alarmy, dnešní rezervace, spotřeba týdne proti loňsku |
| `GET /api/iot/budovy/<id>` | detail: místnosti, prvky, plán dne, dveře, poslední vstupy |
| `GET /api/iot/budovy/<id>/mereni?metrika&od&do&krok=15m,1h,1d` | řady z `mereni` nebo agregací podle rozsahu |
| `POST /api/iot/prikazy` / `GET /api/iot/prikazy/<id>` | vytvoření příkazu, stav příkazu |
| `POST /api/iot/alarmy/<id>/prevzit` | převzetí alarmu s poznámkou |
| `POST /api/iot/pristupy` / `POST /api/iot/pristupy/<id>/zrusit` | ruční kód, zrušení |
| `GET /api/iot/obce/<slug>/energie?obdobi` | spotřeba, srovnání, odhad úspory, export CSV |
</architektura>

<datovy_model>
Všechny kolekce Payloadu mají pole `obec` (multi-tenant plugin) a přístup omezený na obec uživatele. Časy jsou UTC, zobrazení Europe/Prague. Doménové názvy česky bez diakritiky.

**budovy**: `nazev`, `slug`, `adresa`, `poloha {sirka, delka}`, `typ` (urad | sal | skola | zbrojnice | sokolovna | jine), `provozniDoba` (strukturovaná: dny a od-do; `uredniHodiny` je volný text a nejde strojově číst, proto z něj jen předvyplň návrh k potvrzení), `sablonaProvozu` (sal | kancelar | skola | hasici), `teploty {komfort: 21, utlum: 17, mraz: 8}` (výchozí hodnoty, obec může měnit), `predtopeniMin` (výchozí 120), `utlumPredKoncemMin` (30), `kdoMaKlic` (text, kdo drží nouzový klíč), `rezimZamkuPriVypadku` (zustaneZamceno | otevre | neurceno; hodnotu `otevre` nelze uložit bez pole `potvrzenoProjektantem` s datem a jménem), `brana {id, stav, certifikatDo, verzeAgenta, posledniSpojeni, planVerze}`, `limity {mrazC: 5, co2ppm: 1500, oknoMin: 10, baterieProc: 20, vypadekBranyMin: 10}`.

**prvky**: `budova`, `mistnost`, `nazev`, `typ` (hlavice | cidloTeploty | cidloCo2 | cidloZaplaveni | kontaktOkno | meric | zamek | klavesnice | rele), `vyrobce`, `model`, `protokol` (zigbee | shellyRpc | matter | nukiBridge | saltoCloud), `haEntita`, `firmware`, `baterie`, `signal`, `stav` (ok | varovani | porucha | offline), `posledniZprava`, servisní záznamy (pole). Index na `(budova, typ)`.

**planyVytapeni**: `budova`, `mistnost` (volitelně), `nazev`, `zdroj` (urednihodiny | rezervace | rucni | sablona), `rezervace` (vztah, volitelný), `rezim` (komfort | utlum | mraz), `cilovaTeplota`, `od`, `do`, `opakovani` (týdenní vzor pro základní plán). Vypočtené intervaly se ukládají do `iot.plan_vypocteny(budova_id, verze, intervaly jsonb)`.

**pristupy**: `budova`, `typ` (trvaly | docasny), `nositel` (text: jméno nebo funkce), `rezervace` (volitelně), `platnostOd`, `platnostDo`, `kodHash`, `kodPoslednichCislic` (jen poslední 2 číslice pro identifikaci), `stav` (naplanovan | odeslan | aktivni | vyprsel | zrusen), `dorucenoPrez` (sms | email), `dorucenoVCas`. Samotný kód se ukládá jen jako hash; v plaintextu existuje v paměti při generování a v šifrované zprávě pro bránu (sealed box klíčem brány).

**prikazy**: `budova`, `prvek`, `typ` (nastavTeplotu | nastavRezim | otevriDvere | zamkniDvere | vytvorKod | zrusKod), `parametry` (json), `zadal` (uživatel nebo systém), `duvod` (povinný u dveří), `idempotencyKey` (unikátní), `platnoDo`, `stav` (vytvoren | odeslan | provedeno | selhalo | vyprselo), `odeslanoV`, `potvrzenoV`, `chyba`. Výchozí platnost: dveře 30 s, teplota a režim 5 min, kódy 15 min. Přechody stavů jsou jednosměrné, koncové stavy se nemění.

**alarmy**: `budova`, `prvek` (volitelný), `druh` (mraz | unikVody | vypadekBrany | slabaBaterie | oknoOtevrene | dvereNezamcene | prikazSelhal), `zavaznost` (varovani | porucha), `vznikl`, `skoncil`, `prevzal`, `prevzatoV`, `poznamka`, `eskalaceStav`. Unikátnost: nejvýš jeden aktivní alarm daného druhu na prvek a budovu.

**Schéma `iot` (SQL migrace mimo Payload, RLS zapnutá bez politik, přístup jen serverovou rolí):**
- `iot.mereni(cas timestamptz, obec_id, budova_id, prvek_id, metrika text, hodnota double precision, kvalita smallint)`, `PARTITION BY RANGE (cas)`, denní partice spravované pg_partman, primární klíč včetně `cas`, unikátní `(prvek_id, metrika, cas)`, index `(budova_id, metrika, cas desc)`. Metriky: `teplota`, `cilovaTeplota`, `vlhkost`, `co2`, `polohaVentilu`, `baterie`, `signal`, `energieKwh` (čítač), `vykonW`, `oknoOtevrene`, `dverePolohy`, `zaplaveni`.
- Retence: surová data 90 dní (konfigurace, partice se odpojují a mažou přes pg_partman retention). Agregace `iot.mereni_hodina` a `iot.mereni_den` (min, max, průměr, počet, u čítačů přírůstek) plní pg_cron každých 15 minut a po půlnoci; agregace se drží dlouhodobě. Funkce agregace je idempotentní a umí dopočítat zpětně (zpožděná data z fronty).
- `iot.audit_vstupu(id, cas, obec_id, budova_id, prvek_id, akce, puvod, uzivatel_id, pristup_id, duvod, vysledek)`. Akce: otevreniDalkove, otevreniKodem, otevreniKlicemZjisteno, zamceni, kodVytvoren, kodZrusen. Append-only: trigger zakazuje UPDATE a DELETE, mazání po lhůtě provádí jediná funkce s vyhrazenou rolí. Bez IP adres a bez obsahu kódů.
- Doba uložení auditu: `obce.iot.retenceAuditMesice`, výchozí [DOPLNIT: 12, k potvrzení advokátem a DPIA]. Nikde ji nezapisuj do kódu natvrdo.
- Dostupnost `pg_partman` a `pg_cron` na Supabase ověř přes `list_extensions` nebo dokumentaci; TimescaleDB na PG17 není k dispozici.
</datovy_model>

<funkce>
**Brána: cyklus.** Start: načti konfiguraci z cloudu, nebo poslední uloženou, pokud cloud není dostupný. Připoj se k HA, stáhni `get_states`, přihlas odběr změn. Každý vzorek jde nejdřív do SQLite fronty a teprve potom do MQTT; položka se maže až po potvrzení dávky cloudem (`seq`). Při obnově spojení se fronta odesílá v pořadí po dávkách, nejnovější data až po starších, aniž by blokovala heartbeat. Velikost fronty je omezená [DOPLNIT: limit disku], při přetečení se zahazují nejstarší vzorky a vzniká událost `frontaPretekla`. Hodiny: pokud se čas brány liší od brokeru o víc než 60 s, hlásí to heartbeat.

**Brána: pravidla (priorita shora).**
1. Ruční zásah na místě: změna cíle na hlavici nebo kolečkem, kterou agent nevyvolal, přepne místnost do režimu `rucni` do konce aktuálního intervalu plánu (nastavitelné) a pošle událost. Agent proti ručnímu zásahu nebojuje.
2. Mráz: teplota místnosti pod `mrazC` zapne protimrazové topení na `teploty.mraz` bez ohledu na plán a cloud, pošle událost a vznikne alarm. Po návratu nad práh o hysterezi 1 K se režim vrací.
3. Otevřené okno: kontakt okna nebo prudký pokles teploty po dobu `oknoMin` zavře hlavici, po zavření okna vrátí režim. Hlavice Danfoss to umí i sama; agent to řídí jen u zařízení, která to neumějí.
4. Plán: aktuální interval určuje cílovou teplotu místností.
5. Kódy: kód platí v okně `platnostOd` až `platnostDo`, i bez internetu; brána drží kódy 30 dní dopředu.

**Příkaz: životní cyklus.** Dashboard nebo aplikace pošle `POST /api/iot/prikazy` s `idempotencyKey`. Server ověří roli a oprávnění, zapíše příkaz do stavu `vytvoren`, publikuje ho (`odeslan`) a klient sleduje stav (dotazováním nebo SSE). Brána příkaz po `platnoDo` neprovede a ani po obnovení spojení nesmí provést prošlý příkaz (platí hlavně pro odemčení). Po provedení brána ověří výsledek ze stavu zařízení a pošle `ack` (`provedeno` nebo `selhalo`). Bez `ack` do `platnoDo` přejde příkaz do `vyprselo`, uživatel to uvidí a u dveří vznikne alarm `prikazSelhal`. Opakování téhož `idempotencyKey` vrací původní příkaz.

**Dálkové otevření dveří.** Povolí jen uživatel s `users.iotPrava = dvere` (pole přidej, výchozí hodnoty: žádné, čtení, ovládání, dveře; správce obce začíná na ovládání, dveře se přidělují výslovně), s dvoufázovým ověřením provedeným v posledních 5 minutách (step-up), s povinným důvodem z nabídky (servis nebo oprava, nájemce zapomněl kód, zásah hasičů, jiný s textem). V aplikaci (milník 9) před odesláním navíc biometrie na zařízení. Zámek se po 5 minutách sám zamkne. Každé otevření, úspěšné i neúspěšné, jde do `audit_vstupu`. Rozhraní vždy uvádí text „Dveře lze vždy otevřít klíčem. Klíč má: <kdoMaKlic>“.

**Plány a rezervace.** Základní plán: v úřední hodiny komfort, jinak útlum; sál a sokolovna bez rezervace drží útlum. Potvrzená rezervace prostoru vytvoří interval komfortu od `od - predtopeniMin` do `do - utlumPredKoncemMin` pro místnosti prostoru a přístupový kód s platností od 30 minut před začátkem do 30 minut po konci (obojí v konfiguraci). Rezervace přes půlnoc je jeden interval. Dvě navazující rezervace se spojí. Zrušení nebo posun rezervace plán a kód přepočítá a starý kód zruší. Kód se pošle nájemci SMS nebo e-mailem [DOPLNIT: dodavatel SMS]; zpráva obsahuje poučení o záznamu vstupů a odkaz na podmínky rezervace. Ruční plán obce má přednost před šablonou, nikoli před mrazovou ochranou.

**Alarmy a upozornění.** Druhy a prahy: mráz (pod `mrazC`), únik vody (kontakt čidla), výpadek brány (bez heartbeatu déle než `vypadekBranyMin`, vyhodnocuje pg_cron nebo cron route každou minutu [OVĚŘIT omezení Vercel Cron]), slabá baterie (pod `baterieProc`), okno otevřené příliš dlouho, dveře nezamčené po konci přístupu. Každý alarm: text v češtině, budova, od kdy, co dělat. Doručení do aplikace a e-mailem; eskalace po 15 minutách bez převzetí další osobě v pořadí a volitelně SMS. Alarm se neopakuje při každém vzorku, ukončí se sám po obnově hodnoty a zůstane v historii.

**Dashboard (osm obrazovek).** Přehled obce (mapa budov, alarmy, dnešní rezervace, spotřeba týdne proti loňsku). Detail budovy (místnosti s aktuální a cílovou teplotou a oknem, plán dne s vyznačenými rezervacemi, dveře a poslední vstupy, energie po 15 minutách, zařízení s baterií a signálem). Plány a pravidla (šablony Sál, Kancelář, Škola, Hasiči s nastavitelnými hodnotami a pravidla „když – pak“ jako předpřipravené šablony s parametry). Přístupy (trvalé a dočasné kódy, záznam vstupů). Energie (po budovách a měsících, srovnání s předchozím obdobím, odhad úspory v Kč, export CSV). Alarmy (aktivní, převzetí s poznámkou, historie). Zařízení (inventář, firmware, baterie, servisní záznamy). Rezervace (náhled kalendáře z digitálního úřadu a co která rezervace v budově spustí). Pro každou obrazovku udělej stavy: načítání (kostra), prázdný stav (např. „V obci zatím není žádná budova“ s odkazem na přidání), chyba (srozumitelná věta a tlačítko Zkusit znovu), brána offline (poslední známá data označená časem, ovládání zakázané s vysvětlením).

**Mapa budov.** Bez dlaždic třetích stran (kvůli IP adresám a § 89 zákona 127/2005 Sb.): jednoduchá SVG mapa bodů z GPS s názvy a stavem, vždy s ekvivalentním seznamem. Mapové podklady jako rozšíření [OVĚŘIT].

**Spotřeba a úspory.** Elektřina se měří (Shelly Pro EM). Teplo se měřit nemusí; pokud chybí měřič tepla nebo plynoměr, zobrazuj u vytápění jen ukazatele (hodiny v útlumu, průměrná odchylka od cíle) a odhad úspory označ jako odhad s uvedenou metodou. Porovnání s předchozím obdobím: stejné období loni, u tepla přepočtené na denostupně, pokud jsou data. Odhad úspory v Kč = rozdíl spotřeby × cena energie zadaná obcí [DOPLNIT: cena nastavuje obec]. Nepoužívej čísla výrobců ani procenta úspor bez zdroje; vedle odhadu vždy ukaž, z čeho vznikl.

**Zařízení (doporučení, ceny a funkce ověřit před nákupem; ceny z návrhu jsou orientační):**

| Role | Doporučení | Poznámka |
|---|---|---|
| Hlavice | Danfoss Ally přímo přes Zigbee (bez Ally Gateway, ta vyžaduje internet) | funkce okna a předehřevu v hlavici jsou [OVĚŘIT] (rešerše potvrzuje jen regulaci na nastavenou teplotu při ztrátě spojení); chování přes ZHA ověř |
| Hlavice, varianta | Shelly BLU TRV s lokálním RPC přes BLU Gateway Gen3 | nejlépe doložená lokální cesta (`TRV.SetTarget`, webhooky) |
| Čidla | teplota a vlhkost, CO2, zaplavení, kontakt okna přes Zigbee | konkrétní modely [DOPLNIT] |
| Elektřina | Shelly Pro EM (nebo Pro 3EM podle návrhu) | LAN, lokální API |
| Zámek | Nuki Smart Lock Pro 5. gen. + Keypad 2.0 na vložce s nouzovou funkcí, lokálně přes Nuki Bridge API nebo Matter | ověř lokální API a to, zda kódy fungují bez cloudu; mechanický klíč zůstává |
| Zámek, cloudová varianta | Salto KS jen s předplatným a výslovným upozorněním, že závisí na cloudu | není výchozí |
| Budoucí | Modbus, M-Bus, OpenTherm, KNX | pouze rozhraní adaptéru, ověř |

Adaptér zámku má rozhraní `ZamekAdapter` (`otevri(trvaniS)`, `zamkni()`, `nastavKod(kod, od, do)`, `zrusKod(id)`, `stav()`) a hlásí schopnosti (`kodyOffline: boolean`). Dashboard u zámku bez offline kódů výslovně uvede, že nový kód nelze vytvořit při výpadku internetu.
</funkce>

<pravidla>
- **Pravidlo 5 z CLAUDE.md** je tvrdé: zámek lze vždy otevřít klíčem (zámek na vložku, ne místo ní), mráz nezávisí na cloudu, ruční přepnutí na místě má přednost. Žádná funkce toto neobchází.
- **Únikové cesty.** Produkt neřídí dveře na únikové cestě. Jak se má elektrický zámek chovat při výpadku proudu, určuje požárně bezpečnostní řešení budovy a potvrzuje projektant (pole `rezimZamkuPriVypadku`). Požadavky EN 179 a EN 1125 a pojištění nech jako [OVĚŘIT u odborníka].
- **GDPR.** Záznam vstupů je osobní údaj; správcem je obec, CodeKom zpracovatelem (čl. 28 GDPR). Doba uložení [12] měsíců, vidí jen správce obce a uživatelé s právem `dvere`, nájemce je informován v podmínkách rezervace a ve zprávě s kódem. Posouzení vlivu (DPIA) u vstupu do budov je podle `docs/pravni-dokumenty.md` potřeba; připrav podklad v `docs/iot/soukromi-a-retence.md`, nepředstírej, že DPIA proběhlo.
- **Zákon č. 264/2025 Sb.** (o kybernetické bezpečnosti, účinný od 1. 11. 2025; vyhlášky 408/2025, 409/2025, 410/2025). Obce s rozšířenou působností spadají podle podpůrného materiálu NÚKIB do nižšího režimu (vyhl. 410/2025), malé obce zřejmě přímo ne. CodeKom je pro ně dodavatel, takže `docs/iot/bezpecnostni-priloha.md` popíše technická opatření (MFA, logování, správa zranitelností, řízení přístupu, aktualizace, zálohy) věcně a bez prohlášení o souladu. Přesné povinnosti dodavatele [OVĚŘIT v plném znění].
- **EU Cyber Resilience Act.** Hlášení aktivně zneužívaných zranitelností a závažných incidentů výrobci platí od 11. 9. 2026 (první upozornění do 24 hodin přes ENISA Single Reporting Platform), plná použitelnost od 11. 12. 2027. CodeKom může být výrobcem produktu s digitálními prvky, protože dodává bránu s vlastním softwarem. Tuto právní kvalifikaci neuváděj jako fakt, je to otázka pro právníka. Technicky připrav: SBOM (CycloneDX) generovaný v CI pro obraz doplňku, `SECURITY.md` a `security.txt` s kontaktem [DOPLNIT: e-mail pro hlášení zranitelností], interní postup hlášení v `docs/iot/hlaseni-zranitelnosti.md`, bezpečné výchozí nastavení (žádná společná hesla, jedinečný certifikát na bránu, žádný otevřený port do internetu, zakázané služby, které nejsou potřeba), podepsané aktualizace s možností návratu, vyhlášené období podpory [DOPLNIT].
- **Rádiová zařízení (RED).** Delegovaný akt a EN 18031 se týkají rádiových zařízení; datum použitelnosti a dopad na bránu se Zigbee a Wi-Fi [OVĚŘIT na EUR-Lex]. Do té doby používej jen koordinátory a zařízení od výrobců, kteří nesou CE.
- **Cookies a třetí strany.** Dashboard nesmí načítat analytiku ani externí mapové dlaždice a fonty; jen nezbytné cookies.
- **Úřad je fallback.** Na stránce rezervace a v e-mailu s kódem je i telefon a úřední hodiny obce; pro případ, že kód nefunguje.
- **Peníze.** Nic v tomto modulu s penězi nepracuje. Cena služby je mimo rozsah.
</pravidla>

<design_a_pristupnost>
- Vzhled podle `design/prototypy/IoT-Dashboard.dc.html` a pravidel unslop z CLAUDE.md: řezy písma nejvýš 600, jedna akcentová barva, žádné přechody, záře ani emoji, mřížka po 4 px, tenké linky, bez kartiček jako ze SaaS šablony. Text 17 px, cíle pro dotyk aspoň 44 × 44 px, kontrast textu aspoň 4,5 : 1. Stavové barvy a tokeny bez vlastních odstínů z `packages/tokeny` (stav: v pořádku, varování, porucha; krizové barvy nepoužívej pro IoT).
- Stav nikdy jen barvou. Každý stav má slovo (V pořádku, Varování, Porucha, Offline) a samostatný tvar nebo ikonu s textovou alternativou. Alarm má ve výpisu slovo závažnosti na začátku.
- Grafy mají textovou alternativu: tabulku hodnot pod grafem nebo za přepínačem „Zobrazit jako tabulku“ a jednovětý souhrn. Čáry se liší i tvarem nebo stylem, ne jen barvou.
- Klávesnice: každý prvek dosažitelný a ovladatelný, viditelný fokus, žádná past. Dialog odemčení je modální s návratem fokusu, `Esc` zavírá, počáteční fokus je na nabídce důvodů.
- Změny stavu (nový alarm, výsledek příkazu) oznamuje `aria-live="polite"`, kritické `role="alert"`. Příkaz zobrazuje postup slovy: Odesílám, Čekám na potvrzení, Provedeno, Neprovedeno, Vypršelo.
- Žádný údaj se nespoléhá na hover. Časy a teploty česky (22,5 °C, 27. 10. 2026, 10:50). Respektuj `prefers-reduced-motion`.
- Mobil: v záložce Úřad jen důležité, to jsou Přehled (alarmy, dnešní rezervace, schválení), Budovy (teploty, režim; ke čtení je staví prompt 02 nad adaptérem `GET /api/mobilni/urad/budovy`, otevření dveří s biometrií, důvodem a právem `dvere` přidává milník 9). Plány, energie, zařízení a export jsou jen na webu a aplikace na ně odkáže. Offline zobrazí poslední stav s časem a zakáže ovládání.
- Rozvržení na 375 a 1280 px bez vodorovného posunu; tabulky na úzkém displeji přejdou na seznam položek.
</design_a_pristupnost>

<bezpecnost_a_soukromi>
- Brána nemá otevřený žádný port do internetu; spojení jen ven, MQTT s TLS 1.2 nebo vyšší, klientský certifikát na bránu, ACL na prefix brány. Zařízení v oddělené síti.
- Vzdálená správa přes WireGuard (brána jako klient hubu CodeKom [DOPLNIT: hub a síť]), zapínaná jen na čas, každé zapnutí do auditu. Porovnání s Tailscale pro flotilu viz `overit`.
- Aktualizace doplňku přes repozitář doplňků HA [DOPLNIT: repozitář a registr obrazů]; automatické aktualizace jsou ve výchozím stavu vypnuté, nasazuje se po vlnách (nejdřív zkušební budova), je možný návrat na předchozí verzi, obrazy jsou podepsané [OVĚŘIT podporu podpisu u doplňků]. Aktualizace HA jádra a OS jen po vyzkoušení.
- LTE záloha je volitelná, SIM a modem [DOPLNIT]; bez ní se brána chová jako při výpadku internetu.
- Tajemství (tajemství webhooku, klíč CA, klíče brán) jen v `.env` a v úložišti klíčů, nikdy v logu ani commitu. `.env.example` pro `apps/brana` a nové proměnné v `apps/web`.
- Autorizace: každá kolekce a endpoint kontroluje obec a `moduly.iot`; uživatel jedné obce nikdy neuvidí nebo neovládne budovu jiné (test napříč tenanty). Redaktor audit vstupů nevidí. Superadmin CodeKomu k datům vstupů přistupuje jen s auditovaným podpůrným přístupem.
- Limit četnosti na příkazy a na vytváření kódů, 5 neúspěšných ověření zablokuje step-up na 15 minut.
- Šifrování kódů ve zprávě do brány klíčem brány; v logu a v odpovědích API se kód nikdy neobjeví.
- Data zůstávají v EU (Supabase Frankfurt, broker v EU).
</bezpecnost_a_soukromi>

<testy>
Nástroje: Vitest, Testing Library, Playwright, axe-core (`pnpm a11y`), Postgres 17 v kontejneru s pg_partman a pg_cron pro integraci (např. image Supabase; PGlite jen pro čistou SQL logiku bez partitionování), vložený MQTT broker.

1. **Simulátor brány** (`apps/brana/sim`): fake HA WebSocket (autorizace, `get_states`, odběr událostí, `call_service` pro `climate` a `lock`), tepelný model místnosti (ohřev, ztráty, otevřené okno), ovladač scénářů (výpadek spojení, restart agenta, ruční zásah, mráz, slabá baterie). Stejný simulátor spouští integrační testy i demo.
2. **Integrační testy MQTT**: agent, broker a cloud dohromady; dávky jsou idempotentní, vzorek se nezduplikuje ani při opakovaném doručení; neplatná zpráva se odmítne a spočítá.
3. **Plánovač** (`spocitejPlan`): úřední hodiny v Europe/Prague, přechod na letní čas (konec března, neexistující 02:30) a zimní čas (konec října, opakovaná hodina), rezervace přes půlnoc, spojení navazujících rezervací, posun a zrušení rezervace, překryv ručního plánu, předtopení před začátkem a útlum před koncem, hranice horizontu 30 dní. Tabulkové testy s pevnými daty.
4. **Offline a dosynchronizace**: výpadek spojení na 1 hodinu (60 vzorků na metriku) – po obnově v `mereni` žádná mezera a žádný duplikát, správné pořadí, `seq` souvislé; restart agenta uprostřed výpadku nezanechá ztrátu; přetečení fronty vytvoří událost; plán a kódy platí celou dobu.
5. **Fail-safe**: bez cloudu klesne teplota pod práh a protimrazové topení se zapne do jedné minuty simulovaného času; ruční zásah se nepřebíjí; nedostupný HA vytvoří místní příznak a po obnově alarm; prošlý příkaz k odemčení se po obnově spojení neprovede.
6. **Příkazy**: stavy a přechody, idempotence, `platnoDo`, vypršení bez `ack`, `ack` selhalo, souběh dvou příkazů na týž zámek, nedostatečná role, chybějící step-up, chybějící důvod.
7. **Telemetrie a SQL**: migrace schématu `iot` včetně partic, retenční odpojení partic, idempotentní agregace a zpětný dopočet, trigger append-only na auditu, retenční funkce auditu.
8. **Tenanti**: dvě obce, vzájemná izolace všech kolekcí a endpointů, `moduly.iot` vypnuté vrátí 404.
9. **Alarmy**: vznik, deduplikace, hystereze, převzetí, eskalace po 15 minutách, ukončení po návratu hodnoty.
10. **Dashboard**: Playwright na 375 a 1280 px pro klíčové cesty (přehled, detail budovy, převzetí alarmu, změna režimu, odemčení s důvodem a výsledkem příkazu, vytvoření kódu, offline stav brány), axe-core bez chyb na každé obrazovce ve všech stavech (načítání, prázdno, chyba, offline), ruční kontrola klávesnicí zapsaná do `docs/iot/pristupnost.md`.
11. **Zařízení**: kontraktní testy adaptérů proti nahrávkám zpráv HA; rozhraní `ZamekAdapter` s fake implementací včetně chování bez offline kódů.
</testy>

<postup>
Na začátku zjisti stav repa, sepiš plán a seznam úkolů do `docs/progress.json` a odškrtávej. Každý milník končí kontrolami (`pnpm typecheck`, `pnpm lint`, `pnpm test`, u UI `pnpm e2e` a `pnpm a11y`) a commitem česky v rozkazovacím způsobu. Pro schéma, bezpečnost a plánovač přepni na vyšší úsilí. Po dvou neúspěšných opravách téhož problému začni znovu s čistou hlavou a zapiš, co se nepovedlo.

1. **Základ a typy.** Workspace pro `apps/brana` a `packages/typy`, zod schémata zpráv MQTT a API, funkce `spocitejPlan` s tabulkovými testy (časová pásma, letní čas, půlnoc). Ověř verze balíčků přes `npm view`.
2. **Cloud: data.** Kolekce Payloadu, `users.iotPrava`, migrace schématu `iot` (`mereni`, agregace, `audit_vstupu`, pg_partman, pg_cron), testy SQL a izolace tenantů. Ověř dostupnost rozšíření.
3. **Simulátor a agent.** Fake HA, klient HA, fronta, MQTT, místní plánovač a pravidla, heartbeat. Testy offline a fail-safe.
4. **Cloud: tok.** Příjem telemetrie, publikace plánu a příkazů, `ack` a časový limit, alarmy a oznámení, registrace brány a certifikáty (vývojová CA). Integrační testy brána – broker – cloud.
5. **Plány, rezervace, kódy.** Zdroj rezervací (rozhraní a fixtura, zapojení na hák, pokud kolekce už existují), přepočet plánu, kódy a jejich doručení, audit.
6. **Dashboard.** Osm obrazovek a API, nejdřív Přehled a Detail budovy, potom Alarmy, Přístupy, Energie, Plány, Zařízení, Rezervace. Playwright a axe. Pokud existuje `apps/mobile`, doplň do záložky Úřad Přehled ke čtení; Budovy ke čtení staví prompt 02 a otevření dveří je milník 9.
7. **Doplněk HA a dokumenty.** Balení doplňku, `docs/iot/*`, SBOM v CI, `SECURITY.md`, zápisy do `docs/rozhodnuti.md` (příjem telemetrie, `iotPrava`, mapa bez dlaždic, ověřené a neověřené položky).
8. **Demo a úklid.** Skript `pnpm iot:demo` spustí simulátor a naplní Javoří Lhotu. Projdi checklist níže a ověř položky z `overit`.
9. **Otevření dveří v aplikaci** (samostatný milník, jen když existuje `apps/mobile` s Budovami ke čtení z promptu 02; jinak dodej adaptér, typy a kontraktní testy a do závěru napiš, že UI čeká na aplikaci). Tenký adaptér `POST /api/mobilni/urad/budovy/<id>/dvere` (tokeny aplikace) volá tutéž funkci jako `POST /api/iot/prikazy`: právo `dvere` v `users.iotPrava`, čerstvé 2FA (step-up do 5 minut), povinný důvod z nabídky, `idempotencyKey`, zápis pokusu i výsledku do `audit_vstupu`. Server vrátí v `GET /api/mobilni/urad/budovy` oprávnění `dvere`; jen s ním aplikace ukáže tlačítko Otevřít dveře. Dialog s důvodem (modální, fokus se vrací), biometrie na zařízení těsně před odesláním, postup příkazu slovy (Odesílám, Čekám na potvrzení, Provedeno, Neprovedeno, Vypršelo), text „Dveře lze vždy otevřít klíčem. Klíč má: <kdoMaKlic>“, offline ovládání zakázané. Testy: bez práva 403, bez step-up 403, bez důvodu 400, bez úspěšné biometrie se příkaz neodešle (RNTL), opakovaný `idempotencyKey` vrací původní příkaz, audit zapíše pokus i výsledek, a11y (role, popisky, cíle aspoň 44 × 44, čtečka). Zapiš do `docs/rozhodnuti.md`.
</postup>

<hotovo_kdyz>
Projdou `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm e2e` (375 a 1280 px), `pnpm a11y`. Navíc je ukázáno (příkazem `pnpm iot:demo` a v záznamu testu):

- [ ] Ukázková obec Javoří Lhota má 2 budovy v simulátoru (Obecní úřad se sálem, Sokolovna), každou s vlastní bránou, hlavicemi, čidly, měřičem energie a zámkem.
- [ ] Brána se zaregistruje jednorázovým tokenem, získá certifikát a připojí se přes mTLS; brána s cizím certifikátem je odmítnuta.
- [ ] Potvrzená rezervace sálu na sobotu 18:00 až 22:00 vytvoří plán: komfort od 16:00 do 21:30, jinak útlum; brána plán potvrdí verzí.
- [ ] Nájemce dostane kód platný od 17:30 do 22:30 e-mailem (a SMS přes adaptér), zpráva obsahuje poučení o záznamu vstupů a telefon na úřad; v databázi je jen hash.
- [ ] Zrušení rezervace odstraní interval a zruší kód v bráně do 1 minuty.
- [ ] Výpadek internetu na 1 h: brána dál vykonává plán, kód v oknem platnosti otevře zámek, protimrazové pravidlo zareaguje; po obnově je v `mereni` všech 60 vzorků na metriku bez mezery a bez duplicity a audit obsahuje otevření kódem.
- [ ] Příkaz vydaný při výpadku (otevření dveří) vyprší a po obnově spojení se neprovede; uživatel vidí stav Vypršelo a vznikne alarm.
- [ ] Mráz v Sokolovně (scénář 4 °C) vyvolá místní protimrazové topení, alarm, e-mail a push; alarm lze převzít s poznámkou; po návratu teploty se ukončí.
- [ ] Dálkové otevření dveří vyžaduje právo `dvere` (`users.iotPrava`), čerstvé 2FA a důvod; jinak endpoint vrátí 403; audit zapíše pokus i výsledek.
- [ ] Otevření dveří v aplikaci (milník 9, je-li aplikace): tlačítko vidí jen uživatel s právem `dvere`, před odesláním biometrie a důvod, výsledek příkazu slovy a zápis v auditu; bez práva server vrací 403.
- [ ] Dashboard: Přehled řekne do 5 sekund, zda je vše v pořádku; všechny stavy jsou čitelné i bez barvy; axe bez chyb; mobilní Úřad ukazuje jen Přehled a Budovy.
- [ ] Energie: srovnání s předchozím obdobím a odhad úspory v Kč s uvedenou metodou a cenou zadanou obcí.
- [ ] `docs/iot/` obsahuje instalaci brány, bezpečnostní přílohu, postup hlášení zranitelností, podklad k soukromí a seznam zařízení; CI vytváří SBOM.
- [ ] Žádné tajemství v repu, žádné `any` ani `@ts-ignore` kvůli tichému průchodu.
</hotovo_kdyz>

<overit>
Co rešerše nepotvrdila. Ověř z dokumentace a výsledek zapiš do `docs/iot/overeni.md` se zdrojem a datem; co se neověří, nech v kódu a dokumentech označené [OVĚŘIT].

| Položka | Jak ověřit |
|---|---|
| České ceny Danfoss Ally, Shelly BLU TRV, Shelly Pro EM, Nuki Pro 5 a Keypad 2.0, ZBT-2, mini PC | srovnávače (zbozi.cz), obchody; v dokumentech vždy s datem |
| Nuki Bridge HTTP API a Web API, offline kódy | developer.nuki.io, dokumentace Bridge API |
| Salto KS lokální API a chování offline | dokumentace Salto, dodavatel |
| Modbus, M-Bus, KNX, OpenTherm jako rozšíření | dokumentace integrací HA |
| Node-RED a ThingsBoard Edge jako alternativa agentu | dokumentace; zapiš jen stručné srovnání do rozhodnutí |
| Tailscale oproti WireGuard pro flotilu | dokumentace; sleduj souběh s požadavkem na data v EU a licenční model |
| HA WebSocket API, doplňky HA (konfigurace, repozitář, podpis), ZHA a Danfoss Ally, ZBT-2 Zigbee a Thread | developers.home-assistant.io, home-assistant.io |
| `pg_partman`, `pg_cron` na Supabase, limity Realtime | `list_extensions`, supabase.com/docs |
| Vercel Cron s minutovou frekvencí | dokumentace Vercel |
| RED delegovaný akt a EN 18031 | EUR-Lex, text aktu |
| Povinnosti dodavatele podle zákona 264/2025 Sb. a vyhlášky 410/2025 | plné znění |
| Postavení CodeKomu podle CRA | právník, nezapisovat jako fakt |
| Úniková cesta a zámky (EN 179, EN 1125), pojištění | odborník na požární bezpečnost |
| Případové studie úspor v českých obcích a dotace 2026 (OPŽP, NPO, IROP, programy MPO, Modernizační fond) | SFŽP, MPO; pozor, výzva z let 2015–2016 v rešerši je neaktuální; neuváděj čísla úspor bez zdroje |
</overit>

<zaver>
Na konci napiš krátké shrnutí:
- co je hotové a čím je to ověřené (výstup příkazů, scénář `pnpm iot:demo`, testy offline a dosynchronizace),
- co zbývá a co záměrně chybí (hardware, DPS, LoRaWAN, učení předtopení),
- které položky z `overit` jsou ověřené, které zůstaly [OVĚŘIT],
- kde jsou místa [DOPLNIT] (broker, SMS a e-mail, KMS pro CA, hub WireGuard, repozitář doplňků, doba uložení auditu, kontakt pro zranitelnosti, období podpory),
- rozhodnutí, která jsi zapsal do `docs/rozhodnuti.md`.
</zaver>
