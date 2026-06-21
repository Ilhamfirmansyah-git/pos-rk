import { describe, it, expect } from 'vitest'
import { categorySchema, productSchema } from './types'

describe('categorySchema', () => {
  it('accepts valid category data', () => {
    const result = categorySchema.safeParse({ name: 'Minuman', sortOrder: 0 })
    expect(result.success).toBe(true)
  })

  it('rejects name shorter than 2 chars', () => {
    const result = categorySchema.safeParse({ name: 'A', sortOrder: 0 })
    expect(result.success).toBe(false)
  })

  it('treats empty description as undefined', () => {
    const result = categorySchema.safeParse({ name: 'Makanan', description: '', sortOrder: 0 })
    expect(result.success).toBe(true)
  })

  it('coerces string sortOrder to number', () => {
    const result = categorySchema.safeParse({ name: 'Makanan', sortOrder: '2' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.sortOrder).toBe(2)
  })
})

describe('productSchema', () => {
  const valid = {
    name: 'Kopi Susu',
    sku: 'KOPI-001',
    categoryId: 'cat-uuid',
    price: 15000,
    costPrice: 8000,
    stock: 100,
    lowStockThreshold: 5,
    isActive: true,
  }

  it('accepts valid product data', () => {
    expect(productSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects missing categoryId', () => {
    const result = productSchema.safeParse({ ...valid, categoryId: '' })
    expect(result.success).toBe(false)
  })

  it('rejects negative price', () => {
    const result = productSchema.safeParse({ ...valid, price: -1 })
    expect(result.success).toBe(false)
  })

  it('coerces string price to number', () => {
    const result = productSchema.safeParse({ ...valid, price: '15000' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.price).toBe(15000)
  })

  it('transforms empty imageUrl to null', () => {
    const result = productSchema.safeParse({ ...valid, imageUrl: '' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.imageUrl).toBeNull()
  })

  it('rejects invalid imageUrl', () => {
    const result = productSchema.safeParse({ ...valid, imageUrl: 'not-a-url' })
    expect(result.success).toBe(false)
  })
})
