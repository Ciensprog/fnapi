import {
  type MissionParsed,
  type WorldInfoParsed,
} from './schemas/parsed-world-info'
import {
  type WorldInfo,
  type WorldInfoMissionAlert,
  worldInfoSchema,
} from './schemas/world-info'
import {
  availableWorlds,
  Worlds,
  zoneCategories,
} from '../../config/contants'

export * from '../../config/contants'

export type WorldInfoParserConfig = {
  data?: WorldInfo | null
}

export class WorldInfoParser {
  private _data: WorldInfo | null = null
  private _parsed: WorldInfoParsed = {}

  constructor(config?: WorldInfoParserConfig) {
    this.updateData(config?.data)
  }

  /**
   * Original data
   */
  get raw() {
    return this._data
  }

  /**
   * Parsed data
   */
  get parsed() {
    return this._parsed
  }

  /**
   * Override world info data
   */
  updateData(value?: WorldInfoParserConfig['data']) {
    if (!value) {
      this._data = null

      return
    }

    const result = worldInfoSchema.safeParse(value)

    if (result.success) {
      this._data = result.data
    }
  }

  /**
   * Parse original data
   */
  parse(value?: WorldInfoParserConfig['data']): WorldInfoParsed {
    const worldInfo = worldInfoSchema.safeParse(value).data ?? this._data
    const parsed: WorldInfoParsed = {}

    if (!worldInfo) {
      return parsed
    }

    Object.values(worldInfo.theaters).forEach((theater) => {
      if (availableWorlds.includes(theater.uniqueId)) {
        parsed[theater.uniqueId] = {}
      }
    })

    const alertsGroupByTheaterId = worldInfo.missionAlerts.reduce(
      (accumulator, { availableMissionAlerts, theaterId }) => {
        if (!availableWorlds.includes(theaterId)) {
          return accumulator
        }

        if (!accumulator[theaterId]) {
          accumulator[theaterId] = {}
        }

        availableMissionAlerts.forEach((alert) => {
          accumulator[theaterId][alert.tileIndex] = alert
        })

        return accumulator
      },
      {} as Record<string, Record<string, WorldInfoMissionAlert>>
    )

    worldInfo.missions.forEach((missions) => {
      if (!parsed[missions.theaterId]) {
        return
      }

      const theaterId = missions.theaterId

      missions.availableMissions.forEach((mission) => {
        const missionGuid = mission.missionGuid
        const tileIndex = mission.tileIndex

        const alert =
          alertsGroupByTheaterId[missions.theaterId]?.[
            tileIndex.toString()
          ] ?? null
        let alertParsed: MissionParsed['alert'] = null

        const zoneInfo = this.parseZone({
          missionGenerator: mission.missionGenerator,
          theaterId,
        })
        const modifiers: MissionParsed['mission']['modifiers'] =
          this.parseModifiers(alert?.missionAlertModifiers)
        const filters: MissionParsed['filters'] = []

        if (alert) {
          const alertRewards = Object.entries(
            alert.missionAlertRewards.items.reduce(
              (accumulator, current) => {
                if (accumulator[current.itemType] === undefined) {
                  accumulator[current.itemType] = 0
                }

                accumulator[current.itemType] += current.quantity

                return accumulator
              },
              {} as Record<string, number>
            )
          ).map(([itemType, quantity]) => ({
            itemType,
            quantity,
          }))

          alertParsed = {
            id: alert.missionAlertGuid,
            rewards: alertRewards.map((reward) =>
              this.parseResource(reward)
            ),
          }

          alert.missionAlertRewards.items.forEach((reward) => {
            filters.push(reward.itemType)
          })
        }

        const missionRewards = Object.entries(
          mission.missionRewards.items.reduce((accumulator, current) => {
            if (accumulator[current.itemType] === undefined) {
              accumulator[current.itemType] = 0
            }

            accumulator[current.itemType] += current.quantity

            return accumulator
          }, {} as Record<string, number>)
        ).map(([itemType, quantity]) => ({
          itemType,
          quantity,
        }))

        mission.missionRewards.items.forEach((reward) => {
          filters.push(reward.itemType)
        })

        parsed[theaterId][missionGuid] = {
          filters,

          theaterId: theaterId,

          alert: alertParsed,

          mission: {
            modifiers,
            id: missionGuid,
            tileIndex: tileIndex,
            powerLevel: 0,
            rewards: missionRewards.map((reward) =>
              this.parseResource(reward)
            ),
            zone: zoneInfo,
          },

          raw: {
            alert,
            mission,
          },
        }
      })
    })

    if (value) {
      return parsed
    }

    this._parsed = parsed

    return this._parsed
  }

  isEvoMat(value: string) {
    return (
      value.includes('reagent_c_t01') ||
      value.includes('reagent_c_t02') ||
      value.includes('reagent_c_t03') ||
      value.includes('reagent_c_t04')
    )
  }

  parseModifiers(value: WorldInfoMissionAlert['missionAlertModifiers']) {
    const modifiers: MissionParsed['mission']['modifiers'] = []

    value?.items.forEach((item) => {
      modifiers.push({
        id: `${item.itemType}`.replace('GameplayModifier:', ''),
        templateId: item.itemType,
      })
    })

    return modifiers
  }

  parseResource({
    itemType,
    quantity,
  }: {
    itemType: string
    quantity: number
  }) {
    const newKey = itemType
      .replace(/_((very)?low|medium|(very)?high|extreme)$/gi, '')
      .replace('AccountResource:', '')
      .replace('CardPack:zcp_', '')
    const data: NonNullable<MissionParsed['alert']>['rewards'][number] = {
      itemType,
      quantity,
      id: newKey?.replace(/_t\d{2}/, '') ?? null,
      isBad: null,
      rarity: null,
      tier: null,
      type: null,
    }

    if (this.isEvoMat(itemType)) {
      data.isBad = !(
        itemType.endsWith('_veryhigh') || itemType.endsWith('_extreme')
      )
    }

    const rarity = itemType.match(/(\w+)_(c|uc|r|vr|sr|ur)(?:_t\d{2})?\b/)

    if (rarity) {
      data.id = rarity?.[1]?.replace(/_t\d{2}/, '') ?? null
      data.rarity = rarity?.[2] ?? null
    }

    const tier = itemType.match(/.*_t\d+(\d)$/)

    if (!!tier?.[1]) {
      data.tier = Number(tier[1])
    }

    const type = itemType.match(/^([^:]+):/)

    if (!!type) {
      data.type = type[1]
    }

    return data
  }

  parseZone({
    missionGenerator,
    theaterId,
  }: {
    missionGenerator: string
    theaterId: string
  }) {
    const generator = `${missionGenerator}`.trim()
    const current = Object.entries(zoneCategories).find(([, patterns]) =>
      patterns.some((pattern) => generator.includes(pattern))
    )
    const data: MissionParsed['mission']['zone'] = {
      theme: {
        generator,
        matches: [],
        isGroup: false,
        type: {
          id: 'unknown',
        },
      },
    }

    if (!current) {
      return data
    }

    const [key, matches] = current
    const newKey =
      {
        [Worlds.Stonewood as string]: key === 'ets' ? 'rescue' : key,
      }[theaterId] ?? key
    const isGroup =
      theaterId === Worlds.Stonewood && newKey === 'rescue'
        ? false
        : generator.toLowerCase().includes('group')

    data.theme.isGroup = isGroup
    data.theme.matches = matches
    data.theme.type.id = newKey

    return data
  }
}
