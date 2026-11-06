# Předání: co má udělat session aplikace

Stav k 6. 11. 2026. Tento repozitář je pro mobilní aplikaci CodeKom (občan a úřad) a pro IoT bránu do obecních budov. Web obcí a jeho API jsou v `mlnamata/codecom` (`apps/web`), firemní web v `mlnamata/codekom_web`.

## Co už je hotové

- Základ monorepa: pnpm 10, TypeScript strict s `noUncheckedIndexedAccess`, ESLint, Vitest.
- `packages/iot` (11 testů):
  - `protokoly.ts`: katalog standardů IoT (Zigbee, Z-Wave, Thread, Matter, BLE, Wi-Fi zařízení, LoRaWAN, Modbus, M-Bus, KNX, BACnet, OPC UA, MQTT, HTTP, CoAP, OpenTherm, DALI, 1-Wire, EnOcean). U každého je cesta připojení (`nativni`, `mqtt-most`, `home-assistant`, `planovano`) a potřebný hardware.
  - `konfigurace.ts`: zod schéma konfigurace brány (připojení Home Assistant, MQTT s předvolbami, Modbus TCP, Shelly RPC, HTTP JSON; protimrazové pravidlo).
  - `zpravy.ts`: témata a zprávy MQTT podle zadání 04 (`codekom/v1/brany/<branaId>/telemetrie|stav|udalost|prikaz|ack|plan|lwt`).

- **MVP prototypu aplikace** (`apps/mobile`, zadání 08), stav k 6. 11. 2026, větev `claude/youthful-mayer-cq8f79`:
  - role Občan (přehled, deska, zprávy, služby včetně rozšířených modulů, více) a Úřad (přehled, krize a rozhlas, závady, budovy ke čtení) nad daty Javoří Lhoty, vestavěný režim i režim API,
  - nahlašování závad je hlavní funkce: tlačítko „+“ v liště, karta na přehledu, 16 kategorií s ikonami, sledovací kód a dohledání stavu,
  - vzhled černá a limetková s písmem Inter Tight, snímky v `snimky-ukazka/`,
  - ověření: `pnpm typecheck`, `pnpm lint`, `pnpm test` (58 testů) a `pnpm --filter mobile kontrola:web` (39 kroků v prohlížeči nad statickým exportem), vše prochází,
  - postup spuštění a kontroly je v `apps/mobile/README.md`.

  Otevřené body MVP:
  - napojení na ostré API webu 07 není ověřené (API ani CORS v tomto prostředí neběží); nové kategorie závad a kategorie desky v režimu API se berou z vestavěných dat [OVĚŘIT],
  - hosting zveřejněné ukázky musí překládat cesty na soubory exportu jako `scripts/serve.mjs` (`deska/index.html`, `deska/[id].html`), jinak chyba hydratace,
  - písmo Inter Tight se zatím načítá jen na webu, nativní aplikace má systémové písmo,
  - na webu `codecom` je u AI fotografií textový popisek; uživatel chce místo něj vodoznak, rozhodnutí a změna patří do `codecom` [DOPLNIT: kdo změnu udělá].

Adaptéry brány (`apps/brana`) se začaly psát, ale práce se zastavila, a proto složka v repozitáři není.

## Co udělat

Zadání jsou v `docs/zadani/`, podklady v `docs/podklady/`, klikací návrhy v `design/`. Doporučené pořadí:

1. **Prototyp aplikace** (`docs/zadani/08-prototyp-aplikace.md`): aplikace s rolemi Občan a Úřad, nad daty ukázkové obce Javoří Lhota. Návrhy jsou `design/App-Obcan.dc.html` a `design/App-Urad.dc.html`. Data bere z API ukázky webu obce (`apps/web` v `codecom`: `/api/obce`, `/api/krize`, `/api/hlaseni-zavad`). Ukázka běží na https://codecom-psi.vercel.app [OVĚŘIT, že je nasazená]. CORS povoluje jen `CODEKOM_APP_ORIGIN`, tu je potřeba nastavit na adresu aplikace.
2. **Ostrá aplikace** (`docs/zadani/02-mobilni-aplikace.md`): Expo SDK 58, Expo Router, TanStack Query, přihlášení, push, obchody.
3. **IoT brána** (`docs/zadani/04-iot-budovy.md`, část brána): `apps/brana` nad `packages/iot`. Plánovaný rozsah:
   - jednotné rozhraní adaptéru a registr,
   - adaptéry Home Assistant WebSocket, MQTT s předvolbami (Zigbee2MQTT, Z-Wave JS UI, Tasmota, ESPHome, Shelly, Homie, ChirpStack, TTN), Modbus TCP, Shelly RPC a HTTP JSON,
   - objevování zařízení přes mDNS s hotovými návrhy konfigurace,
   - fronta na `node:sqlite` a odesílání do cloudu přes MQTT,
   - protimrazové pravidlo, které nezávisí na cloudu,
   - testy proti falešnému HA, brokeru aedes a falešnému Modbus serveru.
   
   Cloudová část IoT (kolekce, schéma `iot`, dashboard) patří do `codecom/apps/web`.
4. **Otevření dveří v aplikaci**: milník 9 zadání 04, až existují Budovy ke čtení.

## Pravidla

Platí `CLAUDE.md` tohoto repozitáře a pravidla domény z `codecom/CLAUDE.md`, hlavně:
- pravidlo 5: zámek jde vždy otevřít klíčem a mráz nezávisí na cloudu,
- design podle unslop,
- přístupnost WCAG 2.2 AA,
- data v EU.

Po každém ověřeném kroku commitni, pushni na `main` a aktualizuj `docs/progress.md`.

## Kopie

`docs/zadani`, `docs/podklady` a `design/` jsou kopie z `codecom` ze 4. 11. 2026. Zdrojem pravdy zůstává `codecom`. Zadání 04 popisuje i cloud v `apps/web`, proto zůstává i tam.
