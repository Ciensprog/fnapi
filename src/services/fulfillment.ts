import { FetchManager, type RequestParamConfig } from '../managers/http'

export const fulfillmentService = FetchManager.create(
  'https://fulfillment-public-service-prod.ol.epicgames.com/fulfillment/api/public',
)
  .defaultHeaders({
    'Content-Type': 'application/json',
  })
  .build()

export function accountRedeemCode(
  {
    accountId,
    code,
  }: {
    accountId: string
    code: string
  },
  config?: RequestParamConfig,
) {
  return fulfillmentService.post<RedeemCodeAccountResponse>(
    `/accounts/${accountId}/codes/${code}`,
    {},
    config,
  )
}

export type RedeemCodeAccountResponse = {
  offerId: string
  accountId: string
  identityId: string
  details: Array<{
    entitlementId: string
    entitlementName: string
    itemId: string
    namespace: string
    country: string
  }>
}
