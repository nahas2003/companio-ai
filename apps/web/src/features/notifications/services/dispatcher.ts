import { triggerNotification } from '../../../../app/actions/notifications'

export const notificationDispatcher = {
  async sendWelcomeNotification(userId: string) {
    return triggerNotification(userId, {
      title: 'Welcome to Companio AI!',
      message:
        'Your personal dashboard is active. You can now upload study notes to build graded practices.',
      type: 'WELCOME',
    })
  },

  async sendAssessmentCompleted(
    userId: string,
    payload: { attemptId: string; title: string; score: number },
  ) {
    return triggerNotification(userId, {
      title: 'Exam attempt completed',
      message: `Your attempt on "${payload.title}" has been graded with a score of ${Math.round(payload.score)}%.`,
      type: 'ASSESSMENT_COMPLETED',
    })
  },

  async sendProcessingCompleted(
    userId: string,
    payload: { sourceId: string; fileName: string; success: boolean; errorMsg?: string },
  ) {
    return triggerNotification(userId, {
      title: payload.success ? 'Document processing complete' : 'Document processing failed',
      message: payload.success
        ? `Your uploaded notes file "${payload.fileName}" was parsed successfully and is ready to generate quizzes.`
        : `Failed to parse document "${payload.fileName}": ${payload.errorMsg || 'Unknown parsing exception'}.`,
      type: payload.success ? 'RESULTS_AVAILABLE' : 'SYSTEM',
    })
  },

  async sendSystemAlert(userId: string, title: string, message: string) {
    return triggerNotification(userId, {
      title,
      message,
      type: 'SYSTEM',
    })
  },
}
