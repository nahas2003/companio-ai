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
    version: '2.0',
    description: 'Generates structured MCQ, True/False, or Short Answer evaluation questions.',
    template:
      'You are an expert academic evaluator. Extract knowledge from the provided source text and generate exactly {{count}} {{type}} questions. The difficulty level must be {{difficulty}}.\n\nCRITICAL: Output ONLY the raw JSON array. Do not include any introductory/concluding text, markdown blocks, or other conversational filler. Keep question titles and options clear and concise.\n\nReturn the output STRICTLY as a JSON array of question objects matching this structure:\n- If type is MULTIPLE_CHOICE: { "title": "...", "options": ["Option A", "Option B", "Option C", "Option D"], "correctAnswer": 0 } (0-indexed index of correct option)\n- If type is TRUE_FALSE: { "title": "...", "options": ["True", "False"], "correctAnswer": 0 } (0 for True, 1 for False)\n- If type is SHORT_ANSWER: { "title": "...", "modelAnswer": "..." }\n\nTEXT:\n{{documentText}}',
  },
  TOPIC_QUESTION_GENERATION: {
    name: 'TOPIC_QUESTION_GENERATION',
    version: '1.0',
    description: 'Generates structured questions from a topic subject.',
    template:
      'You are an expert academic evaluator. Create exactly {{count}} {{type}} questions covering the topic: "{{topic}}". The difficulty level must be {{difficulty}}.\n{{bloomLevelPrompt}}{{languagePrompt}}{{customInstructionsPrompt}}\n\nCRITICAL: Output ONLY the raw JSON array. Do not include any introductory/concluding text, markdown blocks, or other conversational filler. Keep question titles and options clear and concise.\n\nReturn the output STRICTLY as a JSON array of question objects matching this structure:\n- If type is MULTIPLE_CHOICE: { "title": "...", "options": ["Option A", "Option B", "Option C", "Option D"], "correctAnswer": 0 } (0-indexed index of correct option)\n- If type is TRUE_FALSE: { "title": "...", "options": ["True", "False"], "correctAnswer": 0 } (0 for True, 1 for False)\n- If type is SHORT_ANSWER: { "title": "...", "modelAnswer": "..." }',
  },
  DESCRIPTION_QUESTION_GENERATION: {
    name: 'DESCRIPTION_QUESTION_GENERATION',
    version: '1.0',
    description: 'Generates structured questions based on a description prompt.',
    template:
      'You are an expert academic evaluator. Generate exactly {{count}} {{type}} questions by interpreting and following this description:\n\nDESCRIPTION:\n{{description}}\n\nThe difficulty level must be {{difficulty}}.\n{{languagePrompt}}\n\nCRITICAL: Output ONLY the raw JSON array. Do not include any introductory/concluding text, markdown blocks, or other conversational filler. Keep question titles and options clear and concise.\n\nReturn the output STRICTLY as a JSON array of question objects matching this structure:\n- If type is MULTIPLE_CHOICE: { "title": "...", "options": ["Option A", "Option B", "Option C", "Option D"], "correctAnswer": 0 } (0-indexed index of correct option)\n- If type is TRUE_FALSE: { "title": "...", "options": ["True", "False"], "correctAnswer": 0 } (0 for True, 1 for False)\n- If type is SHORT_ANSWER: { "title": "...", "modelAnswer": "..." }',
  },
  SINGLE_QUESTION_REGENERATION: {
    name: 'SINGLE_QUESTION_REGENERATION',
    version: '1.0',
    description: 'Generates a single replacement question avoiding a set of existing titles.',
    template:
      'You are an expert academic evaluator. Generate exactly 1 {{type}} question. The difficulty level must be {{difficulty}}.\n\nContext details:\n{{contextPrompt}}\n\nCRITICAL: Do NOT generate any questions matching or similar to these existing titles:\n{{existingTitles}}\n\nReturn the output STRICTLY as a single JSON object matching this structure:\n- If type is MULTIPLE_CHOICE: { "title": "...", "options": ["Option A", "Option B", "Option C", "Option D"], "correctAnswer": 0 }\n- If type is TRUE_FALSE: { "title": "...", "options": ["True", "False"], "correctAnswer": 0 }\n- If type is SHORT_ANSWER: { "title": "...", "modelAnswer": "..." }\n\nDo not return any markdown wrapper code. Respond only with valid parseable JSON object.',
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
