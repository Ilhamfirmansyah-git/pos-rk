import { Boxes } from 'lucide-react'

export default function InventoryPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
      <Boxes size={48} strokeWidth={1.5} />
      <p className="text-lg font-medium">Manajemen Stok</p>
      <p className="text-sm">Segera hadir — fitur stok sedang dibangun.</p>
    </div>
  )
}
