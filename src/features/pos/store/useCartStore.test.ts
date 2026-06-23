import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from './useCartStore'
import type { Product } from '@/shared/types'

const mockProduct = (overrides: Partial<Product> = {}): Product => ({
  uuid: 'prod-1',
  sku: 'TEST-001',
  name: 'Test Product',
  description: null,
  categoryId: 'cat-1',
  price: 10000,
  costPrice: 6000,
  stock: 50,
  lowStockThreshold: 5,
  imageUrl: null,
  barcode: null,
  isActive: true,
  hasVariants: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  syncedAt: null,
  ...overrides,
})

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], discountAmount: 0 })
  })

  it('adds a new item to cart', () => {
    useCartStore.getState().addItem(mockProduct())
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0]?.quantity).toBe(1)
  })

  it('increments quantity when same product added twice', () => {
    useCartStore.getState().addItem(mockProduct())
    useCartStore.getState().addItem(mockProduct())
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0]?.quantity).toBe(2)
  })

  it('updates quantity correctly', () => {
    useCartStore.getState().addItem(mockProduct())
    useCartStore.getState().updateQty('prod-1', 5)
    expect(useCartStore.getState().items[0]?.quantity).toBe(5)
    expect(useCartStore.getState().items[0]?.subtotal).toBe(50000)
  })

  it('removes item when quantity set to 0', () => {
    useCartStore.getState().addItem(mockProduct())
    useCartStore.getState().updateQty('prod-1', 0)
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('removes item by id', () => {
    useCartStore.getState().addItem(mockProduct())
    useCartStore.getState().removeItem('prod-1')
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('calculates totals correctly', () => {
    useCartStore.getState().addItem(mockProduct({ price: 20000 }))
    useCartStore.getState().updateQty('prod-1', 3)
    const totals = useCartStore.getState().getTotals()
    expect(totals.subtotal).toBe(60000)
    expect(totals.total).toBe(60000)
  })

  it('applies discount to total', () => {
    useCartStore.getState().addItem(mockProduct({ price: 50000 }))
    useCartStore.getState().setDiscount(10000)
    const totals = useCartStore.getState().getTotals()
    expect(totals.subtotal).toBe(50000)
    expect(totals.discountAmount).toBe(10000)
    expect(totals.total).toBe(40000)
  })

  it('clears cart completely', () => {
    useCartStore.getState().addItem(mockProduct())
    useCartStore.getState().setDiscount(5000)
    useCartStore.getState().clearCart()
    expect(useCartStore.getState().items).toHaveLength(0)
    expect(useCartStore.getState().discountAmount).toBe(0)
  })
})
