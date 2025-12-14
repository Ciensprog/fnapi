type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type FetchConfig = {
  url: string
  method?: HttpMethod
  headers?: Record<string, string>
  params?: Record<string, number | string>
  data?: unknown
  signal?: AbortSignal
  next?: {
    revalidate?: number | false
    tags?: Array<string>
  }
}

export type RequestParamConfig = Omit<
  FetchConfig,
  'method' | 'data' | 'url'
>

type Interceptor<Value> = (value: Value) => Value | Promise<Value>

type ApiError = {
  errorCode: string
  errorMessage: string
  messageVars: Array<number | string>
  numericErrorCode: number
  originatingService: string
  intent: string
}

export enum FNApiErrorCode {
  AccountNotFound = 'account_not_found',
  InvalidAccountCredentials = 'invalid_account_credentials',
  InvalidToken = 'invalid_token',
  OperationForbidden = 'operation_forbidden',
  RateLimit = 'rate_limit',
}

export class FetchManager {
  private baseURL: string
  private defaultHeaders: Record<string, string>
  private requestInterceptors: Array<Interceptor<FetchConfig>> = []
  private responseInterceptors: Array<Interceptor<Response>> = []

  constructor(
    baseURL: string,
    defaultHeaders: Record<string, string> = {}
  ) {
    this.baseURL = baseURL
    this.defaultHeaders = defaultHeaders
  }

  static create(baseURL: string) {
    return new FetchManagerBuilder(baseURL)
  }

  requestInterceptor(interceptor: Interceptor<FetchConfig>) {
    this.requestInterceptors.push(interceptor)

    return this
  }

  responseInterceptor(interceptor: Interceptor<Response>) {
    this.responseInterceptors.push(interceptor)

    return this
  }

  private async request<Data>(config: FetchConfig): Promise<Data> {
    let currentConfig: FetchConfig = {
      ...config,
      url: `${this.baseURL}${config.url}`,
      headers: { ...this.defaultHeaders, ...config.headers },
    }

    for (const interceptor of this.requestInterceptors) {
      currentConfig = await interceptor(currentConfig)
    }

    let body: RequestInit['body'] | undefined

    if (currentConfig.data) {
      if (
        currentConfig.headers?.['Content-Type'] ===
        'application/x-www-form-urlencoded'
      ) {
        const urlEncoded = new URLSearchParams()

        Object.entries(currentConfig.data).forEach(([key, value]) => {
          urlEncoded.append(key, value)
        })

        body = urlEncoded
      } else if (
        currentConfig.headers?.['Content-Type'] === 'application/json'
      ) {
        body = JSON.stringify(currentConfig.data)
      } else {
        body = currentConfig.data as RequestInit['body']
      }
    }

    const urlWithParams = this.buildUrlWithParams(
      currentConfig.url,
      currentConfig.params
    )
    const newConfig: RequestInit = {
      method: currentConfig.method,
      headers: currentConfig.headers,
      signal: currentConfig.signal,
      body,
    }

    let response = await fetch(urlWithParams, newConfig)

    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response)
    }

    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`)
    // }

    const result: any = await response.json()

    if (result.errorCode) {
      if (result.errorCode.includes(FNApiErrorCode.AccountNotFound)) {
        throw new FNApiErrorAccountNotFound(
          result,
          result.errorMessage ?? 'Generic API Error'
        )
      }

      if (
        result.errorCode.includes(FNApiErrorCode.InvalidAccountCredentials)
      ) {
        throw new FNApiErrorInvalidCredentials(
          result,
          result.errorMessage ?? 'Generic API Error'
        )
      }

      if (result.errorCode.includes(FNApiErrorCode.InvalidToken)) {
        throw new FNApiErrorInvalidToken(
          result,
          result.errorMessage ?? 'Generic API Error'
        )
      }

      if (result.errorCode.includes(FNApiErrorCode.OperationForbidden)) {
        throw new FNApiErrorOperationForbidden(
          result,
          result.errorMessage ?? 'Generic API Error'
        )
      }

      if (result.errorCode.includes(FNApiErrorCode.RateLimit)) {
        throw new FNApiErrorRateLimit(
          result,
          result.errorMessage ?? 'Generic API Error'
        )
      }

      throw new FNApiError(
        result,
        result.errorMessage ?? 'Generic API Error'
      )
    }

    return result
  }

  get<Data>(url: string, config?: RequestParamConfig) {
    return this.request<Data>({ ...config, url, method: 'GET' })
  }

  post<Data>(url: string, data?: unknown, config?: RequestParamConfig) {
    return this.request<Data>({ ...config, url, method: 'POST', data })
  }

  put<Data>(url: string, data?: unknown, config?: RequestParamConfig) {
    return this.request<Data>({ ...config, url, method: 'PUT', data })
  }

  delete<Data>(url: string, config?: RequestParamConfig) {
    return this.request<Data>({ ...config, url, method: 'DELETE' })
  }

  private buildUrlWithParams(
    url: string,
    params?: Record<string, number | string>
  ): string {
    if (!params) return url

    const searchParams = new URLSearchParams()

    for (const [key, value] of Object.entries(params)) {
      searchParams.append(key, `${value}`)
    }

    return `${url}?${searchParams.toString()}`
  }

  static async serverFetch<Data>(
    url: string,
    config?: Omit<FetchConfig, 'url'>
  ): Promise<Data> {
    const response: any = await fetch(url, {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    })

    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`)
    // }

    return response.json()
  }
}

