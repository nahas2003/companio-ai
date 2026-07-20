import * as React from 'react'
import { Card } from './Card'
import { cn } from '../index'

export interface StatisticsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
}

function StatisticsCard({
  title,
  value,
  description,
  icon,
  className,
  ...props
}: StatisticsCardProps) {
  return (
    <Card className={cn('p-5 flex flex-col justify-between min-h-[140px]', className)} {...props}>
      <div className="flex items-start justify-between">
        <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">
          {title}
        </span>
        {icon && (
          <div className="text-text-secondary w-5 h-5 flex items-center justify-center">{icon}</div>
        )}
      </div>
      <div className="mt-3">
        <div className="text-3xl font-extrabold text-text-primary tracking-tight">{value}</div>
        {description && <p className="text-[10px] text-text-secondary mt-1">{description}</p>}
      </div>
    </Card>
  )
}

export { StatisticsCard }
