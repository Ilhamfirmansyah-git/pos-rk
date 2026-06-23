import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getDateRange } from './useTransactions'

describe('getDateRange', () => {
  const FIXED_NOW = new Date('2024-06-15T10:30:00') // Saturday

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(FIXED_NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns today range with same start and end date', () => {
    const { dateFrom, dateTo } = getDateRange('today')
    expect(dateFrom).toBeDefined()
    expect(dateTo).toBeDefined()
    expect(dateFrom!.getFullYear()).toBe(2024)
    expect(dateFrom!.getMonth()).toBe(5) // June (0-indexed)
    expect(dateFrom!.getDate()).toBe(15)
    expect(dateTo!.getDate()).toBe(15)
    expect(dateFrom!.getHours()).toBe(0)
    expect(dateFrom!.getMinutes()).toBe(0)
  })

  it('returns week range starting on Sunday', () => {
    const { dateFrom, dateTo } = getDateRange('week')
    expect(dateFrom).toBeDefined()
    // June 15 is Saturday (getDay()=6), so week starts June 9 (Sunday)
    expect(dateFrom!.getDate()).toBe(9)
    expect(dateFrom!.getDay()).toBe(0)
    expect(dateTo!.getDate()).toBe(15)
  })

  it('returns month range starting on the 1st', () => {
    const { dateFrom, dateTo } = getDateRange('month')
    expect(dateFrom).toBeDefined()
    expect(dateFrom!.getDate()).toBe(1)
    expect(dateFrom!.getMonth()).toBe(5)
    expect(dateTo!.getDate()).toBe(15)
  })

  it('returns no dates for "all"', () => {
    const { dateFrom, dateTo } = getDateRange('all')
    expect(dateFrom).toBeUndefined()
    expect(dateTo).toBeUndefined()
  })

  it('week start is always a Sunday (day 0)', () => {
    const { dateFrom } = getDateRange('week')
    expect(dateFrom!.getDay()).toBe(0)
  })
})
