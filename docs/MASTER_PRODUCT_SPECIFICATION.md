# MASTER_PRODUCT_SPECIFICATION.md

# Companio – Master Product Specification

Version: 1.0 (Product Vision)
Status: Source of Truth
Owner: Muhammed Nahas
Last Updated: July 2026

---

# 1. Product Vision

Companio is a modern online assessment platform that enables anyone to create, share, and evaluate assessments within minutes.

Artificial Intelligence is an internal engine that assists with assessment generation but is intentionally hidden from the user experience.

The platform focuses on simplicity, speed, accessibility, and low operational cost.

The primary goal is not to showcase AI.

The primary goal is to help users create assessments quickly.

---

# 2. Core Principles

The following principles override all implementation decisions.

## Assessment First

The product is an assessment platform.

Everything revolves around creating, sharing and completing assessments.

---

## AI is Invisible

Users should never feel like they are using an AI application.

AI should work completely behind the scenes.

Avoid:

• Robot icons
• AI branding
• Chat interfaces
• Neon AI themes
• "Powered by AI" banners

---

## Guest First

Registration must NOT be mandatory.

Users should be able to use the platform immediately.

Guest users can:

- Create assessments
- Join assessments
- Share assessment codes
- View leaderboard
- Complete assessments

---

## Login Adds Value

Authentication should unlock advanced features instead of blocking basic usage.

Registered users receive:

- Saved assessments
- Assessment history
- Analytics
- Dashboard
- Question library
- Profile
- Future cloud synchronization

---

## Minimal Design

The interface must feel clean and modern.

Design Goals

- White background
- Neutral colors
- Professional typography
- Rounded cards
- Spacious layout
- Fast loading
- Mobile responsive

Avoid visual clutter.

---

# 3. Target Users

Primary

- Teachers
- Trainers
- Educational Institutions
- Students
- Companies
- Interviewers

Secondary

- Self learners
- Workshop organizers
- Event coordinators
- HR teams

---

# 4. Primary User Journey

Landing Page

↓

Create Assessment

or

Join Assessment

↓

Assessment Creation

↓

Generate Questions

↓

Publish Assessment

↓

Share Assessment Code

↓

Participants Join

↓

Complete Assessment

↓

Leaderboard

↓

Results

---

# 5. Landing Page

The homepage should immediately communicate the product purpose.

Primary Buttons

- Create Assessment
- Join Assessment

Secondary Content

- Features
- How it Works
- Benefits
- FAQ

No login should be required to continue.

---

# 6. Assessment Creation

Users can generate assessments from:

1. Topic

Example

Java Programming

---

2. Description

Example

Generate a beginner assessment covering Java OOP concepts.

---

3. Uploaded Notes

Supported Formats

- PDF
- DOCX
- TXT

Future

- PPTX
- Images
- URLs

---

# 7. AI Behaviour

AI must remain invisible.

The workflow should be:

Input

↓

Cache Lookup

↓

Question Pool Exists?

↓

YES

Reuse Questions

↓

NO

Generate Question Pool

↓

Store Questions

↓

Return Assessment

---

AI should never be called unnecessarily.

---

# 8. AI Cost Optimization

The system should minimize AI API usage.

Instead of generating questions for every request:

Generate a large reusable question pool.

Example

Generate

100 Easy

100 Medium

100 Hard

Store the generated questions.

Future assessments should reuse existing questions whenever possible.

Only generate new questions when the existing pool is insufficient.

---

# 9. Question Pool

Question pools are reusable.

Each pool should contain

- Question
- Options
- Correct Answer
- Explanation
- Difficulty
- Topic
- Metadata

Pools should be searchable.

Pools should be reusable across multiple assessments.

---

# 10. File Handling

Uploaded documents are temporary.

Workflow

Upload

↓

Extract Text

↓

Generate Questions

↓

Delete Uploaded File

↓

Save Only

- Assessment
- Questions
- Answers
- Metadata

The original uploaded file should never be permanently stored.

Reason

Reduce storage usage and operating costs.

---

# 11. Guest Mode

Guest users can

- Create assessment
- Join assessment
- Share code
- Complete assessment
- View leaderboard

Guest users cannot

- Save history
- Edit previous assessments
- Access dashboard
- View analytics

Guest assessments may expire automatically after a configurable period.

---

# 12. Registered User Features

Registered users receive

- Dashboard
- Saved Assessments
- Question Library
- Analytics
- Assessment Management
- Profile
- History

---

# 13. Assessment Sharing

Every assessment receives

Unique Assessment Code

Users can share

- Code
- Direct Link

Participants join without registration.

---

# 14. Leaderboard

Leaderboard should display

- Rank
- Name
- Score
- Accuracy
- Time Taken

Optional

- Institution
- Country

---

# 15. Results

Results should include

Overall Score

Correct Answers

Wrong Answers

Accuracy

Time Taken

Review Answers

Leaderboard Position

---

# 16. Performance Requirements

The application should

- Minimize AI calls
- Reuse generated questions
- Lazy load pages
- Optimize API usage
- Cache repeated requests
- Delete temporary uploads

---

# 17. Security

- Validate uploaded files
- Limit upload size
- Protect assessments
- Secure API routes
- Prevent abuse
- Rate limit AI generation

---

# 18. Future Enhancements

- Multiple AI Providers
- AI Difficulty Calibration
- Image Questions
- Coding Assessments
- Import from URL
- Team Assessments
- Certificates
- Classroom Management

---

# 19. Success Criteria

A new user should be able to

Visit Website

↓

Click Create Assessment

↓

Enter Topic / Description / Upload Notes

↓

Generate Assessment

↓

Share Code

↓

Participants Join

↓

View Leaderboard

Without needing to create an account.

If this journey is smooth, Companio has achieved its primary product objective.

---

# 20. Source of Truth

This document is the highest-level product specification.

If implementation differs from this document, this document takes precedence.

Future implementation plans, UI changes, architecture updates, and feature development must align with this specification.
