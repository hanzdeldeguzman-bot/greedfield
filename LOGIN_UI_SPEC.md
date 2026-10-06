# EMS Login Flow UI Specification

| | |
|---|---|
| **Audience** | Teacher / evaluator of the school project |
| **Based on** | [EMS_System_Documentation.md](EMS_System_Documentation.md) v2.1 (Section 4) and the three login mockups |
| **Covers** | Login, Account Activation, Update User Credentials, and the Forgot Password modal |
| **Status** | Built. Source: `app/page.tsx` and `app/lib/authStore.ts` |

## Contents

1. [Screens and Flow](#1-screens-and-flow)
2. [Visual Design](#2-visual-design)
3. [Login](#3-login)
4. [Account Activation](#4-account-activation)
5. [Update User Credentials](#5-update-user-credentials)
6. [Forgot Password](#6-forgot-password)
7. [Sessions](#7-sessions)
8. [Copy Reference](#8-copy-reference)
9. [Seed Accounts for Testing](#9-seed-accounts-for-testing)
10. [Test Checklist](#10-test-checklist)

---

## 1. Screens and Flow

```
                 +--------------------+
   first time    |  Account           |  match found
  +------------->|  Activation        |-------------+
  |              +--------------------+             |
  |                                                 v
+-------+    default password    +----------------------+
| Login |<-------(prefilled)-----|  Login (prefilled)   |
+-------+                        +----------------------+
  |  first login with default password
  v
+----------------------+   confirm   +----------------------------+
| Update User          |------------>| Dashboard (by role)        |
| Credentials          |             | Employee or Manager        |
+----------------------+             +----------------------------+

Later logins: Login ---------------------------> Dashboard
```

All three screens share one card on the same background. Switching screens swaps the card contents without a page reload.

---

## 2. Visual Design

The login follows the supplied mockups: dark teal polygon background, a centered circular emblem, and a frosted glass card.

| Element | Specification |
|---|---|
| Background | Deep teal radial gradient, faceted polygons, and a slowly floating crystal to the left of the card |
| Card | Max width 460px, 34px radius, glass fill with 28px blur, 1.5px light border |
| Emblem | 104px circular teal swirl emblem at the top of the card |
| Inputs | Pill shape, translucent fill, 1.5px light border, leading icon, focus ring in cyan |
| Password toggle | Dark circular eye button at the right end of the field |
| Primary button | Full width, teal gradient, uppercase label, lifts 1px on hover |
| Links | Cyan, underlined |
| Errors | Red text above the fields |
| Success | Green text above the fields |

Motion is limited to the background crystal and glow. Both stop when the user has reduced motion enabled.

---

## 3. Login

**Title:** LOGIN  **Subtitle:** Welcome back.

| Element | Behavior |
|---|---|
| Email | Accepts an email, or a username once credentials have been updated. Placeholder: `Example@Email.com`. |
| Password | Masked by default. The eye button toggles visibility. |
| Forgot Password | Opens the Forgot Password modal (Section 6). |
| Remember me | Toggle. Off by default. Controls where the session is stored (Section 7). |
| LOG IN | Validates, then signs in. The button reads "LOGGING IN..." and is disabled while it works. |
| Activation link | "Have not active your account? **Active Here!**" opens Account Activation. |

**Validation:**
- Checked on submit only. One inline message appears above the fields.
- An empty field or a wrong credential shows the same message: **Invalid email or password.** It never says which field was wrong.
- There is no lockout. The same message appears for every failed attempt.
- Typing in either field clears the message.

**Outcomes:**

| Case | Result |
|---|---|
| Valid, credentials already updated | Dashboard for the account's role |
| Valid, using the default password | Update User Credentials |
| Default password after credentials were updated | Invalid email or password. |
| Username before credentials were updated | Invalid email or password. Email works from activation. |

---

## 4. Account Activation

**Title:** ACTIVE ACCOUNT  **Subtitle:** Verify your Employee ID and Company Email to activate your account.

| Element | Behavior |
|---|---|
| Employee ID | Format `EMP-####`, for example `EMP-1012`. Not case sensitive. |
| Company Email | Must match the email on the employee's record. |
| Continue | Checks both fields together. |
| Login link | "Already have an account? **Login!**" returns to Login. |

**Validation and messages:**

| Case | Message |
|---|---|
| Either field empty | Employee ID and company email are both required. |
| No record matches both fields | Employee ID and company email do not match our records. |
| Account already finished setup | This account is already activated. Please log in. |
| Match found | Account verified! Default password sent: `TempPass123!` (green) |

**After a match:** the default password is shown on screen as a simulated email. After 1.5 seconds the app goes to Login with the company email and the default password already filled in. Nothing is actually emailed.

---

## 5. Update User Credentials

**Title:** UPDATE USER CREDENTIALS  **Subtitle:** Create a new username and password before accessing your account.

This screen cannot be skipped. A user with the default password sees it after their first login and cannot reach the Dashboard without confirming it.

| Field | Rule |
|---|---|
| New Username | Required. At least 3 characters. |
| Old Password | Required. Prefilled with the default password used to sign in. Must match the current password, otherwise: **Old password does not match our records.** |
| New Password | Required. At least 8 characters with a letter and a number. A hint under the field states the rule. Eye toggle. |
| CONFIRM | Saves only when every field is valid. The button reads "UPDATING..." while it works. |

**Messages:**

| Case | Message |
|---|---|
| Any field empty | All fields are required. |
| Username too short | Username must be at least 3 characters. |
| Password breaks the rule | Password must be at least 8 characters with at least one letter and one number. |
| Success | Credentials updated successfully! Signing you in... |

**After success:** the default password stops working, the new username and password become the login, and the user lands on their Dashboard after about 1 second.

A "Cancel and return to Login" link goes back to Login without saving.

> **Note:** The mockup labels the first two password fields "New Password" and "New Password". The spec uses **Old Password** and **New Password** (Doc Section 4.3) so the user knows which value goes where.

---

## 6. Forgot Password

A modal opened from Login.

| Element | Behavior |
|---|---|
| Heading | Password Recovery |
| Email field | Company email. |
| Send Link | Shows "Password reset instructions have been dispatched to *email*." If the field is empty it shows "Please enter your email address." |
| Close | Closes and clears the modal. |

This is a simulated dispatch. No email is sent and there is no reset page. A real reset flow is out of scope for this prototype.

---

## 7. Sessions

| Remember me | Storage | Ends when |
|---|---|---|
| On | LocalStorage | The user logs out |
| Off | SessionStorage | The user logs out or closes the tab |

A saved session does not expire on a timer. On page load the app checks for a session and, if one exists, skips the login card and shows the signed-in view. Logging out clears both storages.

---

## 8. Copy Reference

The copy below matches the mockups exactly, including their wording.

| Where | Text |
|---|---|
| Login title | LOGIN |
| Login subtitle | Welcome back. |
| Login error | Invalid email or password. |
| Login primary button | LOG IN |
| Login footer | Have not active your account? **Active Here!** |
| Activation title | ACTIVE ACCOUNT |
| Activation required error | Employee ID and company email are both required. |
| Activation button | Continue |
| Activation footer | Already have an account? **Login!** |
| Credentials title | UPDATE USER CREDENTIALS |
| Credentials button | CONFIRM |

---

## 9. Seed Accounts for Testing

There is no demo switcher on the login page. Type these credentials.

| Role | Employee ID | Email | Password | State |
|---|---|---|---|---|
| Employee | `EMP-1012` | `john.doe@company.com` | `Password123!` | Ready to log in |
| Department Manager | `EMP-1001` | `sarah.connor@company.com` | `ManagerPass123!` | Ready to log in |
| Employee (new) | `EMP-1020` | `Example@Email.com` | Default `TempPass123!` | Needs activation and credential update |

To reset test data, clear this site's LocalStorage and SessionStorage in the browser.

---

## 10. Test Checklist

| # | Steps | Expected |
|---|---|---|
| 1 | Submit Login with both fields empty | Invalid email or password. |
| 2 | Log in as `john.doe@company.com` with a wrong password | Invalid email or password. |
| 3 | Log in as John with the correct password, Remember me off, close the tab, reopen | Login card shown again |
| 4 | Same as 3 with Remember me on | Still signed in |
| 5 | Activation with empty fields | Employee ID and company email are both required. |
| 6 | Activation with `EMP-1012` and a wrong email | Employee ID and company email do not match our records. |
| 7 | Activation with `EMP-1012` and John's email | This account is already activated. Please log in. |
| 8 | Activation with `EMP-1020` and `Example@Email.com` | Green message, then Login prefilled |
| 9 | Log in with the prefilled default password | Update User Credentials |
| 10 | Confirm with a 5-character password | Password rule message |
| 11 | Confirm with `Peter` and `NewPass123` | Dashboard sign-in |
| 12 | Log out, then log in as `Peter` with `NewPass123` | Works |
| 13 | Log in with `TempPass123!` after step 11 | Invalid email or password. |
| 14 | Forgot Password with an empty field | Please enter your email address. |
