import { useState } from 'react'
import { Search, Pencil, EyeOff, Eye } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import { useProducts, deactivateProduct, restoreProduct } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { formatRupiah } from '@/shared/lib/formatters'
import { cn } from '@/shared/lib/utils'
import type { Product } from '@/shared/types'

interface ProductListProps {
  onEdit: (product: Product) => void
}

export function ProductList({ onEdit }: ProductListProps) {
  const [search, setSearch] = useState('')
  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>()
  const [showInactive, setShowInactive] = useState(false)

  const categories = useCategories()
  const products = useProducts({
    search,
    categoryId: activeCategoryId,
    activeOnly: !showInactive,
  })

  const categoryMap = Object.fromEntries(categories.map((c) => [c.uuid, c.name]))

  async function handleToggleActive(product: Product) {
    try {
      if (product.isActive) {
        await deactivateProduct(product.uuid)
      } else {
        await restoreProduct(product.uuid)
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Terjadi kesalahan')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Cari nama, SKU, atau barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="h-4 w-4 rounded"
          />
          Tampilkan produk nonaktif
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategoryId(undefined)}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium transition-colors',
            !activeCategoryId
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
          )}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat.uuid}
            onClick={() =>
              setActiveCategoryId(activeCategoryId === cat.uuid ? undefined : cat.uuid)
            }
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              activeCategoryId === cat.uuid
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
          <p className="font-medium">Tidak ada produk ditemukan</p>
          {search && (
            <p className="text-sm">
              Coba kata kunci lain atau{' '}
              <button className="text-primary underline" onClick={() => setSearch('')}>
                hapus pencarian
              </button>
            </p>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">Produk</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Kategori</th>
                <th className="px-4 py-3 font-medium">Harga</th>
                <th className="px-4 py-3 font-medium">Stok</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.uuid}
                  className={cn(
                    'border-b transition-colors last:border-0 hover:bg-muted/30',
                    !product.isActive && 'opacity-50',
                  )}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sku}</p>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {categoryMap[product.categoryId] ?? '—'}
                  </td>
                  <td className="px-4 py-3 font-medium">{formatRupiah(product.price)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span>{product.stock}</span>
                      {product.stock <= product.lowStockThreshold && product.isActive && (
                        <Badge variant="warning">Rendah</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={product.isActive ? 'success' : 'outline'}>
                      {product.isActive ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(product)}
                        aria-label={`Edit ${product.name}`}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => void handleToggleActive(product)}
                        aria-label={
                          product.isActive
                            ? `Nonaktifkan ${product.name}`
                            : `Aktifkan ${product.name}`
                        }
                      >
                        {product.isActive ? (
                          <EyeOff size={14} className="text-muted-foreground" />
                        ) : (
                          <Eye size={14} className="text-primary" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-muted-foreground">{products.length} produk ditemukan</p>
    </div>
  )
}
