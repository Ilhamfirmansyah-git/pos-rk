import { useState } from 'react'
import { Package, Search } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { useInventoryProducts } from '../hooks/useInventory'
import { StockAdjustmentDialog } from '../components/StockAdjustmentDialog'
import type { Product } from '@/shared/types'
import type { StockFilter } from '../hooks/useInventory'

const FILTER_OPTIONS: { value: StockFilter; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'low', label: 'Stok Rendah' },
  { value: 'out', label: 'Habis' },
]

export default function InventoryPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<StockFilter>('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const products = useInventoryProducts({ search, filter })
  const allProducts = useInventoryProducts()

  const lowStockCount = allProducts.filter(
    (p) => p.stock > 0 && p.stock <= p.lowStockThreshold,
  ).length
  const outOfStockCount = allProducts.filter((p) => p.stock <= 0).length

  function handleAdjust(product: Product) {
    setSelectedProduct(product)
    setDialogOpen(true)
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4 md:p-6">
      <h1 className="text-xl font-semibold">Manajemen Stok</h1>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{allProducts.length}</p>
          <p className="text-xs text-muted-foreground">Total Produk</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{lowStockCount}</p>
          <p className="text-xs text-muted-foreground">Stok Rendah</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-destructive">{outOfStockCount}</p>
          <p className="text-xs text-muted-foreground">Habis</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Cari produk atau SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                filter === opt.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
            <Package size={40} strokeWidth={1.5} />
            <p className="font-medium">Tidak ada produk</p>
          </div>
        ) : (
          <div className="divide-y rounded-xl border bg-white">
            {products.map((product) => {
              const isOutOfStock = product.stock <= 0
              const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold
              return (
                <div key={product.uuid} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sku}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="text-right">
                      <p
                        className={cn(
                          'text-sm font-bold',
                          isOutOfStock
                            ? 'text-destructive'
                            : isLowStock
                              ? 'text-yellow-600'
                              : 'text-foreground',
                        )}
                      >
                        {product.stock}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        / {product.lowStockThreshold} min
                      </p>
                    </div>
                    {isOutOfStock ? (
                      <Badge variant="destructive">Habis</Badge>
                    ) : isLowStock ? (
                      <Badge variant="warning">Rendah</Badge>
                    ) : (
                      <Badge variant="success">OK</Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleAdjust(product)}>
                      Sesuaikan
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <StockAdjustmentDialog
        product={selectedProduct}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
