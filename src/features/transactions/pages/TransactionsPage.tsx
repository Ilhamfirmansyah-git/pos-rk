import { Receipt } from 'lucide-react'

export default function TransactionsPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
      <Receipt size={48} strokeWidth={1.5} />
      <p className="text-lg font-medium">Riwayat Transaksi</p>
      <p className="text-sm">Segera hadir — fitur transaksi sedang dibangun.</p>
    </div>
  )
}
