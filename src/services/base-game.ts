import { FetchManager } from '../managers/http'
import { type WorldInfo } from '../parsers/stw'

export const baseGameService = FetchManager.create(
  'https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/game/v2'
)
  .defaultHeaders({
    'Content-Type': 'application/json',
  })
  .build()

export function getWorldInfo({ accessToken }: { accessToken: string }) {
  return baseGameService.get<WorldInfo>('/world/info', {
    headers: {
      Authorization: `bearer ${accessToken}`,
    },
  })
}
