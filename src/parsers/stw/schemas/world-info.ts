import { z } from 'zod'

export type WorldInfo = z.infer<typeof worldInfoSchema>
export type WorldInfoMission = z.infer<typeof worldInfoMission>
export type WorldInfoMissionAlert = z.infer<typeof worldInfoMissionAlert>
export type WorldInfoTheater = z.infer<typeof worldInfoTheater>

export const localesSchema = z.union([
  z.literal('en'),
  z.literal('de'),
  z.literal('ru'),
  z.literal('ko'),
  z.literal('pt-br'),
  z.literal('it'),
  z.literal('fr'),
  z.literal('es'),
  z.literal('zh'),
  z.literal('ar'),
  z.literal('ja'),
  z.literal('pl'),
  z.literal('es-419'),
  z.literal('tr'),
])

export const localesRecordSchema = z
  .partialRecord(localesSchema, z.string().nullable())
  .or(z.string())

export const worldInfoColorSchema = z.object({
  specifiedColor: z.object({
    r: z.number(),
    g: z.number(),
    b: z.number(),
    a: z.number(),
  }),
  colorUseRule: z.string(),
})

export const worldInfoImageSizeSchema = z.object({
  x: z.number(),
  y: z.number(),
})

export const worldInfoRegionThemeIconSchema = z.string()

export const worldInfoBrushSchema = z.object({
  bIsDynamicallyLoaded: z.boolean(),
  drawAs: z.string(),
  tiling: z.string(),
  mirroring: z.string(),
  imageType: z.string(),
  imageSize: worldInfoImageSizeSchema,
  margin: z.object({
    left: z.number(),
    top: z.number(),
    right: z.number(),
    bottom: z.number(),
  }),
  tintColor: worldInfoColorSchema,
  outlineSettings: z.object({
    cornerRadii: z.object({
      x: z.number(),
      y: z.number(),
      z: z.number(),
      w: z.number(),
    }),
    color: worldInfoColorSchema,
    width: z.number(),
    roundingType: z.string(),
    bUseBrushTransparency: z.boolean(),
  }),
  resourceObject: z.string(),
  resourceName: worldInfoRegionThemeIconSchema,
  uVRegion: z.object({
    min: worldInfoImageSizeSchema,
    max: worldInfoImageSizeSchema,
    bIsValid: z.boolean(),
  }),
})

export const worldInfoTagSchema = z.object({
  tagName: z.string(),
})

export const worldInfoTagsSchema = z.object({
  gameplayTags: z.array(worldInfoTagSchema),
})

export const worldInfoMissionWeightSchema = z.object({
  weight: z.number(),
  missionGenerator: z.string(),
})

export const worldInfoObjectiveStatHandleSchema = z.object({
  dataTable: z.string(),
  rowName: z.string(),
})

export const worldInfoRequirementsSchema = z
  .object({
    commanderLevel: z.number(),
    personalPowerRating: z.number(),
    maxPersonalPowerRating: z.number(),
    partyPowerRating: z.number(),
    maxPartyPowerRating: z.number(),
    activeQuestDefinitions: z.array(z.string()),
    questDefinition: z.string(),
    objectiveStatHandle: worldInfoObjectiveStatHandleSchema,
    uncompletedQuestDefinition: worldInfoRegionThemeIconSchema,
    itemDefinition: worldInfoRegionThemeIconSchema,
    eventFlag: z.string(),
  })
  .or(z.any())

export const worldInfoLinkedQuestSchema = z.object({
  questDefinition: z.string(),
  objectiveStatHandle: worldInfoObjectiveStatHandleSchema,
})

export const worldInfoTileSchema = z.object({
  tileType: z.string(),
  zoneTheme: z.string(),
  customReqs: z.object({}).optional(),
  requirements: worldInfoRequirementsSchema,
  linkedQuests: z.array(worldInfoLinkedQuestSchema),
  xCoordinate: z.number(),
  yCoordinate: z.number(),
  missionWeightOverrides: z.array(worldInfoMissionWeightSchema),
  difficultyWeightOverrides: z.array(
    z.object({
      weight: z.number(),
      difficultyInfo: z.object({
        dataTable: z.string().optional(),
        rowName: z.string(),
      }),
    })
  ),
  canBeMissionAlert: z.boolean(),
  tileTags: worldInfoTagsSchema,
  bDisallowQuickplay: z.boolean(),
})

