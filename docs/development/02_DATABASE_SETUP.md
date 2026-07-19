# 02_DATABASE_SETUP.md

> **Project:** Companio
> **Document:** Database Setup Guide
> **Version:** 1.0
> **Status:** Active

---

# 1. Purpose

This document defines how to implement the Companio database in Supabase/PostgreSQL. It translates the database architecture into a practical development sequence, ensuring migrations, security, and relationships are created consistently.

This guide assumes the project setup phase has been completed successfully.

---

# 2. Objectives

By the end of this phase:

* Supabase project is configured.
* Database schema is implemented.
* Row Level Security (RLS) is enabled where appropriate.
* Initial migrations are applied.
* Core relationships are validated.
* Development and staging databases are synchronized.

---

# 3. Prerequisites

Complete before starting:

* `00_MASTER_DEVELOPMENT_PLAN.md`
* `01_PROJECT_SETUP.md`

Review these architecture documents:

* `05_DATABASE_ARCHITECTURE.md`
* `16_AUTHENTICATION.md`
* `21_PROJECT_CONSTITUTION.md`

---

# 4. Migration Strategy

Database changes must be managed through versioned migrations.

Rules:

* Never edit production tables manually.
* Every schema change requires a new migration.
* Migrations should be reversible where practical.
* Test migrations in a development environment before promotion.

---

# 5. Implementation Order

Create database objects in this sequence to satisfy dependencies:

1. Authentication-related tables (if applicable beyond Supabase Auth)
2. User profiles
3. Organizations (future-ready, if included)
4. Sources
5. Content ingestion metadata
6. Question Banks
7. Question Bank versions
8. Questions
9. Assessment Templates
10. Published Assessments
11. Assessment Attempts
12. Results
13. Leaderboards (or supporting views/materialized views)
14. Audit or activity logs (if implemented)

Do not create dependent tables before their parent entities exist.

---

# 6. Constraints and Relationships

For every table:

* Define primary keys.
* Define foreign keys.
* Add appropriate indexes.
* Apply uniqueness constraints where required.
* Avoid redundant data unless justified for performance.

Validate referential integrity after each migration.

---

# 7. Row Level Security (RLS)

Enable RLS on user-owned data.

General guidelines:

* Users may access only their own private resources.
* Public resources should have explicit read policies.
* Administrative roles require dedicated policies.
* Service-role access should be restricted to backend operations.

Review every policy before deployment.

---

# 8. Seed Data

Development environments may include seed data for:

* Roles
* Sample users
* Example Sources
* Example Question Banks
* Example Assessments

Production environments should not rely on development seed data.

---

# 9. Validation Checklist

After applying migrations, verify:

* All tables exist.
* Foreign keys are valid.
* Indexes are present.
* RLS policies are active.
* Example records can be created.
* Example records can be queried according to permissions.
* Cascading behavior matches the design.

---

# 10. Rollback Strategy

If a migration fails:

1. Stop further deployments.
2. Restore the previous migration state if possible.
3. Correct the migration.
4. Re-run validation.
5. Continue only after successful verification.

Avoid manual fixes directly in production.

---

# 11. Deliverables

Completion of this phase should provide:

* Version-controlled migrations.
* Secure database schema.
* Verified relationships.
* Working RLS policies.
* Initial development data (if applicable).

---

# 12. Exit Criteria

Proceed to the Authentication development phase only when:

* Database schema is complete for the current milestone.
* Security policies are functioning.
* Migrations are repeatable.
* Validation checklist passes without critical issues.

---

# 13. Related Documents

## Depends On

* 00_MASTER_DEVELOPMENT_PLAN.md
* 01_PROJECT_SETUP.md

## Architecture

* 05_DATABASE_ARCHITECTURE.md
* 16_AUTHENTICATION.md
* 21_PROJECT_CONSTITUTION.md

## Next Development Document

* 03_AUTHENTICATION.md
