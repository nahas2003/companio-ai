'use client'

import * as React from 'react'
import { Sun, Moon, Laptop, Check } from 'lucide-react'
import { useTheme, Theme } from './ThemeProvider'
import { Button } from './Button'
import { cn } from '../index'

export interface ThemeToggleProps {
  className?: string
}

function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const options: {
    value: Theme
    label: string
    icon: React.ComponentType<{ className?: string }>
  }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Laptop },
  ]

  const ActiveIcon = React.useMemo(() => {
    if (theme === 'light') return Sun
    if (theme === 'dark') return Moon
    return Laptop
  }, [theme])

  return (
    <div ref={containerRef} className={cn('relative inline-block text-left', className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        className="h-9 w-9 rounded-medium text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition duration-200 focus-visible:ring-1 focus-visible:ring-primary"
        title="Choose Theme"
        aria-label="Choose Theme"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <ActiveIcon className="h-[18px] w-[18px] transition-all" />
      </Button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-36 origin-top-right rounded-medium border border-border bg-surface p-1 shadow-soft z-50 animate-fade-in focus:outline-none"
          role="menu"
        >
          <div className="space-y-0.5">
            {options.map((opt) => {
              const Icon = opt.icon
              const isActive = theme === opt.value
              return (
                <button
                  key={opt.value}
                  role="menuitem"
                  onClick={() => {
                    setTheme(opt.value)
                    setOpen(false)
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-2.5 py-1.5 rounded-small text-left text-xs font-semibold transition duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{opt.label}</span>
                  </div>
                  {isActive && <Check className="h-3.5 w-3.5" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export { ThemeToggle }
