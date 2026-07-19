# 14_CONTENT_INGESTION.md

> **Project:** Companio
> **Document:** Content Ingestion
> **Version:** 1.0 (MVP)
> **Priority:** High
> **Depends On:** 00–13

---

# 1. Purpose

This document defines how learning content enters the Companio platform before AI processing.

The ingestion layer is responsible for:

* Receiving content
* Validating content
* Extracting text
* Generating metadata
* Persisting source information
* Preparing content for AI processing

It must not generate questions or make AI-related decisions.

---

# 2. Objectives

The ingestion layer should:

* Accept multiple content sources.
* Validate all incoming content.
* Produce normalized text.
* Create reusable Source records.
* Detect duplicates.
* Prepare content for downstream AI processing.

---

# 3. Supported Sources

## MVP

* Topic
* PDF
* Notes

---

## Future

* DOCX
* PPTX
* Markdown
* URL
* YouTube Transcript
* EPUB
* HTML
* ZIP packages

---

# 4. Ingestion Pipeline

```text id="ing001"
Receive Input
      │
      ▼
Validate Request
      │
      ▼
Identify Source Type
      │
      ▼
Extract Content
      │
      ▼
Normalize Text
      │
      ▼
Generate Metadata
      │
      ▼
Generate SHA-256 Hash
      │
      ▼
Store Source
      │
      ▼
Return Source ID
```

---

# 5. Source Entity

Every uploaded or entered item becomes a **Source**.

Suggested attributes:

* source_id
* source_type
* owner_id
* title
* normalized_text
* source_hash
* metadata
* created_at
* updated_at

The Source is immutable once created.

---

# 6. Validation

Validate before processing:

* Content exists.
* Supported source type.
* File size.
* MIME type (for uploads).
* Character encoding.
* Maximum text length.

Reject invalid content before storage.

---

# 7. PDF Ingestion

Workflow:

```text id="pdf001"
Upload PDF
      │
      ▼
Validate File
      │
      ▼
Extract Text
      │
      ▼
Normalize
      │
      ▼
Store Source
```

Extraction failures should be reported clearly.

---

# 8. Topic Ingestion

Workflow:

```text id="topic001"
Enter Topic
      │
      ▼
Trim Input
      │
      ▼
Validate Length
      │
      ▼
Store Source
```

---

# 9. Notes Ingestion

Workflow:

```text id="notes001"
Paste Notes
      │
      ▼
Normalize Text
      │
      ▼
Store Source
```

---

# 10. Metadata Extraction

Generate metadata such as:

* Title
* Estimated language
* Character count
* Word count
* Page count (where applicable)
* Source type

Metadata supports analytics and future search capabilities.

---

# 11. Duplicate Detection

Use the normalized content hash to identify duplicate Sources.

If an identical Source already exists:

* Reuse the existing Source where appropriate.
* Avoid unnecessary duplicate storage.

Policies may vary based on ownership and privacy requirements.

---

# 12. Storage

Persist:

* Original metadata.
* Normalized text.
* Source hash.
* Ownership information.

Large binary files (such as PDFs) should be stored in object storage rather than the relational database.

---

# 13. Security

Treat all input as untrusted.

Rules:

* Validate file types.
* Enforce upload limits.
* Reject corrupted files.
* Prevent path traversal.
* Sanitize extracted text.

---

# 14. Error Handling

Handle:

* Unsupported file type.
* Upload interruption.
* Extraction failure.
* Empty content.
* Invalid encoding.
* Storage failure.

Provide meaningful messages that help the user resolve the issue.

---

# 15. Performance

Recommendations:

* Stream uploads where possible.
* Process large files asynchronously if required.
* Cache extraction results.
* Avoid repeated text extraction for identical content.

---

# 16. Future Enhancements

* OCR for scanned PDFs.
* Multi-language detection.
* Automatic document classification.
* Batch uploads.
* Cloud storage integrations.
* Connector-based imports.

---

# 17. AI Implementation Rules

Every AI coding agent must:

* Keep ingestion independent of AI generation.
* Store Sources before invoking AI.
* Never duplicate identical Sources unnecessarily.
* Preserve immutability of stored Source records.
* Follow documented validation rules.

---

# 18. Acceptance Criteria

The feature is complete when:

* Topics can be ingested.
* PDFs can be ingested.
* Notes can be ingested.
* Metadata is generated.
* Duplicate detection works.
* Sources are stored.
* Invalid content is rejected.
* Downstream AI processing receives normalized input.

---

# 19. Dependencies

Depends on:

* 00–13

Referenced by:

* 13_AI_CONTENT_PROCESSING.md
* 15_QUESTION_BANK.md
* Future ingestion connectors.
