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
  { accountId, deviceId, secret }: DeviceAuthConfig,
  config?: RequestParamConfig,
) {
  return oauthService.post<AuthorizationCodeResponse>(
    '/token',
    {
      secret,
      grant_type: 'device_auth',
      account_id: accountId,
      device_id: deviceId,
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

export function createExchangeCode(config: RequestParamConfig) {
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
