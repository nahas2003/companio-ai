import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Companio - AI Assessment & Practice Platform',
  description: 'Generate assessments, practice sessions, and track results with AI.',
}

import { AuthInitializer } from '@/components/AuthInitializer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        <AuthInitializer>{children}</AuthInitializer>
      </body>
    </html>
  )
}
