import z from 'zod'

import { zoneCategories } from '../../../config/contants'
import { worldInfoMission, worldInfoMissionAlert } from './world-info'

export type MissionParsed = z.infer<typeof missionParsedSchema>
export type WorldInfoParsed = z.infer<typeof worldInfoParsedSchema>

export const missionParsedSchema = z.object({
  raw: z.object({
    alert: worldInfoMissionAlert.nullable(),
    mission: worldInfoMission,
  }),

  filters: z.array(z.string()),
  theaterId: z.string(),

  alert: z
    .object({
      id: z.string(),
      rewards: z.array(
        z.object({
          id: z.string().nullable(),
          isBad: z.boolean().nullable(),
          itemType: z.string(),
          quantity: z.number(),
          rarity: z.string().nullable(),
          tier: z.number().nullable(),
          type: z.string().nullable(),
        })
      ),
    })
    .nullable(),

  mission: z.object({
    id: z.string(),
    tileIndex: z.number(),
    modifiers: z.array(
      z.object({
        id: z.string(),
        templateId: z.string(),
      })
    ),
    powerLevel: z.number(),
    rewards: z.array(
      z.object({
        id: z.string().nullable(),
        isBad: z.boolean().nullable(),
        itemType: z.string(),
        quantity: z.number(),
        rarity: z.string().nullable(),
        tier: z.number().nullable(),
        type: z.string().nullable(),
      })
    ),
    zone: z.object({
      theme: z.object({
        generator: z.string(),
        isGroup: z.boolean(),
        matches: z.array(z.string()),
        type: z.object({
          id: z.enum(Object.keys(zoneCategories)),
        }),
      }),
    }),
  }),
})

export const worldInfoParsedSchema = z.record(
  z.string(),
  z.record(z.string(), missionParsedSchema)
)
