import mammoth from 'mammoth'

export interface ParsedDocument {
  content: string
  wordCount: number
  pageCount: number | null
}

export async function parseDocument(
  fileBuffer: Buffer,
  fileExtension: string,
): Promise<ParsedDocument> {
  const ext = fileExtension.toLowerCase()

  let rawText = ''
  let pageCount: number | null = null

  if (ext === 'txt' || ext === 'md') {
    rawText = fileBuffer.toString('utf-8')
  } else if (ext === 'pdf') {
    if (typeof module !== 'undefined' && !module.parent) {
      module.parent = { id: 'main' } as any
    }
    const pdf = require('pdf-parse')
    const data = await pdf(fileBuffer)
    rawText = data.text || ''
    pageCount = data.numpages || null
  } else if (ext === 'docx') {
    const result = await mammoth.extractRawText({ buffer: fileBuffer })
    rawText = result.value || ''
  } else {
    throw new Error(`Unsupported document extension: .${fileExtension}`)
  }

  const normalizedContent = rawText
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line, index, arr) => line !== '' || (index > 0 && arr[index - 1] !== ''))
    .join('\n')
    .trim()

  const wordCount = normalizedContent.split(/\s+/).filter((word) => word.length > 0).length

  if (!normalizedContent) {
    throw new Error('Document does not contain any readable text.')
  }

  return {
    content: normalizedContent,
    wordCount,
    pageCount,
  }
}
