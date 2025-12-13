import {
  type MissionParsed,
  type WorldInfoParsed,
} from './schemas/parsed-world-info'
import {
  type WorldInfo,
  type WorldInfoMissionAlert,
  worldInfoSchema,
  type WorldInfoTheater,
} from './schemas/world-info'
import {
  availableBiomes,
  availableWorlds,
  EndgameZones,
  StormKingZones,
  worldPowerLevels,
  Worlds,
  zoneCategories,
} from '../../config/contants'

export {
  Biomes,
  EndgameZones,
  StormKingZones,
  WorldModifiers,
  Worlds,
  availableBiomes,
  availableWorlds,
  worldPowerLevels,
  zoneCategories,
} from '../../config/contants'

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

    const tiles: Record<string, WorldInfoTheater['tiles']> = {}

    Object.values(worldInfo.theaters).forEach((theater) => {
      if (availableWorlds.includes(theater.uniqueId)) {
        parsed[theater.uniqueId] = {}
        tiles[theater.uniqueId] = theater.tiles
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

        const zoneTheme = this.parseZone({
          missionGenerator: mission.missionGenerator,
          theaterId,
        })
        const modifiers: MissionParsed['mission']['modifiers'] =
          this.parseModifiers(alert?.missionAlertModifiers)
        const filters: MissionParsed['filters'] = []

        const currentZoneType = mission.missionDifficultyInfo.rowName
          .replace('Theater_', '')
          .replace('_Group', '')
        let zoneType = currentZoneType

        if (currentZoneType === StormKingZones.CannyValley) {
          zoneType = 'Hard_Zone5'
        } else if (currentZoneType === StormKingZones.TwinePeaks) {
          zoneType = 'Endgame_Zone5'
        }

        const powerLevel =
          (worldPowerLevels as any)[theaterId]?.[zoneType] ??
          (worldPowerLevels.ventures as any)?.[zoneType] ??
          0

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

        const tile = tiles[theaterId]?.[mission.tileIndex] ?? null
        const biome: MissionParsed['mission']['zone']['biome'] = tile
          ? {
              id: 'unknown',
              tile,
            }
          : null

        if (biome) {
          const getBiomeId = availableBiomes.find((item) =>
            biome.tile.zoneTheme.includes(item)
          )

          if (getBiomeId) {
            biome.id = getBiomeId
          }
        }

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
            difficulty: {
              powerLevel,
            },
            tileIndex: tileIndex,
            rewards: missionRewards.map((reward) =>
              this.parseResource(reward, { zoneType })
            ),
            zone: {
              zoneType,
              biome,
              theme: zoneTheme,
            },
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

  parseResource(
    {
      itemType,
      quantity,
    }: {
      itemType: string
      quantity: number
    },
    params?: Partial<{
      zoneType: string
    }>
  ) {
    const data: NonNullable<MissionParsed['alert']>['rewards'][number] = {
      itemType,
      quantity,
      id: null,
      isBad: null,
      rarity: null,
      tier: null,
      type: null,
    }

    const tier = itemType.match(/.*_t\d+(\d)(_\w+)?$/)

    if (!!tier?.[1]) {
      data.tier = Number(tier[1])
    }

    if (this.isEvoMat(itemType)) {
      data.rarity = 'c'
      data.type = 'AccountResource'

      if (params?.zoneType === EndgameZones.TwinePeaks160) {
        data.isBad = !(
          itemType.endsWith('_veryhigh') || itemType.endsWith('_extreme')
        )
      }

      return data
    }

    const newKey = itemType
      .replace(/_((very)?low|medium|(very)?high|extreme)$/gi, '')
      .replace('AccountResource:', '')
      .replace('CardPack:zcp_', '')
      .replace(/_((very)?low|medium)$/, '')

    const rarity = itemType.match(/(\w+)_(c|uc|r|vr|sr|ur)(?:_t\d{2})?\b/)

    data.id = newKey?.replace(/_t\d{2}/, '') ?? null

    if (rarity) {
      data.id = rarity?.[1]?.replace(/_t\d{2}/, '') ?? null
      data.rarity = rarity?.[2] ?? null

      if (data.rarity && data.id.startsWith('manager')) {
        /**
         * Increase rarity: lead survivors
         */
        const rarities: Record<string, string> = {
          uc: 'r',
          r: 'vr',
          vr: 'sr',
        }

        data.rarity = rarities[data.rarity] ?? data.rarity
      }
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
    const data: MissionParsed['mission']['zone']['theme'] = {
      generator,
      id: 'unknown',
      matches: [],
      isGroup: false,
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

    data.id = newKey
    data.isGroup = isGroup
    data.matches = matches

    return data
  }
}
