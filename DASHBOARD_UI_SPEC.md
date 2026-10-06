# EMS Dashboard UI Specification

| | |
|---|---|
| **Audience** | Teacher / evaluator of the school project |
| **Based on** | [EMS_System_Documentation.md](EMS_System_Documentation.md) v2.1 (Sections 3, 5.1, 6.1, 7, 8) |
| **Covers** | Shared app shell, Employee Dashboard, Manager Dashboard |
| **Status** | Design spec. The dashboards are not built yet. Only the login screens exist. |

## Contents

1. [Visual Language](#1-visual-language)
2. [App Shell](#2-app-shell)
3. [Employee Dashboard](#3-employee-dashboard)
4. [Manager Dashboard](#4-manager-dashboard)
5. [Shared States](#5-shared-states)
6. [Responsive Behavior](#6-responsive-behavior)
7. [Accessibility](#7-accessibility)
8. [Open Questions](#8-open-questions)

---

## 1. Visual Language

The dashboards continue the login screens: dark teal background, frosted glass surfaces, and the faceted polygon backdrop.

| Token | Value | Use |
|---|---|---|
| Background | `#0a1f1e` to `#0d2a28` | Page base |
| Glass surface | `rgba(255,255,255,0.10)` with 28px blur, 1.5px border at 45% white | Cards, sidebar |
| Accent teal | `#2d6b68` (hover `#37827e`) | Primary buttons, active nav |
| Link cyan | `#38bdf8` | Text links only |
| Text | `#ffffff` primary, `#d1e2e1` muted | All copy |
| Present | `#10B981` | Attendance chart, Present |
| Late | `#F59E0B` | Late |
| Half-day | `#3B82F6` | Half-day |
| Absent | `#EF4444` | Absent, errors |
| Rest day / No log | `#64748B` | Rest day, No log |

**Type:** Geist Sans (already loaded in the app). Page titles 28px semibold, card titles 16px semibold, body 14px, captions 12px. Sentence case everywhere. Buttons say what they do ("Time in", "Review task").

**Shape:** Cards use 24px radius. Inputs and buttons use pill radius, as on the login. Sidebar items use 14px radius.

**Color is never the only signal.** Every status chip shows its text label next to its color (Section 7).

---

## 2. App Shell

Every screen after login uses the same shell.

```
+-----------+--------------------------------------------------+
| [G] EMS   |  Page title                       [bell] [avatar] |
|           |--------------------------------------------------|
| Dashboard |                                                  |
| Announce..|                                                  |
| Task      |              Page content                        |
| DTR       |                                                  |
| Leave     |                                                  |
|           |                                                  |
| [avatar]  |                                                  |
| John Doe  |                                                  |
| Log out   |                                                  |
+-----------+--------------------------------------------------+
```

| Part | Behavior |
|---|---|
| Sidebar | 240px wide, always visible on desktop. The active item has a teal fill and a left accent bar. |
| Profile block | Bottom of the sidebar. Shows avatar, name, position. Click opens Profile. |
| Log out | Below the profile block. Clears the session and returns to Login. |
| Items | Role decides the list: Employee has 5 items (Dashboard, Announcement, Task, DTR, Leave Request). Manager has Dashboard, Announcements, Employees, Task, Leave Request. |
| Badges | Announcement shows the unread count. Task shows the count of tasks needing action. |

The role comes from the signed-in account. Visiting the other role's pages redirects to the user's own Dashboard.

---

## 3. Employee Dashboard

**Job of the page:** answer "What do I need to do today, and how is my week going?" at a glance.

### 3.1 Layout

```
+--------------------------------------------------------------+
| Good morning, John                                           |
+----------------------------------+---------------------------+
| Attendance overview              | Time tracker              |
| Week of Sep 29 - Oct 5           |   09:12:44 AM             |
| [bar chart Mon..Sun]             |   Mon, Oct 6              |
| Total: 38.5 h                    |   Shift 9:00 AM - 6:00 PM |
|                                  |   Grace period: 15 min    |
|                                  |   Status: Not timed in    |
|                                  |   [      Time in      ]   |
+----------------------------------+---------------------------+
| Announcements                    | Tasks                     |
| (3 latest, unread dot)  View all | (3 latest)        View all|
+----------------------------------+---------------------------+
```

The page has four widgets. There is no calendar widget (Doc 1.2).

### 3.2 Widgets

| Widget | Content | Interaction |
|---|---|---|
| **Attendance overview** | Bar chart of hours per day for the latest completed week (Mon to Sun) with a weekly total. Bars use the status colors. Days with no hours show a text label: Absent, Rest, or No log. | Hover or focus a bar for date, time in, time out, hours, and status. The chart moves to the new week at the end of each week. |
| **Time tracker** | Live clock and date, shift (9:00 AM to 6:00 PM), 15-minute grace note, running session timer, current status, and one button. Links to the DTR page. | **Time in** starts the timer and records the time. The button becomes **Time out**. Time in after 9:15 AM records the day as Late (Doc 7.2). |
| **Announcements preview** | 3 latest items: category tag, event date, poster, title. Green dot on unread. | Click opens the announcement and clears its dot. **View all** goes to Announcements. |
| **Tasks preview** | 3 latest tasks: title, status, priority, supervisor, due date. An **Overdue** tag when past due. | Click opens the task. **View all** goes to Tasks. |

### 3.3 Rules

- The dashboard is read-only except the Time in / Time out button.
- Attendance statuses come from the DTR rules in Doc Section 7. The dashboard never lets the employee choose a status.
- Time in / out is the backup record. The entrance clock-in stays the primary source.
- Hours = Time out - Time in - 1 hour break.

---

## 4. Manager Dashboard

**Job of the page:** answer "What needs my decision, and how is my department doing today?"

### 4.1 Layout

```
+--------------------------------------------------------------+
| Good morning, Sarah          [+ Post announcement] [+ Assign task] |
+----------------------------------+---------------------------+
| Today's attendance               | Pending approvals         |
| [donut]  Present 8  Late 2       | Leave (3)                 |
|          Absent 1  On leave 1    |  Jane - Sick, Oct 8-9 [v][x]
|                      Review >    | Task review (2)           |
|                                  |  Report draft  [Review]   |
+----------------------------------+---------------------------+
| Department tasks                                             |
| [Active 12] [In review 2] [Completed 31] [Overdue 3]         |
+--------------------------------------------------------------+
```

### 4.2 Widgets

| Widget | Content | Interaction |
|---|---|---|
| **Today's attendance** | Donut chart of the department's attendance today using the 5 unified statuses, plus On leave. Counts are shown as text beside the chart. | Click a segment to open Employees > Attendance filtered to that status. |
| **Pending approvals** | Two lists: pending leave requests and task deliverables In Review. | Leave rows have **Approve** and **Reject** with a confirmation. Task rows have **Review**, which opens the review modal. |
| **Department tasks** | Four metric cards: Active, In review, Completed, Overdue. | Click a card to open Task filtered to that status. |
| **Quick actions** | **Post announcement**, **Assign task**, **Review attendance**. | Open the matching modal or page (Doc 6.2, 6.4, 6.3). |

### 4.3 Rules

- Approving leave deducts the days from the employee's balance and records the manager as approver (Doc 9.2).
- Approving a deliverable sets the task to `Completed`. Rejecting needs feedback text and sets it to `Rejected` (Doc 9.1).
- Each decision updates the counts on this page immediately.

---

## 5. Shared States

| State | Treatment |
|---|---|
| **Loading** | Skeleton blocks in the shape of each widget. No spinners over content. |
| **Empty** | Say what is missing and what to do. Example: "No tasks yet. Tasks your manager assigns will show up here." |
| **Error** | Inline in the widget: what failed and how to retry. Example: "Couldn't load announcements. Try again." with a **Try again** button. One widget failing never blanks the page. |
| **No attendance data** | Chart shows days labeled "No log" in grey. The total reads 0 h. |
| **Not timed in** | Time tracker shows "Not timed in" and a **Time in** button. |
| **Confirmation** | After an action, the result is named the same as the action: "Approve" gives "Leave approved". |

---

## 6. Responsive Behavior

| Width | Behavior |
|---|---|
| 1024px and above | Sidebar plus two-column widget grid, as in the wireframes. |
| 640 to 1023px | Sidebar collapses to icons. Widgets stack in one column, except Announcements and Tasks, which stay side by side down to 768px. |
| Below 640px | Sidebar becomes a menu button. All widgets are one column. Chart scrolls horizontally rather than shrinking bars below readable size. |

---

## 7. Accessibility

- Visible keyboard focus on every control (2px cyan outline).
- Status chips and chart bars always include a text label, not only color.
- Chart has a text table alternative reachable by keyboard.
- Contrast: white text on glass surfaces must stay at 4.5:1 or better. Use a darker glass tint where the polygon backdrop is bright.
- Animations respect reduced motion. The crystal float and glow stop when it is set.
- All buttons and links have unique, descriptive ids for testing.

---

## 8. Open Questions

| # | Question | Default if unanswered |
|---|---|---|
| 1 | Which dashboard should be built first? | Employee, because the Manager dashboard depends on Employee data (tasks, leave). |
| 2 | Should the notification bell in the header be built? | No. Unread counts on sidebar badges are enough for the prototype. |
| 3 | Seed data for the attendance chart: fixed or generated per week? | Fixed seed for the last full week, so the demo looks the same every time. |
