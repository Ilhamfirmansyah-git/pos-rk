import { describe, it, expect } from 'vitest'
import { buildReportData } from './useReports'
import { PaymentMethod, TransactionStatus } from '@/shared/types'
import type { Transaction, TransactionItem } from '@/shared/types'

function makeTx(overrides: Partial<Transaction> = {}): Transaction {
  return {
    uuid: crypto.randomUUID(),
    receiptNumber: 'TRX-001',
    cashierId: 'c1',
    cashierName: 'Kasir',
    subtotal: 10000,
    discountAmount: 0,
    taxAmount: 0,
    total: 10000,
    paymentMethod: PaymentMethod.Cash,
    amountPaid: 10000,
    changeAmount: 0,
    status: TransactionStatus.Completed,
    notes: null,
    createdAt: new Date('2024-06-15T10:00:00'),
    updatedAt: new Date('2024-06-15T10:00:00'),
    syncedAt: null,
    ...overrides,
  }
}

function makeItem(overrides: Partial<TransactionItem> = {}): TransactionItem {
  return {
    uuid: crypto.randomUUID(),
    transactionId: 'tx1',
    productId: 'p1',
    productName: 'Kopi',
    productSku: 'KOP-001',
    variantId: null,
    variantName: null,
    quantity: 1,
    unitPrice: 10000,
    discountAmount: 0,
    subtotal: 10000,
    createdAt: new Date('2024-06-15T10:00:00'),
    syncedAt: null,
    ...overrides,
  }
}

describe('buildReportData', () => {
  it('returns zero values for empty input', () => {
    const result = buildReportData([], [])
    expect(result.revenue).toBe(0)
    expect(result.transactionCount).toBe(0)
    expect(result.avgOrderValue).toBe(0)
    expect(result.dailyRevenue).toHaveLength(0)
    expect(result.topProducts).toHaveLength(0)
    expect(result.paymentStats).toHaveLength(0)
  })

  it('sums revenue correctly', () => {
    const txs = [makeTx({ total: 30000 }), makeTx({ total: 20000 })]
    const { revenue, transactionCount, avgOrderValue } = buildReportData(txs, [])
    expect(revenue).toBe(50000)
    expect(transactionCount).toBe(2)
    expect(avgOrderValue).toBe(25000)
  })

  it('sums total discount', () => {
    const txs = [makeTx({ discountAmount: 5000 }), makeTx({ discountAmount: 3000 })]
    const { totalDiscount } = buildReportData(txs, [])
    expect(totalDiscount).toBe(8000)
  })

  it('groups daily revenue by ISO date', () => {
    const txs = [
      makeTx({ total: 10000, createdAt: new Date('2024-06-15T08:00:00') }),
      makeTx({ total: 5000, createdAt: new Date('2024-06-15T12:00:00') }),
      makeTx({ total: 20000, createdAt: new Date('2024-06-16T09:00:00') }),
    ]
    const { dailyRevenue } = buildReportData(txs, [])
    expect(dailyRevenue).toHaveLength(2)
    expect(dailyRevenue[0]).toEqual({ date: '2024-06-15', revenue: 15000 })
    expect(dailyRevenue[1]).toEqual({ date: '2024-06-16', revenue: 20000 })
  })

  it('ranks top products by revenue and limits to 7', () => {
    const items = [
      makeItem({ productName: 'Teh', subtotal: 5000, quantity: 1 }),
      makeItem({ productName: 'Kopi', subtotal: 15000, quantity: 3 }),
      makeItem({ productName: 'Kopi', subtotal: 5000, quantity: 1 }),
    ]
    const { topProducts } = buildReportData([], items)
    expect(topProducts[0]?.productName).toBe('Kopi')
    expect(topProducts[0]?.revenue).toBe(20000)
    expect(topProducts[0]?.quantity).toBe(4)
    expect(topProducts[1]?.productName).toBe('Teh')
  })

  it('groups payment stats by method', () => {
    const txs = [
      makeTx({ paymentMethod: PaymentMethod.Cash, total: 20000 }),
      makeTx({ paymentMethod: PaymentMethod.Cash, total: 10000 }),
      makeTx({ paymentMethod: PaymentMethod.Qris, total: 30000 }),
    ]
    const { paymentStats } = buildReportData(txs, [])
    expect(paymentStats).toHaveLength(2)
    const qris = paymentStats.find((p) => p.method === PaymentMethod.Qris)
    expect(qris?.count).toBe(1)
    expect(qris?.revenue).toBe(30000)
    const cash = paymentStats.find((p) => p.method === PaymentMethod.Cash)
    expect(cash?.count).toBe(2)
    expect(cash?.revenue).toBe(30000)
  })
})
