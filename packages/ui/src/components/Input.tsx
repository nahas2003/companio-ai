import * as React from 'react'
import { cn } from '../index'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, helperText, ...props }, ref) => {
    return (
      <div className="w-full space-y-1 text-left">
        <input
          type={type}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-medium border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder-text-secondary shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-danger focus-visible:ring-danger',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs font-semibold text-danger">{error}</p>}
        {!error && helperText && <p className="text-xs text-text-secondary">{helperText}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
