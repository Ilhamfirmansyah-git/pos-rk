import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface StoreSettings {
  storeName: string
  storeAddress: string
  storePhone: string
  cashierName: string
  taxRate: number
  receiptHeader: string
  receiptFooter: string
}

interface SettingsState extends StoreSettings {
  update: (settings: Partial<StoreSettings>) => void
}

const DEFAULTS: StoreSettings = {
  storeName: 'Toko Saya',
  storeAddress: '',
  storePhone: '',
  cashierName: 'Kasir',
  taxRate: 0,
  receiptHeader: '',
  receiptFooter: 'Terima kasih atas kunjungan Anda!',
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      update(settings) {
        set(settings)
      },
    }),
    { name: 'pos-rk-settings' },
  ),
)
