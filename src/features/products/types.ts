import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(50, 'Nama maksimal 50 karakter'),
  description: z.string().max(200, 'Deskripsi maksimal 200 karakter').optional().or(z.literal('')),
  sortOrder: z.coerce.number().int().min(0).default(0),
})

export type CategoryFormData = z.infer<typeof categorySchema>

export const productSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
  sku: z.string().min(2, 'SKU minimal 2 karakter').max(50, 'SKU maksimal 50 karakter'),
  categoryId: z.string().min(1, 'Pilih kategori produk'),
  price: z.coerce
    .number({ invalid_type_error: 'Harga harus angka' })
    .int('Harga harus bilangan bulat')
    .min(0, 'Harga tidak boleh negatif'),
  costPrice: z.coerce
    .number({ invalid_type_error: 'Harga modal harus angka' })
    .int('Harga modal harus bilangan bulat')
    .min(0, 'Harga modal tidak boleh negatif'),
  stock: z.coerce
    .number({ invalid_type_error: 'Stok harus angka' })
    .int('Stok harus bilangan bulat')
    .min(0, 'Stok tidak boleh negatif'),
  lowStockThreshold: z.coerce.number().int().min(0).default(5),
  description: z.string().max(500, 'Deskripsi maksimal 500 karakter').optional().or(z.literal('')),
  imageUrl: z
    .string()
    .url('URL gambar tidak valid')
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  barcode: z.string().max(50).optional().or(z.literal('')),
  isActive: z.boolean().default(true),
})

export type ProductFormData = z.infer<typeof productSchema>
