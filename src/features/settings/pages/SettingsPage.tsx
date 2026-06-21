import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
      <Settings size={48} strokeWidth={1.5} />
      <p className="text-lg font-medium">Pengaturan</p>
      <p className="text-sm">Segera hadir — fitur pengaturan sedang dibangun.</p>
    </div>
  )
}
