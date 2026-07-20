import type { PromptTemplate } from '../types/ai.types'

export const promptTemplates: Record<string, PromptTemplate> = {
  DIAGNOSTIC_TEST: {
    name: 'DIAGNOSTIC_TEST',
    version: '1.0',
    description: 'Runs a basic network loop-back health check connection.',
    template:
      "Hello AI! Please reply with a valid JSON containing status: 'OK', provider: '{{provider}}', and message: 'Hello from Companio AI!'.",
  },
  DOCUMENT_SUMMARY: {
    name: 'DOCUMENT_SUMMARY',
    version: '1.0',
    description: 'Summarizes extracted document texts.',
    template:
      'Review the following text and summarize the key concepts in a concise markdown bullet list.\n\nTEXT:\n{{documentText}}',
  },
  QUESTION_GENERATION: {
    name: 'QUESTION_GENERATION',
    version: '1.0',
    description: 'Generates multiple-choice quiz questions from study materials.',
    template:
      'You are a professional educational assessor. Generate {{count}} multiple choice questions based on the following text. The response must be a JSON array of questions carrying title, options, and correctAnswer index.\n\nTEXT:\n{{documentText}}',
  },
}

export function compilePrompt(
  templateName: string,
  variables: Record<string, string>,
): { prompt: string; version: string } {
  const templateObj = promptTemplates[templateName]
  if (!templateObj) {
    throw new Error(`Prompt template '${templateName}' does not exist in prompt registry.`)
  }

  let prompt = templateObj.template
  for (const [key, value] of Object.entries(variables)) {
    prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value)
  }

  return {
    prompt,
    version: templateObj.version,
  }
}
