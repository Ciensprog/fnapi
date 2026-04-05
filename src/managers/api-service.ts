import type { WritableDraft } from 'immer'

import {
  createAccessTokenUsingDeviceAuth,
  defaultFortniteClient,
  refreshAccessToken,
} from '../services'

import { accountSchema, type Account } from '../schemas/accounts'
import { parseDate } from '../utils/parsers/dates'

import {
  FNApiError,
  FNApiErrorCode,
  FNApiErrorInvalidCredentials,
  FNApiErrorInvalidToken,
  FNApiErrorRateLimit,
  type RequestParamConfig,
} from './http'

export type ApiServiceConfig = Partial<{
  account: Account | string | null
  overrideOnInvalidCredentials: boolean
  removeInsteadOfDisable: boolean
}>

type GetRandomAccountFunction = () => Account | undefined
type FindAccountFunction = (accountId: string) => Account | undefined
type RemoveAccountFunction = (config: {
  accountId: string
  type: 'available' | 'disabled'
}) => unknown
type DisableAccountFunction = (accountId: string, notify?: true) => unknown
type UpdateAccountFunction = (
  accountId: string,
  callback: (draft: WritableDraft<Account>) => void,
) => Account

export class ApiService {
  private static getRandomAccount: GetRandomAccountFunction = () =>
    undefined
  private static findAccount: FindAccountFunction = () => undefined
  private static removeAccount: RemoveAccountFunction = () => {}
  private static disableAccount: DisableAccountFunction = () => {}
  private static updateAccount: UpdateAccountFunction = (accountId) =>
    this.findAccount(accountId)!

  static setRandomAccountCallback(callback: GetRandomAccountFunction) {
    this.getRandomAccount = callback
  }

  static setFindAccountCallback(callback: FindAccountFunction) {
    this.findAccount = callback
  }

  static setRemoveAccountCallback(callback: RemoveAccountFunction) {
    this.removeAccount = callback
  }

  static setDisableAccountCallback(callback: DisableAccountFunction) {
    this.disableAccount = callback
  }

  static setUpdateAccountCallback(callback: UpdateAccountFunction) {
    this.updateAccount = callback
  }

  static run(config?: ApiServiceConfig) {
    return async <Callback extends (...args: Array<any>) => any>(
      callback: Callback,
      ...args: Parameters<Callback>
    ): Promise<
      | {
          data: Awaited<ReturnType<Callback>>
          error: null
        }
      | {
          data: null
          error: ReturnType<typeof parseErrorCode>
        }
    > => {
      const {
        account: overrideAccount,
        overrideOnInvalidCredentials = false,
        removeInsteadOfDisable = false,
      } = config ?? {}

      const lastArg = args.length > 1 ? args.at(-1) : null
      const withConfig =
        lastArg &&
        typeof lastArg === 'object' &&
        !Array.isArray(lastArg) &&
        !(lastArg instanceof FormData)

      const currentParams = args.slice(
        0,
        lastArg === null ? 1 : args.length - 1,
      )
      const requestConfig: RequestParamConfig = withConfig
        ? structuredClone(lastArg)
        : { headers: {} }

      let account: Account | undefined = undefined

      if (typeof overrideAccount === 'string') {
        account = this.findAccount(overrideAccount)
      } else if (
        overrideAccount !== null &&
        overrideAccount !== undefined
      ) {
        account = overrideAccount
      } else {
        account = this.getRandomAccount()
      }

      const parseAccount = accountSchema.safeParse(overrideAccount)

      if (parseAccount.success) {
        account = parseAccount.data
      }

      const maxTries = 5
      let currentTries = 0

      if (!requestConfig.headers) {
        requestConfig.headers = {}
      }

      while (currentTries < maxTries) {
        if (
          !requestConfig.headers?.Authorization ||
          requestConfig.headers?.Authorization?.trim() === ''
        ) {
          if (!account) {
            return {
              data: null,
              error: parseErrorCode('empty-accounts'),
            }
          }

          const { data: token, error: errorToken } =
            await this.verifyAccessToken(account)

          if (!token) {
            if (errorToken === FNApiErrorCode.InvalidAccountCredentials) {
              if (removeInsteadOfDisable) {
                this.removeAccount({
                  accountId: account.accountId,
                  type: 'available',
                })
              } else {
                this.disableAccount(account.accountId, true)
              }

              if (overrideOnInvalidCredentials) {
                account = this.getRandomAccount()

                continue
              }
            }

            return {
              data: null,
              error: parseErrorCode(errorToken),
            }
          }

          this.updateAccount(account.accountId, (state) => {
            state.token = token
          })

          requestConfig.headers['Authorization'] = `bearer ${token.value}`
        }

        try {
          const result = await callback(
            ...[...currentParams, requestConfig],
          )

          return {
            data: result,
            error: null,
          }
        } catch (error: any) {
          if (error instanceof FNApiErrorRateLimit) {
            if (!account) {
              break
            }

            currentTries++

            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * 5 * currentTries),
            )
          }

          if (error instanceof FNApiErrorInvalidToken) {
            if (!account) {
              break
            }

            account = this.updateAccount(account.accountId, (state) => {
              state.token = {
                value: null,
                expiresAt: null,
                refreshToken: null,
                refreshExpiresAt: null,
              }
            })

            requestConfig.headers['Authorization'] = ''

            currentTries++

            continue
          }

          if (error instanceof FNApiError || error?.code !== undefined) {
            return {
              data: null,
              error: parseErrorCode(error.code, {
                continuationUrl: error.result?.continuationUrl,
                correctiveAction: error.result?.correctiveAction,
              }),
            }
          }

          break
        }
      }

