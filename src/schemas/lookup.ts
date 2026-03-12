import z from 'zod'

export const availableExternalAuths = z.enum([
  'nintendo',
  'psn',
  'steam',
  'xbl',
])

export const lookupExternalAuths = [
  availableExternalAuths.enum.xbl,
  availableExternalAuths.enum.psn,
]

export const externalAuthsSchema = z.partialRecord(
  availableExternalAuths,
  z.string().nullable(),
)

export const accountInfoSchema = z.object({
  accountId: z.string().nullable(),
  displayName: z.string().nullable(),
  externalAuths: externalAuthsSchema,
})
