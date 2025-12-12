import { expect, test } from 'vitest'

import { worldInfoSchema } from '../../src/parsers/stw/schemas/world-info'

import wiv1 from '../_data/world-info-v1.json'
import wiv2 from '../_data/world-info-v2.json'

test('Schema for: World Info data v1', () => {
  const result = worldInfoSchema.safeParse(wiv1)

  expect(result.success).toBe(true)
})

test('Schema for: World Info data v2', () => {
  const result = worldInfoSchema.safeParse(wiv2)

  expect(result.success).toBe(true)
})
