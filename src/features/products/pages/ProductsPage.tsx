import { useState } from 'react'
import { Plus, Tags } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { ProductList } from '../components/ProductList'
import { ProductForm } from '../components/ProductForm'
import { CategoryDialog } from '../components/CategoryDialog'
import type { Product } from '@/shared/types'

export default function ProductsPage() {
  const [productFormOpen, setProductFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)

  function handleEdit(product: Product) {
    setEditProduct(product)
    setProductFormOpen(true)
  }

  function handleAddNew() {
    setEditProduct(null)
    setProductFormOpen(true)
  }

  function handleFormClose(open: boolean) {
    setProductFormOpen(open)
    if (!open) setEditProduct(null)
  }

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Manajemen Produk</h1>
          <p className="text-sm text-muted-foreground">Kelola produk dan kategori toko Anda</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCategoryDialogOpen(true)}>
            <Tags size={16} />
            <span className="hidden sm:inline">Kategori</span>
          </Button>
          <Button onClick={handleAddNew}>
            <Plus size={16} />
            <span className="hidden sm:inline">Tambah Produk</span>
          </Button>
        </div>
      </div>

      <ProductList onEdit={handleEdit} />

      <ProductForm
        open={productFormOpen}
        onOpenChange={handleFormClose}
        editProduct={editProduct}
      />

      <CategoryDialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen} />
    </div>
  )
}
