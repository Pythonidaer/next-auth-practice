# Project Spec

## 0. Project Overview

**Meatbag** is a new web application designed to help gymgoers manage and track their workout routines. The platform aims to allow users to **log daily exercise activity**, **track progress over time**, **receive workout plans from other users**, and **design and assign plans to others** in a collaborative and motivational context.

Jonathan is currently building out the MVP. As the frontend architect on this project, my role is to design and maintain a robust and extensible architecture to support ongoing development and scaling.

## 1. Meatbag Software System

_This section describes the entire Meatbag software system. It includes the primary user group, all core software components, and external dependencies. The user-facing web app is a key focus of this system._

---

### System Context

_This zoomed-out view of the Meatbag system shows its actors and external systems, following the guidelines of the C4 Model._

#### System Users

- **👤 User** — A gymgoer using the app to track workouts, log completed exercises, design workout plans, and optionally assign or receive plans from other users.

#### External Systems

- **PostgreSQL** — The core data store for users, workouts, exercise completion data, and user-to-user plan sharing.
- _(No Email System currently planned in the MVP scope)_

#### System Context Diagram

![System Context Diagram](/img/meatbag_context_view.png)

---

### System Containers

_These are the core containers making up the system. Use these for reference when designing your container diagram._

- **Web Application** — Built with Next.js (App Router), this handles both frontend and backend functionality, including UI rendering, routing, API logic, and server-side authentication.
- **API Layer (included in Next.js)** — Used to handle server-side logic like fetching/storing workout data, assigning plans, etc.
- **Database** — PostgreSQL stores structured data like users, workouts, daily logs, and assigned plans.
- **ORM** — Prisma serves as the interface between the Next.js backend and the PostgreSQL database, providing type-safe database access and schema management.

#### Container Diagram

![Container Diagram](/img/meatbag_container_view.png)

---

### Functional Requirements

_This section outlines the core functional requirements of the Meatbag application. These describe what the user can do in the app and help inform architectural design decisions._

#### Authentication & Access

- Users must be logged in to browse or use the app beyond the sign-in page.
- Users can sign in using Google OAuth via NextAuth.js, which is integrated with Prisma using the @auth/prisma-adapter.
- The Prisma Adapter automatically handles user account creation, session management, and OAuth account linking in the database.
- (Planned) Users may be able to sign in with credentials or magic link in the future.
- Authenticated users can securely sign out.
- Authenticated users can update their account details.
- User authentication state is managed through NextAuth.js sessions and made available throughout the application via React context.

#### Workout Planning & Management

- Authenticated users can create workout plans.
- Authenticated users can create exercises within groups of 7 workout days (i.e., a week or custom group).
- Workout days can be filled with any number of exercises or be designated as "rest days".
- Authenticated users can drag workout days around within a group to reorder them.
- Authenticated users can edit workout plans, workout days, and exercises.
- Authenticated users can delete exercises from a workout day.
- Authenticated users can preview workout programs before getting or sharing them.

#### Exercise Experience

- Authenticated users can click or press an exercise to view its details after creation.
- Authenticated users can swipe to view each of the exercises in a workout day.
- Authenticated users can complete exercises.
- Authenticated users can mark exercises as complete or undo completion.
- Authenticated users can edit their exercises and enter weights, warmup sets, working sets, reps, and optional notes.
- Saving or completing an exercise submits the data to the database.
- When all exercises in a day are completed, users can proceed to the next workout day.
- When all workout days in a group are completed, users can proceed to the next workout group.

#### Collaboration & Sharing

- Authenticated users can view all other users (in MVP).
- Authenticated users can send ("share") workout plans to one or more other users.
- Authenticated users can request ("get") workout plans from other users (may be receive-only in MVP).

#### Workout Tracking & Dashboard

- Authenticated users can view their daily workouts.
- Authenticated users can enter workout-specific data (logged exercise notes).
- Logged exercise stats are received from the database and shown in the dashboard.
- Users can revisit previous workout logs to track their progress over time.

#### Usability & Navigation

- The UI should clearly show users what to do next (e.g., today's workout).
- The application should prioritize simplicity and clarity in layout and navigation.
- All main features should be accessible from a dashboard or sidebar.
- The UI should support progressive enhancement (keyboard navigation, fast mobile loading, etc.)

#### (Planned) Insights & Progress Visualization

- Users can see historical workout data by day, plan, or exercise.
- Basic statistics like volume, frequency, or most-used exercises may be shown.
- Progress may be visualized through charts or tables.

---
