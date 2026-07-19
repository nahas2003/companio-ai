# 24_AI_AGENT_WORKFLOW.md

> **Project:** Companio
> **Document:** AI Agent Workflow & Development Protocol
> **Version:** 1.0
> **Status:** Required Before AI Development

---

# 1. Purpose

This document defines how AI coding agents (such as Antigravity AI Agent) should contribute to the Companio project.

It establishes a standardized workflow to ensure all AI-generated code follows the project's architecture, development standards, and quality expectations.

This document applies to every AI-assisted implementation task.

---

# 2. Primary Objective

The AI agent must:

* Follow the documented architecture.
* Implement features incrementally.
* Produce maintainable code.
* Minimize architectural drift.
* Preserve existing functionality.
* Keep documentation synchronized with implementation.

The AI should behave as an implementation engineer—not as a product designer.

---

# 3. Required Reading Order

Before implementing any feature, the AI should review documents in the following order:

1. `README.md`
2. `docs/architecture/00_MASTER_PROJECT_SPECIFICATION.md`
3. `docs/architecture/21_PROJECT_CONSTITUTION.md`
4. Relevant architecture documents for the requested feature
5. Relevant development guide for the requested feature
6. Coding standards
7. Security checklist
8. Environment configuration

The AI should not begin implementation without sufficient architectural context.

---

# 4. Development Workflow

For every task, the AI should follow this sequence:

```text
Understand Request
        ↓
Read Relevant Documents
        ↓
Identify Affected Modules
        ↓
Plan Implementation
        ↓
Implement Small Changes
        ↓
Run Validation
        ↓
Run Tests
        ↓
Update Documentation (if required)
        ↓
Summarize Changes
```

Avoid making unrelated modifications.

---

# 5. Implementation Principles

The AI should:

* Make focused changes.
* Reuse existing modules.
* Prefer composition over duplication.
* Keep features modular.
* Respect existing interfaces.
* Avoid introducing unnecessary abstractions.

Every change should have a clear purpose.

---

# 6. File Modification Rules

The AI may:

* Add new files where appropriate.
* Modify relevant feature modules.
* Extend shared utilities when justified.
* Update documentation for implemented changes.

The AI must not:

* Rewrite unrelated modules.
* Rename core architecture without instruction.
* Delete existing functionality.
* Introduce breaking changes without explicit approval.

---

# 7. Documentation Responsibilities

Whenever implementation changes affect project behavior, update:

* Architecture documents (if design changes)
* Development guides (if workflow changes)
* API documentation (if contracts change)
* README (if setup changes)

Documentation should remain aligned with implementation.

---

# 8. Code Quality Expectations

Generated code should:

* Compile successfully.
* Pass linting.
* Pass type checking.
* Follow project naming conventions.
* Include appropriate validation.
* Handle errors consistently.

Avoid placeholder implementations unless explicitly requested.

---

# 9. Testing Requirements

For every implemented feature:

* Add or update unit tests.
* Add integration tests where appropriate.
* Verify affected user flows.
* Ensure no regressions are introduced.

Do not mark work as complete without validation.

---

# 10. AI-Specific Guardrails

The AI should never:

* Invent undocumented requirements.
* Ignore project architecture.
* Hardcode secrets.
* Bypass authentication or authorization.
* Skip validation.
* Duplicate existing functionality.
* Leave incomplete TODOs without explanation.

When uncertain, follow the documented architecture rather than guessing.

---

# 11. Prompt Interpretation

When a request is ambiguous:

1. Prefer the documented architecture.
2. Preserve existing behavior.
3. Implement the smallest reasonable change.
4. Avoid speculative features.

Consistency is more important than creativity.

---

# 12. Completion Checklist

Before considering a task complete, verify:

* Code builds successfully.
* Relevant tests pass.
* No linting errors remain.
* Documentation is updated if required.
* No unrelated files were modified.
* Existing functionality remains intact.

---

# 13. Communication Expectations

After completing work, provide:

* Summary of changes
* Files created or modified
* Testing performed
* Known limitations
* Recommended next steps

Keep summaries concise and actionable.

---

# 14. Continuous Improvement

The AI should:

* Learn from project conventions.
* Reuse established patterns.
* Prefer consistency over novelty.
* Suggest improvements without implementing them automatically.

Architectural changes require explicit approval.

---

# 15. Common Mistakes to Avoid

Avoid:

* Making broad repository-wide changes.
* Mixing multiple features in one implementation.
* Ignoring coding standards.
* Updating generated files manually if they have a defined generation process.
* Creating duplicate services or utilities.

---

# 16. Acceptance Criteria

The AI workflow is successful when:

* Implementations follow architecture.
* Code quality standards are met.
* Documentation remains synchronized.
* Features are modular and maintainable.
* Human review is straightforward.

---

# 17. Definition of Done

An AI-assisted task is complete when:

* Requested functionality is implemented.
* Quality checks pass.
* Documentation is current.
* The implementation aligns with project architecture.
* No unintended side effects are introduced.

---

# 18. AI Development Lifecycle

```text
User Request
      ↓
Architecture Review
      ↓
Development Guide Review
      ↓
Implementation Plan
      ↓
Code Changes
      ↓
Validation
      ↓
Testing
      ↓
Documentation Update
      ↓
Human Review
      ↓
Merge
```

This lifecycle should be followed for every implementation task.

---

# 19. AI Collaboration Principles

When collaborating with human developers:

* Respect previous architectural decisions.
* Explain significant implementation choices.
* Keep commits focused.
* Surface risks early.
* Ask for clarification when requirements conflict with documented architecture.

The AI is a collaborator, not the final decision-maker.

---

# 20. Project Success Criteria

The AI's contribution is considered successful when:

* The implementation is correct.
* The codebase remains consistent.
* Documentation stays accurate.
* Future maintenance is simplified.
* The project continues to evolve without architectural drift.

---

# End of Development Documentation Series

This document concludes the Companio Development Documentation series (00–24).

Together with the Architecture Documentation, it forms the complete implementation reference for both human developers and AI coding agents.
