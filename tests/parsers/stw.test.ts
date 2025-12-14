import { describe, expect, test } from 'vitest'

import { availableWorlds, WorldInfoParser } from '../../src/parsers/stw'
import { worldInfoParsedSchema } from '../../src/parsers/stw/schemas/parsed-world-info'

import wiv1 from '../_data/world-info-v1.json'
import wiv2 from '../_data/world-info-v2.json'
import wiv3 from '../_data/world-info-v3.json'
import wiv4 from '../_data/world-info-v4.json'
import wiv5 from '../_data/world-info-v5.json'
import wiv6 from '../_data/world-info-v6.json'

describe('Parsing world info v1', () => {
  test('Update data on fly', () => {
    const worldInfo = new WorldInfoParser()

    expect(worldInfo.raw).toBeNull()

    worldInfo.updateData({ data: wiv1 })
    expect(worldInfo.raw).not.toBeNull()

    worldInfo.updateData()
    expect(worldInfo.raw).toBeNull()

    worldInfo.updateData({ data: wiv1 })
    expect(worldInfo.raw).not.toBeNull()
  })

  test('Check available theaters', () => {
    const worldInfo = new WorldInfoParser({
      data: wiv1,
    })
    const validation = Object.keys(worldInfo.parsed)

    expect(
      validation.every((theaterId) => availableWorlds.includes(theaterId))
    ).toBe(true)
  })

  test('Successfully parsed world info', () => {
    const worldInfo = new WorldInfoParser({
      data: wiv1,
    })
    const result = worldInfoParsedSchema.safeParse(worldInfo.parsed)

    expect(result.success).toBe(true)
  })
})

describe('Parsing world info v2', () => {
  test('Update data on fly', () => {
    const worldInfo = new WorldInfoParser()

    expect(worldInfo.raw).toBeNull()

    worldInfo.updateData({ data: wiv2 })
    expect(worldInfo.raw).not.toBeNull()

    worldInfo.updateData()
    expect(worldInfo.raw).toBeNull()

    worldInfo.updateData({ data: wiv2 })
    expect(worldInfo.raw).not.toBeNull()
  })

  test('Check available theaters', () => {
    const worldInfo = new WorldInfoParser({
      data: wiv2,
    })
    const validation = Object.keys(worldInfo.parsed)

    expect(
      validation.every((theaterId) => availableWorlds.includes(theaterId))
    ).toBe(true)
  })

  test('Successfully parsed world info', () => {
    const worldInfo = new WorldInfoParser({
      data: wiv2,
    })
    const result = worldInfoParsedSchema.safeParse(worldInfo.parsed)

    expect(result.success).toBe(true)
  })
})

describe('Parsing world info v3', () => {
  test('Update data on fly', () => {
    const worldInfo = new WorldInfoParser()

    expect(worldInfo.raw).toBeNull()

    worldInfo.updateData({ data: wiv3 })
    expect(worldInfo.raw).not.toBeNull()

    worldInfo.updateData()
    expect(worldInfo.raw).toBeNull()

    worldInfo.updateData({ data: wiv3 })
    expect(worldInfo.raw).not.toBeNull()
  })

  test('Check available theaters', () => {
    const worldInfo = new WorldInfoParser({
      data: wiv3,
    })
    const validation = Object.keys(worldInfo.parsed)

    expect(
      validation.every((theaterId) => availableWorlds.includes(theaterId))
    ).toBe(true)
  })

  test('Successfully parsed world info', () => {
    const worldInfo = new WorldInfoParser({
      data: wiv3,
    })
    const result = worldInfoParsedSchema.safeParse(worldInfo.parsed)

    expect(result.success).toBe(true)
  })
})

describe('Parsing world info v4', () => {
  test('Update data on fly', () => {
    const worldInfo = new WorldInfoParser()

    expect(worldInfo.raw).toBeNull()

    worldInfo.updateData({ data: wiv4 })
    expect(worldInfo.raw).not.toBeNull()

    worldInfo.updateData()
    expect(worldInfo.raw).toBeNull()

    worldInfo.updateData({ data: wiv4 })
    expect(worldInfo.raw).not.toBeNull()
  })

  test('Check available theaters', () => {
    const worldInfo = new WorldInfoParser({
      data: wiv4,
    })
    const validation = Object.keys(worldInfo.parsed)

    expect(
      validation.every((theaterId) => availableWorlds.includes(theaterId))
    ).toBe(true)
  })

  test('Successfully parsed world info', () => {
    const worldInfo = new WorldInfoParser({
      data: wiv4,
    })
    const result = worldInfoParsedSchema.safeParse(worldInfo.parsed)

    expect(result.success).toBe(true)
  })
})

describe('Parsing world info v5', () => {
  test('Update data on fly', () => {
    const worldInfo = new WorldInfoParser()

    expect(worldInfo.raw).toBeNull()

    worldInfo.updateData({ data: wiv5 })
    expect(worldInfo.raw).not.toBeNull()

    worldInfo.updateData()
    expect(worldInfo.raw).toBeNull()

    worldInfo.updateData({ data: wiv5 })
    expect(worldInfo.raw).not.toBeNull()
  })

  test('Check available theaters', () => {
    const worldInfo = new WorldInfoParser({
      data: wiv5,
    })
    const validation = Object.keys(worldInfo.parsed)

    expect(
      validation.every((theaterId) => availableWorlds.includes(theaterId))
    ).toBe(true)
  })

  test('Successfully parsed world info', () => {
    const worldInfo = new WorldInfoParser({
      data: wiv5,
    })
    const result = worldInfoParsedSchema.safeParse(worldInfo.parsed)

    expect(result.success).toBe(true)
  })
})

describe('Parsing world info v6', () => {
  test('Update data on fly', () => {
    const worldInfo = new WorldInfoParser()

    expect(worldInfo.raw).toBeNull()

    worldInfo.updateData({ data: wiv6 })
    expect(worldInfo.raw).not.toBeNull()

    worldInfo.updateData()
    expect(worldInfo.raw).toBeNull()

    worldInfo.updateData({ data: wiv6 })
    expect(worldInfo.raw).not.toBeNull()
  })

  test('Check available theaters', () => {
    const worldInfo = new WorldInfoParser({
      data: wiv6,
    })
    const validation = Object.keys(worldInfo.parsed)

    expect(
      validation.every((theaterId) => availableWorlds.includes(theaterId))
    ).toBe(true)
  })

  test('Successfully parsed world info', () => {
    const worldInfo = new WorldInfoParser({
      data: wiv6,
    })
    const result = worldInfoParsedSchema.safeParse(worldInfo.parsed)

    expect(result.success).toBe(true)
  })
})
