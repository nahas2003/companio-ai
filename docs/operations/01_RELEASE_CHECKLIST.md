# 01_RELEASE_CHECKLIST.md

> **Project:** Companio
> **Document Type:** Operations Guide
> **Version:** 1.0
> **Status:** Living Document

---

# 1. Purpose

This checklist defines the minimum verification steps required before releasing Companio to staging or production.

Its objectives are to:

- Reduce deployment risk.
- Improve release quality.
- Ensure consistency across releases.
- Verify operational readiness.
- Provide a repeatable release process.

No deployment should proceed without completing this checklist.

---

# 2. Release Information

Record the following information for each release:

| Field            | Value                              |
| ---------------- | ---------------------------------- |
| Version          |                                    |
| Release Date     |                                    |
| Environment      | Development / Staging / Production |
| Release Owner    |                                    |
| Approver         |                                    |
| Release Type     | Feature / Patch / Hotfix           |
| Rollback Version |                                    |

---

# 3. Pre-Release Planning

Verify:

- Release scope is finalized.
- All planned tasks are completed.
- Outstanding issues are reviewed.
- High-priority defects are resolved or accepted.
- Stakeholders have been informed (if applicable).

---

# 4. Code Quality

Confirm:

- Code review completed.
- Coding standards followed.
- No debug code remains.
- No temporary workarounds left in production code.
- No unresolved merge conflicts.
- No unnecessary commented code.

---

# 5. Testing Checklist

Verify:

## Automated Testing

- Unit tests pass.
- Integration tests pass.
- API tests pass.
- End-to-end tests pass (if applicable).

## Manual Testing

- Critical user flows verified.
- Authentication works.
- Practice Mode works.
- Assessment workflow works.
- AI question generation works.
- Dashboard loads correctly.
- Notifications function correctly.
- Administration pages operate as expected.

---

# 6. Database Validation

Confirm:

- Required migrations have been reviewed.
- Migrations execute successfully.
- Rollback strategy exists where practical.
- Seed data is valid.
- Database backups are available before production changes.

---

# 7. Security Review

Verify:

- Secrets are not committed to source control.
- Environment variables are configured correctly.
- Authentication works.
- Authorization rules are enforced.
- File upload restrictions are active.
- Rate limiting is enabled.
- Dependency vulnerabilities have been reviewed.

---

# 8. Performance Verification

Confirm:

- Application builds successfully.
- Bundle size reviewed.
- Slow queries optimized.
- API performance verified.
- Large file uploads tested.
- AI response times reviewed.

---

# 9. Infrastructure Readiness

Verify:

- Environment variables are complete.
- Storage is accessible.
- Database connectivity works.
- AI provider configuration is valid.
- Email services are operational.
- Monitoring systems are available.

---

# 10. Logging & Monitoring

Confirm:

- Application logging enabled.
- Error logging operational.
- Audit logging active.
- Health checks responding.
- Monitoring dashboards available.
- Alerts configured for critical failures.

---

# 11. Documentation Review

Ensure the following are up to date:

- README
- CHANGELOG
- Deployment Guide
- API Reference
- Database Dictionary
- Architecture documents
- Task documentation (if applicable)

---

# 12. Deployment Checklist

Before deployment:

- Build artifacts generated successfully.
- Version number updated.
- Release notes prepared.
- Configuration validated.
- Rollback plan confirmed.
- Maintenance window communicated (if required).

---

# 13. Post-Deployment Verification

Immediately after deployment:

- Application starts successfully.
- Login works.
- Dashboard loads.
- File uploads succeed.
- AI services respond correctly.
- Practice Mode works.
- Assessment flow completes successfully.
- Results are generated.
- Notifications are delivered.
- Admin functions are accessible.

---

# 14. Rollback Criteria

Rollback should be considered if:

- Critical authentication failures occur.
- Data corruption is detected.
- AI services consistently fail.
- Core workflows become unusable.
- Severe performance degradation occurs.
- Security vulnerabilities are identified after deployment.

---

# 15. Release Approval

Before marking the release complete:

| Role                     | Name | Date | Approval |
| ------------------------ | ---- | ---- | -------- |
| Release Owner            |      |      |          |
| Technical Reviewer       |      |      |          |
| Product Owner (Optional) |      |      |          |

---

# 16. AI Agent Guidelines

Before initiating a deployment, the AI agent should:

1. Confirm all checklist items have been reviewed.
2. Report any failed checks.
3. Refuse to mark a release as complete if critical items remain unresolved.
4. Summarize release risks and mitigation steps.
5. Record the release version and validation results.

---

# 17. Maintenance

Review and update this checklist whenever:

- The deployment process changes.
- New infrastructure is introduced.
- Security requirements evolve.
- Testing standards are updated.
- Release governance changes.

This checklist should be used for every staging and production release to ensure consistent quality and operational readiness.
