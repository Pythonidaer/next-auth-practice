# API Details

This document provides a detailed specification for the API layer of the Meatbag application. It focuses on the use of Next.js API Routes, how they interact with the PostgreSQL database via Prisma, and outlines the various endpoints available to support the application's functionality.

---

## 1. API Layer Overview

The Meatbag application leverages **Next.js API Routes** as its backend API layer. This approach offers a unified full-stack development experience, allowing frontend (React) and backend (API endpoints) code to reside within the same Next.js project.

**Technology Stack:**

- **Framework:** Next.js (with App Router)
- **Backend Runtime:** Node.js (implicitly managed by Next.js)
- **Database:** PostgreSQL
- **ORM (Object-Relational Mapper):** Prisma
- **Authentication:** NextAuth.js

**Key Benefits:**

- **Cohesion:** Single codebase for frontend and backend.
- **Simplicity:** No need for a separate server setup (e.g., Express.js).
- **Scalability:** API Routes are designed to be deployed as serverless functions, enabling easy scaling.
- **Type Safety:** Seamless integration with TypeScript (recommended for development).

---

## 2. Authentication and Authorization

All sensitive API endpoints are protected to ensure only authenticated and authorized users can access them.

- **Authentication:** Handled by NextAuth.js. API routes can access the user's session information to determine if a user is logged in.
- **Authorization:** Based on the user's session data (e.g., `session.user.id`). API routes verify if the logged-in user has the necessary permissions (e.g., ownership of a resource, access to shared content) before performing operations.

For example, when fetching WorkoutPrograms, the API route will check `created_by_user_id` or `workout_assignments` to determine if the current user has access.

---

## 3. Data Interaction with PostgreSQL (via Prisma)

API routes interact with the PostgreSQL database using **Prisma**. Prisma acts as the ORM, providing a type-safe and intuitive way to query, insert, update, and delete data without writing raw SQL.

- **Prisma Client:** An instance of the Prisma Client is initialized and used within API routes to perform database operations.
- **Schema First:** The database schema (as defined in `schema.prisma`) is the single source of truth, from which Prisma generates its client.

---

## 4. API Endpoints

The following sections detail the primary API endpoints, categorized by the modules they support.

### 4.1. Authentication Endpoints

These endpoints are primarily handled by NextAuth.js internally, but it's important to acknowledge their role.

#### `GET /api/auth/session`

- **Purpose:** Retrieves the current session data. Used by the frontend to determine if a user is logged in and to get user details.
- **Authentication:** Public (but returns null if not authenticated).
- **Response:** `{ user: { id: string, name: string, email: string }, expires: string }` or `null`.

#### `POST /api/auth/signin` (and other OAuth callbacks)

- **Purpose:** Initiates the authentication flow (e.g., Google OAuth).
- **Authentication:** Public.

#### `POST /api/auth/signout`

- **Purpose:** Ends the user session.
- **Authentication:** Authenticated.

---

### 4.2. User Management Endpoints

#### `GET /api/users`

- **Purpose:** Retrieves a list of all users in the system (for MVP collaboration feature).
- **Authentication:** Authenticated.
- **Response:** `[{ id: string, name: string, email: string }, ...]`

#### `PUT /api/users/[userId]`

- **Purpose:** Updates the profile details of a specific user.
- **Authentication:** Authenticated (user must own the profile or be an admin).
- **Request Body:** `{ name?: string, email?: string, ... }`
- **Response:** `{ user: { id: string, name: string, email: string, ... } }`

---

### 4.3. Workout Program Management Endpoints

These endpoints manage the definition of workout programs, groups, days, and exercises.

#### `GET /api/programs`

- **Purpose:** Retrieves a list of all workout programs created by or assigned to the authenticated user.
- **Authentication:** Authenticated.
- **Response:** `[{ id: string, title: string, description: string, createdByUserId: string, ... }, ...]`

#### `POST /api/programs`

- **Purpose:** Creates a new workout program.
- **Authentication:** Authenticated.
- **Request Body:** `{ title: string, description?: string, groups: [{ title?: string, days: [{ isRestDay: boolean, exercises: [{ name: string, notes?: string, targetWarmupSets: int, targetWorkingSets: int, targetReps: string }] }] }] }`
- **Response:** `{ programId: string, ... }`

#### `GET /api/programs/[programId]`

