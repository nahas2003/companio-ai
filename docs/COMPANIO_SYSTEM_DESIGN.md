# COMPANIO_SYSTEM_DESIGN.md

# Companio System Design

Version: 1.0
Status: Engineering Blueprint

---

# 1. Purpose

This document defines the complete engineering architecture of Companio.

It acts as the single engineering reference for future development.

Every implementation must align with this document.

---

# 2. Product Philosophy

Companio is NOT an AI product.

Companio is an Assessment Platform.

AI exists only as an internal service.

The user should never feel like they are using AI.

The experience should be:

Simple

↓

Fast

↓

Professional

↓

Reliable

---

# 3. Engineering Principles

## Assessment First

Everything revolves around assessments.

Not AI.

Not documents.

Not chat.

---

## AI Invisible

Never expose

- AI branding
- Model names
- Providers
- API vendors

Users only create assessments.

---

## Guest First

Guest users should immediately begin using the platform.

No forced registration.

---

## Cost Optimized

Every architecture decision should reduce AI costs.

---

## Vendor Independent

Companio should never depend on one AI provider.

---

# 4. High Level Architecture

                    User
                      │
                      ▼
               Next.js Frontend
                      │
                      ▼
              Server Actions/API
                      │
                      ▼
             Assessment Engine
                      │
      ┌───────────────┼───────────────┐
      ▼               ▼               ▼

Question Cache File Processor AI Router
│ │ │
└───────────────┼───────────────┘
▼
Database

---

# 5. Assessment Engine

The Assessment Engine is the core of Companio.

Responsibilities

- Create assessments
- Generate questions
- Reuse existing questions
- Publish assessments
- Create join codes

No UI directly communicates with AI.

Everything passes through this engine.

---

# 6. Assessment Creation Flow

User

↓

Topic

or

Description

or

Notes

↓

Assessment Engine

↓

Question Cache

↓

Cache Found?

↓

Yes

↓

Return Questions

↓

No

↓

AI Router

↓

Provider

↓

Questions Generated

↓

Store

↓

Return

---

# 7. AI Architecture

AI should be modular.

Structure

AI Router

↓

Provider Factory

↓

Provider Registry

↓

Providers

Every provider implements

IAIProvider

Supported Providers

- Mock
- Gemini
- NVIDIA
- OpenAI
- Claude
- Ollama
- Azure OpenAI
- Future Providers

---

# 8. Provider Priority

Each provider has

Name

Priority

Enabled

Cost

Capabilities

Health

Rate Limits

API Key

Example

Gemini Flash

Priority: 1

Cost: Low

Enabled

NVIDIA

Priority: 2

OpenAI

Priority: 3

Claude

Priority: 4

Mock

Priority: Last Resort

---

# 9. AI Request Flow

Assessment Engine

↓

Cache

↓

Hit?

↓

Return

↓

Miss

↓

Provider Router

↓

Try Provider

↓

Success?

↓

Store Result

↓

Return

↓

Failure

↓

Next Provider

↓

All Failed

↓

Mock

---

# 10. Intelligent Cache

Every request should be cached.

Cache Keys

Topic

Description Hash

Document Hash

Difficulty

Language

Question Count

Question Type

---

# 11. Question Pool

Instead of generating every request

Generate

100 Easy

100 Medium

100 Hard

Reuse forever.

Questions contain

Topic

Difficulty

Question

Options

Answer

Explanation

Metadata

Source

---

# 12. File Processing

Upload

↓

Virus Check

↓

Extract Text

↓

Generate Questions

↓

Delete File

↓

Store Questions

Never permanently store uploaded notes.

---

# 13. Authentication

Guest

- Create Assessment
- Join Assessment
- Leaderboard

Registered

- Dashboard
- Saved Assessments
- Analytics
- History
- Question Library

---

# 14. Database

Major Tables

Users

Assessments

Assessment Attempts

Question Pools

Questions

Provider Logs

Prompt Templates

Guest Sessions

Cache

Settings

Leaderboard

---

# 15. Performance

Priority

1 Cache

2 Existing Question Pool

3 Cheapest Provider

4 Fallback Provider

5 Mock Provider

---

# 16. Security

Rate Limiting

Prompt Validation

Upload Validation

Authentication

Authorization

Audit Logs

API Protection

---

# 17. Monitoring

Track

Provider Response Time

Failures

Token Usage

Cost

Cache Hit Rate

Question Reuse

Assessment Creation Time

---

# 18. Deployment

Frontend

Next.js

Backend

Server Actions

Database

Supabase PostgreSQL

Storage

Temporary Only

Hosting

Vercel

AI

External Providers

---

# 19. Future Expansion

Coding Assessments

Video Assessments

Image Questions

Certificates

Classrooms

Organizations

Payments

Marketplace

Public Question Bank

Multi-language

---

# 20. Guiding Rule

Whenever a new feature is proposed, ask:

Does this improve the assessment experience?

If YES

Implement.

If NO

Reject.

Companio is an assessment platform first.

Everything else is secondary.
