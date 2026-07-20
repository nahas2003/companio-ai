import * as React from 'react'
import { cn } from '../index'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  fallback?: string
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = '', fallback = 'U', ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false)

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface-secondary border border-border items-center justify-center text-sm font-bold text-text-primary select-none',
          className,
        )}
        {...props}
      >
        {src && !hasError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            className="aspect-square h-full w-full object-cover"
          />
        ) : (
          <span className="uppercase text-text-secondary">{fallback.substring(0, 2)}</span>
        )}
      </div>
    )
  },
)
Avatar.displayName = 'Avatar'

export { Avatar }
