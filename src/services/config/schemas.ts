import z from 'zod'

export type ClientCredential = z.infer<typeof clientCredentialSchema>
export type DefaultClientCredential = z.infer<
  typeof defaultClientCredentialSchema
>

export const clientCredentialSchema = z.object({
  clientId: z.string().length(32),
  secret: z.string().length(32),
  auth: z.string().length(88),
})

export const defaultClientCredentialSchema = z.object({
  use: clientCredentialSchema,
})
