import { FetchManager, type RequestParamConfig } from '../managers/http'

export const friendsService = FetchManager.create(
  'https://friends-public-service-prod.ol.epicgames.com/friends/api/v1',
)
  .defaultHeaders({
    'Content-Type': 'application/json',
  })
  .build()

export function getFriend(
  {
    accountId,
    friendId,
  }: {
    accountId: string
    friendId: string
  },
  config?: RequestParamConfig,
) {
  return friendsService.get<FetchFriendResponse>(
    `/${accountId}/friends/${friendId}`,
    config,
  )
}

export function addFriend(
  {
    accountId,
    friendId,
  }: {
    accountId: string
    friendId: string
  },
  config?: RequestParamConfig,
) {
  return friendsService.post(
    `/${accountId}/friends/${friendId}`,
    {},
    config,
  )
}

export function removeFriend(
  {
    accountId,
    friendId,
  }: {
    accountId: string
    friendId: string
  },
  config?: RequestParamConfig,
) {
  return friendsService.delete(`/${accountId}/friends/${friendId}`, config)
}

export type FetchFriendResponse = {
  accountId: string
  groups: Array<unknown>
  alias: string
  note: string
  favorite: boolean
  created: string
}
