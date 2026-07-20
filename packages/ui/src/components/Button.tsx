import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../index'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-medium text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary-hover shadow-sm',
        destructive: 'bg-danger text-white hover:bg-danger/90 shadow-sm',
        outline: 'border border-border bg-transparent hover:bg-surface-secondary text-text-primary',
        secondary: 'bg-secondary text-text-primary hover:bg-secondary/80',
        ghost: 'hover:bg-surface-secondary text-text-primary',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-small px-3 text-xs',
        lg: 'h-11 rounded-large px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
