# THEME_GUIDELINES.md

# Companio Theme Guidelines

Version: 1.0

Status: Official Theme Rules

---

# Philosophy

Companio is a professional SaaS platform.

The theme should communicate

Professional

↓

Trustworthy

↓

Modern

↓

Fast

↓

Simple

Never flashy.

Never distracting.

Never look like an AI application.

---

# Theme Modes

Supported

✅ Light

✅ Dark

✅ System

Default

Light

---

# Theme Toggle

Location

Navbar Right

Appearance

Sun / Moon Switch

Animation

Smooth

Duration

250ms

Remember Choice

Yes

Support OS Theme

Yes

---

# Light Theme

Feeling

Clean

Bright

Open

Professional

Background

Very light gray

Cards

Pure white

Primary

Blue

Text

Dark gray

Borders

Very subtle

Shadows

Soft

Illustrations

Minimal

Whitespace

Generous

---

# Dark Theme

Feeling

Elegant

Focused

Premium

Professional

Background

Deep navy

Cards

Dark slate

Primary

Blue

Accent

Purple

Text

Off-white

Borders

Subtle

Shadows

Very soft

Never use pure black.

---

# Color Rules

Never hardcode colors.

Always use semantic tokens.

Example

--background

--surface

--primary

--secondary

--text-primary

--text-secondary

--border

--success

--warning

--danger

---

# Theme Variables

Every component must use

CSS Variables

or

Tailwind Theme Tokens

Never

background: white

Never

color: black

---

# Typography

Light

Dark

must use

the same typography.

Never change fonts between themes.

---

# Shadows

Light Theme

Soft shadows

Dark Theme

Soft ambient shadows

Avoid

Heavy black shadows

---

# Borders

Light

Very subtle

Dark

Slightly brighter than background

Never high contrast.

---

# Cards

Both themes

20px radius

Soft shadows

Hover

Lift

Scale

1.02

Transition

200ms

---

# Buttons

Primary

Filled

Secondary

Outline

Ghost

Transparent

Danger

Red

Never change button sizes between themes.

---

# Icons

Lucide

Rounded

Outline

Icons never change style.

Only colors.

---

# Charts

Theme aware

Light

Blue

Green

Orange

Purple

Dark

Slightly brighter versions

Grid

Very subtle

---

# Tables

Theme aware

Header

Surface color

Hover

Primary tint

Border

Subtle

---

# Forms

Background

Theme aware

Focus

Primary Blue

Errors

Red

Success

Green

---

# Dialogs

Dark Overlay

Blur Background

Rounded

24px Padding

Theme aware

---

# Sidebar

Collapsed by default

Theme aware

Hover

Primary Tint

Selected

Primary Background

---

# Navbar

Transparent

↓

Solid after scrolling

↓

Theme aware

↓

Blur enabled

---

# Hero

Both themes should have

Large whitespace

Large typography

Minimal illustration

Rounded UI preview

Statistics section

Feature cards

CTA buttons

---

# Animations

Theme change

Fade

250ms

Card hover

Lift

Button hover

Scale

Never flashy.

Never bounce.

---

# Images

Use the same illustrations.

Only adjust colors.

Do not create separate artwork for each theme.

---

# Accessibility

Minimum WCAG AA contrast.

Keyboard navigation.

Visible focus states.

Large touch targets.

---

# Performance

Theme switching should not reload the page.

Should not flash white.

Should be instant.

---

# Storage

Store theme inside

localStorage

Fallback

System Theme

---

# Future Themes

Architecture should support

High Contrast

Corporate

University Branding

Custom Organization Themes

without changing component code.

---

# Developer Rules

Every component

must support

Light

Dark

System

before it can be merged.

Every page

must be visually tested

in both themes.

No exceptions.

---

# Design Approval Checklist

Before a page is approved:

✓ Looks good in Light

✓ Looks good in Dark

✓ Mobile responsive

✓ Desktop responsive

✓ Accessibility passes

✓ Theme switch works

✓ No hardcoded colors

✓ Smooth animations

✓ Consistent spacing

✓ Matches Companio Design Language
