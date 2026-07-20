import type { DashboardStats, ActivityItem } from '../types/dashboard.types'

const SIMULATE_EMPTY_STATE = false

export const dashboardService = {
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (SIMULATE_EMPTY_STATE) {
      return {
        practiceCompleted: 0,
        assessmentsCompleted: 0,
        questionsAnswered: 0,
        accuracyRate: 0,
      }
    }

    return {
      practiceCompleted: 12,
      assessmentsCompleted: 4,
      questionsAnswered: 184,
      accuracyRate: 78.5,
    }
  },

  async getRecentActivities(userId: string): Promise<ActivityItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 900))

    if (SIMULATE_EMPTY_STATE) {
      return []
    }

    return [
      {
        id: 'act_1',
        type: 'assessment',
        title: 'Calculus I Midterm Review',
        date: '2026-07-19T14:30:00Z',
        status: 'Completed',
        details: 'Score: 18/20 (90%)',
      },
      {
        id: 'act_2',
        type: 'practice',
        title: 'Modern Physics Chapter 3',
        date: '2026-07-18T10:15:00Z',
        status: 'In Progress',
        details: '15 questions remaining',
      },
      {
        id: 'act_3',
        type: 'upload',
        title: 'Introduction to Organic Chemistry.pdf',
        date: '2026-07-17T09:00:00Z',
        status: 'Processed',
        details: 'Generated 30 flashcards',
      },
      {
        id: 'act_4',
        type: 'assessment',
        title: 'Algorithms & Data Structures Quiz',
        date: '2026-07-15T16:45:00Z',
        status: 'Completed',
        details: 'Score: 8/10 (80%)',
      },
    ]
  },
}
