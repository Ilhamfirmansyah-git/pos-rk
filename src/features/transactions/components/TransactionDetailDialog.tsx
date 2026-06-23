import { formatRupiah, formatDate, formatTime } from '@/shared/lib/formatters'
import { Badge } from '@/shared/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { useTransactionItems } from '../hooks/useTransactions'
import type { Transaction } from '@/shared/types'
import { PaymentMethod, TransactionStatus } from '@/shared/types'

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.Cash]: 'Tunai',
  [PaymentMethod.Qris]: 'QRIS',
  [PaymentMethod.DebitCard]: 'Kartu Debit',
  [PaymentMethod.CreditCard]: 'Kartu Kredit',
  [PaymentMethod.BankTransfer]: 'Transfer Bank',
}

type BadgeVariant = 'success' | 'warning' | 'destructive' | 'outline' | 'secondary'

const STATUS_CONFIG: Record<TransactionStatus, { label: string; variant: BadgeVariant }> = {
  [TransactionStatus.Completed]: { label: 'Selesai', variant: 'success' },
  [TransactionStatus.Pending]: { label: 'Menunggu', variant: 'warning' },
  [TransactionStatus.Voided]: { label: 'Dibatalkan', variant: 'destructive' },
  [TransactionStatus.Refunded]: { label: 'Dikembalikan', variant: 'outline' },
  [TransactionStatus.OnHold]: { label: 'Ditahan', variant: 'secondary' },
}

interface TransactionDetailDialogProps {
  transaction: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionDetailDialog({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailDialogProps) {
  const items = useTransactionItems(transaction?.uuid ?? null)

  if (!transaction) return null

  const status = STATUS_CONFIG[transaction.status]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detail Transaksi</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2 rounded-lg bg-muted/50 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">No. Struk</span>
              <span className="font-mono font-medium">{transaction.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tanggal</span>
              <span>
                {formatDate(transaction.createdAt)} {formatTime(transaction.createdAt)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kasir</span>
              <span>{transaction.cashierName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Pembayaran</span>
              <span>{PAYMENT_LABELS[transaction.paymentMethod]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            {transaction.notes && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Catatan</span>
                <span className="text-right">{transaction.notes}</span>
              </div>
            )}
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Item
            </p>
            <div className="divide-y rounded-lg border">
              {items.map((item) => (
                <div
                  key={item.uuid}
                  className="flex items-start justify-between gap-2 px-3 py-2.5 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">{item.productSku}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-medium">{formatRupiah(item.subtotal)}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} × {formatRupiah(item.unitPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatRupiah(transaction.subtotal)}</span>
            </div>
            {transaction.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Diskon</span>
                <span>-{formatRupiah(transaction.discountAmount)}</span>
              </div>
            )}
            {transaction.taxAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pajak</span>
                <span>{formatRupiah(transaction.taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-1.5 text-base font-bold">
              <span>Total</span>
              <span className="text-primary">{formatRupiah(transaction.total)}</span>
            </div>
            {transaction.paymentMethod === PaymentMethod.Cash && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dibayar</span>
                  <span>{formatRupiah(transaction.amountPaid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kembalian</span>
                  <span className="font-medium text-green-600">
                    {formatRupiah(transaction.changeAmount)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
