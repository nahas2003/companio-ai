import * as React from 'react'
import { cn } from '../index'

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  glass?: boolean
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ className, glass = true, ...props }, ref) => {
    const [scrolled, setScrolled] = React.useState(false)

    React.useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 10)
      }
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
      <header
        ref={ref}
        className={cn(
          'w-full sticky top-0 z-40 border-b border-border bg-surface transition-all duration-200 h-[72px]',
          glass && 'bg-surface/80 backdrop-blur-md',
          scrolled && 'shadow-sm bg-surface',
          className,
        )}
        {...props}
      />
    )
  },
)
Navbar.displayName = 'Navbar'

export { Navbar }
