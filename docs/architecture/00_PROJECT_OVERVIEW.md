# 00_PROJECT_OVERVIEW.md

> **Project:** Companio
> **Version:** 1.0 (MVP)
> **Status:** Draft
> **Document Type:** Project Overview
> **Priority:** Critical
> **Last Updated:** July 2026

---

# Companio

### Your AI Learning Companion

Companio is an AI-powered assessment platform that enables anyone to generate high-quality quizzes and assessments from topics, notes, or PDF documents within seconds. It focuses on simplicity, speed, and accessibility while maintaining a scalable architecture for future growth.

The platform allows users to practice individually or create live assessments that others can join instantly using a unique assessment code. Participants are not required to create an account, making the assessment process quick and frictionless. Registered users can optionally save their history, monitor their progress, and create reusable assessments.

---

# Vision

Build the simplest and smartest AI-powered assessment platform that anyone can use without technical knowledge.

Companio should enable educators, trainers, students, and organizations to create engaging assessments in minutes instead of hours.

---

# Mission

Reduce the time required to create quality assessments by leveraging AI while delivering an enjoyable experience for both creators and participants.

---

# Core Philosophy

* Simplicity over complexity.
* Fast user experience.
* AI should reduce work, not increase it.
* Guest participation should require minimal effort.
* Optional authentication instead of mandatory registration.
* Secure by design.
* Modular and maintainable architecture.
* Reusable components and services.
* AI-generated code must remain understandable by human developers.

---

# Project Goals

## Primary Goals

* Generate assessments from AI.
* Generate questions from PDFs.
* Generate questions from notes.
* Generate questions from topics.
* Support live assessments.
* Support individual practice mode.
* Provide a live leaderboard.
* Save user history for registered users.
* Allow guests to participate without registration.

## Secondary Goals

* Question caching.
* AI provider abstraction.
* Mobile-friendly UI.
* Fast loading experience.
* Future support for multiple AI providers.

---

# Non-Goals (MVP)

The first version intentionally excludes:

* Learning Management System (LMS)
* Course Management
* Institute Management
* Batch Management
* Student Management
* Teacher Management
* Payment Gateway
* Certificates
* Chat System
* AI Tutor
* Flashcards
* Video Learning
* Complex Analytics
* Enterprise Features

These may be considered in future versions.

---

# Target Users

## Students

* Practice quizzes.
* Join assessments.
* Review results.
* Save progress (optional).

## Teachers

* Create assessments.
* Share assessment codes.
* View participant results.

## Trainers

* Conduct workshops.
* Run live assessments.
* Evaluate participants.

## Organizations (Future)

* Internal assessments.
* Recruitment tests.
* Training evaluations.

---

# User Types

## Guest User

Can:

* Practice quizzes.
* Join assessments.
* View leaderboard.
* View results.

Cannot:

* Save history.
* Create assessments.
* Sync across devices.

---

## Registered User

Can:

* Everything a guest can do.
* Save assessment history.
* Create assessments.
* Manage assessments.
* Track progress.
* Access previous attempts.

---

# Core Features

## Practice Mode

Generate AI questions from:

* Topic
* Notes
* PDF

Users choose:

* Question count
* Difficulty (future)
* Timer (optional)

---

## Assessment Mode

Creators can:

* Upload content.
* Generate questions.
* Select question count.
* Create an assessment.
* Receive an assessment code.

Participants:

* Enter assessment code.
* Enter display name.
* Join instantly.
* Complete assessment.
* View live leaderboard.

---

## AI Question Generation

Supports:

* Topic-based generation.
* PDF analysis.
* Notes analysis.

Questions include:

* Multiple Choice Questions (MCQ)
* Four options
* Correct answer
* Explanation

---

## Leaderboard

Displays:

* Live rankings.
* Participant names.
* Scores.
* Completion time.

---

## Results

Displays:

* Score
* Correct answers
* Incorrect answers
* Time taken
* Ranking

Registered users retain assessment history.

---

# High-Level User Flow

## Practice Flow

Home

↓

Practice

↓

Enter Topic / Upload PDF / Paste Notes

↓

Generate Questions

↓

Start Quiz

↓

Results

---

## Assessment Flow

Home

↓

Create Assessment

↓

Upload Content

↓

Generate Questions

↓

Create Assessment

↓

Assessment Code Generated

↓

Participants Join

↓

Live Leaderboard

↓

Results

---

# AI Strategy

Companio uses an AI Provider Abstraction Layer.

The application never directly depends on a single AI provider.

Preferred provider order:

1. Gemini
2. Groq
3. NVIDIA Build
4. OpenAI (Future)
5. Claude (Future)
6. Ollama (Future)

Question generation results are cached to reduce AI cost and improve performance.

---

# Security Principles

* Secure by default.
* Validate every input.
* Secure file uploads.
* Rate limit AI requests.
* Row Level Security (Supabase).
* Prevent prompt injection.
* Prevent duplicate assessment codes.
* Never expose secrets to the client.
* Follow the principle of least privilege.

---

# Performance Goals

* Fast initial load.
* Responsive interface.
* Cached AI responses.
* Efficient database queries.
* Reusable UI components.
* Optimized API calls.

---

# Technology Overview

Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

Backend

* Supabase
* PostgreSQL
* Edge Functions

AI

* Gemini
* Groq
* NVIDIA Build

Future

* OpenAI
* Claude
* Ollama

---

# Development Principles

* Feature-based architecture.
* Strong TypeScript typing.
* Reusable components.
* Reusable services.
* Minimal code duplication.
* Clean folder structure.
* Consistent naming conventions.
* Modular development.
* Comprehensive documentation.
* Test before merge.

---

# Success Criteria (MVP)

The MVP is considered successful when users can:

* Generate questions from a topic.
* Generate questions from notes.
* Generate questions from PDFs.
* Practice assessments.
* Create live assessments.
* Join assessments as guests.
* View live leaderboard.
* Save history using an optional account.
* Complete assessments without major usability issues.

---

# Future Vision

Companio is designed with extensibility in mind.

Potential future enhancements include:

* AI Tutor
* Flashcards
* Coding Assessments
* Essay Evaluation
* Adaptive Learning
* Analytics Dashboard
* Classroom Management
* Enterprise Features
* Mobile Applications
* Public API
* Integrations with external learning platforms

---

# Dependencies

This document is the foundation for every other project document.

The following documents must remain consistent with this overview:

* 01_PRODUCT_REQUIREMENTS.md
* 02_SYSTEM_ARCHITECTURE.md
* 03_TECH_STACK.md
* 04_PROJECT_STRUCTURE.md
* 05_DATABASE_ARCHITECTURE.md
* 06_API_SPECIFICATION.md
* 07_SECURITY_ARCHITECTURE.md
* 08_AI_ARCHITECTURE.md
* 09_DEVELOPMENT_GUIDELINES.md

Any changes to the project vision or MVP scope must be reflected here before updating dependent documents.
