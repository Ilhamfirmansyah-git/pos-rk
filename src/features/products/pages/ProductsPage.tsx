import { Package } from 'lucide-react'

export default function ProductsPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
      <Package size={48} strokeWidth={1.5} />
      <p className="text-lg font-medium">Manajemen Produk</p>
      <p className="text-sm">Segera hadir — fitur produk sedang dibangun.</p>
    </div>
  )
}
