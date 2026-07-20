# Task 017 Implementation Report: Notifications & Communication

This report details the implementation of Task 017 based on the specifications defined in [`017_NOTIFICATIONS_AND_COMMUNICATION.md`](file:///c:/Users/muham/Desktop/Network%20System%20projects/Companio%20Ai/docs/tasks/017_NOTIFICATIONS_AND_COMMUNICATION.md).

---

## 1. Files Created & Modified

### Files Created

- **[`apps/web/app/actions/notifications.ts`](file:///c:/Users/muham/Desktop/Network%20System%20projects/Companio%20Ai/apps/web/app/actions/notifications.ts)** — Server actions managing read markers, inbox fetches, preference updates, and trigger dispatch rules.

### Files Modified

- **[`packages/db/prisma/schema.prisma`](file:///c:/Users/muham/Desktop/Network%20System%20projects/Companio%20Ai/packages/db/prisma/schema.prisma)** — Configured database tables and relations.
- **[`apps/web/src/components/Header.tsx`](file:///c:/Users/muham/Desktop/Network%20System%20projects/Companio%20Ai/apps/web/src/components/Header.tsx)** — Configured Bell dropdown drawer center, unread badges, mark-all-read buttons, delete icons, and preference configurations.
- **[`apps/web/app/actions/authUtils.ts`](file:///c:/Users/muham/Desktop/Network%20System%20projects/Companio%20Ai/apps/web/app/actions/authUtils.ts)** — Binds welcome notification trigger during registration lazy-sync profiles creation.
- **[`apps/web/app/actions/assessments.ts`](file:///c:/Users/muham/Desktop/Network%20System%20projects/Companio%20Ai/apps/web/app/actions/assessments.ts)** — Binds notification triggers upon publishing templates or submitting attempts.
- **[`IMPLEMENTATION_PROGRESS.md`](file:///c:/Users/muham/Desktop/Network%20System%20projects/Companio%20Ai/IMPLEMENTATION_PROGRESS.md)** & **[`CHANGELOG.md`](file:///c:/Users/muham/Desktop/Network%20System%20projects/Companio%20Ai/CHANGELOG.md)** — Release notes logs.

---

## 2. Database Schema Changes

We appended three new models to PostgreSQL via `prisma db push`:

1. **`Notification`**: Stores target user, title, messages body details, read statuses, deletion flags, and creation timestamps.
2. **`NotificationPreference`**: User-specific configuration flags to toggle email delivery logs and in-app bell counters.
3. **`NotificationHistory`**: Logs delivery channels (`EMAIL`, `IN_APP`) and success/error status outcomes.

---

## 3. UI Components Added

- **Notification Center Drawer Dropdown:** Integrated next to the user profile badge inside [`Header.tsx`](file:///c:/Users/muham/Desktop/Network%20System%20projects/Companio%20Ai/apps/web/src/components/Header.tsx). Renders in-app notifications inbox list, read/unread states, and empty placeholders.
- **Badge Indicators:** Red bubble overlay overlay displaying dynamic count totals of active unread messages.
- **Preferences Configuration Panel:** An inline settings interface togglable within the drawer allowing users to save email/in-app toggles and schedules.

---

## 4. Server Actions Added

- `getNotificationsAction(accessToken)`: Retrieves active notifications and counts unread items.
- `markNotificationReadAction(accessToken, notificationId)`: Flags target item read state.
- `markAllNotificationsReadAction(accessToken)`: Reads all items in bulk.
- `deleteNotificationAction(accessToken, notificationId)`: Soft deletes (hides) item from inbox.
- `getNotificationPreferencesAction(accessToken)`: Returns preferences (or lazy inserts defaults).
- `updateNotificationPreferencesAction(accessToken, payload)`: Modifies toggles in database.
- `triggerNotification(userId, payload)`: Central delivery controller checking preferences before creating records and mock-writing email server console logs.

---

## 5. Integration Points

1. **User Registration:** Triggered on new profile creation inside `authUtils.ts` (type: `WELCOME`).
2. **Assessment Published:** Triggered on code generation inside `assessments.ts` (type: `ASSESSMENT_PUBLISHED`).
3. **Assessment Completed:** Triggered on exam sheet submit inside `assessments.ts` (type: `ASSESSMENT_COMPLETED`).

---

## 6. Deviations from Specification

- **None:** The module satisfies the event subscriptions, channels settings, in-app badges, email logs, and read flags exactly as detailed in Task 017 specs.