      return {
        data: null,
        error: parseErrorCode(null),
      }
    }
  }

  static async verifyAccessToken(account: Account): Promise<
    | {
        data: Account['token']
        error: null
      }
    | {
        data: null
        error: FNApiErrorCode | string | null
      }
  > {
    const token: Account['token'] = {
      value: account.token.value,
      expiresAt: account.token.expiresAt,
      refreshToken: account.token.refreshToken,
      refreshExpiresAt: account.token.refreshExpiresAt,
    }

    if (token.value) {
      const nowDate = parseDate()
      const expiresAtDate = parseDate(token.expiresAt)
      const refreshExpiresAtDate = parseDate(token.refreshExpiresAt)

      const tokenHasExpired = nowDate.isAfter(expiresAtDate)

      if (tokenHasExpired) {
        const isRefreshTokenExpired = nowDate.isAfter(refreshExpiresAtDate)

        if (isRefreshTokenExpired) {
          return await this.createAccountAccessToken(account)
        }

        return await this.refreshAccountAccessToken(token.refreshToken)
      }

      return {
        data: token,
        error: null,
      }
    }

    const newToken = await this.createAccountAccessToken(account)

    return newToken
  }

  static async createAccountAccessToken(account: Account): Promise<
    | {
        data: Account['token']
        error: null
      }
    | {
        data: null
        error: FNApiErrorCode | string | null
      }
  > {
    try {
      const newToken = await createAccessTokenUsingDeviceAuth(account)

      return {
        data: {
          expiresAt: newToken.expires_at,
          refreshExpiresAt: newToken.refresh_expires_at,
          refreshToken: newToken.refresh_token,
          value: newToken.access_token,
        },
        error: null,
      }
    } catch (error) {
      if (error instanceof FNApiErrorInvalidCredentials) {
        return {
          data: null,
          error: FNApiErrorCode.InvalidAccountCredentials,
        }
      } else if (error instanceof FNApiError) {
        return {
          data: null,
          error: error.code,
        }
      }
    }

    return {
      data: null,
      error: null,
    }
  }

  static async refreshAccountAccessToken(
    refreshToken: string | null,
  ): Promise<
    | {
        data: Account['token']
        error: null
      }
    | {
        data: null
        error: FNApiErrorCode | string | null
      }
  > {
    if (!refreshToken) {
      return {
        data: null,
        error: null,
      }
    }

    try {
      const newToken = await refreshAccessToken(
        {
          refresh_token: refreshToken,
        },
        {
          headers: {
            Authorization: `basic ${defaultFortniteClient.use.auth}`,
          },
        },
      )

      return {
        data: {
          expiresAt: newToken.expires_at,
          refreshExpiresAt: newToken.refresh_expires_at,
          refreshToken: newToken.refresh_token,
          value: newToken.access_token,
        },
        error: null,
      }
    } catch (error) {
      if (error instanceof FNApiErrorInvalidCredentials) {
        return {
          data: null,
          error: FNApiErrorCode.InvalidAccountCredentials,
        }
      } else if (error instanceof FNApiError) {
        return {
          data: null,
          error: error.code,
        }
      }
    }

    return {
      data: null,
      error: null,
    }
  }
}

function parseErrorCode(
  code: null | string | FNApiErrorCode,
  params?: Partial<{
    continuationUrl: string | null
    correctiveAction: string | null
  }>,
) {
  const isAccountNotFound =
    code?.toLowerCase().includes(FNApiErrorCode.AccountNotFound) ?? false
  const isCorrectiveAction =
    code?.toLowerCase().includes(FNApiErrorCode.CorrectiveAction) ?? false
  const isInvalidCredentials =
    code
      ?.toLowerCase()
      .includes(FNApiErrorCode.InvalidAccountCredentials) ?? false
  const isInvalidToken =
    code?.toLowerCase().includes(FNApiErrorCode.InvalidToken) ?? false
  const isOperationForbidden =
    code?.toLowerCase().includes(FNApiErrorCode.OperationForbidden) ??
    false
  const isRateLimit =
    code?.toLowerCase().includes(FNApiErrorCode.RateLimit) ?? false

  const continuationUrl = isCorrectiveAction
    ? (params?.continuationUrl ?? null)
    : null
  const correctiveAction = isCorrectiveAction
    ? (params?.correctiveAction ?? null)
    : null

  return {
    code,
    continuationUrl,
    correctiveAction,
    isAccountNotFound,
    isCorrectiveAction,
    isInvalidCredentials,
    isInvalidToken,
    isOperationForbidden,
    isRateLimit,
  }
}
