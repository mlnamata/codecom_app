import { ObceSeznamOdpoved } from '@codekom/typy'
import type { RezimZdroje } from './typy'

/**
 * Adresa API z `EXPO_PUBLIC_API_URL`. Bez ní běží aplikace jen ve vestavěném
 * režimu a API se vůbec nezkouší (zadání 08), takže zveřejněná ukázka
 * nevolá `localhost` v prohlížeči návštěvníka.
 */
export function adresaApi(): string {
  return (process.env.EXPO_PUBLIC_API_URL ?? '').trim()
}

export async function overitPripojeniApi(urlVychozi?: string): Promise<RezimZdroje> {
  const zakladApi = (urlVychozi ?? adresaApi()).trim()
  if (zakladApi === '') {
    return 'vestavene'
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 2500)

  try {
    const res = await fetch(`${zakladApi}/api/obce`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    })

    if (!res.ok) {
      return 'vestavene'
    }

    const data: unknown = await res.json()
    const valid = ObceSeznamOdpoved.safeParse(data)
    if (!valid.success) {
      return 'vestavene'
    }

    return 'api'
  } catch {
    return 'vestavene'
  } finally {
    clearTimeout(timeoutId)
  }
}
