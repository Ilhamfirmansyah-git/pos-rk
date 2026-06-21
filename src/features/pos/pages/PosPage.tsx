import { ShoppingCart } from 'lucide-react'

export default function PosPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
      <ShoppingCart size={48} strokeWidth={1.5} />
      <p className="text-lg font-medium">Layar Kasir</p>
      <p className="text-sm">Segera hadir — fitur POS sedang dibangun.</p>
    </div>
  )
}
