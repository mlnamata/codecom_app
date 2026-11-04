# Rozhodnutí

Odchylky od zadání a jejich důvody. Nejnovější dole.

## 1. Sdílené balíčky jako kopie z `codecom` (4. 11. 2026)

Zadání 08 počítá s tím, že aplikace vzniká v repozitáři `codecom` vedle `packages/tokeny`, `packages/typy`, `packages/demo-data` a `obsah/javori-lhota`. Aplikace se ale přesunula do `codecom_app`. Prompt 07 v `codecom` proběhl (balíčky, datová vrstva `apps/web/src/lib/data/demo-pamet.ts`, endpointy, `CODEKOM_APP_ORIGIN`), takže balíčky se nezakládají znovu.

- Balíčky a obsah se kopírují skriptem `scripts/synchronizuj-sdilene.sh` (výchozí zdroj `../codecom`). Zdrojem pravdy zůstává `codecom`, kopie se ručně neupravují.
- Jediná úprava při kopírování: z `packages/tokeny/package.json` se odebere skript `generate`, protože generátor `design/generator` je jen v `codecom`.
- Kořenový ESLint kopie ignoruje (obsahují záměrné nezlomitelné mezery v českých textech a v `codecom` mají vlastní kontrolu).
- Proč ne git submodul nebo závislost z gitu: `codecom` je velký monorepozitář s Next.js a Payload a pnpm workspace by ho celý tahal; kopie tří malých balíčků je jednodušší a odpovídá tomu, jak se sem už kopírují `docs/zadani` a `design/`.

## 2. Systémové písmo v mobilní aplikaci (4. 11. 2026)

Písma šablon obce jsou určena pro web a v aplikaci by vyžadovala stahování externích webových písem při každém načtení. Mobilní aplikace proto používá systémové písmo (`system-ui` na webu, `System` na iOS, `sans-serif` na Androidu).

## 3. Založení apps/mobile (4. 11. 2026)

Prototyp aplikace je založen na Expo SDK 58 (58.0.23), Expo Router (58.0.30), React 19 (19.3.0), react-native 0.88.1, react-native-web 0.21.4 a TanStack Query v5. Metro v monorepu sleduje i kořenový adresář (`packages/*`, `obsah/`).
Webový rámec (`Ramec.web.tsx`) vykresluje aplikaci na desktopu v rámu telefonu o maximální šířce 430 px uprostřed obrazovky.
