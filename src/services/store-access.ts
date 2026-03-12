import { FetchManager, type RequestParamConfig } from '../managers/http'

export const storeAccessService = FetchManager.create(
  'https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/storeaccess/v1',
)
  .defaultHeaders({
    'Content-Type': 'application/json',
  })
  .build()

export function requestStoreAccess(
  {
    accountId,
  }: {
    accountId: string
  },
  config?: RequestParamConfig,
) {
  return storeAccessService.post<unknown>(
    `/request_access/${accountId}`,
    {},
    config,
  )
}
