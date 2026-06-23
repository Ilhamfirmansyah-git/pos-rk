import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { formatDate, formatTime } from '@/shared/lib/formatters'
import { cn } from '@/shared/lib/utils'
import { adjustStock, computeStockChange, useProductStockLogs } from '../hooks/useInventory'
import type { Product } from '@/shared/types'
import { StockLogType } from '@/shared/types'

const STOCK_LOG_LABELS: Partial<Record<StockLogType, string>> = {
  [StockLogType.Sale]: 'Penjualan',
  [StockLogType.Restock]: 'Restock',
  [StockLogType.Adjustment]: 'Koreksi',
  [StockLogType.Return]: 'Retur',
}

type AdjustMode = 'restock' | 'set'

const schema = z.object({
  quantity: z.coerce
    .number({ invalid_type_error: 'Masukkan angka' })
    .int('Harus bilangan bulat')
    .min(0, 'Tidak boleh negatif'),
  notes: z.string().max(200).optional().or(z.literal('')),
})

type FormData = z.infer<typeof schema>

interface StockAdjustmentDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StockAdjustmentDialog({ product, open, onOpenChange }: StockAdjustmentDialogProps) {
  const [mode, setMode] = useState<AdjustMode>('restock')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const logs = useProductStockLogs(product?.uuid ?? null)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { quantity: 0, notes: '' },
  })

  const quantity = watch('quantity') ?? 0
  const currentStock = product?.stock ?? 0
  const { newStock, quantityChange } = computeStockChange(mode, currentStock, Number(quantity))

  function handleClose(v: boolean) {
    reset()
    setSubmitError(null)
    onOpenChange(v)
  }

  async function onSubmit(data: FormData) {
    if (!product) return
    setSubmitError(null)
    try {
      const type = mode === 'restock' ? StockLogType.Restock : StockLogType.Adjustment
      const { quantityChange: change } = computeStockChange(mode, currentStock, data.quantity)
      await adjustStock(product.uuid, change, type, data.notes ?? '')
      reset()
      onOpenChange(false)
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Gagal menyimpan')
    }
  }

  if (!product) return null

  const isOutOfStock = product.stock <= 0
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Sesuaikan Stok</DialogTitle>
        </DialogHeader>

        <div className="flex items-start justify-between rounded-lg bg-muted/50 p-3">
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.sku}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Stok saat ini</p>
            <p
              className={cn(
                'text-lg font-bold',
                isOutOfStock
                  ? 'text-destructive'
                  : isLowStock
                    ? 'text-yellow-600'
                    : 'text-foreground',
              )}
            >
              {product.stock}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {(['restock', 'set'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m)
                reset()
              }}
              className={cn(
                'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                mode === m ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-muted',
              )}
            >
              {m === 'restock' ? 'Tambah Stok' : 'Set Stok Aktual'}
            </button>
          ))}
        </div>

        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="qty-input">
              {mode === 'restock' ? 'Jumlah masuk' : 'Stok aktual sekarang'}
            </Label>
            <Input id="qty-input" type="number" min={0} {...register('quantity')} />
            {errors.quantity && (
              <p className="text-xs text-destructive">{errors.quantity.message}</p>
            )}
            {Number(quantity) > 0 && (
              <p
                className={cn(
                  'text-xs',
                  quantityChange >= 0 ? 'text-green-600' : 'text-destructive',
                )}
              >
                {mode === 'restock'
                  ? `Stok baru: ${currentStock} + ${quantity} = ${newStock}`
                  : `Stok baru: ${newStock} (${quantityChange >= 0 ? '+' : ''}${quantityChange})`}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="adj-notes">Catatan (opsional)</Label>
            <Input
              id="adj-notes"
              placeholder="mis. terima barang dari supplier A"
              {...register('notes')}
            />
          </div>

          {submitError && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {submitError}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting || Number(quantity) === 0}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>

        {logs.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Riwayat Stok
            </p>
            <div className="max-h-40 divide-y overflow-y-auto rounded-lg border text-sm">
              {logs.map((log) => (
                <div key={log.uuid} className="flex items-start gap-2 px-3 py-2">
                  <div className="min-w-0 flex-1">
                    <span className="font-medium">{STOCK_LOG_LABELS[log.type] ?? log.type}</span>
                    {log.notes && <span className="ml-1 text-muted-foreground">· {log.notes}</span>}
                    <p className="text-xs text-muted-foreground">
                      {formatDate(log.createdAt)} {formatTime(log.createdAt)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 font-semibold',
                      log.quantityChange >= 0 ? 'text-green-600' : 'text-destructive',
                    )}
                  >
                    {log.quantityChange >= 0 ? '+' : ''}
                    {log.quantityChange}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
