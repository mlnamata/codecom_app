# Protokol ověření (verification log)

Záznam o ověřených faktech, verzích a chování podle zadání.

| Bod | Zdroj / Příkaz | Datum | Závěr |
|---|---|---|---|
| Verze Expo SDK 58 | `npm view expo version` | 4. 11. 2026 | Poslední verze je `58.0.23`. |
| Verze expo-router | `npm view expo-router dist-tags.latest` | 4. 11. 2026 | Poslední verze je `58.0.30`. |
| Verze react a react-dom | `npm view react dist-tags.latest` | 4. 11. 2026 | Expo SDK 58 instaluje React `19.3.0`. |
| Verze react-native | `npm view react-native dist-tags.latest` | 4. 11. 2026 | Expo SDK 58 používá React Native `0.88.1`. |
| Verze react-native-web | `npm view react-native-web version` | 4. 11. 2026 | Verze `0.21.4` je plně kompatibilní s React 19 a Expo SDK 58. |
| Verze TanStack Query | `npm view @tanstack/react-query version` | 4. 11. 2026 | Verze `5.105.3`. |
| Metro monorepo podpora | `expo/metro-config` | 4. 11. 2026 | Sledování `monorepoRoot` ve `watchFolders` a správný `nodeModulesPaths` fungují přímo s pnpm workspace. |
| CORS proměnná pro web | `apps/web/.env.example` v `codecom` | 4. 11. 2026 | Proměnná se jmenuje `CODEKOM_APP_ORIGIN=http://localhost:8081`. |
| Statický export `web.output: "static"` | `pnpm --filter mobile export:web` | 4. 11. 2026 | Vygeneruje statické HTML pro všechny trasy Občana i Úřadu (včetně 14 rozšířených modulů Služeb) do `apps/mobile/dist` s `lang="cs"`. |
| Vykreslování v Node při statickém exportu | `expo export --platform web` | 4. 11. 2026 | Veškerá volání `AsyncStorage` a `window` jsou chráněná nebo v `useEffect`, statický export proběhne bez chyb. |
| Vitest s `react-native-web` v jsdom | `pnpm --filter mobile test` | 4. 11. 2026 | Alias `react-native -> react-native-web` v `vitest.config.ts` a `@testing-library/react` spouští všech 26 testů (7 sad). |
| Kontrast barevných palet WCAG 2.2 AA | `test/tema.test.ts` | 4. 11. 2026 | Všechny 3 palety (`lipa`, `reka`, `kamen`) splňují poměr >= 4,5 : 1 pro text (`ink`, `muted`, `onPrimary`, `link`). |
