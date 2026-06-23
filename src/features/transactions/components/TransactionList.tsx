import { formatRupiah, formatDate, formatTime } from '@/shared/lib/formatters'
import { Badge } from '@/shared/components/ui/badge'
import type { Transaction } from '@/shared/types'
import { PaymentMethod, TransactionStatus } from '@/shared/types'

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.Cash]: 'Tunai',
  [PaymentMethod.Qris]: 'QRIS',
  [PaymentMethod.DebitCard]: 'K. Debit',
  [PaymentMethod.CreditCard]: 'K. Kredit',
  [PaymentMethod.BankTransfer]: 'Transfer',
}

type BadgeVariant = 'success' | 'warning' | 'destructive' | 'outline' | 'secondary'

const STATUS_CONFIG: Record<TransactionStatus, { label: string; variant: BadgeVariant }> = {
  [TransactionStatus.Completed]: { label: 'Selesai', variant: 'success' },
  [TransactionStatus.Pending]: { label: 'Menunggu', variant: 'warning' },
  [TransactionStatus.Voided]: { label: 'Batal', variant: 'destructive' },
  [TransactionStatus.Refunded]: { label: 'Retur', variant: 'outline' },
  [TransactionStatus.OnHold]: { label: 'Ditahan', variant: 'secondary' },
}

interface TransactionListProps {
  transactions: Transaction[]
  onSelect: (transaction: Transaction) => void
}

export function TransactionList({ transactions, onSelect }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
        <p className="font-medium">Tidak ada transaksi</p>
        <p className="text-sm">Coba ubah filter atau rentang tanggal</p>
      </div>
    )
  }

  return (
    <div className="divide-y rounded-xl border bg-white">
      {transactions.map((tx) => {
        const status = STATUS_CONFIG[tx.status]
        return (
          <button
            key={tx.uuid}
            onClick={() => onSelect(tx)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-muted/50"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm font-medium">{tx.receiptNumber}</p>
                <Badge variant={status.variant} className="shrink-0">
                  {status.label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDate(tx.createdAt)} · {formatTime(tx.createdAt)} · {tx.cashierName}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-semibold text-primary">{formatRupiah(tx.total)}</p>
              <p className="text-xs text-muted-foreground">{PAYMENT_LABELS[tx.paymentMethod]}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
