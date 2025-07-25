# API: Routes

This section documents the main API endpoints for the Meatbag application, grouped by functional area. These endpoints are implemented using Next.js API Routes and interact with the PostgreSQL database via Prisma.

---

## User Management Endpoints

### `GET /api/users`

- **Purpose:** Retrieves a list of all users in the system (for MVP collaboration feature).
- **Authentication:** Authenticated.
- **Response:** `[{ id: string, name: string, email: string }, ...]`

### `PUT /api/users/[userId]`

- **Purpose:** Updates the profile details of a specific user.
- **Authentication:** Authenticated (user must own the profile or be an admin).
- **Request Body:** `{ name?: string, email?: string, ... }`
- **Response:** `{ user: { id: string, name: string, email: string, ... } }`

---

## Workout Program Management Endpoints

### `GET /api/programs`

- **Purpose:** Retrieves a list of all workout programs created by or assigned to the authenticated user.
- **Authentication:** Authenticated.
- **Response:** `[{ id: string, title: string, description: string, createdByUserId: string, ... }, ...]`

### `POST /api/programs`

- **Purpose:** Creates a new workout program.
- **Authentication:** Authenticated.
- **Request Body:** `{ title: string, description?: string, groups: [{ title?: string, days: [{ isRestDay: boolean, exercises: [{ name: string, notes?: string, targetWarmupSets: int, targetWorkingSets: int, targetReps: string }] }] }] }`
- **Response:** `{ programId: string, ... }`

### `GET /api/programs/[programId]`

- **Purpose:** Retrieves the full details of a specific workout program, including its nested groups, days, and exercises.
- **Authentication:** Authenticated (user must have access to this program).
- **Response:** `{ id: string, title: string, description: string, groups: [...], ... }`

### `PUT /api/programs/[programId]`

- **Purpose:** Updates an existing workout program (e.g., title, description, or modifies nested structure).
- **Authentication:** Authenticated (user must be the creator or authorized editor).
- **Request Body:** `{ title?: string, description?: string, ... }`
- **Response:** `{ programId: string, message: string }`

### `DELETE /api/programs/[programId]`

- **Purpose:** Deletes a workout program and all its associated groups, days, and exercises.
- **Authentication:** Authenticated (user must be the creator).
- **Response:** `{ message: 'Program deleted successfully' }`

---

## Workout Execution & Completion Endpoints

### `GET /api/workout/today`

- **Purpose:** Retrieves the current user's active workout day details, including exercises and their completion status.
- **Authentication:** Authenticated.
- **Response:** `{ currentProgramId: string, currentDayId: string, dayOrder: int, isRestDay: boolean, exercises: [{ id: string, name: string, isCompleted: boolean, userNotes: string, ... }], programProgress: { completedDays: int, totalDays: int } }`

### `POST /api/workout/complete-exercise`

- **Purpose:** Marks a specific exercise as complete for the current user and workout day.
- **Authentication:** Authenticated.
- **Request Body:** `{ exerciseId: string, userNotes?: string }`
- **Response:** `{ exerciseCompletionId: string, dayCompleted: boolean, groupCompleted: boolean, programCompleted: boolean }`

### `POST /api/workout/undo-exercise-completion`

- **Purpose:** Reverts the completion status of an exercise.
- **Authentication:** Authenticated.
- **Request Body:** `{ exerciseCompletionId: string }`
- **Response:** `{ message: 'Exercise completion undone' }`

### `GET /api/workout/history`

- **Purpose:** Retrieves a summary of the user's past completed workout days.
- **Authentication:** Authenticated.
- **Response:** `[{ id: string, dayId: string, programId: string, completedAt: string, programTitle: string, dayOrder: int, groupTitle?: string, ... }, ...]`

### `GET /api/workout/history/[workoutDayCompletionId]`

- **Purpose:** Retrieves detailed information for a specific completed workout day, including all exercises and their recorded notes.
- **Authentication:** Authenticated.
- **Response:** `{ dayCompletionId: string, dayTitle: string, exercisesCompleted: [{ exerciseName: string, userNotes: string, ... }], ... }`

---

## Collaboration & Sharing Endpoints

### `POST /api/share/program`

- **Purpose:** Assigns a workout program to one or more other users.
- **Authentication:** Authenticated (user must own the program).
- **Request Body:** `{ programId: string, recipientIds: string[] }`
- **Response:** `{ assignmentIds: string[], message: 'Programs assigned successfully' }`

### `GET /api/assignments/incoming`

- **Purpose:** Retrieves a list of workout programs that have been assigned to the current user by others.
- **Authentication:** Authenticated.
- **Response:** `[{ assignmentId: string, programId: string, programTitle: string, senderName: string, assignedAt: string, isActive: boolean }, ...]`

### `GET /api/assignments/outgoing`

- **Purpose:** Retrieves a list of workout programs the current user has assigned to others.
- **Authentication:** Authenticated.
- **Response:** `[{ assignmentId: string, programId: string, programTitle: string, recipientName: string, assignedAt: string, isActive: boolean }, ...]`

---

## Statistics & Reporting Endpoints

### `GET /api/stats/user/[userId]/program/[programId]`

- **Purpose:** Retrieves a specific user's high-level workout statistics for a given program.
- **Authentication:** Authenticated (user must be the userId or authorized to view other users' stats).
- **Response:** `{ userId: string, programId: string, completedDayCount: int, lastCompletedDayId?: string, lastCompletedAt?: string, programStartDate?: string }`

---

## General/Utility Endpoints

### `GET /api/status` (Optional)

- **Purpose:** Simple health check endpoint for the API.
- **Authentication:** Public.
- **Response:** `{ status: 'OK', timestamp: '...' }`
