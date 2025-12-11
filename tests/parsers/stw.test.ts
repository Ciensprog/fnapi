import { expect, test } from 'vitest'

import { parser } from '../../src/parsers/stw'

test('[demo] parser = parser', () => {
  expect(parser()).toBe('parser')
})
