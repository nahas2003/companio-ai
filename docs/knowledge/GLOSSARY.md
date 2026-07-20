# GLOSSARY.md

> **Project:** Companio
> **Document Type:** Knowledge Base
> **Version:** 1.0
> **Status:** Living Document

---

# 1. Purpose

This glossary defines the key terms, concepts, and abbreviations used throughout the Companio project.

It provides a shared vocabulary for developers, designers, testers, stakeholders, and AI coding agents.

When introducing new project-specific terminology, update this document to maintain consistency.

---

# 2. Core Platform Terms

## AI Orchestrator

A centralized service responsible for managing all AI interactions. It abstracts AI providers, handles prompt execution, validates responses, manages retries, and records AI usage.

---

## Assessment

A formal evaluation created from one or more questions in the Question Bank. Assessments typically have rules such as time limits, scoring, and submission requirements.

---

## Assessment Attempt

A learner's participation in an assessment, including answers, timing information, and submission status.

---

## Audit Log

A chronological record of important system events, particularly security-sensitive and administrative actions.

---

## Component Library

The collection of reusable UI components used throughout the application to ensure consistency and reduce duplicate development.

---

## Dashboard

The primary landing page presenting summaries, statistics, recent activity, and quick actions relevant to the signed-in user.

---

## Document Processing

The process of extracting and normalizing content from uploaded learning materials before AI processing.

---

## Feature Flag

A configurable switch used to enable, disable, or gradually roll out functionality without changing application code.

---

## Learning Source

An uploaded learning resource, such as a PDF, DOCX, Markdown file, or text document, that serves as input for document processing and AI-assisted question generation.

---

## Notification

A system-generated message delivered to users through supported communication channels, such as in-app notifications or email.

---

## Practice Mode

A learning-focused workflow where users answer questions, receive immediate feedback, and can continue learning at their own pace.

---

## Prompt Template

A reusable instruction template provided to an AI model. Prompt templates include variables, expected outputs, and validation requirements.

---

## Question Bank

The centralized repository containing all questions available for practice sessions and assessments.

---

## Question Generation

The AI-assisted process of generating structured assessment questions from processed learning materials.

---

## Result

The evaluated outcome of a completed assessment, including scores, pass/fail status, feedback, and related metadata.

---

## User Profile

A collection of user-specific information such as display name, avatar, language, timezone, and preferences.

---

# 3. Technical Terms

## API

Application Programming Interface. A defined set of endpoints and contracts used for communication between clients and backend services.

---

## Authentication

The process of verifying a user's identity before granting access to protected resources.

---

## Authorization

The process of determining whether an authenticated user has permission to perform a specific action.

---

## CI/CD

Continuous Integration and Continuous Deployment. Automated processes for building, testing, and deploying software.

---

## Endpoint

A specific API route that performs an operation or provides access to a resource.

---

## Pagination

A method of dividing large datasets into smaller, manageable pages for efficient retrieval and display.

---

## Rate Limiting

A technique that restricts the number of requests a client may make within a defined period to protect system stability.

---

## Row Level Security (RLS)

A database security feature that restricts access to individual rows based on defined authorization policies.

---

## Soft Delete

A deletion strategy where a record is marked as deleted (for example, using a `deleted_at` field) rather than permanently removed.

---

## UUID

Universally Unique Identifier. A globally unique identifier commonly used as a primary key for database records.

---

# 4. AI Terms

## AI Provider

An external or local service that supplies AI capabilities to the platform, such as question generation or summarization.

---

## Context

The information supplied to an AI model alongside a prompt to improve the quality and relevance of generated responses.

---

## Hallucination

An AI response that is factually incorrect, fabricated, or unsupported by the provided context.

---

## Prompt

The complete instruction sent to an AI model, including system instructions, user input, variables, and context.

---

## Prompt Version

A versioned iteration of a prompt template used to track improvements and maintain reproducibility.

---

## Schema Validation

The process of verifying that an AI response conforms to an expected structure before it is accepted by the application.

---

# 5. Operational Terms

## Backup

A copy of application data created to support recovery in the event of data loss or corruption.

---

## Deployment

The process of releasing an application to a target environment such as development, staging, or production.

---

## Health Check

An endpoint or mechanism used to determine whether a service is operational.

---

## Monitoring

The continuous observation of system health, performance, and operational metrics.

---

## Release

A packaged version of the application that is prepared for deployment and use.

---

## Rollback

The process of restoring a previous application version when a deployment introduces significant issues.

---

# 6. Abbreviations

| Abbreviation | Meaning                              |
| ------------ | ------------------------------------ |
| ADR          | Architectural Decision Record        |
| AI           | Artificial Intelligence              |
| API          | Application Programming Interface    |
| CI           | Continuous Integration               |
| CD           | Continuous Deployment                |
| CRUD         | Create, Read, Update, Delete         |
| JSON         | JavaScript Object Notation           |
| MVP          | Minimum Viable Product               |
| RLS          | Row Level Security                   |
| UI           | User Interface                       |
| UUID         | Universally Unique Identifier        |
| WCAG         | Web Content Accessibility Guidelines |

---

# 7. Naming Conventions

Use consistent terminology throughout the project:

- **Assessment** instead of "Exam" unless a specific business requirement calls for that wording.
- **Practice Mode** instead of "Quiz Practice."
- **Learning Source** instead of "Uploaded File."
- **Question Bank** instead of "Question Repository."
- **Prompt Template** instead of "AI Prompt String."
- **AI Orchestrator** instead of "AI Service."

---

# 8. AI Agent Guidelines

Before introducing new terminology, the AI agent should:

1. Search this glossary for an existing definition.
2. Reuse established terminology wherever possible.
3. Avoid creating multiple names for the same concept.
4. Add new terms only when they represent genuinely new concepts.
5. Update related documentation to maintain consistency.

---

# 9. Maintenance

Update this glossary whenever:

- New platform concepts are introduced.
- Existing terminology changes.
- New abbreviations become common within the project.
- Documentation adopts new naming conventions.

This glossary should remain the authoritative reference for project terminology.
