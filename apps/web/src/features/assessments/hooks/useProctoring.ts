'use client'

import * as React from 'react'

export interface ViolationItem {
  timestamp: number
  type: 'TAB_BLUR' | 'SCREEN_EXIT' | 'KEYBOARD_SHORTCUT' | 'CLIPBOARD_PASTE' | 'WEBCAM_DISCONNECT'
  details: string
}

export interface UseProctoringOptions {
  enabled?: boolean
  attemptId: string
  onViolation?: (violation: ViolationItem) => void
}

export function useProctoring({ enabled = true, attemptId, onViolation }: UseProctoringOptions) {
  const [blurCount, setBlurCount] = React.useState(0)
  const [isFocused, setIsFocused] = React.useState(true)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [warningMessage, setWarningMessage] = React.useState<string | null>(null)
  const [isMonitoring, setIsMonitoring] = React.useState(enabled)

  // Clear warning state helper
  const clearWarning = React.useCallback(() => {
    setWarningMessage(null)
  }, [])

  // Start monitoring handler
  const startMonitoring = React.useCallback(() => {
    setIsMonitoring(true)
  }, [])

  // Stop monitoring handler
  const stopMonitoring = React.useCallback(() => {
    setIsMonitoring(false)
  }, [])

  // 1. Tab Focus/Blur Monitors
  React.useEffect(() => {
    if (!isMonitoring) return

    const handleBlur = () => {
      setIsFocused(false)
      setBlurCount((prev) => {
        const next = prev + 1
        const violation: ViolationItem = {
          timestamp: Date.now(),
          type: 'TAB_BLUR',
          details: `Candidate switched tab or window (Count: ${next})`,
        }
        setWarningMessage(
          `Tab Switch Detected: Please keep focus on the exam window. Violation Count: ${next}`,
        )
        if (onViolation) {
          onViolation(violation)
        }
        return next
      })
    }

    const handleFocus = () => {
      setIsFocused(true)
    }

    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
    }
  }, [isMonitoring, onViolation])

  // 2. BeforeUnload Page Navigation Blocker
  React.useEffect(() => {
    if (!isMonitoring) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue =
        'Warning: Leaving or reloading this page will submit your exam. Are you sure you want to exit?'
      return e.returnValue
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isMonitoring])

  // Placeholder triggers for future features
  const startFullscreen = React.useCallback(async () => {
    console.log('Fullscreen monitoring interface placeholder for attempt:', attemptId)
    setIsFullscreen(true)
  }, [attemptId])

  const stopFullscreen = React.useCallback(() => {
    setIsFullscreen(false)
  }, [])

  return {
    blurCount,
    isFocused,
    isFullscreen,
    warningMessage,
    clearWarning,
    startMonitoring,
    stopMonitoring,

    // Future architectural hooks slots (placeholders)
    startFullscreen,
    stopFullscreen,
    isWebcamActive: false,
    isClipboardAccessGranted: false,
    warningLevel: blurCount >= 3 ? 'critical' : blurCount >= 1 ? 'warning' : 'none',
  }
}
