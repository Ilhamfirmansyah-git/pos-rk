import { useState } from 'react'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { formatRupiah } from '@/shared/lib/formatters'
import { useCartStore } from '../store/useCartStore'
import { useCheckout } from '../hooks/useCheckout'
import { CartItemRow } from './CartItemRow'
import { CheckoutDialog } from './CheckoutDialog'
import type { PaymentMethod } from '@/shared/types'

export function Cart() {
  const { items, discountAmount, setDiscount, updateQty, removeItem, clearCart, getTotals } =
    useCartStore()
  const { checkout, isLoading, error } = useCheckout()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const totals = getTotals()
  const isEmpty = items.length === 0

  async function handleConfirm(method: PaymentMethod, amountPaid: number, notes: string) {
    const receipt = await checkout({ items, totals, paymentMethod: method, amountPaid, notes })
    if (receipt) {
      clearCart()
    }
  }

  return (
    <div className="flex h-full flex-col border-l bg-white">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} className="text-primary" />
          <span className="font-semibold">Keranjang</span>
          {items.length > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">
              {items.length}
            </span>
          )}
        </div>
        {!isEmpty && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearCart}
            aria-label="Kosongkan keranjang"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 size={14} />
          </Button>
        )}
      </div>

      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground">
          <ShoppingCart size={36} strokeWidth={1.5} />
          <p className="text-sm">Keranjang kosong</p>
          <p className="text-xs">Klik produk untuk menambahkan</p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4">
            {items.map((item) => (
              <CartItemRow
                key={item.product.uuid}
                item={item}
                onUpdateQty={updateQty}
                onRemove={removeItem}
              />
            ))}
          </div>

          <div className="space-y-3 border-t px-4 py-3">
            <div className="space-y-1">
              <Label htmlFor="discount">Diskon (Rp)</Label>
              <Input
                id="discount"
                type="number"
                min={0}
                step={1000}
                value={discountAmount || ''}
                placeholder="0"
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} item)</span>
                <span>{formatRupiah(totals.subtotal)}</span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Diskon</span>
                  <span>-{formatRupiah(totals.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-1 text-base font-bold">
                <span>Total</span>
                <span className="text-primary">{formatRupiah(totals.total)}</span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={() => setCheckoutOpen(true)}
              disabled={isEmpty}
            >
              Bayar {formatRupiah(totals.total)}
            </Button>
          </div>
        </>
      )}

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        totals={totals}
        onConfirm={handleConfirm}
        isLoading={isLoading}
        error={error}
      />
    </div>
  )
}
