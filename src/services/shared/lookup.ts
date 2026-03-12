import type z from 'zod'

import {
  availableExternalAuths,
  lookupExternalAuths,
  type accountInfoSchema,
} from '../../schemas/lookup'

import { ApiService } from '../../managers/api-service'
import {
  findUserByAccountId,
  findUserByDisplayName,
  findUserByExternalDisplayName,
  lookupUserByAccountId,
} from '../public-account'

export async function findAccount(data: string) {
  const id = decodeURI(data.trim())
  const information: z.infer<typeof accountInfoSchema> = {
    accountId: null,
    displayName: null,
    externalAuths: {},
  }

  /**
   * Maybe is accountId
   */
  if (id.length > 26) {
    const { data: result } = await ApiService.run({
      overrideOnInvalidCredentials: true,
    })(findUserByAccountId, {
      accountId: id,
    })

    if (result?.id) {
      information.accountId = result.id
      information.displayName = result.displayName ?? null
    }
  }

  /**
   * By displayName
   */
  if (!information.accountId) {
    const { data: result, error } = await ApiService.run({
      overrideOnInvalidCredentials: true,
    })(findUserByDisplayName, {
      displayName: id,
    })

    if (result?.id) {
      information.accountId = result.id
      information.displayName = result.displayName ?? null
    }

    /**
     * By externalAuths
     */
    if (error?.isAccountNotFound) {
      for (const external of lookupExternalAuths) {
        const { data: result } = await ApiService.run({
          overrideOnInvalidCredentials: true,
        })(findUserByExternalDisplayName, {
          externalAuthType: external,
          displayName: id,
        })
        const current = result?.[0]

        if (current?.id) {
          information.accountId = current.id
          information.displayName = current.displayName ?? null
          information.externalAuths[external] =
            current.externalAuths?.[external]?.externalDisplayName ?? null
          break
        }
      }
    }
  }

  if (!information.accountId) {
    return null
  }

  /**
   * Get externalAuths
   */
  if (information.accountId) {
    const { data: result } = await ApiService.run({
      overrideOnInvalidCredentials: true,
    })(lookupUserByAccountId, {
      accountId: information.accountId,
    })
    const current = result?.[0]

    if (current?.id) {
      const keys = Object.keys(availableExternalAuths.enum) as Array<
        z.infer<typeof availableExternalAuths>
      >

      keys.forEach((external) => {
        information.externalAuths[external] =
          current.externalAuths?.[external]?.externalDisplayName ?? null
      })
    }
  }

  return information
}