export const worldInfoRegionSchema = z.object({
  uniqueId: z.string(),
  displayName: localesRecordSchema,
  missionData: z.object({
    difficultyWeights: z.array(
      z.object({
        difficultyInfo: z.object({
          dataTable: z.string().optional(),
          rowName: z.string(),
        }),
        weight: z.number().optional(),
      })
    ),
    missionWeights: z
      .array(
        z.object({
          missionGenerator: z.string(),
          weight: z.number(),
        })
      )
      .optional(),
    missionChangeFrequency: z.number().optional(),
    numMissionsAvailable: z.number().optional(),
    numMissionsToChange: z.number().optional(),
  }),
  tileIndices: z.array(z.number()),
  regionTags: z.object({
    gameplayTags: z.array(
      z.object({
        tagName: z.string(),
      })
    ),
  }),
  regionThemeIcon: z.string(),
  customReqs: z.object({}).optional(),
  requirements: z
    .object({
      commanderLevel: z.number(),
      personalPowerRating: z.number(),
      maxPersonalPowerRating: z.number(),
      partyPowerRating: z.number(),
      maxPartyPowerRating: z.number(),
      activeQuestDefinitions: z.array(z.any()),
      questDefinition: z.string(),
      objectiveStatHandle: z.object({
        dataTable: z.string(),
        rowName: z.string(),
      }),
      uncompletedQuestDefinition: z.string(),
      itemDefinition: z.string(),
      eventFlag: z.string(),
    })
    .or(z.any()),
  missionAlertRequirements: z.array(
    z.object({
      categoryName: z.string(),
      customReqs: z.object({}).optional(),
      requirements: z
        .object({
          commanderLevel: z.number(),
          personalPowerRating: z.number(),
          maxPersonalPowerRating: z.number(),
          partyPowerRating: z.number(),
          maxPartyPowerRating: z.number(),
          activeQuestDefinitions: z.array(z.any()),
          questDefinition: z.string(),
          objectiveStatHandle: z.object({
            dataTable: z.string(),
            rowName: z.string(),
          }),
          uncompletedQuestDefinition: z.string(),
          itemDefinition: z.string(),
          eventFlag: z.string(),
        })
        .or(z.any()),
    })
  ),
})

export const worldInfoMission = z.object({
  bonusMissionRewards: z
    .object({
      tierGroupName: z.string(),
      items: z.array(
        z.object({
          itemType: z.string(),
          quantity: z.number(),
        })
      ),
    })
    .optional(),
  missionGuid: z.string(),
  missionRewards: z.object({
    tierGroupName: z.string(),
    items: z.array(
      z.object({
        itemType: z.string(),
        quantity: z.number(),
      })
    ),
  }),
  overrideMissionRewards: z.record(z.string(), z.unknown()),
  missionGenerator: z.string(),
  missionDifficultyInfo: z.object({
    dataTable: z.string(),
    rowName: z.string(),
  }),
  tileIndex: z.number(),
  availableUntil: z.string(),
})

export const worldInfoMissionAlert = z.object({
  name: z.string(),
  categoryName: z.string(),
  spreadDataName: z.string(),
  missionAlertGuid: z.string(),
  tileIndex: z.number(),
  availableUntil: z.string(),
  totalSpreadRefreshes: z.number(),
  missionAlertRewards: z.object({
    tierGroupName: z.string(),
    items: z.array(
      z.object({
        attributes: z
          .object({
            Alteration: z
              .object({
                LootTierGroup: z.string().optional(),
                Tier: z.number().optional(),
              })
              .partial()
              .optional(),
          })
          .partial()
          .optional(),
        itemType: z.string(),
        quantity: z.number(),
      })
    ),
  }),
  missionAlertModifiers: z
    .object({
      tierGroupName: z.string(),
      items: z.array(
        z.object({
          itemType: z.string(),
          quantity: z.number(),
        })
      ),
    })
    .optional(),
})

