# 13_AI_CONTENT_PROCESSING.md

> **Project:** Companio
> **Document:** AI Content Processing
> **Version:** 1.0 (MVP)
> **Priority:** High
> **Depends On:** 00–12

---

# 1. Purpose

This document defines the complete AI content processing pipeline used by Companio.

It covers everything from receiving learning material to producing validated, reusable learning assets.

The AI pipeline is provider-independent and follows the AI Architecture defined in `09_AI_ARCHITECTURE.md`.

---

# 2. Objectives

The pipeline should:

- Produce high-quality questions.
- Reuse previous work whenever possible.
- Minimize AI costs.
- Validate AI responses.
- Support future AI-generated learning resources.

---

# 3. Supported Input Types

MVP:

- Topic
- PDF
- Notes

Future:

- DOCX
- PPTX
- Markdown
- URL
- YouTube transcript
- Web page

---

# 4. Processing Pipeline

```text
Receive Source
      │
      ▼
Validate Input
      │
      ▼
Extract Text
      │
      ▼
Normalize Text
      │
      ▼
Generate Source Hash
      │
      ▼
Check Cache
      │
 ┌────┴────┐
 │         │
Hit       Miss
 │         │
 ▼         ▼
Return   Chunk Content
               │
               ▼
      Build Prompt
               ▼
      AI Orchestrator
               ▼
      Validate Output
               ▼
     Normalize Questions
               ▼
     Store Question Bank
               ▼
      Return Results
```

---

# 5. Input Validation

Before processing:

Validate:

- File type
- File size
- Empty input
- Text length
- Encoding
- Duplicate uploads

Reject invalid content before AI processing.

---

# 6. Text Extraction

Responsible for converting the input into clean text.

Examples:

- PDF → Plain text
- Topic → Prompt context
- Notes → Normalized text

Extraction should preserve meaningful structure where possible.

---

# 7. Text Normalization

Normalize:

- Whitespace
- Line endings
- Repeated spaces
- Invalid characters
- Page artifacts
- OCR noise (future)

The normalized text is used for hashing and prompt generation.

---

# 8. Source Hashing

Generate a deterministic SHA-256 hash from the normalized content.

The hash is used to:

- Detect duplicate sources.
- Reuse Question Banks.
- Reduce AI requests.

---

# 9. Cache Strategy

Before calling AI:

1. Search for an existing Question Bank using the source hash and relevant generation parameters.
2. If a matching Question Bank exists, reuse it.
3. Otherwise continue with AI generation.

---

# 10. Chunking Strategy

Large inputs may exceed model limits.

Processing steps:

- Split content into logical sections.
- Preserve context within each section.
- Avoid splitting sentences where practical.
- Merge generated results into a single Question Bank.

Chunk size should be configurable.

---

# 11. Prompt Construction

Prompts should:

- Use versioned templates.
- Separate system instructions from user content.
- Specify the required JSON schema.
- Include generation parameters (question count, difficulty, language, etc.).

Prompt templates must be stored independently of application logic.

---

# 12. AI Generation

The AI Orchestrator:

- Selects the provider.
- Sends the prompt.
- Receives the response.
- Records metrics.
- Applies retry and fallback strategies when appropriate.

---

# 13. Response Validation

Before accepting AI output:

- Ensure valid JSON.
- Validate required fields.
- Confirm exactly one correct answer for single-choice questions.
- Reject malformed or incomplete responses.

---

# 14. Question Normalization

Normalize generated questions into a common format.

Fields include:

- Question text
- Options
- Correct answer
- Explanation
- Difficulty
- Tags (future)

All providers must produce the same internal representation.

---

# 15. Duplicate Detection

Before storing questions:

- Detect exact duplicates.
- Detect near duplicates where feasible.
- Remove redundant entries.
- Preserve unique questions.

---

# 16. Storage

Store validated output in the Question Bank.

Do not regenerate identical content unless explicitly requested.

---

# 17. Error Handling

Handle:

- Unsupported file.
- Text extraction failure.
- AI timeout.
- Provider failure.
- Invalid JSON.
- Validation failure.
- Storage failure.

Return clear, actionable messages.

---

# 18. Performance

Optimizations:

- Cache reusable outputs.
- Process large documents in chunks.
- Parallelize chunk processing where appropriate.
- Minimize repeated AI requests.

---

# 19. Security

Treat all uploaded content as untrusted.

Rules:

- Sanitize extracted text.
- Prevent prompt injection.
- Never execute embedded instructions.
- Keep API keys server-side.

---

# 20. Future AI Outputs

The same pipeline should support:

- Flashcards
- Summaries
- Study notes
- Learning objectives
- Topic extraction
- Difficulty analysis
- Keyword extraction
- Personalized study plans

without redesigning the architecture.

---

# 21. AI Implementation Rules

Every AI coding agent must:

- Use the AI Orchestrator.
- Validate every AI response.
- Reuse Question Banks.
- Keep prompt templates versioned.
- Follow the normalization contract.

---

# 22. Acceptance Criteria

The feature is complete when:

- All supported input types work.
- Duplicate content is detected.
- Question Banks are reused.
- AI responses are validated.
- Questions are normalized.
- Results are stored correctly.
- Errors are handled gracefully.

---

# 23. Dependencies

Depends on:

- 00–12

Referenced by:

- 14_FILE_PROCESSING.md
- 15_QUESTION_BANK.md
- Future AI feature documents.
