import { describe, expect, test } from 'vitest'

import { availableWorlds, WorldInfoParser } from '../../src/parsers/stw'
import { worldInfoParsedSchema } from '../../src/parsers/stw/schemas/parsed-world-info'

import wiv1 from '../_data/world-info-v1.json'
import wiv2 from '../_data/world-info-v2.json'

describe('Parsing world info v1', () => {
  test('Update data on fly', () => {
    const worldInfo = new WorldInfoParser()

    expect(worldInfo.raw).toBeNull()

    worldInfo.updateData(wiv1)
    expect(worldInfo.raw).not.toBeNull()

    worldInfo.updateData()
    expect(worldInfo.raw).toBeNull()

    worldInfo.updateData(wiv1)
    expect(worldInfo.raw).not.toBeNull()
  })

  test('Check available theaters', () => {
    const worldInfo = new WorldInfoParser({
      data: wiv1,
    })
    const parsed = worldInfo.parse()
    const validation = Object.keys(parsed)

    expect(
      validation.every((theaterId) => availableWorlds.includes(theaterId))
    ).toBe(true)
  })

  test('Successfully parsed world info', () => {
    const worldInfo = new WorldInfoParser({
      data: wiv1,
    })
    const parsed = worldInfo.parse()
    const result = worldInfoParsedSchema.safeParse(parsed)

    expect(result.success).toBe(true)
  })
})

describe('Parsing world info v2', () => {
  test('Update data on fly', () => {
    const worldInfo = new WorldInfoParser()

    expect(worldInfo.raw).toBeNull()

    worldInfo.updateData(wiv2)
    expect(worldInfo.raw).not.toBeNull()

    worldInfo.updateData()
    expect(worldInfo.raw).toBeNull()

    worldInfo.updateData(wiv2)
    expect(worldInfo.raw).not.toBeNull()
  })

  test('Check available theaters', () => {
    const worldInfo = new WorldInfoParser({
      data: wiv2,
    })
    const parsed = worldInfo.parse()
    const validation = Object.keys(parsed)

    expect(
      validation.every((theaterId) => availableWorlds.includes(theaterId))
    ).toBe(true)
  })

  test('Successfully parsed world info', () => {
    const worldInfo = new WorldInfoParser({
      data: wiv2,
    })
    const parsed = worldInfo.parse()
    const result = worldInfoParsedSchema.safeParse(parsed)

    expect(result.success).toBe(true)
  })
})
