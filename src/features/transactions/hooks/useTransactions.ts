import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db'
import type { PaymentMethod } from '@/shared/types'

interface UseTransactionsParams {
  search?: string
  paymentMethod?: PaymentMethod | 'all'
  dateFrom?: Date
  dateTo?: Date
}

export function useTransactions({
  search = '',
  paymentMethod = 'all',
  dateFrom,
  dateTo,
}: UseTransactionsParams = {}) {
  return useLiveQuery(
    async () => {
      let results = await db.transactions.orderBy('createdAt').reverse().toArray()

      if (dateFrom) {
        results = results.filter((t) => t.createdAt >= dateFrom)
      }
      if (dateTo) {
        const end = new Date(dateTo)
        end.setHours(23, 59, 59, 999)
        results = results.filter((t) => t.createdAt <= end)
      }
      if (paymentMethod !== 'all') {
        results = results.filter((t) => t.paymentMethod === paymentMethod)
      }
      if (search) {
        const q = search.toLowerCase()
        results = results.filter(
          (t) =>
            t.receiptNumber.toLowerCase().includes(q) || t.cashierName.toLowerCase().includes(q),
        )
      }

      return results
    },
    [search, paymentMethod, dateFrom?.toDateString(), dateTo?.toDateString()],
    [],
  )
}

export function useTransactionItems(transactionUuid: string | null) {
  return useLiveQuery(
    async () => {
      if (!transactionUuid) return []
      return db.transactionItems.where('transactionId').equals(transactionUuid).toArray()
    },
    [transactionUuid],
    [],
  )
}

export type DatePreset = 'today' | 'week' | 'month' | 'all'

export function getDateRange(preset: DatePreset): { dateFrom?: Date; dateTo?: Date } {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  if (preset === 'today') {
    return { dateFrom: today, dateTo: today }
  }
  if (preset === 'week') {
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    return { dateFrom: weekStart, dateTo: today }
  }
  if (preset === 'month') {
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    return { dateFrom: monthStart, dateTo: today }
  }
  return {}
}
