import { useEffect } from 'react'
import { useCartStore } from '../store/useCartStore'
import { useSettingsStore } from '@/features/settings/store/useSettingsStore'
import { ProductGrid } from '../components/ProductGrid'
import { Cart } from '../components/Cart'

export default function PosPage() {
  const addItem = useCartStore((state) => state.addItem)
  const setTaxRate = useCartStore((state) => state.setTaxRate)
  const taxRate = useSettingsStore((state) => state.taxRate)

  useEffect(() => {
    setTaxRate(taxRate / 100)
  }, [setTaxRate, taxRate])

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 overflow-hidden p-4">
        <ProductGrid onAdd={addItem} />
      </div>

      <div className="w-80 shrink-0 overflow-hidden lg:w-96">
        <Cart />
      </div>
    </div>
  )
}
