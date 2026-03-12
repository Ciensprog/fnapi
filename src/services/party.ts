import type { StringUnion } from '../types/common'

import { FetchManager, type RequestParamConfig } from '../managers/http'

export const partyService = FetchManager.create(
  'https://party-service-prod.ol.epicgames.com/party/api/v1/Fortnite',
)
  .defaultHeaders({
    'Content-Type': 'application/json',
  })
  .build()

export function fetchParty(
  {
    accountId,
  }: {
    accountId: string
  },
  config?: RequestParamConfig,
) {
  return partyService.get<FetchPartyResponse>(`/user/${accountId}`, config)
}

export function kick(
  {
    accountId,
    partyId,
  }: {
    accountId: string
    partyId: string
  },
  config?: RequestParamConfig,
) {
  return partyService.delete<PartyKickResponse>(
    `/parties/${partyId}/members/${accountId}`,
    config,
  )
}

export function invite(
  {
    friendAccountId,
    partyId,
  }: {
    friendAccountId: string
    partyId: string
  },
  config?: RequestParamConfig,
) {
  return partyService.post<PartyInviteResponse>(
    `/parties/${partyId}/invites/${friendAccountId}?sendPing=true`,
    {
      'urn:epic:invite:platformdata_s': '',
    },
    config,
  )
}

export function removeInvite(
  {
    friendAccountId,
    partyId,
  }: {
    friendAccountId: string
    partyId: string
  },
  config?: RequestParamConfig,
) {
  return partyService.delete<PartyInviteResponse>(
    `/parties/${partyId}/invites/${friendAccountId}`,
    config,
  )
}

export type PartyData = {
  id: string
  created_at: string
  updated_at: string
  config: {
    type: 'DEFAULT'
    joinability: 'INVITE_AND_FORMER' | 'OPEN'
    discoverability: 'ALL' | 'INVITED_ONLY'
    sub_type: 'default'
    max_size: number
    invite_ttl: number
    join_confirmation: boolean
    intention_ttl: number
  }
  members: Array<{
    account_id: string
    meta: Record<string, unknown>
    connections: Array<unknown>
    revision: number
    updated_at: string
    joined_at: string
    role: StringUnion<'CAPTAIN' | 'MEMBER'>
  }>
  applicants: Array<unknown>
  meta: Record<string, string>
  invites: Array<unknown>
  revision: number
  intentions: Array<unknown>
}

export type FetchPartyResponse = {
  current: Array<PartyData>
  invites: Array<unknown>
  pending: Array<unknown>
  pings: Array<unknown>
}

export type PartyKickResponse = Record<string, unknown>

export type PartyInviteResponse = Record<string, unknown>
