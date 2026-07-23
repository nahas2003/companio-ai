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
    if (typeof global !== 'undefined') {
      if (!(global as any).DOMMatrix) {
        (global as any).DOMMatrix = class DOMMatrix {
          a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
          constructor() {}
          toString() {
            return `matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.e}, ${this.f})`;
          }
        };
      }
      if (!(global as any).DOMPoint) {
        (global as any).DOMPoint = class DOMPoint {
          x = 0; y = 0; z = 0; w = 1;
          constructor() {}
        };
      }
      if (!(global as any).DOMRect) {
        (global as any).DOMRect = class DOMRect {
          x = 0; y = 0; width = 0; height = 0;
          constructor() {}
        };
      }
    }
    if (typeof module !== 'undefined' && !module.parent) {
      module.parent = { id: 'main' } as any
    }
    const pdfModule = require('pdf-parse')
    const uint8Array = new Uint8Array(fileBuffer)
    const parser = new pdfModule.PDFParse(uint8Array)
    const data = await parser.getText()
    rawText = data.text || ''
    pageCount = data.total || null
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
