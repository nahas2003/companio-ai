import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '../index'
import { Button } from './Button'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  position?: 'left' | 'right'
  className?: string
}

function Drawer({ open, onClose, title, children, position = 'right', className }: DrawerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const previousFocus = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (open) {
      previousFocus.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)

      // Set focus to the first focusable element inside drawer
      const focusable = containerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex="0"]',
      )
      if (focusable && focusable.length > 0) {
        setTimeout(() => (focusable[0] as HTMLElement).focus(), 50)
      }
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      if (previousFocus.current) {
        previousFocus.current.focus()
      }
    }
  }, [open, onClose])

  React.useEffect(() => {
    if (!open) return

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const elements = containerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex="0"]',
      )
      if (!elements || elements.length === 0) return

      const firstEl = elements[0] as HTMLElement
      const lastEl = elements[elements.length - 1] as HTMLElement

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          lastEl.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastEl) {
          firstEl.focus()
          e.preventDefault()
        }
      }
    }

    window.addEventListener('keydown', handleTabKey)
    return () => {
      window.removeEventListener('keydown', handleTabKey)
    }
  }, [open])

  if (!open) return null

  const isLeft = position === 'left'

  return (
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'drawer-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />
      {/* Container */}
      <div
        ref={containerRef}
        className={cn(
          'fixed top-0 bottom-0 z-10 w-full max-w-sm border-border bg-surface p-6 shadow-soft transition-transform duration-300 flex flex-col',
          isLeft
            ? 'left-0 border-r border-t-0 border-b-0 animate-slide-in-left'
            : 'right-0 border-l border-t-0 border-b-0 animate-slide-in-right',
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          {title && (
            <h3 id="drawer-title" className="text-base font-bold text-text-primary">
              {title}
            </h3>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full p-0 text-text-secondary hover:text-text-primary ml-auto"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto text-sm text-text-secondary leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}

export { Drawer }
