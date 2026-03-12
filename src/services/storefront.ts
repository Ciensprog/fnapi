import type z from 'zod'

import type { storefrontCatalogSchema } from '../schemas/storefront'
import { FetchManager, type RequestParamConfig } from '../managers/http'

export const storefrontService = FetchManager.create(
  'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/storefront/v2',
)
  .defaultHeaders({
    'Content-Type': 'application/json',
  })
  .build()

export function getCatalog(config?: RequestParamConfig) {
  return storefrontService.get<StorefrontCatalogResponse>(
    '/catalog',
    config,
  )
}

export type StorefrontCatalogResponse = z.infer<
  typeof storefrontCatalogSchema
>
