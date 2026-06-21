import Dexie, { type EntityTable } from 'dexie'
import type {
  Category,
  Product,
  ProductVariant,
  Transaction,
  TransactionItem,
  StockLog,
  User,
} from '@/shared/types'

// ─── Database Class ───────────────────────────────────────────────────────────

class PosRkDatabase extends Dexie {
  categories!: EntityTable<Category, 'id'>
  products!: EntityTable<Product, 'id'>
  productVariants!: EntityTable<ProductVariant, 'id'>
  transactions!: EntityTable<Transaction, 'id'>
  transactionItems!: EntityTable<TransactionItem, 'id'>
  stockLogs!: EntityTable<StockLog, 'id'>
  users!: EntityTable<User, 'id'>

  constructor() {
    super('pos-rk-db')

    this.version(1).stores({
      categories: '++id, &uuid, name, sortOrder, syncedAt',
      products: '++id, &uuid, &sku, name, categoryId, isActive, stock, syncedAt, barcode',
      productVariants: '++id, &uuid, productId, sku, syncedAt',
      transactions:
        '++id, &uuid, &receiptNumber, cashierId, status, paymentMethod, createdAt, syncedAt',
      transactionItems: '++id, &uuid, transactionId, productId, syncedAt',
      stockLogs: '++id, &uuid, productId, type, createdAt, syncedAt',
      users: '++id, &uuid, &email, role, isActive, syncedAt',
    })
  }
}

// ─── Singleton Instance ───────────────────────────────────────────────────────

export const db = new PosRkDatabase()

// ─── Error Helper ─────────────────────────────────────────────────────────────

export async function withDbError<T>(operation: () => Promise<T>, context: string): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database error'
    throw new Error(`[DB:${context}] ${message}`)
  }
}
