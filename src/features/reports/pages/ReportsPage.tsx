import { BarChart2 } from 'lucide-react'

export default function ReportsPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
      <BarChart2 size={48} strokeWidth={1.5} />
      <p className="text-lg font-medium">Laporan Penjualan</p>
      <p className="text-sm">Segera hadir — fitur laporan sedang dibangun.</p>
    </div>
  )
}
