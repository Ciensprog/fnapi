import { FetchManager } from '../managers/http'

export const calderaService = FetchManager.create(
  'https://caldera-service-prod.ecosec.on.epicgames.com/caldera/api/v1/launcher',
)
  .defaultHeaders({
    'Content-Type': 'application/json',
  })
  .build()

export function getAntiCheatProvider({
  accountId: account_id,
  exchangeCode: exchange_code,
}: {
  accountId: string
  exchangeCode: string
}) {
  return calderaService.post<AntiCheatProviderResponse>('/racp', {
    account_id,
    exchange_code,
    epic_app: 'fortnite',
    test_mode: false,
    nvidia: false,
    luna: false,
    salmon: false,
  })
}

export type AntiCheatProviderResponse = {
  jwt: string
  provider: string
}
