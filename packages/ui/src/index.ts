import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export * from './components/Button'
export * from './components/Card'
export * from './components/Input'
export * from './components/Badge'
export * from './components/Avatar'
export * from './components/Dialog'
export * from './components/Drawer'
export * from './components/Navbar'
export * from './components/Sidebar'
export * from './components/Footer'
export * from './components/StatisticsCard'
export * from './components/FeatureCard'
export * from './components/AssessmentCard'
export * from './components/EmptyState'
export * from './components/SkeletonLoader'
export * from './components/ThemeProvider'
export * from './components/ThemeToggle'
