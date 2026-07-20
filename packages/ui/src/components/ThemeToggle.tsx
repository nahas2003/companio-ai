'use client'

import * as React from 'react'
import { Sun, Moon, Laptop } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { Button } from './Button'
import { cn } from '../index'

export interface ThemeToggleProps {
  className?: string
}

function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className={cn(
        'relative h-9 w-9 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition duration-200 focus-visible:ring-1 focus-visible:ring-primary',
        className,
      )}
      title={`Current theme: ${theme} (Click to toggle)`}
      aria-label="Toggle theme"
    >
      <Sun
        className={cn(
          'h-4.5 w-4.5 absolute transition-all duration-300 transform',
          theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50',
        )}
      />
      <Moon
        className={cn(
          'h-4.5 w-4.5 absolute transition-all duration-300 transform',
          theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50',
        )}
      />
      <Laptop
        className={cn(
          'h-4.5 w-4.5 absolute transition-all duration-300 transform',
          theme === 'system' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-50',
        )}
      />
    </Button>
  )
}

export { ThemeToggle }
