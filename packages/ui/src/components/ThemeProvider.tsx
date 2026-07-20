'use client'

import * as React from 'react'

export type Theme = 'light' | 'dark' | 'system'

export interface ThemeProviderContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  systemTheme: 'light' | 'dark'
}

const ThemeContext = React.createContext<ThemeProviderContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'companio-theme',
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [systemTheme, setSystemTheme] = React.useState<'light' | 'dark'>('light')

  // Resolve system preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  // Load from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem(storageKey) as Theme | null
    if (saved) {
      setThemeState(saved)
    }
    setSystemTheme(getSystemTheme())
  }, [storageKey])

  // Apply theme classes to <html>
  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    const activeTheme = theme === 'system' ? getSystemTheme() : theme
    root.classList.add(activeTheme)

    // Listen for media changes if theme is system
    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)')
      const listener = (e: MediaQueryListEvent) => {
        root.classList.remove('light', 'dark')
        root.classList.add(e.matches ? 'dark' : 'light')
        setSystemTheme(e.matches ? 'dark' : 'light')
      }
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    }
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme)
    setThemeState(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, systemTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
