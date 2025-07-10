# Domain Model - DRAFT

## Entities

- `User`
- `Account` (NextAuth)
- `Session` (NextAuth)
- `VerificationToken` (NextAuth)
- `WorkoutProgram`
- `WorkoutGroup`
- `WorkoutDay`
- `Exercise`
- `ExerciseCompletion`
- `WorkoutDayCompletion`
- `WorkoutGroupCompletion`
- `WorkoutAssignment`
- `UserWorkoutStats`

---

## Attributes and Operations

### `User`

- `id`: string (Primary Key)
- `name`: string (optional)
- `email`: string (Unique)
- `image`: string (optional)
- `emailVerified`: datetime (optional)
- `createdAt`: datetime
- `updatedAt`: datetime

**Relationships**

- One `User` has many `Account`s
- One `User` has many `Session`s
- One `User` has many `WorkoutProgram`s
- One `User` has many `ExerciseCompletion`s
- One `User` has many `WorkoutDayCompletion`s
- One `User` has many `WorkoutGroupCompletion`s
- One `User` has many sent `WorkoutAssignment`s
- One `User` has many received `WorkoutAssignment`s
- One `User` has many `UserWorkoutStat`s

**Operations**

- `createWorkoutProgram()`
- `getWorkoutProgram(id)`
- `assignWorkoutProgram(toUserIds[])`
- `markExerciseAsComplete(exerciseId, notes)`
- `viewDashboard()`
- `getAllUsers()`
- `updateProfile(details)`
- `signOut()`

---

### `Account` (NextAuth)

- `provider`: string (Part of Composite Primary Key)
- `providerAccountId`: string (Part of Composite Primary Key)
- `userId`: string (Foreign Key to `User.id`)
- `type`: string
- `refresh_token`: string (optional)
- `access_token`: string (optional)
- `expires_at`: integer (optional)
- `token_type`: string (optional)
- `scope`: string (optional)
- `id_token`: string (optional)
- `session_state`: string (optional)
- `createdAt`: datetime
- `updatedAt`: datetime

**Relationships**

- One `Account` belongs to one `User`

---

### `Session` (NextAuth)

- `sessionToken`: string (Unique)
- `userId`: string (Foreign Key to `User.id`)
- `expires`: datetime
- `createdAt`: datetime
- `updatedAt`: datetime

**Relationships**

- One `Session` belongs to one `User`

---

### `VerificationToken` (NextAuth)

- `identifier`: string (Part of Composite Primary Key)
- `token`: string (Part of Composite Primary Key)
- `expires`: datetime

---

### `WorkoutProgram`

- `id`: string (Primary Key)
- `title`: string
- `description`: string (optional)
- `createdByUserId`: string (Foreign Key to `User.id`)
- `createdAt`: datetime
- `updatedAt`: datetime

**Relationships**

- One `WorkoutProgram` has many `WorkoutGroup`s.

**Operations**

- `addWorkoutGroup()`
- `cloneProgram()`
- `previewProgram()`
- `assignToUsers(userIds[])`
- `edit()`
- `delete()`

---

### `WorkoutGroup`

- `id`: string (Primary Key)
- `programId`: string (Foreign Key to `WorkoutProgram.id`)
- `order`: number (Determines position within the program)
- `title`: string (optional, e.g., “Week 1”, "Phase A")
- `createdAt`: datetime

**Relationships**

- One `WorkoutGroup` has exactly 7 `WorkoutDay`s.

**Operations**

- `reorderWorkoutDays(order[])`
- `getNextWorkoutDay(currentDayId)`
- `edit()`
- `delete()`

---

### `WorkoutDay`

- `id`: string (Primary Key)
- `groupId`: string (Foreign Key to `WorkoutGroup.id`)
- `order`: number (Determines position within the group, 1-7)
- `isRestDay`: boolean
- `createdAt`: datetime

**Relationships**

- One `WorkoutDay` has many `Exercise`s (0-N).

**Operations**

- `addExercise()`
- `removeExercise(exerciseId)`
- `reorderExercises(order[])`
- `edit()`

---

### `Exercise`

- `id`: string (Primary Key)
- `dayId`: string (Foreign Key to `WorkoutDay.id`)
- `name`: string
- `notes`: string
- `targetWarmupSets`: number
- `targetWorkingSets`: number
- `targetReps`: string (e.g., "8-10 reps", "20 reps")
- `order`: number
- `createdAt`: datetime

**Operations**

- `edit()`
- `viewDetails()`

---

### `ExerciseCompletion`

- `id`: string (Primary Key)
- `exerciseId`: string (Foreign Key to `Exercise.id`)
- `userId`: string (Foreign Key to `User.id`)
- `workoutDayId`: string (Foreign Key to `WorkoutDay.id`)
- `programId`: string (Foreign Key to `WorkoutProgram.id`)
- `completedAt`: datetime
- `userNotes`: string (optional)

**Operations**

- `submitCompletion()`
- `undoCompletion()`

---

### `WorkoutDayCompletion`

- `id`: string (Primary Key)
- `dayId`: string (Foreign Key to `WorkoutDay.id`)
- `userId`: string (Foreign Key to `User.id`)
- `workoutGroupId`: string (Foreign Key to `WorkoutGroup.id`)
- `programId`: string (Foreign Key to `WorkoutProgram.id`)
- `completedAt`: datetime

**Operations**

- (Managed by system logic based on `ExerciseCompletion` and `isRestDay`)

---

### `WorkoutGroupCompletion`

- `id`: string (Primary Key)
- `groupId`: string (Foreign Key to `WorkoutGroup.id`)
- `userId`: string (Foreign Key to `User.id`)
- `programId`: string (Foreign Key to `WorkoutProgram.id`)
- `completedAt`: datetime

**Operations**

- (Managed by system logic based on `WorkoutDayCompletion`)

---

### `WorkoutAssignment`

- `id`: string (Primary Key)
- `senderId`: string (Foreign Key to `User.id`)
- `recipientId`: string (Foreign Key to `User.id`)
- `programId`: string (Foreign Key to `WorkoutProgram.id`)
- `assignedAt`: datetime
- `isActive`: boolean

**Operations**

- `assignProgramToUser()`
- `unassignProgram()`

---

### `UserWorkoutStats`

- `id`: string (Primary Key)
- `userId`: string (Foreign Key to `User.id`)
- `programId`: string (Foreign Key to `WorkoutProgram.id`)
- `completedDayCount`: number
- `lastCompletedDayId`: string (Foreign Key to `WorkoutDay.id`, or null)
- `lastCompletedAt`: datetime
- `programStartDate`: datetime

**Operations**

- `getExerciseHistory(exerciseId, userId)`
- `computeProgress()`
- `viewSummary()`