class FetchManagerBuilder {
  private baseURL: string
  private headers: Record<string, string> = {}

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  defaultHeaders(headers: Record<string, string>): FetchManagerBuilder {
    this.headers = headers

    return this
  }

  build(): FetchManager {
    return new FetchManager(this.baseURL, this.headers)
  }
}

/**
 * @see https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Error
 */
export class FNApiError extends Error {
  code: string
  date: Date
  result: ApiError

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(result: ApiError, ...params: Array<any>) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FNApiError)
    }

    this.name = 'FNApiError'
    this.result = result
    this.code = result.errorCode.toLowerCase() ?? '-1'
    this.date = new Date()
  }
}

/**
 * @see https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Error
 */
export class FNApiErrorAccountNotFound extends Error {
  code: string
  date: Date
  result: ApiError

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(result: ApiError, ...params: Array<any>) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FNApiErrorAccountNotFound)
    }

    this.name = 'FNApiErrorAccountNotFound'
    this.result = result
    this.code = result.errorCode.toLowerCase() ?? '-1'
    this.date = new Date()
  }
}

/**
 * @see https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Error
 */
export class FNApiErrorInvalidCredentials extends Error {
  code: string
  date: Date
  result: ApiError

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(result: ApiError, ...params: Array<any>) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FNApiErrorInvalidCredentials)
    }

    this.name = 'FNApiErrorInvalidCredentials'
    this.result = result
    this.code = result.errorCode.toLowerCase() ?? '-1'
    this.date = new Date()
  }
}

/**
 * @see https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Error
 */
export class FNApiErrorInvalidToken extends Error {
  code: string
  date: Date
  result: ApiError

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(result: ApiError, ...params: Array<any>) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FNApiErrorInvalidToken)
    }

    this.name = 'FNApiErrorInvalidToken'
    this.result = result
    this.code = result.errorCode.toLowerCase() ?? '-1'
    this.date = new Date()
  }
}

/**
 * @see https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Error
 */
export class FNApiErrorOperationForbidden extends Error {
  code: string
  date: Date
  result: ApiError

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(result: ApiError, ...params: Array<any>) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FNApiErrorOperationForbidden)
    }

    this.name = 'FNApiErrorOperationForbidden'
    this.result = result
    this.code = result.errorCode.toLowerCase() ?? '-1'
    this.date = new Date()
  }
}

/**
 * @see https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Error
 */
export class FNApiErrorRateLimit extends Error {
  code: string
  date: Date
  result: ApiError

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(result: ApiError, ...params: Array<any>) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FNApiErrorRateLimit)
    }

    this.name = 'FNApiErrorRateLimit'
    this.result = result
    this.code = result.errorCode.toLowerCase() ?? '-1'
    this.date = new Date()
  }
}
