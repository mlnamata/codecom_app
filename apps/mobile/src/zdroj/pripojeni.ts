import { ObceSeznamOdpoved } from '@codekom/typy'
import type { RezimZdroje } from './typy'

export async function overitPripojeniApi(urlVychozi?: string): Promise<RezimZdroje> {
  const zakladApi = urlVychozi ?? process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'
  if (!zakladApi || zakladApi.trim() === '') {
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
