import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog'
import { useCategories, addCategory, updateCategory, deleteCategory } from '../hooks/useCategories'
import { categorySchema, type CategoryFormData } from '../types'
import type { Category } from '@/shared/types'

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryDialog({ open, onOpenChange }: CategoryDialogProps) {
  const categories = useCategories()
  const [editTarget, setEditTarget] = useState<Category | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', description: '', sortOrder: 0 },
  })

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) setShowForm(false)
    onOpenChange(newOpen)
  }

  function openAdd() {
    setEditTarget(null)
    reset({ name: '', description: '', sortOrder: categories.length })
    setError(null)
    setShowForm(true)
  }

  function openEdit(cat: Category) {
    setEditTarget(cat)
    reset({ name: cat.name, description: cat.description ?? '', sortOrder: cat.sortOrder })
    setError(null)
    setShowForm(true)
  }

  async function onSubmit(data: CategoryFormData) {
    setIsLoading(true)
    setError(null)
    try {
      if (editTarget) {
        await updateCategory(editTarget.uuid, data)
      } else {
        await addCategory(data)
      }
      setShowForm(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(cat: Category) {
    if (!confirm(`Hapus kategori "${cat.name}"?`)) return
    setError(null)
    try {
      await deleteCategory(cat.uuid)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        {!showForm ? (
          <>
            <DialogHeader>
              <DialogTitle>Kelola Kategori</DialogTitle>
            </DialogHeader>

            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="max-h-64 overflow-y-auto">
              {categories.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">Belum ada kategori</p>
              ) : (
                <ul className="space-y-1">
                  {categories.map((cat) => (
                    <li
                      key={cat.uuid}
                      className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted"
                    >
                      <span className="text-sm font-medium">{cat.name}</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(cat)}
                          aria-label={`Edit kategori ${cat.name}`}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => void handleDelete(cat)}
                          aria-label={`Hapus kategori ${cat.name}`}
                        >
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Button onClick={openAdd} className="w-full" variant="outline">
              <Plus size={16} />
              Tambah Kategori
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{editTarget ? 'Edit Kategori' : 'Tambah Kategori'}</DialogTitle>
            </DialogHeader>

            <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} noValidate className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="cat-name">Nama Kategori</Label>
                <Input id="cat-name" placeholder="mis. Minuman, Makanan" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="cat-desc">Deskripsi (opsional)</Label>
                <Input id="cat-desc" placeholder="Deskripsi singkat" {...register('description')} />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
