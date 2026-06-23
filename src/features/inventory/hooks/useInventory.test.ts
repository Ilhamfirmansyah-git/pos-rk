import { describe, it, expect } from 'vitest'
import { computeStockChange } from './useInventory'

describe('computeStockChange', () => {
  describe('restock mode', () => {
    it('adds quantity to current stock', () => {
      const { newStock, quantityChange } = computeStockChange('restock', 10, 5)
      expect(newStock).toBe(15)
      expect(quantityChange).toBe(5)
    })

    it('handles adding to zero stock', () => {
      const { newStock, quantityChange } = computeStockChange('restock', 0, 20)
      expect(newStock).toBe(20)
      expect(quantityChange).toBe(20)
    })

    it('clamps to zero when adding negative quantity', () => {
      const { newStock } = computeStockChange('restock', 5, -10)
      expect(newStock).toBe(0)
    })
  })

  describe('set mode', () => {
    it('sets stock to exact quantity regardless of current stock', () => {
      const { newStock } = computeStockChange('set', 10, 3)
      expect(newStock).toBe(3)
    })

    it('computes quantityChange as difference', () => {
      const { quantityChange } = computeStockChange('set', 10, 3)
      expect(quantityChange).toBe(-7)
    })

    it('quantityChange is positive when setting higher than current', () => {
      const { quantityChange } = computeStockChange('set', 5, 20)
      expect(quantityChange).toBe(15)
    })

    it('clamps new stock to zero when quantity is 0', () => {
      const { newStock, quantityChange } = computeStockChange('set', 10, 0)
      expect(newStock).toBe(0)
      expect(quantityChange).toBe(-10)
    })
  })
})
