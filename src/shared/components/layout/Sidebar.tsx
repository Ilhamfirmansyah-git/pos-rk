import { NavLink } from 'react-router-dom'
import { ShoppingCart, Package, Receipt, Boxes, BarChart2, Settings } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const navItems = [
  { to: '/', icon: ShoppingCart, label: 'Kasir', end: true },
  { to: '/products', icon: Package, label: 'Produk', end: false },
  { to: '/transactions', icon: Receipt, label: 'Transaksi', end: false },
  { to: '/inventory', icon: Boxes, label: 'Stok', end: false },
  { to: '/reports', icon: BarChart2, label: 'Laporan', end: false },
  { to: '/settings', icon: Settings, label: 'Pengaturan', end: false },
]

export function Sidebar() {
  return (
    <aside className="flex h-full w-16 flex-col items-center gap-1 border-r bg-white py-4 md:w-56 md:items-start md:px-3">
      <div className="mb-4 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
          RK
        </div>
        <span className="hidden text-sm font-semibold text-gray-900 md:block">POS-RK</span>
      </div>

      <nav className="flex w-full flex-col gap-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex min-h-touch items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              )
            }
          >
            <Icon size={20} className="shrink-0" />
            <span className="hidden md:block">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
