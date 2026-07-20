'use client'

import * as React from 'react'
import { AuthGuard } from '@/features/auth/components/AuthGuard'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-background text-text-primary">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <Header setMobileOpen={setMobileOpen} />

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6 md:p-8">
            <div className="max-w-7xl mx-auto w-full">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
