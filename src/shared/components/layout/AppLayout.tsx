import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-auto">{children}</main>
    </div>
  )
}
