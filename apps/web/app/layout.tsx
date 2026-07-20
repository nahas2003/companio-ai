import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '@companio/ui'

export const metadata: Metadata = {
  title: 'Companio - AI Assessment & Practice Platform',
  description: 'Generate assessments, practice sessions, and track results with AI.',
}

import { AuthInitializer } from '@/components/AuthInitializer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('companio-theme');
                  var isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-background text-text-primary">
        <ThemeProvider>
          <AuthInitializer>{children}</AuthInitializer>
        </ThemeProvider>
      </body>
    </html>
  )
}
