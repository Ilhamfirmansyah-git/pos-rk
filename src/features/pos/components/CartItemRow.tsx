import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { formatRupiah } from '@/shared/lib/formatters'
import type { CartItem } from '@/shared/types'

interface CartItemRowProps {
  item: CartItem
  onUpdateQty: (productId: string, qty: number) => void
  onRemove: (productId: string) => void
}

export function CartItemRow({ item, onUpdateQty, onRemove }: CartItemRowProps) {
  return (
    <div className="flex items-start gap-2 border-b py-3 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item.product.name}</p>
        <p className="text-xs text-muted-foreground">{formatRupiah(item.unitPrice)} / pcs</p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onUpdateQty(item.product.uuid, item.quantity - 1)}
          aria-label="Kurangi"
        >
          <Minus size={12} />
        </Button>
        <span className="w-8 text-center text-sm font-medium tabular-nums">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onUpdateQty(item.product.uuid, item.quantity + 1)}
          disabled={item.quantity >= item.product.stock}
          aria-label="Tambah"
        >
          <Plus size={12} />
        </Button>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold">{formatRupiah(item.subtotal)}</p>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-destructive"
          onClick={() => onRemove(item.product.uuid)}
          aria-label={`Hapus ${item.product.name}`}
        >
          <Trash2 size={12} />
        </Button>
      </div>
    </div>
  )
}
