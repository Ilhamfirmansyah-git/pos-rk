import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, Loader2, Wifi, WifiOff } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { useSettingsStore } from '../store/useSettingsStore'
import type { StoreSettings } from '../store/useSettingsStore'
import { supabase } from '@/lib/supabase'
import type * as React from 'react'

const settingsSchema = z.object({
  storeName: z.string().min(1, 'Nama toko wajib diisi').max(100),
  storeAddress: z.string().max(200).optional().or(z.literal('')),
  storePhone: z.string().max(20).optional().or(z.literal('')),
  cashierName: z.string().min(1, 'Nama kasir wajib diisi').max(50),
  taxRate: z.coerce.number().min(0, 'Tidak boleh negatif').max(100, 'Maks 100%'),
  receiptHeader: z.string().max(200).optional().or(z.literal('')),
  receiptFooter: z.string().max(200).optional().or(z.literal('')),
})

type SettingsFormData = z.infer<typeof settingsSchema>

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

type TestStatus = 'idle' | 'loading' | 'success' | 'error'

function SupabaseConnectionTest() {
  const [status, setStatus] = useState<TestStatus>('idle')
  const [message, setMessage] = useState('')

  async function runTest() {
    setStatus('loading')
    setMessage('')
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({ name: 'Contoh Kategori', description: 'Tes koneksi Supabase', sort_order: 0 })
        .select('id, name')
        .single()

      if (error) throw error

      setStatus('success')
      setMessage(
        `Berhasil! Kategori "${data.name}" tersimpan (id: ${String(data.id).slice(0, 8)}…)`,
      )
    } catch (e) {
      setStatus('error')
      setMessage(e instanceof Error ? e.message : 'Koneksi gagal')
    }
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        onClick={() => void runTest()}
        disabled={status === 'loading'}
      >
        {status === 'loading' && <Loader2 size={15} className="animate-spin" />}
        {status === 'idle' && <Wifi size={15} />}
        {status === 'success' && <Wifi size={15} className="text-green-600" />}
        {status === 'error' && <WifiOff size={15} className="text-destructive" />}
        Tes Koneksi Supabase
      </Button>

      {status === 'success' && (
        <p className="flex items-center gap-1.5 text-sm text-green-600">
          <CheckCircle2 size={14} />
          {message}
        </p>
      )}
      {status === 'error' && (
        <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <p className="font-medium">Koneksi gagal</p>
          <p className="mt-0.5 text-xs opacity-80">{message}</p>
        </div>
      )}
    </div>
  )
}

export default function SettingsPage() {
  const settings = useSettingsStore()
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings as StoreSettings,
  })

  useEffect(() => {
    reset(settings as StoreSettings)
  }, [reset, settings])

  function onSubmit(data: SettingsFormData) {
    settings.update(data as StoreSettings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Pengaturan</h1>
        {saved && (
          <div className="flex items-center gap-1.5 text-sm text-green-600">
            <CheckCircle2 size={16} />
            <span>Tersimpan</span>
          </div>
        )}
      </div>

      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="max-w-lg space-y-5">
        <Section title="Informasi Toko">
          <Field id="storeName" label="Nama Toko" error={errors.storeName?.message}>
            <Input id="storeName" placeholder="Toko Saya" {...register('storeName')} />
          </Field>
          <Field id="storeAddress" label="Alamat" error={errors.storeAddress?.message}>
            <Input id="storeAddress" placeholder="Jl. Contoh No. 1" {...register('storeAddress')} />
          </Field>
          <Field id="storePhone" label="Nomor Telepon" error={errors.storePhone?.message}>
            <Input id="storePhone" placeholder="08xxxxxxxxxx" {...register('storePhone')} />
          </Field>
        </Section>

        <Section title="Pengaturan Kasir">
          <Field
            id="cashierName"
            label="Nama Kasir Default"
            hint="Nama yang tercetak di struk jika tidak ada login kasir"
            error={errors.cashierName?.message}
          >
            <Input id="cashierName" placeholder="Kasir" {...register('cashierName')} />
          </Field>
          <Field
            id="taxRate"
            label="Pajak (%)"
            hint="Masukkan 0 jika tidak ada pajak. Contoh: 11 untuk PPN 11%"
            error={errors.taxRate?.message}
          >
            <Input
              id="taxRate"
              type="number"
              min={0}
              max={100}
              step={0.5}
              {...register('taxRate')}
            />
          </Field>
        </Section>

        <Section title="Pengaturan Struk">
          <Field
            id="receiptHeader"
            label="Teks Header Struk"
            hint="Teks yang muncul di bagian atas struk"
            error={errors.receiptHeader?.message}
          >
            <Input
              id="receiptHeader"
              placeholder="mis. Selamat datang!"
              {...register('receiptHeader')}
            />
          </Field>
          <Field
            id="receiptFooter"
            label="Teks Footer Struk"
            hint="Teks yang muncul di bagian bawah struk"
            error={errors.receiptFooter?.message}
          >
            <Input
              id="receiptFooter"
              placeholder="Terima kasih atas kunjungan Anda!"
              {...register('receiptFooter')}
            />
          </Field>
        </Section>

        <div className="flex gap-3">
          <Button type="submit" disabled={!isDirty}>
            Simpan Pengaturan
          </Button>
          {isDirty && (
            <Button type="button" variant="outline" onClick={() => reset()}>
              Reset
            </Button>
          )}
        </div>
      </form>

      <div className="mt-5 max-w-lg">
        <Section title="Tes Koneksi Supabase">
          <p className="text-sm text-muted-foreground">
            Klik tombol di bawah untuk insert 1 kategori contoh ke Supabase dan memverifikasi
            koneksi database berjalan.
          </p>
          <SupabaseConnectionTest />
        </Section>
      </div>
    </div>
  )
}
