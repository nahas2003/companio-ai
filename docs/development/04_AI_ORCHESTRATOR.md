# 04_AI_ORCHESTRATOR.md

> **Project:** Companio
> **Document:** AI Orchestrator Development Guide
> **Version:** 1.0
> **Status:** Ready for Implementation

---

# 1. Purpose

The AI Orchestrator is the central gateway for all Artificial Intelligence interactions within Companio.

No module should communicate directly with an AI provider.

Instead, every AI request must pass through the AI Orchestrator, ensuring consistency, maintainability, security, observability, and provider independence.

---

# 2. Objectives

After completing this module:

- A single AI service layer exists.
- Multiple AI providers can be supported.
- Prompts are versioned and reusable.
- AI responses are validated before use.
- Errors and retries are handled consistently.
- Usage metrics are available.

---

# 3. Prerequisites

Complete before starting:

- 00_MASTER_DEVELOPMENT_PLAN.md
- 01_PROJECT_SETUP.md
- 02_DATABASE_SETUP.md
- 03_AUTHENTICATION.md

Review architecture:

- 02_SYSTEM_ARCHITECTURE.md
- 13_AI_CONTENT_PROCESSING.md
- 21_PROJECT_CONSTITUTION.md
- 22_ARCHITECTURAL_DECISIONS.md

---

# 4. AI Agent Context

## Goal

Implement a provider-independent orchestration layer for all AI operations.

## Expected Output

A reusable AI module capable of:

- Sending prompts
- Receiving structured responses
- Validating output
- Retrying transient failures
- Logging requests
- Supporting future providers without changing business modules

## Files Allowed to Modify

- `src/services/ai/`
- `src/lib/`
- Environment configuration
- Shared utilities

## Files That Must NOT Be Modified

- UI components
- Question Bank logic
- Assessment logic
- Authentication module

---

# 5. Recommended Folder Structure

```text
src/
├── services/
│   └── ai/
│       ├── providers/
│       ├── prompts/
│       ├── schemas/
│       ├── validators/
│       ├── orchestrator/
│       ├── retry/
│       ├── logging/
│       ├── cache/
│       ├── types/
│       └── index.ts
```

---

# 6. Responsibilities

The AI Orchestrator is responsible for:

- Selecting the provider.
- Loading prompts.
- Injecting variables.
- Calling the AI provider.
- Validating responses.
- Retrying failures.
- Logging requests.
- Returning normalized results.

It must not contain business logic for assessments or question generation.

---

# 7. Implementation Order

1. Create AI service structure.
2. Implement provider interface.
3. Add first AI provider.
4. Create prompt loader.
5. Implement prompt variable replacement.
6. Add JSON schema validation.
7. Implement retry strategy.
8. Add timeout handling.
9. Implement logging.
10. Add optional response caching.
11. Write integration tests.

---

# 8. Provider Abstraction

Every AI provider must implement a common interface.

Capabilities should include:

- Text generation
- Structured JSON output
- Token usage reporting (if available)
- Error reporting

Business modules must never know which provider is being used.

---

# 9. Prompt Management

Store prompts outside business logic.

Each prompt should define:

- Identifier
- Version
- Purpose
- Variables
- Expected output schema

Prompt changes should not require modifications to business modules.

---

# 10. Response Validation

Every AI response must be validated before use.

Validation should verify:

- Required fields
- Data types
- JSON structure
- Business constraints (where applicable)

Reject malformed or incomplete responses.

---

# 11. Retry Strategy

Retry only transient failures.

Examples:

- Network timeout
- Temporary provider error
- Rate limiting (with backoff)

Do not retry invalid prompt or validation failures.

---

# 12. Error Handling

Handle errors consistently.

Return normalized error objects for:

- Provider unavailable
- Timeout
- Invalid response
- Validation failure
- Rate limit exceeded
- Authentication failure (provider)

Avoid leaking provider-specific errors to business modules.

---

# 13. Logging

Log:

- Provider used
- Prompt identifier
- Request timestamp
- Response duration
- Success/failure
- Retry count

Never log sensitive user content unless explicitly required and compliant with privacy policies.

---

# 14. Configuration

Provider selection should be configurable through environment variables.

Configuration should support:

- Default provider
- Timeout
- Retry count
- Logging level
- Future provider credentials

Do not hardcode provider details.

---

# 15. Testing Checklist

Verify:

- Provider interface works.
- Prompt loading succeeds.
- Variables are injected correctly.
- Valid responses pass validation.
- Invalid responses are rejected.
- Retry logic behaves correctly.
- Logging records requests.
- Configuration changes are respected.

---

# 16. Acceptance Criteria

The module is complete when:

- All AI requests pass through the orchestrator.
- Providers can be swapped without business changes.
- Prompt management is centralized.
- Response validation is enforced.
- Error handling is standardized.
- Tests pass.

---

# 17. Common Mistakes

Avoid:

- Calling AI providers directly from feature modules.
- Embedding prompts inside UI or business logic.
- Skipping response validation.
- Ignoring retry limits.
- Hardcoding provider credentials.

---

# 18. Definition of Done

The AI Orchestrator is complete when:

- It serves as the only AI gateway.
- It is provider-independent.
- It is fully tested.
- It follows the Project Constitution.
- It is ready for integration with Content Ingestion and AI Content Processing.

---

# 19. Next Development Module

Proceed to:

**05_SOURCE_MANAGEMENT.md**
