import * as React from 'react'
import { Card } from './Card'
import { cn } from '../index'

export interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  icon?: React.ReactNode
}

function FeatureCard({ title, description, icon, className, ...props }: FeatureCardProps) {
  return (
    <Card
      className={cn(
        'p-8 bg-surface-secondary border-border hover:border-primary/20 hover:shadow-soft transition duration-200 text-left flex flex-col justify-between h-full',
        className,
      )}
      {...props}
    >
      <div>
        {icon && (
          <div className="w-10 h-10 rounded-medium bg-primary/10 text-primary flex items-center justify-center mb-6">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary text-xs leading-relaxed">{description}</p>
      </div>
    </Card>
  )
}

export { FeatureCard }
