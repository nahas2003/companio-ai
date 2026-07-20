import * as React from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { cn } from '../index'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
}

function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <Card
      className={cn(
        'p-12 text-center flex flex-col items-center justify-center space-y-5 bg-surface-secondary border-dashed border-2',
        className,
      )}
      {...props}
    >
      {icon && (
        <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center text-text-secondary">
          {icon}
        </div>
      )}
      <div className="space-y-1.5 max-w-sm">
        <h4 className="text-sm font-bold text-text-primary">{title}</h4>
        <p className="text-xs text-text-secondary leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="rounded-medium font-bold">
          {actionLabel}
        </Button>
      )}
    </Card>
  )
}

export { EmptyState }
