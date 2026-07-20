import * as React from 'react'
import { Card } from './Card'
import { Badge } from './Badge'
import { Button } from './Button'
import { Clock, Users, ArrowRight, Share2 } from 'lucide-react'
import { cn } from '../index'

export interface AssessmentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  code: string
  status: 'draft' | 'published' | 'expired'
  questionCount: number
  attemptsCount: number
  onShare?: () => void
  onAction?: () => void
  actionLabel?: string
}

function AssessmentCard({
  title,
  code,
  status,
  questionCount,
  attemptsCount,
  onShare,
  onAction,
  actionLabel = 'Manage',
  className,
  ...props
}: AssessmentCardProps) {
  const getStatusVariant = () => {
    switch (status) {
      case 'published':
        return 'success'
      case 'expired':
        return 'danger'
      default:
        return 'warning'
    }
  }

  return (
    <Card
      className={cn('p-6 text-left flex flex-col justify-between h-full space-y-4', className)}
      {...props}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold tracking-wider text-primary">{code}</span>
          <Badge variant={getStatusVariant()} className="capitalize">
            {status}
          </Badge>
        </div>
        <h3 className="text-base font-bold text-text-primary line-clamp-1">{title}</h3>
      </div>

      <div className="flex items-center gap-4 text-xs text-text-secondary border-t border-border pt-4">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>{questionCount} Questions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          <span>{attemptsCount} Attempts</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        {onShare && (
          <Button
            variant="outline"
            size="icon"
            onClick={onShare}
            className="h-9 w-9 rounded-medium"
          >
            <Share2 className="w-4 h-4 text-text-secondary" />
          </Button>
        )}
        {onAction && (
          <Button
            onClick={onAction}
            className="flex-1 h-9 text-xs rounded-medium flex items-center justify-center gap-1.5"
          >
            {actionLabel} <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </Card>
  )
}

export { AssessmentCard }
