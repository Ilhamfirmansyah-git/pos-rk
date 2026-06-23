import { useState } from 'react'
import { db, withDbError } from '@/db'
import { generateReceiptNumber } from '@/shared/lib/formatters'
import { StockLogType, TransactionStatus } from '@/shared/types'
import type { CartItem, CartTotals, PaymentMethod } from '@/shared/types'

interface CheckoutParams {
  items: CartItem[]
  totals: CartTotals
  paymentMethod: PaymentMethod
  amountPaid: number
  notes: string
}

export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function checkout(params: CheckoutParams): Promise<string | null> {
    setIsLoading(true)
    setError(null)
    try {
      const receiptNumber = await generateUniqueReceiptNumber()
      const now = new Date()
      const transactionUuid = crypto.randomUUID()

      await withDbError(
        () =>
          db.transaction(
            'rw',
            [db.transactions, db.transactionItems, db.products, db.stockLogs],
            async () => {
              await db.transactions.add({
                uuid: transactionUuid,
                receiptNumber,
                cashierId: 'default',
                cashierName: 'Kasir',
                subtotal: params.totals.subtotal,
                discountAmount: params.totals.discountAmount,
                taxAmount: params.totals.taxAmount,
                total: params.totals.total,
                paymentMethod: params.paymentMethod,
                amountPaid: params.amountPaid,
                changeAmount: params.amountPaid - params.totals.total,
                status: TransactionStatus.Completed,
                notes: params.notes || null,
                createdAt: now,
                updatedAt: now,
                syncedAt: null,
              })

              for (const item of params.items) {
                await db.transactionItems.add({
                  uuid: crypto.randomUUID(),
                  transactionId: transactionUuid,
                  productId: item.product.uuid,
                  productName: item.product.name,
                  productSku: item.product.sku,
                  variantId: item.variant?.uuid ?? null,
                  variantName: item.variant?.name ?? null,
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                  discountAmount: item.discountAmount,
                  subtotal: item.subtotal,
                  createdAt: now,
                  syncedAt: null,
                })

                const product = await db.products.where('uuid').equals(item.product.uuid).first()
                if (product?.id) {
                  const { id: productId } = product
                  const newStock = Math.max(0, product.stock - item.quantity)
                  await db.products.update(productId, {
                    stock: newStock,
                    updatedAt: now,
                    syncedAt: null,
                  })
                  await db.stockLogs.add({
                    uuid: crypto.randomUUID(),
                    productId: item.product.uuid,
                    type: StockLogType.Sale,
                    quantityBefore: product.stock,
                    quantityChange: newStock - product.stock,
                    quantityAfter: newStock,
                    referenceId: transactionUuid,
                    notes: null,
                    performedBy: 'Kasir',
                    createdAt: now,
                    syncedAt: null,
                  })
                }
              }
            },
          ),
        'checkout',
      )

      return receiptNumber
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memproses transaksi')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { checkout, isLoading, error }
}

async function generateUniqueReceiptNumber(): Promise<string> {
  const count = await db.transactions.count()
  return generateReceiptNumber(count + 1)
}
