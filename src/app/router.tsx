import { lazy, Suspense } from 'react'
import { createBrowserRouter, Outlet } from 'react-router-dom'
import AppLayout from '@/shared/components/layout/AppLayout'

const PosPage = lazy(() => import('@/features/pos/pages/PosPage'))
const ProductsPage = lazy(() => import('@/features/products/pages/ProductsPage'))
const TransactionsPage = lazy(() => import('@/features/transactions/pages/TransactionsPage'))
const InventoryPage = lazy(() => import('@/features/inventory/pages/InventoryPage'))
const ReportsPage = lazy(() => import('@/features/reports/pages/ReportsPage'))
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'))

function PageFallback() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppLayout>
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </AppLayout>
    ),
    children: [
      { index: true, element: <PosPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])
