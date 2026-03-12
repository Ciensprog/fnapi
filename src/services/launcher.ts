import type { StringUnion } from '../types/common'

import { FetchManager, type RequestParamConfig } from '../managers/http'

export const launcherService = FetchManager.create(
  'https://launcher-public-service-prod.ol.epicgames.com/launcher/api',
)
  .defaultHeaders({
    'Content-Type': 'application/json',
  })
  .build()

export const launcherAvailablePlatforms = {
  Android: 'Android',
  IOS: 'IOS',
  PS4: 'PS4',
  PS5: 'PS5',
  Switch: 'Switch',
  Switch2: 'Switch2',
  XB1: 'XB1',
  XSX: 'XSX',
  Windows: 'Windows',
} as const

export function getLauncherAssetForCatalogItem(
  params: {
    appName: string
    catalogItemId: string
    platform: keyof typeof launcherAvailablePlatforms
    label?: 'Live' | 'Production'
  },
  config?: RequestParamConfig,
) {
  return launcherService.get<LauncherAssetForCatalogItem>(
    `/public/assets/${params.platform}/${params.catalogItemId}/${params.appName}${params.label ? `?label=${params.label}` : ''}`,
    config,
  )
}

export type LauncherAssetForCatalogItem = {
  appName: StringUnion<'Fortnite'>
  labelName: StringUnion<'Live-Windows'>
  buildVersion: string
  catalogItemId: string
  metadata: {
    installationPoolId: StringUnion<'FortniteInstallationPool'>
  }
  expires: string
  items: {
    MANIFEST: {
      signature: string
      distribution: string
      path: string
      hash: string
      additionalDistributions: Array<string>
    }
    CHUNKS: {
      signature: string
      distribution: string
      path: string
      additionalDistributions: Array<string>
    }
  }
  assetId: StringUnion<'Fortnite'>
}
