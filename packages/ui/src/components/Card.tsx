import * as React from 'react'
import { cn } from '../index'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-large border border-border bg-surface text-text-primary shadow-soft p-cardPadding transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01]',
        className,
      )}
      {...props}
    />
  ),
)
Card.displayName = 'Card'

export { Card }