export const worldInfoTheater = z.object({
  missionRewardNamedWeightsRowName: z.string(),
  uniqueId: z.string(),
  displayName: localesRecordSchema,
  description: localesRecordSchema,
  theaterSlot: z.number(),
  theaterUIOrder: z.number(),
  bIsTestTheater: z.boolean(),
  bHideLikeTestTheater: z.boolean(),
  requiredEventFlag: z.string(),
  runtimeInfo: z.object({
    theaterType: z.string(),
    theaterTags: z.object({
      gameplayTags: z.array(
        z.object({
          tagName: z.string(),
        })
      ),
    }),
    eventDependentTheaterTags: z.array(
      z.object({
        requiredEventFlag: z.string(),
        relatedTag: z.object({
          tagName: z.string(),
        }),
      })
    ),
    theaterVisibilityRequirements: z.object({
      commanderLevel: z.number(),
      personalPowerRating: z.number(),
      maxPersonalPowerRating: z.number(),
      partyPowerRating: z.number(),
      maxPartyPowerRating: z.number(),
      activeQuestDefinitions: z.array(z.any()),
      questDefinition: z.string(),
      objectiveStatHandle: z.object({
        dataTable: z.string(),
        rowName: z.string(),
      }),
      uncompletedQuestDefinition: z.string(),
      itemDefinition: z.string(),
      eventFlag: z.string(),
    }),
    customReqs: z.object({}).optional(),
    requirements: z
      .object({
        commanderLevel: z.number(),
        personalPowerRating: z.number(),
        maxPersonalPowerRating: z.number(),
        partyPowerRating: z.number(),
        maxPartyPowerRating: z.number(),
        activeQuestDefinitions: z.array(z.any()),
        questDefinition: z.string(),
        objectiveStatHandle: z.object({
          dataTable: z.string(),
          rowName: z.string(),
        }),
        uncompletedQuestDefinition: z.string(),
        itemDefinition: z.string(),
        eventFlag: z.string(),
      })
      .or(z.any()),
    requiredSubGameForVisibility: z.string(),
    bOnlyMatchLinkedQuestsToTiles: z.boolean(),
    worldMapPinClass: z.string(),
    theaterImage: z.string(),
    theaterImages: z.object({
      brush_XXS: worldInfoBrushSchema,
      brush_XS: worldInfoBrushSchema,
      brush_S: worldInfoBrushSchema,
      brush_M: worldInfoBrushSchema,
      brush_L: worldInfoBrushSchema,
      brush_XL: worldInfoBrushSchema,
    }),
    theaterColorInfo: z.object({
      bUseDifficultyToDetermineColor: z.boolean(),
      color: z.object({
        specifiedColor: z.object({
          r: z.number(),
          g: z.number(),
          b: z.number(),
          a: z.number(),
        }),
        colorUseRule: z.string(),
      }),
    }),
    socket: z.string(),
    missionAlertRequirements: z.object({
      commanderLevel: z.number(),
      personalPowerRating: z.number(),
      maxPersonalPowerRating: z.number(),
      partyPowerRating: z.number(),
      maxPartyPowerRating: z.number(),
      activeQuestDefinitions: z.array(z.any()),
      questDefinition: z.string(),
      objectiveStatHandle: z.object({
        dataTable: z.string(),
        rowName: z.string(),
      }),
      uncompletedQuestDefinition: z.string(),
      itemDefinition: z.string(),
      eventFlag: z.string(),
    }),
    missionAlertCategoryRequirements: z.array(
      z.object({
        missionAlertCategoryName: z.string(),
        bRespectTileRequirements: z.boolean(),
        bAllowQuickplay: z.boolean(),
      })
    ),
    gameplayModifierList: z.array(z.any()),
  }),
  tiles: z.array(worldInfoTileSchema),
  regions: z.array(worldInfoRegionSchema),
})

export const worldInfoSchema = z.object({
  missions: z.array(
    z.object({
      availableMissions: z.array(worldInfoMission),
      nextRefresh: z.string(),
      theaterId: z.string(),
    })
  ),
  missionAlerts: z.array(
    z.object({
      availableMissionAlerts: z.array(worldInfoMissionAlert),
      nextRefresh: z.string(),
      theaterId: z.string(),
    })
  ),
  theaters: z.array(worldInfoTheater),
})
