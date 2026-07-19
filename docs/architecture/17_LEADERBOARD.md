# 17_LEADERBOARD.md

> **Project:** Companio
> **Document:** Leaderboard & Ranking Engine
> **Version:** 1.0 (MVP)
> **Priority:** Medium
> **Depends On:** 00–16

---

# 1. Purpose

The Leaderboard presents ranked participant performance for published assessments.

It is a **derived view** of assessment results and must not be treated as the source of truth.

The source of truth is the **Result** generated after an assessment attempt is evaluated.

---

# 2. Objectives

The ranking engine should:

* Rank participants fairly.
* Support configurable ranking strategies.
* Handle ties consistently.
* Scale to large participant counts.
* Be reusable for future ranking scenarios.

---

# 3. Data Flow

```text
Published Assessment
          │
          ▼
Assessment Attempt
          │
          ▼
Evaluation
          │
          ▼
Result
          │
    ┌─────┴─────┐
    ▼           ▼
Leaderboard   Analytics
```

---

# 4. Ranking Strategy

## MVP Priority Order

1. Higher score.
2. Shorter completion time.
3. Earlier submission timestamp.

If all criteria are equal, participants share the same rank.

---

# 5. Ranking Fields

Each leaderboard entry should include:

* Rank
* Participant display name
* Score
* Percentage
* Completion time
* Submission time

Optional fields depend on assessment settings.

---

# 6. Leaderboard Types

## MVP

* Per Published Assessment

## Future

* Organization leaderboard
* Class leaderboard
* Monthly leaderboard
* Weekly leaderboard
* Overall platform leaderboard
* Subject leaderboard

---

# 7. Visibility

The creator controls whether a leaderboard is:

* Public
* Participants only
* Creator only
* Disabled

If disabled, rankings must not be exposed to participants.

---

# 8. Tie Handling

If multiple participants have identical ranking values:

* Assign the same rank.
* Skip subsequent rank numbers as appropriate.

Example:

```text
Rank 1
Rank 2
Rank 2
Rank 4
```

---

# 9. Performance

Recommendations:

* Calculate rankings after result generation.
* Cache leaderboard views.
* Refresh only when new results are added.
* Avoid recomputing unchanged rankings.

---

# 10. APIs

Primary endpoints:

* `GET /leaderboards/{publishedAssessmentId}`
* `GET /leaderboards/{publishedAssessmentId}/top`
* `GET /leaderboards/{publishedAssessmentId}/me`

Future endpoints may support additional leaderboard scopes.

---

# 11. Database Usage

Primary entities:

* published_assessments
* participants
* attempts
* results

The leaderboard itself may be generated dynamically or cached, but it should not replace the underlying result records.

---

# 12. Security

Rules:

* Respect assessment visibility settings.
* Never expose hidden participant information.
* Enforce authorization for creator-only views.
* Prevent unauthorized access to private rankings.

---

# 13. Error Handling

Handle:

* Assessment not found.
* Leaderboard disabled.
* No completed results.
* Unauthorized access.
* Ranking calculation failure.

Provide clear responses without exposing internal details.

---

# 14. Future Enhancements

* Negative marking support.
* Weighted ranking.
* Section-wise ranking.
* Percentile calculation.
* Achievement badges.
* Certificates based on rank.
* Export to CSV/PDF.
* Live leaderboard updates.

---

# 15. AI Implementation Rules

Every AI coding agent must:

* Treat the leaderboard as a derived view.
* Never modify Result records during ranking.
* Keep ranking logic deterministic.
* Support future ranking strategies without breaking existing APIs.

---

# 16. Acceptance Criteria

The feature is complete when:

* Results can be ranked.
* Ties are handled consistently.
* Visibility rules are enforced.
* Rankings update after new results.
* APIs return correct leaderboard data.
* Performance remains acceptable for expected participant volumes.

---

# 17. Document Relationships

## Depends On

* 00–16

## Used By

* 18_RESULTS_AND_HISTORY.md
* Future Analytics modules
* Certificate generation

## Related Documents

* 08_SECURITY_ARCHITECTURE.md
* 12_ASSESSMENT_MODE.md
* 15_QUESTION_BANK.md
