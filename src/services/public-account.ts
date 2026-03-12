import type { StringUnion } from '../types/common'

import { FetchManager, type RequestParamConfig } from '../managers/http'
import type z from 'zod'
import type { availableExternalAuths } from 'src/schemas/lookup'

export const publicAccountService = FetchManager.create(
  'https://account-public-service-prod.ol.epicgames.com/account/api/public/account',
).build()

export function findUserByAccountId(
  {
    accountId,
  }: {
    accountId: string
  },
  config?: RequestParamConfig,
) {
  return publicAccountService.get<LookupFindAccountResponse>(
    `/${accountId}`,
    config,
  )
}

export function findUserByDisplayName(
  {
    displayName,
  }: {
    displayName: string
  },
  config?: RequestParamConfig,
) {
  return publicAccountService.get<LookupFindAccountResponse>(
    `/displayName/${displayName}`,
    config,
  )
}

export function findUserByExternalDisplayName(
  {
    displayName,
    externalAuthType,
  }: {
    displayName: string
    externalAuthType: StringUnion<'psn' | 'xbl'>
  },
  config?: RequestParamConfig,
) {
  return publicAccountService.get<Array<LookupFindAccountResponse>>(
    `/lookup/externalAuth/${externalAuthType}/displayName/${displayName}?caseInsensitive=true`,
    config,
  )
}

export function lookupUserByAccountId(
  {
    accountId,
  }: {
    accountId: string
  },
  config?: RequestParamConfig,
) {
  return publicAccountService.get<Array<LookupFindAccountResponse>>('/', {
    ...config,
    params: {
      accountId,
    },
  })
}

export function createDeviceAuthCredentials(
  {
    accountId,
  }: {
    accountId: string
  },
  config?: RequestParamConfig,
) {
  return publicAccountService.post<DeviceAuthResponse>(
    `/${accountId}/deviceAuth`,
    {},
    config,
  )
}

export function getDevicesAuth(
  {
    accountId,
  }: {
    accountId: string
  },
  config?: RequestParamConfig,
) {
  return publicAccountService.get<DeviceAuthListResponse>(
    `/${accountId}/deviceAuth`,
    config,
  )
}

export function removeDeviceAuth(
  {
    accountId,
    deviceId,
  }: {
    accountId: string
    deviceId: string
  },
  config?: RequestParamConfig,
) {
  return publicAccountService.delete(
    `/${accountId}/deviceAuth/${deviceId}`,
    config,
  )
}

export type LookupFindAccountResponse = {
  id: string
  displayName?: string
  externalAuths?: Partial<
    Record<
      z.infer<typeof availableExternalAuths>,
      {
        accountId: string
        type: string
        externalAuthId?: string
        externalAuthIdType: string
        externalAuthSecondaryId?: string
        externalDisplayName?: string
        authIds: Array<{
          id: string
          type: string
        }>
      }
    >
  >
}

export type DeviceAuthResponse = {
  deviceId: string
  accountId: string
  secret: string
  userAgent: string
  created: Record<string, string>
}

export type DeviceAuthInfo = {
  deviceId: string
  accountId: string
  userAgent: string
  created: {
    location: string
    ipAddress: string
    dateTime: string
  }
  lastAccess?: {
    location: string
    ipAddress: string
    dateTime: string
  }
}

export type DeviceAuthListResponse = Array<DeviceAuthInfo>
