import type { RequestParamConfig } from '../managers/http'

import { defaultFortniteClient } from './config/clients'
import { FetchManager } from '../managers/http'

export const oauthService = FetchManager.create(
  'https://account-public-service-prod.ol.epicgames.com/account/api/oauth',
)
  .defaultHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `basic ${defaultFortniteClient.use.auth}`,
  })
  .build()

export function createAccessTokenUsingAuthorizationCode(
  {
    code,
  }: {
    code: string
  },
  config?: RequestParamConfig,
) {
  return oauthService.post<CreateAccessTokenWithAuthorizationCodeResponse>(
    '/token',
    {
      grant_type: 'authorization_code',
      code,
    },
    config,
  )
}

export function createAccessTokenUsingClientCredentials({
  authorization,
}: {
  authorization: string
}) {
  return oauthService.post<CreateAccessTokenWithClientCredentialsResponse>(
    '/token',
    {
      grant_type: 'client_credentials',
    },
    {
      headers: {
        Authorization: `basic ${authorization}`,
      },
    },
  )
}

export function createAccessTokenUsingDeviceAuth(
  {
    accountId,
    deviceId,
    secret,
    tokenType,
  }: DeviceAuthConfig & {
    tokenType?: string
  },
  config?: RequestParamConfig,
) {
  return oauthService.post<AuthorizationCodeResponse>(
    '/token',
    {
      secret,
      grant_type: 'device_auth',
      account_id: accountId,
      device_id: deviceId,
      token_type: tokenType,
    },
    config,
  )
}

export function createAccessTokenUsingExchangeCode(
  {
    exchangeCode: exchange_code,
    tokenType: token_type,
  }: {
    exchangeCode: string
    tokenType?: string
  },
  config?: RequestParamConfig,
) {
  return oauthService.post<AuthorizationCommonResponse>(
    '/token',
    {
      grant_type: 'exchange_code',
      exchange_code,
      token_type,
    },
    config,
  )
}

export function createExchangeCode(config?: RequestParamConfig) {
  return oauthService.get<CreateExchangeCodeResponse>('/exchange', config)
}

export function refreshAccessToken(
  {
    grant_type = 'refresh_token',
    refresh_token,
  }: {
    grant_type?: string
    refresh_token: string
  },
  config?: RequestParamConfig,
) {
  return oauthService.post<RefreshTokenResponse>(
    '/token',
    {
      grant_type,
      refresh_token,
    },
    config,
  )
}

export function verifyToken(config?: RequestParamConfig) {
  return oauthService.get<
    Omit<VerifyAccessTokenResponse, 'access_token'> & {
      token: string
    }
  >('/verify', config)
}

/**
 * @param type ALL_ACCOUNT_CLIENT Account: account:token:allSessionsForAccountClient DELETE. Kills every Auth Session for this Client for the logged in Account (including the current Session).
 * @param type ALL Account: account:token:otherSessionsForAccountClientService DELETE. Kills all other Auth Sessions for the same Client for Service for the logged in Account (used in Fortnite).
 * @param type OTHERS_ACCOUNT_CLIENT_SERVICE Account: account:token:otherSessionsForAccountClientService DELETE. Kills all other Auth Sessions for the same Client for Service for the logged in Account (used in Fortnite).
 * @param type OTHERS_ACCOUNT_CLIENT Account: account:token:otherSessionsForAccountClient DELETE. Kills all other Auth Sessions for the same Client for the logged in Account.
 * @param type OTHERS_SAME_SOURCE_ID Account: account:token:otherSessionsWithSameSourceId DELETE. Kills all session from the same source???
 * @param type OTHERS Client: account:token:otherSessionsForClient DELETE
Account: account:token:otherSessionsForAccount DELETE. Kills all Other Auth Sessions
 * @param config RequestParamConfig
 *
 * @url https://github.com/LeleDerGrasshalmi/FortniteEndpointsDocumentation/blob/main/EpicGames/AccountService/Authentication/Kill/Sessions.md
 */
export function killAllSessions(
  type:
    | 'ALL_ACCOUNT_CLIENT'
    | 'ALL'
    | 'OTHERS_ACCOUNT_CLIENT_SERVICE'
    | 'OTHERS_ACCOUNT_CLIENT'
    | 'OTHERS_SAME_SOURCE_ID'
    | 'OTHERS',
  config?: RequestParamConfig,
) {
  return oauthService.delete(`/sessions/kill?killType=${type}`, config)
}

export function killSession(token: string, config?: RequestParamConfig) {
  return oauthService.delete(`/sessions/kill/${token}`, config)
}

export type DeviceAuthConfig = {
  accountId: string
  deviceId: string
  secret: string
}

export type AuthorizationCommonResponse<ExtraProps = unknown> =
  ExtraProps & {
    access_token: string
    expires_in: number
    expires_at: string
    token_type: string
    refresh_token: string
    refresh_expires: number
    refresh_expires_at: string
    account_id: string
    client_id: string
    internal_client: boolean
    client_service: string
    displayName: string
    app: string
    in_app_id: string
    device_id: string
    product_id: string
    application_id: string
    acr: string
    auth_time: string
  }

export type CreateAccessTokenWithAuthorizationCodeResponse =
  AuthorizationCommonResponse<{
    scope: Array<string>
  }>

export type CreateAccessTokenWithClientCredentialsResponse = {
  access_token: string
  expires_in: number
  expires_at: string
  token_type: string
  client_id: string
  internal_client: boolean
  client_service: string
  product_id: string
  application_id: string
}

export type AuthorizationCodeResponse = AuthorizationCommonResponse<{
  scope: Array<string>
}>

export type CreateExchangeCodeResponse = {
  expiresInSeconds: number
  code: string
  creatingClientId: string
}

export type RefreshTokenResponse = AuthorizationCommonResponse

export type VerifyAccessTokenResponse = Omit<
  AuthorizationCommonResponse,
  'displayName'
> & {
  display_name: string
}
