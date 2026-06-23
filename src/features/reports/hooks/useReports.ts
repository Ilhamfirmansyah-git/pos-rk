import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db'
import { getDateRange } from '@/features/transactions/hooks/useTransactions'
import type { DatePreset } from '@/features/transactions/hooks/useTransactions'
import type { TransactionItem, Transaction, PaymentMethod } from '@/shared/types'

export type { DatePreset }

export interface DailyRevenue {
  date: string
  revenue: number
}

export interface TopProduct {
  productName: string
  revenue: number
  quantity: number
}

export interface PaymentStat {
  method: PaymentMethod
  count: number
  revenue: number
}

export interface ReportData {
  revenue: number
  transactionCount: number
  avgOrderValue: number
  totalDiscount: number
  dailyRevenue: DailyRevenue[]
  topProducts: TopProduct[]
  paymentStats: PaymentStat[]
}

const EMPTY: ReportData = {
  revenue: 0,
  transactionCount: 0,
  avgOrderValue: 0,
  totalDiscount: 0,
  dailyRevenue: [],
  topProducts: [],
  paymentStats: [],
}

export function useReportData(datePreset: DatePreset): ReportData {
  const { dateFrom, dateTo } = getDateRange(datePreset)

  return useLiveQuery(
    async () => {
      let txs = await db.transactions.toArray()

      if (dateFrom) {
        txs = txs.filter((t) => t.createdAt >= dateFrom)
      }
      if (dateTo) {
        const end = new Date(dateTo)
        end.setHours(23, 59, 59, 999)
        txs = txs.filter((t) => t.createdAt <= end)
      }

      const uuids = txs.map((t) => t.uuid)
      const items: TransactionItem[] =
        uuids.length > 0
          ? await db.transactionItems.where('transactionId').anyOf(uuids).toArray()
          : []

      return buildReportData(txs, items)
    },
    [datePreset],
    EMPTY,
  )
}

export function buildReportData(transactions: Transaction[], items: TransactionItem[]): ReportData {
  const revenue = transactions.reduce((sum, t) => sum + t.total, 0)
  const transactionCount = transactions.length
  const avgOrderValue = transactionCount > 0 ? Math.round(revenue / transactionCount) : 0
  const totalDiscount = transactions.reduce((sum, t) => sum + t.discountAmount, 0)

  const dailyMap = new Map<string, number>()
  for (const tx of transactions) {
    const key = tx.createdAt.toISOString().slice(0, 10)
    dailyMap.set(key, (dailyMap.get(key) ?? 0) + tx.total)
  }
  const dailyRevenue = Array.from(dailyMap.entries())
    .map(([date, rev]) => ({ date, revenue: rev }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const productMap = new Map<string, { revenue: number; quantity: number }>()
  for (const item of items) {
    const prev = productMap.get(item.productName) ?? { revenue: 0, quantity: 0 }
    productMap.set(item.productName, {
      revenue: prev.revenue + item.subtotal,
      quantity: prev.quantity + item.quantity,
    })
  }
  const topProducts = Array.from(productMap.entries())
    .map(([productName, s]) => ({ productName, ...s }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 7)

  const paymentMap = new Map<PaymentMethod, { count: number; revenue: number }>()
  for (const tx of transactions) {
    const prev = paymentMap.get(tx.paymentMethod) ?? { count: 0, revenue: 0 }
    paymentMap.set(tx.paymentMethod, {
      count: prev.count + 1,
      revenue: prev.revenue + tx.total,
    })
  }
  const paymentStats = Array.from(paymentMap.entries())
    .map(([method, s]) => ({ method, ...s }))
    .sort((a, b) => b.revenue - a.revenue)

  return {
    revenue,
    transactionCount,
    avgOrderValue,
    totalDiscount,
    dailyRevenue,
    topProducts,
    paymentStats,
  }
}
