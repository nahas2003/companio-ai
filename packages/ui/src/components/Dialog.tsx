import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '../index'
import { Button } from './Button'

export interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

function Dialog({ open, onClose, title, children, className }: DialogProps) {
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

      // Set focus to the first focusable element inside dialog
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'dialog-title' : undefined}
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
          'relative w-full max-w-lg rounded-large border border-border bg-surface p-6 shadow-soft transition-all duration-300 animate-fade-in z-10 flex flex-col',
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          {title && (
            <h3 id="dialog-title" className="text-base font-bold text-text-primary">
              {title}
            </h3>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full p-0 text-text-secondary hover:text-text-primary ml-auto"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 text-sm text-text-secondary leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

export { Dialog }
