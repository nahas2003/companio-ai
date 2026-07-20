import * as React from 'react'
import { cn } from '../index'

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, collapsed = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'h-screen sticky top-0 border-r border-border bg-surface flex flex-col transition-all duration-300 z-30',
          collapsed ? 'w-16' : 'w-64',
          className,
        )}
        {...props}
      />
    )
  },
)
Sidebar.displayName = 'Sidebar'

export { Sidebar }
