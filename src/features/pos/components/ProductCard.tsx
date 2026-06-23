import { ShoppingCart } from 'lucide-react'
import { formatRupiah } from '@/shared/lib/formatters'
import { cn } from '@/shared/lib/utils'
import type { Product } from '@/shared/types'

interface ProductCardProps {
  product: Product
  onAdd: (product: Product) => void
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold

  return (
    <button
      onClick={() => !isOutOfStock && onAdd(product)}
      disabled={isOutOfStock}
      className={cn(
        'group flex min-h-touch flex-col rounded-xl border bg-white p-3 text-left transition-all',
        isOutOfStock
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer hover:border-primary/50 hover:shadow-md active:scale-[0.98]',
      )}
    >
      <div className="mb-2 flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-gray-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <ShoppingCart size={24} className="text-gray-300" />
        )}
      </div>

      <p className="line-clamp-2 flex-1 text-xs font-medium leading-tight text-gray-800">
        {product.name}
      </p>

      <div className="mt-1 flex items-end justify-between gap-1">
        <span className="text-sm font-bold text-primary">{formatRupiah(product.price)}</span>
        <span
          className={cn(
            'text-xs',
            isOutOfStock ? 'text-destructive' : isLowStock ? 'text-yellow-600' : 'text-gray-400',
          )}
        >
          {isOutOfStock ? 'Habis' : `Stok: ${product.stock}`}
        </span>
      </div>
    </button>
  )
}
