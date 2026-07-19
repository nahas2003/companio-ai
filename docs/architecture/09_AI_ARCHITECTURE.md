# 09_AI_ARCHITECTURE.md

> **Project:** Companio
> **Document:** AI Architecture
> **Version:** 1.0 (MVP)
> **Priority:** Critical
> **Depends On:** 00–08

---

# 1. Purpose

This document defines the AI architecture for Companio.

The AI subsystem is responsible for:

* Question generation
* Question validation
* Question normalization
* Difficulty balancing
* Content analysis
* Future AI capabilities

The application must never depend directly on a specific AI provider.

---

# 2. AI Design Principles

The AI layer must be:

* Provider-independent
* Modular
* Secure
* Observable
* Testable
* Cost-efficient
* Extensible

---

# 3. High-Level AI Architecture

```text
Frontend
      │
      ▼
Application Service
      │
      ▼
AI Orchestrator
      │
      ├──────────────┐
      ▼              ▼
 Prompt Engine   Cache Manager
      │              │
      ▼              ▼
Response Validator
      │
      ▼
Provider Adapter
      │
 ┌────┼────┬────┬─────┐
 ▼    ▼    ▼    ▼
Gemini Groq NVIDIA Future
```

Only the AI Orchestrator communicates with providers.

---

# 4. AI Responsibilities

The AI subsystem may:

* Generate questions
* Summarize content
* Classify difficulty
* Produce explanations
* Validate generated output

It must not:

* Authenticate users
* Access the database directly
* Make business decisions
* Bypass application services

---

# 5. AI Orchestrator

The AI Orchestrator is the single entry point for all AI requests.

Responsibilities:

* Select provider.
* Build prompts.
* Check cache.
* Retry failures.
* Validate responses.
* Normalize output.
* Record metrics.

No other module may communicate directly with an AI provider.

---

# 6. Provider Adapters

Each provider must implement the same interface.

Example responsibilities:

* Authentication
* Request formatting
* Response parsing
* Error mapping

Supported providers (priority order):

1. Gemini
2. Groq
3. NVIDIA Build
4. OpenAI (future)
5. Claude (future)
6. Ollama (future)

Adding a new provider must not require frontend changes.

---

# 7. Prompt Engine

The Prompt Engine builds structured prompts.

Rules:

* Separate system instructions from user content.
* Never concatenate untrusted content into system prompts.
* Use versioned prompt templates.
* Keep prompts deterministic where possible.

---

# 8. Prompt Versioning

Every prompt template should have:

* Identifier
* Version
* Description
* Expected input
* Expected output

Example:

```text
question_generation:v1
```

New prompt behavior should create a new version instead of modifying existing versions silently.

---

# 9. AI Workflow

```text
Receive Request
      │
      ▼
Validate Input
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
Return   Build Prompt
               │
               ▼
      Select Provider
               ▼
         Call Provider
               ▼
      Validate Response
               ▼
     Normalize Output
               ▼
        Store Cache
               ▼
        Return Result
```

---

# 10. Response Contract

Every provider must return normalized data.

Example structure:

```json
{
  "questions": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "B",
      "explanation": "...",
      "difficulty": "medium"
    }
  ]
}
```

Provider-specific formats must never leak into the application.

---

# 11. Response Validation

Before accepting AI output:

* Ensure valid JSON.
* Verify required fields.
* Validate option counts.
* Ensure exactly one correct answer.
* Reject malformed responses.

---

# 12. Retry Strategy

Retry only when appropriate.

Recommended approach:

* Retry transient provider failures.
* Use exponential backoff.
* Avoid infinite retries.
* Surface meaningful errors after retries are exhausted.

---

# 13. Provider Selection

Selection strategy:

1. Preferred provider available.
2. Healthy.
3. Within quota.
4. Lowest estimated latency (future).

If unavailable, use the next configured provider.

---

# 14. Cache Strategy

Question generation should always check the cache before invoking AI.

Cache key inputs may include:

* Source hash
* Prompt version
* Question count
* Difficulty profile

This avoids unnecessary AI requests.

---

# 15. Observability

Capture metrics such as:

* Provider
* Response time
* Success/failure
* Retry count
* Cache hit rate

Do not log prompts containing sensitive user information.

---

# 16. Cost Optimization

Strategies:

* Cache reusable outputs.
* Batch requests when practical.
* Reuse Question Banks.
* Avoid duplicate generations.
* Limit unnecessary retries.

---

# 17. AI Failure Handling

When AI fails:

1. Retry if appropriate.
2. Attempt provider fallback.
3. Return a user-friendly message.
4. Preserve diagnostic logs.

The application should fail gracefully.

---

# 18. Future AI Capabilities

The architecture should support:

* Flashcard generation
* Coding question generation
* Essay evaluation
* Adaptive difficulty
* Personalized recommendations
* Learning analytics
* AI tutor
* Multi-language generation

without redesigning the AI layer.

---

# 19. AI Security

The AI subsystem must:

* Keep API keys server-side.
* Sanitize prompts.
* Validate outputs.
* Reject unsafe or malformed responses.
* Respect provider usage limits.

---

# 20. AI Implementation Rules

Every AI coding agent must:

* Use the AI Orchestrator.
* Never call providers directly.
* Follow the response contract.
* Reuse cached results where available.
* Keep provider adapters isolated.
* Document any new AI capability.

---

# 21. Validation Checklist

Before integrating a new AI feature:

* Provider adapter implemented.
* Prompt template documented.
* Response contract validated.
* Cache integration verified.
* Retry logic tested.
* Metrics recorded.
* Security review completed.

---

# 22. Dependencies

Depends on:

* 00_PROJECT_OVERVIEW.md
* 01_PRODUCT_REQUIREMENTS.md
* 02_SYSTEM_ARCHITECTURE.md
* 03_TECH_STACK.md
* 04_PROJECT_STRUCTURE.md
* 05_DATABASE_ARCHITECTURE.md
* 06_BUSINESS_WORKFLOWS.md
* 07_API_SPECIFICATION.md
* 08_SECURITY_ARCHITECTURE.md

Referenced by:

* 10_DEVELOPMENT_GUIDELINES.md
* 13_AI_CONTENT_PROCESSING.md
* Future AI feature documents.
