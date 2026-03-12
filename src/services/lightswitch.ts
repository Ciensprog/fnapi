import type { StringUnion } from '../types/common'

import { FetchManager, type RequestParamConfig } from '../managers/http'

export const lightswitchService = FetchManager.create(
  'https://lightswitch-public-service-prod.ol.epicgames.com/lightswitch/api/service',
)
  .defaultHeaders({
    'Content-Type': 'application/json',
  })
  .build()

export function getLightswitchStatus(
  serviceId: string,
  config?: RequestParamConfig,
) {
  return lightswitchService.get<LightswitchStatus>(
    `/${serviceId}/status`,
    config,
  )
}

export function getLightswitchStatusBulk(
  serviceIds: Array<string>,
  config?: RequestParamConfig,
) {
  const searchParams = new URLSearchParams()

  serviceIds.forEach((serviceId) => {
    searchParams.append('serviceId', serviceId)
  })

  return lightswitchService.get<Array<LightswitchStatus>>(
    `/bulk/status?${searchParams.toString()}`,
    config,
  )
}

export type LightswitchStatus = {
  serviceInstanceId: StringUnion<'fortnite'>
  status: StringUnion<'DOWN' | 'UP'>
  message: string
  maintenanceUri: string | null
  overrideCatalogIds: Array<string>
  allowedActions: Array<unknown>
  banned: boolean
  launcherInfoDTO: {
    appName: StringUnion<'Fortnite'>
    catalogItemId: string
    namespace: StringUnion<'fn'>
  } | null
}
