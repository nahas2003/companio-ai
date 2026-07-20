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
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />
      {/* Container */}
      <div
        className={cn(
          'relative w-full max-w-lg rounded-large border border-border bg-surface p-6 shadow-soft transition-all duration-300 animate-fade-in z-10 flex flex-col',
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          {title && <h3 className="text-base font-bold text-text-primary">{title}</h3>}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full p-0 text-text-secondary hover:text-text-primary ml-auto"
            onClick={onClose}
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
