import { expect, test } from 'vitest'

import { service } from '../src'

test('[demo] service = service', () => {
  expect(service()).toBe('service')
})
