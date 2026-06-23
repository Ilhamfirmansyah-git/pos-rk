import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/shared/lib/utils'
import { useProducts } from '@/features/products/hooks/useProducts'
import { useCategories } from '@/features/products/hooks/useCategories'
import { ProductCard } from './ProductCard'
import type { Product } from '@/shared/types'

interface ProductGridProps {
  onAdd: (product: Product) => void
}

export function ProductGrid({ onAdd }: ProductGridProps) {
  const [search, setSearch] = useState('')
  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>()

  const categories = useCategories()
  const products = useProducts({ search, categoryId: activeCategoryId, activeOnly: true })

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Cari produk atau scan barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
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

      <div className="flex-1 overflow-y-auto">
        {products.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <p className="font-medium">Tidak ada produk</p>
            {search && (
              <button className="text-sm text-primary underline" onClick={() => setSearch('')}>
                Hapus pencarian
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.uuid} product={product} onAdd={onAdd} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
