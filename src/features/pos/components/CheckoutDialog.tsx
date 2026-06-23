import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog'
import { formatRupiah } from '@/shared/lib/formatters'
import { PaymentMethod } from '@/shared/types'
import type { CartTotals } from '@/shared/types'

const checkoutSchema = z.object({
  paymentMethod: z.nativeEnum(PaymentMethod),
  amountPaid: z.coerce
    .number({ invalid_type_error: 'Masukkan jumlah pembayaran' })
    .min(0, 'Jumlah tidak boleh negatif'),
  notes: z.string().max(200).optional().or(z.literal('')),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  totals: CartTotals
  onConfirm: (method: PaymentMethod, amountPaid: number, notes: string) => Promise<void>
  isLoading: boolean
  error: string | null
}

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.Cash]: 'Tunai',
  [PaymentMethod.Qris]: 'QRIS',
  [PaymentMethod.DebitCard]: 'Kartu Debit',
  [PaymentMethod.CreditCard]: 'Kartu Kredit',
  [PaymentMethod.BankTransfer]: 'Transfer Bank',
}

export function CheckoutDialog({
  open,
  onOpenChange,
  totals,
  onConfirm,
  isLoading,
  error,
}: CheckoutDialogProps) {
  const [success, setSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: PaymentMethod.Cash,
      amountPaid: totals.total,
      notes: '',
    },
  })

  const paymentMethod = watch('paymentMethod')
  const amountPaid = watch('amountPaid') ?? 0
  const change = Math.max(0, amountPaid - totals.total)
  const isCash = paymentMethod === PaymentMethod.Cash
  const canPay = isCash ? amountPaid >= totals.total : true

  async function onSubmit(data: CheckoutFormData) {
    const receipt = await new Promise<string | null>((resolve) => {
      void onConfirm(data.paymentMethod, data.amountPaid, data.notes ?? '').then(() =>
        resolve(null),
      )
    })
    if (!error) {
      setSuccess(receipt ?? 'Transaksi berhasil!')
      reset()
      setTimeout(() => {
        setSuccess(null)
        onOpenChange(false)
      }, 1800)
    }
  }

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xs text-center">
          <div className="flex flex-col items-center gap-3 py-6">
            <CheckCircle2 size={48} className="text-green-500" />
            <p className="text-lg font-semibold">Transaksi Berhasil!</p>
            <p className="text-sm text-muted-foreground">Struk: {success}</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Proses Pembayaran</DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
          <div className="space-y-1 rounded-lg bg-muted/50 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatRupiah(totals.subtotal)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Diskon</span>
                <span>-{formatRupiah(totals.discountAmount)}</span>
              </div>
            )}
            {totals.taxAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pajak</span>
                <span>{formatRupiah(totals.taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-1 text-base font-bold">
              <span>Total</span>
              <span className="text-primary">{formatRupiah(totals.total)}</span>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Metode Pembayaran</Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(PaymentMethod).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => {
                    setValue('paymentMethod', method)
                    if (method !== PaymentMethod.Cash) {
                      setValue('amountPaid', totals.total)
                    }
                  }}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                    paymentMethod === method
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  {PAYMENT_LABELS[method]}
                </button>
              ))}
            </div>
          </div>

          {isCash && (
            <div className="space-y-1">
              <Label htmlFor="amount-paid">Uang Diterima</Label>
              <Input
                id="amount-paid"
                type="number"
                min={0}
                step={1000}
                {...register('amountPaid')}
              />
              {errors.amountPaid && (
                <p className="text-xs text-destructive">{errors.amountPaid.message}</p>
              )}
              {amountPaid >= totals.total && (
                <div className="flex justify-between rounded-lg bg-green-50 px-3 py-2 text-sm">
                  <span className="font-medium">Kembalian</span>
                  <span className="font-bold text-green-600">{formatRupiah(change)}</span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="checkout-notes">Catatan (opsional)</Label>
            <Input
              id="checkout-notes"
              placeholder="mis. meja 5, takeaway..."
              {...register('notes')}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading || !canPay}>
              {isLoading ? 'Memproses...' : `Bayar ${formatRupiah(totals.total)}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
