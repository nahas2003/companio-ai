# 06_CONTENT_INGESTION.md

> **Project:** Companio
> **Document:** Content Ingestion Development Guide
> **Version:** 1.0
> **Status:** Ready for Implementation

---

# 1. Purpose

This document defines how to implement the Content Ingestion module.

The Content Ingestion module is responsible for reading learning material from a Source, validating it, extracting usable text, normalizing the content, and preparing it for AI Content Processing.

This module does **not** generate questions or call AI providers.

---

# 2. Objectives

After completing this module:

- Content can be extracted from supported Source types.
- Extracted content is normalized into a consistent internal format.
- Validation and preprocessing are completed.
- Metadata is generated.
- Content is ready for AI processing.

---

# 3. Prerequisites

Complete before starting:

- 00_MASTER_DEVELOPMENT_PLAN.md
- 01_PROJECT_SETUP.md
- 02_DATABASE_SETUP.md
- 03_AUTHENTICATION.md
- 04_AI_ORCHESTRATOR.md
- 05_SOURCE_MANAGEMENT.md

Review architecture:

- 14_CONTENT_INGESTION.md
- 13_AI_CONTENT_PROCESSING.md
- 21_PROJECT_CONSTITUTION.md

---

# 4. AI Agent Context

## Goal

Implement a reusable ingestion pipeline that converts different learning material formats into a standardized internal representation.

## Expected Output

A pipeline that:

- Reads the Source
- Validates the input
- Extracts text
- Normalizes content
- Stores ingestion metadata
- Produces normalized content for downstream AI processing

## Files Allowed to Modify

- `src/features/content-ingestion/`
- `src/services/content-ingestion/`
- Shared parsing utilities
- Storage integration

## Files That Must NOT Be Modified

- AI Orchestrator
- Question Bank
- Assessment Engine
- Results
- Leaderboard

---

# 5. Recommended Folder Structure

```text
src/
├── features/
│   └── content-ingestion/
│       ├── parsers/
│       ├── extractors/
│       ├── validators/
│       ├── normalizers/
│       ├── services/
│       ├── types/
│       ├── utils/
│       └── index.ts
```

---

# 6. Supported Input Types

The ingestion pipeline should support:

- PDF documents
- Plain text
- Topic-based input
- Rich text (future-ready)
- External URLs (future-ready)

New input types should be added through dedicated extractors rather than modifying existing ones.

---

# 7. Processing Pipeline

Every Source should pass through the same logical pipeline:

```text
Source
    ↓
Validation
    ↓
Content Extraction
    ↓
Text Normalization
    ↓
Metadata Generation
    ↓
Content Hashing
    ↓
Ready for AI Processing
```

Each stage should have a single responsibility.

---

# 8. Frontend Tasks

Implement:

- Ingestion progress indicator
- Processing status display
- Error messages
- Retry action (when appropriate)
- Source processing history

The UI should clearly distinguish between:

- Waiting
- Processing
- Completed
- Failed

---

# 9. Backend Tasks

Implement services for:

- Start ingestion
- Validate Source
- Extract content
- Normalize text
- Generate metadata
- Store normalized output
- Record processing status

Ensure ingestion can be retried safely.

---

# 10. Validation Rules

Validate:

- Supported source type
- File size limits
- Empty content
- Corrupted files
- Unsupported formats
- Missing metadata

Reject invalid inputs before processing.

---

# 11. Normalization Rules

Normalize extracted content by:

- Removing unsupported formatting
- Standardizing whitespace
- Preserving logical paragraph structure
- Handling Unicode consistently
- Cleaning control characters

Normalization should improve consistency without changing the meaning of the content.

---

# 12. Metadata Generation

Generate metadata such as:

- Source identifier
- Content length
- Word count
- Estimated reading time
- Language (future-ready)
- Processing timestamp
- Content hash

This metadata supports downstream processing and duplicate detection.

---

# 13. State Management

Track:

- Current ingestion status
- Processing progress
- Validation errors
- Retry count
- Output location

State should be recoverable if the process is interrupted.

---

# 14. Security Requirements

Ensure:

- Uploaded files are validated.
- Unsupported file types are rejected.
- Ownership is enforced.
- Temporary files are cleaned up.
- Sensitive data is not exposed in logs.

---

# 15. Error Handling

Handle errors for:

- Invalid source
- Extraction failure
- Corrupted file
- Unsupported format
- Storage failure
- Processing interruption

Provide meaningful feedback without exposing internal implementation details.

---

# 16. Testing Checklist

Verify:

- PDF extraction succeeds.
- Plain text ingestion succeeds.
- Topic input is accepted.
- Invalid files are rejected.
- Corrupted files fail gracefully.
- Metadata is generated correctly.
- Normalized content is stored.
- Processing status updates correctly.

---

# 17. Acceptance Criteria

This module is complete when:

- All supported Source types can be ingested.
- Normalized content is produced consistently.
- Metadata is generated.
- Validation and error handling work as expected.
- Tests pass.

---

# 18. Common Mistakes

Avoid:

- Calling AI providers directly.
- Mixing extraction with AI processing.
- Skipping normalization.
- Storing temporary parsing artifacts as permanent data.
- Ignoring duplicate content checks.

---

# 19. Definition of Done

The Content Ingestion module is complete when:

- Content is extracted reliably.
- Normalized output is generated.
- The pipeline is reusable.
- Downstream AI processing can consume the output without additional preprocessing.

---

# 20. Next Development Module

Proceed to:

**07_AI_CONTENT_PROCESSING.md**
