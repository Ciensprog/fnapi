import type { StringUnion } from '../types/common'

import { FetchManager, type RequestParamConfig } from '../managers/http'

export const mcpService = FetchManager.create(
  'https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/game/v2',
)
  .defaultHeaders({
    'Content-Type': 'application/json',
  })
  .build()

export function mcp(
  {
    accountId,
    context = 'client',
    data = {},
    endpoint = 'QueryProfile',
    profileId = 'campaign',
    rvn = -1,
  }: MCPConfig,
  config?: RequestParamConfig,
) {
  return mcpService.post<any>(
    `/profile/${accountId}/${context}/${endpoint}`,
    data,
    {
      ...config,
      params: {
        profileId,
        rvn,
      },
    },
  )
}

export type MCPConfig = {
  accountId: string
  context: StringUnion<'client' | 'public'>
  data?: any
  profileId: ProfileId
  endpoint: StringUnion<'QueryProfile' | 'QueryPublicProfile'>
  rvn?: number
}

export type ProfileId = StringUnion<
  | 'athena'
  | 'campaign'
  | 'collection_book_people0'
  | 'collection_book_schematics0'
  | 'collections'
  | 'common_core'
  | 'common_public'
  | 'creative'
  | 'metadata'
  | 'outpost0'
  | 'recycle_bin'
  | 'theater0'
  | 'theater1'
  | 'theater2'
>
