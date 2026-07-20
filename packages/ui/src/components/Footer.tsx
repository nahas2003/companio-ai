import * as React from 'react'
import { cn } from '../index'

const Footer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <footer
        ref={ref}
        className={cn(
          'w-full border-t border-border bg-surface-secondary py-12 text-xs text-text-secondary select-none',
          className,
        )}
        {...props}
      />
    )
  },
)
Footer.displayName = 'Footer'

export { Footer }
