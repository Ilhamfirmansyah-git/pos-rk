import { describe, it, expect } from 'vitest'
import { generateSku } from './useProducts'

describe('generateSku', () => {
  it('uppercases the prefix', () => {
    const sku = generateSku('kopi susu')
    expect(sku).toMatch(/^[A-Z]/)
  })

  it('uses first 4 alphanumeric chars of name', () => {
    const sku = generateSku('Kopi')
    expect(sku.startsWith('KOPI-')).toBe(true)
  })

  it('falls back to PRD when name has no alphanumeric chars', () => {
    const sku = generateSku('!@#$')
    expect(sku.startsWith('PRD-')).toBe(true)
  })

  it('appends a 4-digit numeric suffix', () => {
    const sku = generateSku('Test')
    const parts = sku.split('-')
    const suffix = parts[parts.length - 1]
    expect(suffix).toMatch(/^\d{4}$/)
  })

  it('truncates names longer than 4 chars', () => {
    const sku = generateSku('Cappuccino')
    expect(sku.startsWith('CAPP-')).toBe(true)
  })

  it('strips non-alphanumeric chars from prefix', () => {
    const sku = generateSku('A-B.C1')
    expect(sku.startsWith('ABC1-')).toBe(true)
  })
})
