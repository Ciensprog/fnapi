import type { ConfigType } from 'dayjs'

import duration from 'dayjs/plugin/duration'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import dayjsRelativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'

dayjs.extend(duration)
dayjs.extend(localizedFormat)
dayjs.extend(dayjsRelativeTime)
dayjs.extend(timezone)
dayjs.extend(utc)

dayjs.tz.setDefault('UTC')

export function parseDate(config?: ConfigType) {
  try {
    return dayjs.tz(config, 'UTC')

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return dayjs.tz('1970-01-01T00:00:00.000Z', 'UTC')
  }
}

export function getDate(config?: ConfigType) {
  return parseDate(config).format('YYYY-MM-DD')
}

export function getDateWithDefaultFormat(config?: ConfigType) {
  return parseDate(config).format()
}

export function getRawDate(config?: ConfigType) {
  return parseDate(config)
}

export function getRawDateWithTZ(config?: ConfigType) {
  return dayjs.tz(config, dayjs.tz.guess())
}

export function toDate(config?: ConfigType) {
  return parseDate(config).toDate()
}

export function getDateWithFormat(config: ConfigType, template: string) {
  return parseDate(config).format(template)
}

export function relativeTime(config?: ConfigType) {
  return parseDate(config).fromNow()
}

export function getExtendedDateFormat(config?: ConfigType) {
  return getDateWithFormat(config, 'dddd, MMMM D, YYYY h:mm:ss A')
}

export function getShortDateFormat(config?: ConfigType) {
  return getDateWithFormat(config, 'ddd, MMM D, YYYY h:mm:ss A')
}

export function getNow() {
  return getRawDateWithTZ().toDate().toISOString()
}

export function secondsToTime(value: number) {
  return dayjs.duration(value, 'seconds').format('HH:mm:ss')
}
