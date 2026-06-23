import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn()', () => {
  it('returns a single class unchanged', () => {
    expect(cn('px-4')).toBe('px-4')
  })

  it('merges multiple classes', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('resolves Tailwind conflicts — last wins', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6')
  })

  it('ignores falsy values', () => {
    expect(cn('px-4', false, null, undefined, '')).toBe('px-4')
  })

  it('supports conditional classes', () => {
    const isActive = true
    const isDisabled = false
    expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe('base active')
  })

  it('handles object syntax', () => {
    expect(cn({ 'bg-primary': true, 'bg-gray-100': false })).toBe('bg-primary')
  })
})

import { formatCompactNumber } from './formatters'

describe('formatCompactNumber()', () => {
  it('formats millions with jt suffix', () => {
    expect(formatCompactNumber(1_500_000)).toBe('1.5jt')
  })

  it('formats thousands with rb suffix', () => {
    expect(formatCompactNumber(50_000)).toBe('50rb')
  })

  it('returns plain number for values under 1000', () => {
    expect(formatCompactNumber(500)).toBe('500')
  })

  it('rounds thousands correctly', () => {
    expect(formatCompactNumber(1_450)).toBe('1rb')
  })
})