- **Purpose:** Retrieves the full details of a specific workout program, including its nested groups, days, and exercises.
- **Authentication:** Authenticated (user must have access to this program).
- **Response:** `{ id: string, title: string, description: string, groups: [...], ... }`

#### `PUT /api/programs/[programId]`

- **Purpose:** Updates an existing workout program (e.g., title, description, or modifies nested structure).
- **Authentication:** Authenticated (user must be the creator or authorized editor).
- **Request Body:** `{ title?: string, description?: string, ... }`
- **Response:** `{ programId: string, message: string }`

#### `DELETE /api/programs/[programId]`

- **Purpose:** Deletes a workout program and all its associated groups, days, and exercises.
- **Authentication:** Authenticated (user must be the creator).
- **Response:** `{ message: 'Program deleted successfully' }`

---

### 4.4. Workout Execution & Completion Endpoints

These endpoints facilitate the tracking of a user's progress through a workout program.

#### `GET /api/workout/today`

- **Purpose:** Retrieves the current user's active workout day details, including exercises and their completion status.
- **Authentication:** Authenticated.
- **Response:** `{ currentProgramId: string, currentDayId: string, dayOrder: int, isRestDay: boolean, exercises: [{ id: string, name: string, isCompleted: boolean, userNotes: string, ... }], programProgress: { completedDays: int, totalDays: int } }`

#### `POST /api/workout/complete-exercise`

- **Purpose:** Marks a specific exercise as complete for the current user and workout day.
- **Authentication:** Authenticated.
- **Request Body:** `{ exerciseId: string, userNotes?: string }`
- **Response:** `{ exerciseCompletionId: string, dayCompleted: boolean, groupCompleted: boolean, programCompleted: boolean }`

#### `POST /api/workout/undo-exercise-completion`

- **Purpose:** Reverts the completion status of an exercise.
- **Authentication:** Authenticated.
- **Request Body:** `{ exerciseCompletionId: string }`
- **Response:** `{ message: 'Exercise completion undone' }`

#### `GET /api/workout/history`

- **Purpose:** Retrieves a summary of the user's past completed workout days.
- **Authentication:** Authenticated.
- **Response:** `[{ id: string, dayId: string, programId: string, completedAt: string, programTitle: string, dayOrder: int, groupTitle?: string, ... }, ...]`

#### `GET /api/workout/history/[workoutDayCompletionId]`

- **Purpose:** Retrieves detailed information for a specific completed workout day, including all exercises and their recorded notes.
- **Authentication:** Authenticated.
- **Response:** `{ dayCompletionId: string, dayTitle: string, exercisesCompleted: [{ exerciseName: string, userNotes: string, ... }], ... }`

---

### 4.5. Collaboration & Sharing Endpoints

#### `POST /api/share/program`

- **Purpose:** Assigns a workout program to one or more other users.
- **Authentication:** Authenticated (user must own the program).
- **Request Body:** `{ programId: string, recipientIds: string[] }`
- **Response:** `{ assignmentIds: string[], message: 'Programs assigned successfully' }`

#### `GET /api/assignments/incoming`

- **Purpose:** Retrieves a list of workout programs that have been assigned to the current user by others.
- **Authentication:** Authenticated.
- **Response:** `[{ assignmentId: string, programId: string, programTitle: string, senderName: string, assignedAt: string, isActive: boolean }, ...]`

#### `GET /api/assignments/outgoing`

- **Purpose:** Retrieves a list of workout programs the current user has assigned to others.
- **Authentication:** Authenticated.
- **Response:** `[{ assignmentId: string, programId: string, programTitle: string, recipientName: string, assignedAt: string, isActive: boolean }, ...]`

---

### 4.6. Statistics & Reporting Endpoints

#### `GET /api/stats/user/[userId]/program/[programId]`

- **Purpose:** Retrieves a specific user's high-level workout statistics for a given program.
- **Authentication:** Authenticated (user must be the userId or authorized to view other users' stats).
- **Response:** `{ userId: string, programId: string, completedDayCount: int, lastCompletedDayId?: string, lastCompletedAt?: string, programStartDate?: string }`

---

### 4.7. General/Utility Endpoints

#### `GET /api/status` (Optional)

- **Purpose:** Simple health check endpoint for the API.
- **Authentication:** Public.
- **Response:** `{ status: 'OK', timestamp: '...' }`
