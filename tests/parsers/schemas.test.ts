import { expect, test } from 'vitest'

import { worldInfoSchema } from '../../src/parsers/stw/schemas/world-info'

import wiv1 from '../_data/world-info-v1.json'
import wiv2 from '../_data/world-info-v2.json'
import wiv3 from '../_data/world-info-v3.json'
import wiv4 from '../_data/world-info-v4.json'
import wiv5 from '../_data/world-info-v5.json'
import wiv6 from '../_data/world-info-v6.json'

test('Schema for: World Info data v1', () => {
  const result = worldInfoSchema.safeParse(wiv1)

  expect(result.success).toBe(true)
})

test('Schema for: World Info data v2', () => {
  const result = worldInfoSchema.safeParse(wiv2)

  expect(result.success).toBe(true)
})

test('Schema for: World Info data v3', () => {
  const result = worldInfoSchema.safeParse(wiv3)

  expect(result.success).toBe(true)
})

test('Schema for: World Info data v4', () => {
  const result = worldInfoSchema.safeParse(wiv4)

  expect(result.success).toBe(true)
})

test('Schema for: World Info data v5', () => {
  const result = worldInfoSchema.safeParse(wiv5)

  expect(result.success).toBe(true)
})

test('Schema for: World Info data v6', () => {
  const result = worldInfoSchema.safeParse(wiv6)

  expect(result.success).toBe(true)
})
