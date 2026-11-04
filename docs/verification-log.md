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
