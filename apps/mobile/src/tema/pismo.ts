import { Platform } from 'react-native'

export const pismo = {
  rodina: Platform.select({
    web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    ios: 'System',
    android: 'sans-serif',
    default: 'sans-serif',
  }),
  velikosti: {
    male: 13,
    popisek: 15,
    zaklad: 17,
    podnadpis: 20,
    nadpis: 24,
    velkyNadpis: 28,
  },
  vahy: {
    normalni: '400' as const,
    stredni: '500' as const,
    polotucne: '600' as const,
  },
}
