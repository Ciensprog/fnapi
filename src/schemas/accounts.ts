import z from 'zod'

export const deviceAuthSchema = z.object({
  accountId: z.string().min(1),
  deviceId: z.string().min(1),
  secret: z.string().min(1),
})

export const deviceAuthInfoSchema = z.object({
  accountId: z.string().min(1),
  deviceId: z.string().min(1),
  userAgent: z.string().min(1),
  created: z
    .object({
      location: z.string(),
      ipAddress: z.string(),
      dateTime: z.string(),
    })
    .optional(),
  lastAccess: z
    .object({
      location: z.string(),
      ipAddress: z.string(),
      dateTime: z.string(),
    })
    .optional(),
})

export const deviceAuthListSchema = z.array(deviceAuthInfoSchema)

export const accountBasicInfoSchema = z.intersection(
  z.object({
    customDisplayName: z.string().nullable().optional(),
    displayName: z.string().min(1),
  }),
  deviceAuthSchema,
)

export const accountTokenInfoSchema = z.object({
  value: z.string().nullable(),
  expiresAt: z.string().nullable(),
  refreshToken: z.string().nullable(),
  refreshExpiresAt: z.string().nullable(),
})

export const accountSchema = z.intersection(
  accountBasicInfoSchema,
  z.object({
    token: accountTokenInfoSchema,
  }),
)

export const accountList = z
  .array(accountBasicInfoSchema)
  .transform((value) =>
    Object.values(value).reduce((accumulator, current) => {
      const validation = accountBasicInfoSchema.safeParse(current)

      if (validation.success) {
        accumulator.push(current)
      }

      return accumulator
    }, [] as Array<AccountBasicInfo>),
  )

export const accountTypeRecord = z.object({
  available: accountList,
  disabled: accountList,
})

export const accountRecord = z.record(z.string(), accountSchema)

export type DeviceAuth = z.infer<typeof deviceAuthSchema>
export type DeviceAuthInfo = z.infer<typeof deviceAuthInfoSchema>

export type AccountBasicInfo = z.infer<typeof accountBasicInfoSchema>
export type AccountTokenInfo = z.infer<typeof accountTokenInfoSchema>
export type Account = z.infer<typeof accountSchema>

export type AccountsWithTokenList = Array<Account>
export type AccountsFileList = z.infer<typeof accountList>
export type AccountsFileRecord = z.infer<typeof accountTypeRecord>
export type AccountsRecord = z.infer<typeof accountRecord>

export type AccountCreatedResult = {
  account: AccountBasicInfo | null
  error: string | null
}
