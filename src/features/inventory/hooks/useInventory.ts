import { useLiveQuery } from 'dexie-react-hooks'
import { db, withDbError } from '@/db'
import type { StockLogType } from '@/shared/types'

export type StockFilter = 'all' | 'low' | 'out'

export function useInventoryProducts({
  search = '',
  filter = 'all',
}: { search?: string; filter?: StockFilter } = {}) {
  return useLiveQuery(
    async () => {
      let results = await db.products.filter((p) => p.isActive).toArray()

      if (filter === 'low') {
        results = results.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold)
      } else if (filter === 'out') {
        results = results.filter((p) => p.stock <= 0)
      }

      if (search) {
        const q = search.toLowerCase()
        results = results.filter(
          (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
        )
      }

      return results.sort((a, b) => a.name.localeCompare(b.name, 'id-ID'))
    },
    [search, filter],
    [],
  )
}

export function useProductStockLogs(productUuid: string | null) {
  return useLiveQuery(
    async () => {
      if (!productUuid) return []
      const logs = await db.stockLogs.where('productId').equals(productUuid).toArray()
      return logs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 20)
    },
    [productUuid],
    [],
  )
}

export async function adjustStock(
  productUuid: string,
  quantityChange: number,
  type: StockLogType,
  notes: string,
): Promise<void> {
  await withDbError(async () => {
    const product = await db.products.where('uuid').equals(productUuid).first()
    if (!product?.id) throw new Error('Produk tidak ditemukan')
    const { id: productId } = product

    const quantityBefore = product.stock
    const quantityAfter = Math.max(0, quantityBefore + quantityChange)
    const now = new Date()

    await db.transaction('rw', [db.products, db.stockLogs], async () => {
      await db.products.update(productId, {
        stock: quantityAfter,
        updatedAt: now,
        syncedAt: null,
      })
      await db.stockLogs.add({
        uuid: crypto.randomUUID(),
        productId: productUuid,
        type,
        quantityBefore,
        quantityChange: quantityAfter - quantityBefore,
        quantityAfter,
        referenceId: null,
        notes: notes || null,
        performedBy: 'Admin',
        createdAt: now,
        syncedAt: null,
      })
    })
  }, 'adjustStock')
}

export function computeStockChange(
  mode: 'restock' | 'set',
  currentStock: number,
  quantity: number,
): { newStock: number; quantityChange: number } {
  const newStock = mode === 'restock' ? Math.max(0, currentStock + quantity) : Math.max(0, quantity)
  return { newStock, quantityChange: newStock - currentStock }
}
