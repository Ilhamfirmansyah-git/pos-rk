import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/shared/lib/utils'
import { formatRupiah } from '@/shared/lib/formatters'
import { useTransactions, getDateRange } from '../hooks/useTransactions'
import { TransactionList } from '../components/TransactionList'
import { TransactionDetailDialog } from '../components/TransactionDetailDialog'
import type { Transaction } from '@/shared/types'
import type { DatePreset } from '../hooks/useTransactions'

const DATE_PRESETS: { value: DatePreset; label: string }[] = [
  { value: 'today', label: 'Hari ini' },
  { value: 'week', label: 'Minggu ini' },
  { value: 'month', label: 'Bulan ini' },
  { value: 'all', label: 'Semua' },
]

export default function TransactionsPage() {
  const [search, setSearch] = useState('')
  const [datePreset, setDatePreset] = useState<DatePreset>('today')
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { dateFrom, dateTo } = getDateRange(datePreset)
  const transactions = useTransactions({ search, dateFrom, dateTo })

  const totalRevenue = transactions.reduce((sum, tx) => sum + tx.total, 0)

  function handleSelect(tx: Transaction) {
    setSelectedTx(tx)
    setDialogOpen(true)
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">Riwayat Transaksi</h1>
        <div className="flex gap-4 text-sm">
          <span>
            <span className="text-muted-foreground">Transaksi: </span>
            <span className="font-semibold">{transactions.length}</span>
          </span>
          <span>
            <span className="text-muted-foreground">Total: </span>
            <span className="font-semibold text-primary">{formatRupiah(totalRevenue)}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Cari no. struk atau nama kasir..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1">
          {DATE_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setDatePreset(preset.value)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                datePreset === preset.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <TransactionList transactions={transactions} onSelect={handleSelect} />
      </div>

      <TransactionDetailDialog
        transaction={selectedTx}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
