import { useLiveQuery } from 'dexie-react-hooks'
import { db, withDbError } from '@/db'
import type { ProductFormData } from '../types'

interface UseProductsParams {
  search?: string
  categoryId?: string
  activeOnly?: boolean
}

export function useProducts({
  search = '',
  categoryId,
  activeOnly = false,
}: UseProductsParams = {}) {
  return useLiveQuery(
    async () => {
      let results = await db.products.toArray()

      if (activeOnly) {
        results = results.filter((p) => p.isActive)
      }
      if (categoryId) {
        results = results.filter((p) => p.categoryId === categoryId)
      }
      if (search) {
        const q = search.toLowerCase()
        results = results.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            (p.barcode?.toLowerCase().includes(q) ?? false),
        )
      }

      return results.sort((a, b) => a.name.localeCompare(b.name, 'id-ID'))
    },
    [search, categoryId, activeOnly],
    [],
  )
}

export function generateSku(name: string): string {
  const prefix = name
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 4)
    .toUpperCase()
  const suffix = Math.floor(1000 + Math.random() * 9000)
  return `${prefix || 'PRD'}-${suffix}`
}

export async function addProduct(data: ProductFormData): Promise<void> {
  const now = new Date()
  await withDbError(
    () =>
      db.products.add({
        uuid: crypto.randomUUID(),
        sku: data.sku,
        name: data.name,
        description: data.description || null,
        categoryId: data.categoryId,
        price: data.price,
        costPrice: data.costPrice,
        stock: data.stock,
        lowStockThreshold: data.lowStockThreshold,
        imageUrl: data.imageUrl ?? null,
        barcode: data.barcode || null,
        isActive: data.isActive,
        hasVariants: false,
        createdAt: now,
        updatedAt: now,
        syncedAt: null,
      }),
    'addProduct',
  )
}

export async function updateProduct(uuid: string, data: ProductFormData): Promise<void> {
  const product = await db.products.where('uuid').equals(uuid).first()
  if (!product?.id) throw new Error('Produk tidak ditemukan')
  await withDbError(
    () =>
      db.products.update(product.id, {
        sku: data.sku,
        name: data.name,
        description: data.description || null,
        categoryId: data.categoryId,
        price: data.price,
        costPrice: data.costPrice,
        stock: data.stock,
        lowStockThreshold: data.lowStockThreshold,
        imageUrl: data.imageUrl ?? null,
        barcode: data.barcode || null,
        isActive: data.isActive,
        updatedAt: new Date(),
        syncedAt: null,
      }),
    'updateProduct',
  )
}

export async function deactivateProduct(uuid: string): Promise<void> {
  const product = await db.products.where('uuid').equals(uuid).first()
  if (!product?.id) throw new Error('Produk tidak ditemukan')
  await withDbError(
    () =>
      db.products.update(product.id, {
        isActive: false,
        updatedAt: new Date(),
        syncedAt: null,
      }),
    'deactivateProduct',
  )
}

export async function restoreProduct(uuid: string): Promise<void> {
  const product = await db.products.where('uuid').equals(uuid).first()
  if (!product?.id) throw new Error('Produk tidak ditemukan')
  await withDbError(
    () =>
      db.products.update(product.id, {
        isActive: true,
        updatedAt: new Date(),
        syncedAt: null,
      }),
    'restoreProduct',
  )
}
