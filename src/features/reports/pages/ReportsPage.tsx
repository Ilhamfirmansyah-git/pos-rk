import { useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { formatRupiah } from '@/shared/lib/formatters'
import { useReportData } from '../hooks/useReports'
import { RevenueChart } from '../components/RevenueChart'
import type { DatePreset } from '../hooks/useReports'
import { PaymentMethod } from '@/shared/types'

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.Cash]: 'Tunai',
  [PaymentMethod.Qris]: 'QRIS',
  [PaymentMethod.DebitCard]: 'K. Debit',
  [PaymentMethod.CreditCard]: 'K. Kredit',
  [PaymentMethod.BankTransfer]: 'Transfer',
}

const DATE_PRESETS: { value: DatePreset; label: string }[] = [
  { value: 'today', label: 'Hari ini' },
  { value: 'week', label: 'Minggu ini' },
  { value: 'month', label: 'Bulan ini' },
  { value: 'all', label: 'Semua' },
]

export default function ReportsPage() {
  const [datePreset, setDatePreset] = useState<DatePreset>('week')
  const data = useReportData(datePreset)

  const maxProductRevenue = data.topProducts[0]?.revenue ?? 1

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">Laporan Penjualan</h1>
        <div className="flex gap-1">
          {DATE_PRESETS.map((p) => (
            <button
              key={p.value}
              onClick={() => setDatePreset(p.value)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                datePreset === p.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs text-muted-foreground">Omzet</p>
          <p className="mt-1 text-xl font-bold text-primary">{formatRupiah(data.revenue)}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs text-muted-foreground">Transaksi</p>
          <p className="mt-1 text-xl font-bold">{data.transactionCount}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs text-muted-foreground">Rata-rata</p>
          <p className="mt-1 text-xl font-bold">{formatRupiah(data.avgOrderValue)}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs text-muted-foreground">Total Diskon</p>
          <p className="mt-1 text-xl font-bold text-green-600">
            {formatRupiah(data.totalDiscount)}
          </p>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="rounded-xl border bg-white p-4">
        <p className="mb-3 text-sm font-semibold">Omzet Harian</p>
        <RevenueChart data={data.dailyRevenue} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Top products */}
        <div className="rounded-xl border bg-white p-4">
          <p className="mb-3 text-sm font-semibold">Produk Terlaris</p>
          {data.topProducts.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Belum ada data</p>
          ) : (
            <div className="space-y-3">
              {data.topProducts.map((product, i) => (
                <div key={product.productName} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="w-4 shrink-0 text-xs font-bold text-muted-foreground">
                        {i + 1}
                      </span>
                      <span className="truncate font-medium">{product.productName}</span>
                    </div>
                    <div className="ml-2 shrink-0 text-right">
                      <span className="font-semibold">{formatRupiah(product.revenue)}</span>
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({product.quantity} pcs)
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${(product.revenue / maxProductRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment breakdown */}
        <div className="rounded-xl border bg-white p-4">
          <p className="mb-3 text-sm font-semibold">Metode Pembayaran</p>
          {data.paymentStats.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Belum ada data</p>
          ) : (
            <div className="space-y-3">
              {data.paymentStats.map((stat) => {
                const pct = data.revenue > 0 ? Math.round((stat.revenue / data.revenue) * 100) : 0
                return (
                  <div key={stat.method} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">
                        {PAYMENT_LABELS[stat.method] ?? stat.method}
                      </span>
                      <div className="text-right">
                        <span className="font-semibold">{formatRupiah(stat.revenue)}</span>
                        <span className="ml-1 text-xs text-muted-foreground">
                          {stat.count}× · {pct}%
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-green-500 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
