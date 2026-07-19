# AI_PROMPT_LIBRARY.md

> **Project:** Companio
> **Document Type:** Knowledge Base
> **Version:** 1.0
> **Status:** Living Document

---

# 1. Purpose

This document defines the AI prompt library used throughout Companio.

It serves as the centralized registry for all prompt templates, expected inputs and outputs, version history, validation rules, and governance.

Prompts should never be treated as hardcoded strings scattered throughout the application.

---

# 2. Objectives

The prompt library should:

* Standardize AI interactions.
* Improve response consistency.
* Support prompt versioning.
* Enable prompt reuse.
* Simplify testing and maintenance.
* Support multiple AI providers.

---

# 3. Design Principles

Every prompt should be:

* Purpose-specific
* Deterministic where practical
* Version controlled
* Easy to test
* Provider agnostic where possible
* Documented

---

# 4. Prompt Metadata

Each prompt should define:

| Field            | Description                        |
| ---------------- | ---------------------------------- |
| Prompt ID        | Unique identifier                  |
| Name             | Human-readable name                |
| Version          | Semantic version                   |
| Module           | Related feature                    |
| Purpose          | Business objective                 |
| Input Variables  | Required placeholders              |
| Expected Output  | Response format                    |
| Validation Rules | Output requirements                |
| Status           | Active / Deprecated / Experimental |

---

# 5. Prompt Categories

## Question Generation

Purpose:

Generate assessment questions from processed learning materials.

Examples:

* Multiple Choice Questions (MCQ)
* True / False
* Short Answer
* Fill in the Blank

---

## Difficulty Adjustment

Purpose:

Rewrite or classify questions as:

* Easy
* Medium
* Hard

---

## Explanation Generation

Purpose:

Generate learner-friendly explanations for answers.

---

## Question Validation

Purpose:

Review AI-generated questions for:

* Completeness
* Accuracy
* Duplicate detection
* Format compliance

---

## Learning Material Analysis

Purpose:

Analyze uploaded content to identify:

* Topics
* Key concepts
* Learning objectives
* Keywords

---

## Summarization

Purpose:

Produce concise summaries of learning materials.

---

## Metadata Extraction

Purpose:

Extract structured information such as:

* Subject
* Difficulty
* Estimated study time
* Topic hierarchy

---

# 6. Prompt Template Structure

Each prompt should include:

1. System instructions
2. User instructions
3. Context
4. Variables
5. Constraints
6. Output specification
7. Examples (optional)

---

# 7. Variable Naming

Use descriptive placeholders.

Examples:

```text id="5rm6nw"
{{document_text}}
{{difficulty}}
{{question_count}}
{{question_type}}
{{language}}
{{learning_objectives}}
```

Avoid ambiguous placeholder names.

---

# 8. Output Formats

Preferred formats:

* JSON
* Markdown
* Plain text (only when appropriate)

AI responses should be machine-readable whenever practical.

Example JSON structure:

```json id="rwtltq"
{
  "questions": [
    {
      "type": "mcq",
      "question": "",
      "options": [],
      "answer": "",
      "explanation": "",
      "difficulty": "medium"
    }
  ]
}
```

---

# 9. Validation Rules

All AI responses should be validated for:

* Valid JSON (when expected)
* Required fields
* Supported question types
* Difficulty values
* Duplicate content
* Empty responses
* Excessive token usage
* Schema compliance

Invalid outputs should trigger retry or review workflows.

---

# 10. Prompt Versioning

Follow semantic versioning.

Examples:

* v1.0.0
* v1.1.0
* v2.0.0

Major version:

* Breaking prompt changes

Minor version:

* Improved instructions
* Better formatting

Patch version:

* Typographical fixes
* Small wording improvements

---

# 11. Provider Compatibility

Prompt templates should be compatible with supported AI providers where practical.

Potential providers include:

* OpenAI
* NVIDIA NIM
* Google Gemini
* Anthropic Claude
* Local open-source models

Provider-specific adaptations should remain within the AI Orchestrator.

---

# 12. Prompt Testing

Every prompt should be tested for:

* Consistent output
* Schema compliance
* Edge cases
* Hallucination resistance
* Performance
* Token efficiency

Document representative test cases and expected outcomes.

---

# 13. Security Guidelines

Prompts should never:

* Expose secrets
* Leak internal system prompts
* Reveal API credentials
* Return sensitive user information
* Circumvent application authorization rules

Sanitize user-provided input before inserting it into prompts where necessary.

---

# 14. Governance

Changes to prompts should include:

* Reason for change
* Version update
* Testing evidence
* Approval (if applicable)
* Updated documentation

Deprecated prompts should remain documented until removed from supported releases.

---

# 15. AI Agent Guidelines

Before creating a new prompt, the AI agent should:

1. Search the existing prompt library.
2. Reuse an existing prompt where appropriate.
3. Version changes instead of overwriting templates.
4. Keep prompts modular and focused.
5. Define expected output schemas.
6. Document all new prompts in this library.

---

# 16. Maintenance

Update this document whenever:

* A prompt is added.
* A prompt is modified.
* A prompt is deprecated.
* Output schemas change.
* New AI providers require compatibility updates.
* Validation rules evolve.
