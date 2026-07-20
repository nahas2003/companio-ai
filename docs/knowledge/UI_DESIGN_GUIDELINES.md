# UI_DESIGN_GUIDELINES.md

> **Project:** Companio
> **Document Type:** Knowledge Base
> **Version:** 1.0
> **Status:** Living Document

---

# 1. Purpose

This document defines the visual design principles and user interface standards for Companio.

It ensures consistency across all screens and provides guidance for developers, designers, and AI coding agents.

---

# 2. Design Principles

The interface should be:

- Clean
- Modern
- Accessible
- Responsive
- Consistent
- Minimal
- User-focused

Every screen should prioritize readability and task completion over visual complexity.

---

# 3. Design System

The design system should include:

- Color palette
- Typography
- Spacing scale
- Border radius
- Shadows
- Icons
- Layout grid
- Motion guidelines

These design tokens should be centralized and reused throughout the application.

---

# 4. Color Guidelines

Define semantic color roles instead of hardcoding colors.

Recommended roles:

- Primary
- Secondary
- Success
- Warning
- Error
- Information
- Background
- Surface
- Border
- Text Primary
- Text Secondary
- Disabled

Avoid assigning meaning through color alone. Pair colors with text, icons, or other indicators.

---

# 5. Typography

Define a consistent type scale.

Recommended text styles:

- Display
- Heading 1
- Heading 2
- Heading 3
- Heading 4
- Body Large
- Body
- Small
- Caption
- Label

Guidelines:

- Use consistent font weights.
- Maintain comfortable line height.
- Avoid excessive text sizes.
- Limit the number of font families.

---

# 6. Spacing

Adopt a consistent spacing scale.

Examples:

- Extra Small (XS)
- Small (S)
- Medium (M)
- Large (L)
- Extra Large (XL)

Use spacing consistently for:

- Margins
- Padding
- Gaps
- Sections
- Component alignment

---

# 7. Layout

Standard page structure:

```text id="ydf4xz"
Header
Sidebar
Content
Footer (optional)
```

Guidelines:

- Keep navigation consistent.
- Maintain predictable page widths.
- Use responsive grids.
- Avoid unnecessary nesting.

---

# 8. Responsive Design

Support:

- Mobile
- Tablet
- Laptop
- Desktop

Guidelines:

- Mobile-first approach where practical.
- Flexible layouts.
- Responsive navigation.
- Scalable typography.
- Touch-friendly controls.

---

# 9. Navigation

Primary navigation should remain consistent across the application.

Include:

- Sidebar
- Top navigation
- Breadcrumbs
- Page titles
- Back navigation where appropriate

Users should always know:

- Where they are.
- How to navigate back.
- What actions are available.

---

# 10. Forms

Forms should:

- Clearly label all fields.
- Indicate required inputs.
- Validate before submission where appropriate.
- Display inline validation messages.
- Preserve entered data when possible after validation errors.

Group related fields logically to reduce cognitive load.

---

# 11. Tables

Tables should support:

- Sorting
- Filtering
- Pagination
- Responsive layouts
- Empty states
- Loading states

Avoid horizontal scrolling whenever practical.

---

# 12. Cards

Use cards for:

- Dashboards
- Statistics
- Learning materials
- Assessments
- AI results
- User information

Each card should have a clear visual hierarchy.

---

# 13. Dialogs & Modals

Dialogs should:

- Explain the action clearly.
- Indicate destructive operations.
- Support keyboard interaction.
- Trap focus while open.
- Provide clear confirmation and cancellation actions.

---

# 14. Icons

Use a single icon library throughout the application.

Guidelines:

- Use icons to support, not replace, text.
- Maintain consistent sizing.
- Avoid decorative overuse.
- Pair icons with labels where ambiguity may arise.

---

# 15. Feedback States

Provide clear feedback for:

- Loading
- Success
- Error
- Warning
- Empty data
- Offline (if applicable)

Avoid leaving users without feedback during long-running operations.

---

# 16. Accessibility

Aim to meet WCAG 2.1 AA standards where practical.

Guidelines:

- Keyboard navigation
- Visible focus indicators
- Semantic HTML
- Appropriate ARIA attributes
- Sufficient color contrast
- Screen reader compatibility
- Descriptive labels for interactive elements

Accessibility should be considered throughout the design process rather than added later.

---

# 17. Motion & Animation

Animations should:

- Support user understanding.
- Be subtle and purposeful.
- Avoid unnecessary distraction.
- Respect reduced-motion user preferences where supported.

Use transitions to communicate state changes rather than for decoration.

---

# 18. Consistency Rules

Maintain consistency across:

- Colors
- Typography
- Button styles
- Form layouts
- Navigation
- Icons
- Error messages
- Page spacing

Avoid introducing unique patterns for individual pages unless justified.

---

# 19. AI Agent Guidelines

Before creating a new screen, the AI agent should:

1. Reuse existing layouts and components.
2. Follow the established design tokens.
3. Maintain responsive behavior.
4. Respect accessibility requirements.
5. Preserve consistent navigation patterns.
6. Update these guidelines if a new global design standard is introduced.

---

# 20. Maintenance

Update this document whenever:

- The design system changes.
- New global UI patterns are introduced.
- Accessibility standards evolve.
- Navigation patterns change.
- Design tokens are updated.
