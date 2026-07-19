# 18_RESULTS_AND_ANALYTICS.md

> **Project:** Companio
> **Document:** Results & Analytics
> **Version:** 1.0 (MVP)
> **Priority:** High
> **Depends On:** 00–17

---

# 1. Purpose

This document defines how assessment outcomes are evaluated, stored, presented, and analyzed.

The **Result** is the canonical record of a participant's completed assessment and serves as the source of truth for all downstream features.

---

# 2. Objectives

The Results & Analytics module should:

* Produce accurate assessment results.
* Preserve immutable result records.
* Support participant history.
* Enable creator analytics.
* Power leaderboards and reports.
* Provide a foundation for future insights.

---

# 3. Core Concepts

## Attempt

A participant's interaction with a published assessment.

An Attempt is temporary while the assessment is in progress.

---

## Result

A finalized, immutable record generated after evaluating an Attempt.

Results are never edited. If recalculation is required due to a system issue, a new result version should be created while preserving the original.

---

# 4. Data Flow

```text id="res001"
Published Assessment
          │
          ▼
Assessment Attempt
          │
          ▼
Evaluation Engine
          │
          ▼
Result
    ┌─────┼─────────────┐
    ▼     ▼             ▼
History Leaderboard Analytics
```

---

# 5. Result Fields

Each Result should include:

* Result ID
* Attempt ID
* Participant ID
* Published Assessment ID
* Total questions
* Correct answers
* Incorrect answers
* Unanswered questions
* Score
* Percentage
* Completion time
* Submission timestamp
* Pass/Fail status
* Evaluation version
* Created timestamp

Additional metadata may be stored without changing the public contract.

---

# 6. Evaluation Rules

The Evaluation Engine should:

* Calculate the score.
* Determine pass/fail status.
* Calculate percentage.
* Measure completion time.
* Validate answer integrity.
* Produce a Result record.

Evaluation must occur on the server.

---

# 7. Participant History

Registered users may view:

* Completed assessments.
* Scores.
* Percentages.
* Completion dates.
* Performance trends.

Guests may only view history if explicitly supported by future identity-linking features.

---

# 8. Creator Analytics

Creators should be able to view:

* Total participants.
* Completion rate.
* Average score.
* Highest score.
* Lowest score.
* Pass percentage.
* Score distribution.
* Question-level performance (future).

---

# 9. Dashboard Metrics

Suggested metrics:

* Assessments published.
* Active assessments.
* Total attempts.
* Completed attempts.
* Average completion time.
* Average participant score.

These metrics are derived from Result records.

---

# 10. Reporting

Support:

* Participant summaries.
* Assessment summaries.
* Performance exports.
* CSV export (future).
* PDF reports (future).

Reports should be generated from Result data.

---

# 11. Certificates

Future certificate generation should use Result records.

Eligibility may depend on:

* Passing score.
* Completion status.
* Assessment settings.
* Creator-defined criteria.

---

# 12. APIs

Primary endpoints:

* `GET /results/{id}`
* `GET /results/me`
* `GET /results/assessment/{publishedAssessmentId}`
* `GET /analytics/assessment/{publishedAssessmentId}`
* `GET /analytics/dashboard`

---

# 13. Database Usage

Primary entities:

* attempts
* results
* participants
* published_assessments

Result records should remain immutable after creation.

---

# 14. Security

Rules:

* Participants access only their own results unless broader visibility is configured.
* Creators access results for assessments they own.
* Administrators access platform-wide analytics according to policy.
* Analytics should respect privacy requirements.

---

# 15. Performance

Recommendations:

* Precompute frequently used aggregates where appropriate.
* Cache dashboard metrics.
* Refresh analytics incrementally as new Results are created.
* Avoid recalculating unchanged Result records.

---

# 16. Error Handling

Handle:

* Result not found.
* Attempt still in progress.
* Evaluation failure.
* Unauthorized access.
* Analytics unavailable.

Return clear, user-friendly responses.

---

# 17. Future Enhancements

* Progress tracking.
* AI-powered performance insights.
* Personalized study recommendations.
* Question difficulty calibration.
* Trend analysis.
* Organization reports.
* Benchmark comparisons.
* Learning path suggestions.

---

# 18. AI Implementation Rules

Every AI coding agent must:

* Treat Results as immutable.
* Derive analytics from Result records.
* Keep evaluation logic server-side.
* Avoid storing redundant calculated values unless justified for performance.
* Maintain compatibility with future analytics features.

---

# 19. Acceptance Criteria

The feature is complete when:

* Attempts are evaluated correctly.
* Results are stored immutably.
* Participant history is available.
* Creator analytics are generated.
* Dashboard metrics are accurate.
* Reports use Result data.
* Security and privacy rules are enforced.

---

# 20. Document Relationships

## Depends On

* 00–17

## Used By

* 19_TESTING_STRATEGY.md
* Future Certificate module
* Future Reporting module
* Future AI Insights module

## Related Documents

* 12_ASSESSMENT_MODE.md
* 17_LEADERBOARD.md
* 08_SECURITY_ARCHITECTURE.md
