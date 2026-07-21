'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function Telemetry() {
  useReportWebVitals((metric) => {
    // Log FCP and LCP web vitals telemetry values
    if (metric.name === 'FCP' || metric.name === 'LCP') {
      console.log(
        `[Telemetry Vitals] ${metric.name}: ${Math.round(metric.value)}ms (Rating: ${metric.rating})`,
      )
    }
  })

  return null
}
