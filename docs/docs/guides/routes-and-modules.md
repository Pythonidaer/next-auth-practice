# Routes and Modules

This document outlines the proposed routing structure for the Meatbag application, organized by logical modules. This structure aligns with Next.js App Router conventions and provides a clear, scalable organization for the application's features.

---

## Route Summary Table

| Route                                                     | Purpose                                                    |
| --------------------------------------------------------- | ---------------------------------------------------------- |
| `/`                                                       | Home/Dashboard. Shows today's workout or key user info.    |
| `/auth/login`                                             | User sign-in page (e.g., Google OAuth).                    |
| `/auth/logout`                                            | Handles user sign-out (may redirect or show confirmation). |
| `/workout/today`                                          | Displays the current day's assigned workout.               |
| `/workout/today/[exerciseId]`                             | View/complete a specific exercise in today's workout.      |
| `/workout/history`                                        | List of all past completed workouts/days.                  |
| `/workout/history/[workoutDayCompletionId]`               | Details for a specific completed workout day.              |
| `/programs`                                               | Lists all workout programs available to the user.          |
| `/programs/create`                                        | Create a new workout program.                              |
| `/programs/[programId]`                                   | View/edit a specific workout program.                      |
| `/programs/[programId]/group/[groupId]`                   | View/edit a specific workout group in a program.           |
| `/programs/[programId]/day/[dayId]`                       | View/edit a specific workout day in a program.             |
| `/programs/[programId]/day/[dayId]/exercise/[exerciseId]` | View/edit a specific exercise in a workout day.            |
| `/programs/preview/[programId]`                           | Read-only preview of a workout program.                    |
| `/share`                                                  | Share workout programs with other users.                   |
| `/get`                                                    | Accept/view programs assigned by others.                   |
| `/users`                                                  | List of all users in the system.                           |
| `/account`                                                | Main account settings/profile overview.                    |
| `/account/profile`                                        | Edit user profile details.                                 |
| `/account/security`                                       | Account security settings (future: password, 2FA).         |
| `/stats`                                                  | View workout statistics and progress.                      |
| `/about`                                                  | About page for the application/team.                       |
| `/legal`                                                  | Legal documents (Terms of Service, Privacy Policy).        |

---

## 1. Core / Landing Module

**Top-Level Folder:** `src/app/`

- `/`  
  **Purpose:** The default landing page for logged-in users, serving as the primary dashboard or "Today's Workout" view.  
  **Files:** `page.js`, `layout.js`, `globals.css` (global styles), etc.

---

## 2. Auth Module

**Top-Level Folder:** `src/app/auth/`

- `/auth/login`  
  **Purpose:** The custom page for user sign-in (e.g., via Google OAuth).  
  **Files:** `auth/login/page.js`
- `/auth/logout`  
  **Purpose:** Handles user sign-out action. May be a redirect or confirmation page.  
  **Files:** `auth/logout/page.js` (optional, NextAuth.js handles most logic internally)
- `/api/auth/[...nextauth]`  
  **Purpose:** NextAuth.js API route handler for authentication backend logic (sign-in, sign-out, session management).  
  **Files:** `api/auth/[...nextauth]/route.js`

---

## 3. Workout Module

**Top-Level Folder:** `src/app/workout/`

- `/workout/today`  
  **Purpose:** Displays the currently assigned or planned workout for the current day.  
  **Files:** `workout/today/page.js`
- `/workout/today/[exerciseId]`  
  **Purpose:** Dynamic route for details and completion of a specific exercise within today's workout.  
  **Files:** `workout/today/[exerciseId]/page.js`
- `/workout/history`  
  **Purpose:** Overview of all past completed workouts/days.  
  **Files:** `workout/history/page.js`
- `/workout/history/[workoutDayCompletionId]`  
  **Purpose:** View the detailed log of a specific past completed workout day.  
  **Files:** `workout/history/[workoutDayCompletionId]/page.js`

---

## 4. Programs Module

**Top-Level Folder:** `src/app/programs/`

- `/programs`  
  **Purpose:** Lists all workout programs accessible to the user.  
  **Files:** `programs/page.js`
- `/programs/create`  
  **Purpose:** Form/interface for creating a new WorkoutProgram.  
  **Files:** `programs/create/page.js`
- `/programs/[programId]`  
  **Purpose:** View/edit a specific WorkoutProgram, including its WorkoutGroups and WorkoutDays.  
  **Files:** `programs/[programId]/page.js`
- `/programs/[programId]/group/[groupId]`  
  **Purpose:** View/edit a specific WorkoutGroup within a program.  
  **Files:** `programs/[programId]/group/[groupId]/page.js`
- `/programs/[programId]/day/[dayId]`  
  **Purpose:** View/edit a specific WorkoutDay within a program/group.  
  **Files:** `programs/[programId]/day/[dayId]/page.js`
- `/programs/[programId]/day/[dayId]/exercise/[exerciseId]`  
  **Purpose:** View/edit a specific Exercise within a workout day.  
  **Files:** `programs/[programId]/day/[dayId]/exercise/[exerciseId]/page.js`
- `/programs/preview/[programId]`  
  **Purpose:** Read-only preview of a WorkoutProgram before assignment or use.  
  **Files:** `programs/preview/[programId]/page.js`

---

## 5. Collaboration & Sharing Module

**Top-Level Folder:** `src/app/share/` (or integrate into programs/)

- `/share`  
  **Purpose:** Page/flow for a user to share their workout programs with others.  
  **Files:** `share/page.js`
- `/get`  
  **Purpose:** Page/flow for a user to see and accept programs assigned to them.  
  **Files:** `get/page.js`
- `/users`  
  **Purpose:** View a list of all users in the system (as per MVP requirement).  
  **Files:** `users/page.js`

---

## 6. Account Module

**Top-Level Folder:** `src/app/account/`

- `/account`  
  **Purpose:** Main account settings page, likely showing profile overview.  
  **Files:** `account/page.js`
- `/account/profile`  
  **Purpose:** Edit user profile details.  
  **Files:** `account/profile/page.js`
- `/account/security`  
  **Purpose:** For future features like password changes, two-factor authentication.  
  **Files:** `account/security/page.js`

---

## 7. Stats / Dashboard Module

**Top-Level Folder:** `src/app/stats/` (or `src/app/dashboard/`)

- `/stats`  
  **Purpose:** Displays overall workout statistics, charts, and insights.  
  **Files:** `stats/page.js`

---

## 8. Static Pages Module

**Top-Level Folders:** `src/app/about/`, `src/app/legal/`

- `/about`  
  **Purpose:** "About Us" page.  
  **Files:** `about/page.js`
- `/legal`  
  **Purpose:** Legal documents such as Terms of Service and Privacy Policy.  
  **Files:** `legal/page.js`

---

## Notes

- Dynamic segments (e.g., `[programId]`, `[groupId]`, `[dayId]`, `[exerciseId]`) follow Next.js conventions for dynamic routing.
- This structure is designed for clarity, scalability, and ease of onboarding.
- Update this guide as the application's requirements or structure evolve.
