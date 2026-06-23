import { useLiveQuery } from 'dexie-react-hooks'
import { db, withDbError } from '@/db'
import type { CategoryFormData } from '../types'

export function useCategories() {
  return useLiveQuery(() => db.categories.orderBy('sortOrder').toArray(), [], [])
}

export async function addCategory(data: CategoryFormData): Promise<void> {
  const now = new Date()
  await withDbError(
    () =>
      db.categories.add({
        uuid: crypto.randomUUID(),
        name: data.name,
        description: data.description || null,
        sortOrder: data.sortOrder,
        createdAt: now,
        updatedAt: now,
        syncedAt: null,
      }),
    'addCategory',
  )
}

export async function updateCategory(uuid: string, data: CategoryFormData): Promise<void> {
  const category = await db.categories.where('uuid').equals(uuid).first()
  if (!category?.id) throw new Error('Kategori tidak ditemukan')
  await withDbError(
    () =>
      db.categories.update(category.id, {
        name: data.name,
        description: data.description || null,
        sortOrder: data.sortOrder,
        updatedAt: new Date(),
        syncedAt: null,
      }),
    'updateCategory',
  )
}

export async function deleteCategory(uuid: string): Promise<void> {
  const category = await db.categories.where('uuid').equals(uuid).first()
  if (!category?.id) throw new Error('Kategori tidak ditemukan')
  const productCount = await db.products.where('categoryId').equals(uuid).count()
  if (productCount > 0) throw new Error(`Kategori masih digunakan oleh ${productCount} produk`)
  await withDbError(() => db.categories.delete(category.id), 'deleteCategory')
}
