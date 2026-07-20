import * as React from 'react'
import { cn } from '../index'

export interface SkeletonLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle'
}

function SkeletonLoader({ variant = 'rect', className, ...props }: SkeletonLoaderProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-surface-secondary/60 border border-border/10',
        variant === 'text' && 'h-4 w-full rounded-small',
        variant === 'rect' && 'h-24 w-full rounded-medium',
        variant === 'circle' && 'h-12 w-12 rounded-full',
        className,
      )}
      {...props}
    />
  )
}

export { SkeletonLoader }
