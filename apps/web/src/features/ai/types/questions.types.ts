export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'
export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER'

export interface GeneratedQuestion {
  title: string
  options?: string[]
  correctAnswer?: number
  modelAnswer?: string
}

export interface GenerationSettings {
  sourceId: string
  count: number
  type: QuestionType
  difficulty: Difficulty
}
