import { create } from 'zustand'
import type { CartItem, CartTotals, Product } from '@/shared/types'

interface CartState {
  items: CartItem[]
  discountAmount: number
  taxRate: number

  addItem: (product: Product) => void
  updateQty: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  setDiscount: (amount: number) => void
  setTaxRate: (rate: number) => void
  clearCart: () => void
  getTotals: () => CartTotals
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  discountAmount: 0,
  taxRate: 0,

  addItem(product) {
    set((state) => {
      const existing = state.items.find((i) => i.product.uuid === product.uuid)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.uuid === product.uuid
              ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.unitPrice }
              : i,
          ),
        }
      }
      const newItem: CartItem = {
        product,
        variant: null,
        quantity: 1,
        unitPrice: product.price,
        discountAmount: 0,
        subtotal: product.price,
      }
      return { items: [...state.items, newItem] }
    })
  },

  updateQty(productId, quantity) {
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.product.uuid === productId ? { ...i, quantity, subtotal: quantity * i.unitPrice } : i,
      ),
    }))
  },

  removeItem(productId) {
    set((state) => ({ items: state.items.filter((i) => i.product.uuid !== productId) }))
  },

  setDiscount(amount) {
    set({ discountAmount: Math.max(0, amount) })
  },

  setTaxRate(rate) {
    set({ taxRate: Math.min(100, Math.max(0, rate)) })
  },

  clearCart() {
    set({ items: [], discountAmount: 0 })
  },

  getTotals() {
    const { items, discountAmount, taxRate } = get()
    const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0)
    const taxAmount = Math.round((subtotal - discountAmount) * taxRate)
    const total = Math.max(0, subtotal - discountAmount + taxAmount)
    return { subtotal, discountAmount, taxAmount, total }
  },
}))
