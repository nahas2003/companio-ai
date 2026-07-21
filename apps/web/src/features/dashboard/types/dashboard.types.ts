export interface DashboardStats {
  practiceCompleted: number
  assessmentsCompleted: number
  questionsAnswered: number
  accuracyRate: number
  aiRequests?: number
  aiTotalTokens?: number
}

export interface ActivityItem {
  id: string
  type: 'upload' | 'practice' | 'assessment'
  title: string
  date: string
  status: string
  details?: string
}
