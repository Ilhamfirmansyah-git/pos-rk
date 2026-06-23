import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog'
import { useCategories } from '../hooks/useCategories'
import { addProduct, updateProduct, generateSku } from '../hooks/useProducts'
import { productSchema, type ProductFormData } from '../types'
import type { Product } from '@/shared/types'

interface ProductFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editProduct?: Product | null
}

export function ProductForm({ open, onOpenChange, editProduct }: ProductFormProps) {
  const categories = useCategories()
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      categoryId: '',
      price: 0,
      costPrice: 0,
      stock: 0,
      lowStockThreshold: 5,
      description: '',
      imageUrl: '',
      barcode: '',
      isActive: true,
    },
  })

  const nameValue = watch('name')

  useEffect(() => {
    if (open) {
      if (editProduct) {
        reset({
          name: editProduct.name,
          sku: editProduct.sku,
          categoryId: editProduct.categoryId,
          price: editProduct.price,
          costPrice: editProduct.costPrice,
          stock: editProduct.stock,
          lowStockThreshold: editProduct.lowStockThreshold,
          description: editProduct.description ?? '',
          imageUrl: editProduct.imageUrl ?? '',
          barcode: editProduct.barcode ?? '',
          isActive: editProduct.isActive,
        })
      } else {
        reset({
          name: '',
          sku: '',
          categoryId: '',
          price: 0,
          costPrice: 0,
          stock: 0,
          lowStockThreshold: 5,
          description: '',
          imageUrl: '',
          barcode: '',
          isActive: true,
        })
      }
      setSubmitError(null)
    }
  }, [open, editProduct, reset])

  async function onSubmit(data: ProductFormData) {
    setIsLoading(true)
    setSubmitError(null)
    try {
      if (editProduct) {
        await updateProduct(editProduct.uuid, data)
      } else {
        await addProduct(data)
      }
      onOpenChange(false)
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Terjadi kesalahan, coba lagi')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editProduct ? 'Edit Produk' : 'Tambah Produk'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="prod-name">Nama Produk *</Label>
              <Input id="prod-name" placeholder="mis. Kopi Susu" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="prod-sku">SKU *</Label>
              <div className="flex gap-2">
                <Input id="prod-sku" placeholder="mis. KOPI-001" {...register('sku')} />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  title="Generate SKU otomatis"
                  onClick={() => setValue('sku', generateSku(nameValue))}
                >
                  <RefreshCw size={14} />
                </Button>
              </div>
              {errors.sku && <p className="text-xs text-destructive">{errors.sku.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="prod-price">Harga Jual (Rp) *</Label>
              <Input
                id="prod-price"
                type="number"
                min={0}
                step={1}
                placeholder="0"
                {...register('price')}
              />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="prod-cost">Harga Modal (Rp)</Label>
              <Input
                id="prod-cost"
                type="number"
                min={0}
                step={1}
                placeholder="0"
                {...register('costPrice')}
              />
              {errors.costPrice && (
                <p className="text-xs text-destructive">{errors.costPrice.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="prod-category">Kategori *</Label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="prod-category">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.uuid} value={cat.uuid}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && (
                <p className="text-xs text-destructive">{errors.categoryId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="prod-stock">Stok Awal</Label>
              <Input
                id="prod-stock"
                type="number"
                min={0}
                step={1}
                placeholder="0"
                {...register('stock')}
              />
              {errors.stock && <p className="text-xs text-destructive">{errors.stock.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="prod-threshold">Batas Stok Rendah</Label>
              <Input
                id="prod-threshold"
                type="number"
                min={0}
                step={1}
                placeholder="5"
                {...register('lowStockThreshold')}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="prod-barcode">Barcode</Label>
              <Input id="prod-barcode" placeholder="Scan atau ketik" {...register('barcode')} />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="prod-image">URL Gambar</Label>
            <Input id="prod-image" type="url" placeholder="https://..." {...register('imageUrl')} />
            {errors.imageUrl && (
              <p className="text-xs text-destructive">{errors.imageUrl.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="prod-desc">Deskripsi</Label>
            <Textarea
              id="prod-desc"
              placeholder="Deskripsi produk..."
              {...register('description')}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="prod-active"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              {...register('isActive')}
            />
            <Label htmlFor="prod-active">Produk aktif (tampil di kasir)</Label>
          </div>

          {submitError && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {submitError}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading || categories.length === 0}>
              {isLoading ? 'Menyimpan...' : editProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
            </Button>
          </DialogFooter>

          {categories.length === 0 && (
            <p className="text-center text-xs text-muted-foreground">
              Buat kategori terlebih dahulu sebelum menambah produk
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
