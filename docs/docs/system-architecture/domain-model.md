# Domain Model - DRAFT

## Entities

- `User`
- `WorkoutPlan`
- `WorkoutGroup`
- `WorkoutDay`
- `Exercise`
- `ExerciseCompletion`
- `WorkoutAssignment`

---

## Attributes and Operations

### `User`

- `id`: string
- `name`: string
- `email`: string
- `authProvider`: enum (`google`)
- `createdAt`: datetime
- `updatedAt`: datetime

**Operations**

- `createWorkoutPlan()`
- `getWorkoutPlan(id)`
- `sendWorkoutPlan(toUserId, planId)`
- `completeExercise(exerciseId, data)`
- `viewDashboard()`
- `getAllUsers()`
- `updateProfile(details)`

---

### `WorkoutPlan`

- `id`: string
- `title`: string
- `description`: string
- `createdBy`: User
- `visibility`: enum (`private`, `shared`)
- `createdAt`: datetime
- `updatedAt`: datetime

**Operations**

- `addWorkoutGroup()`
- `shareWith(userId)`
- `clonePlan()`

---

### `WorkoutGroup`

- `id`: string
- `planId`: WorkoutPlan
- `order`: number
- `title`: string (optional, e.g. “Week 1”)
- `createdAt`: datetime

**Operations**

- `reorderWorkoutDays(order[])`
- `getNextWorkoutDay(currentDayId)`

---

### `WorkoutDay`

- `id`: string
- `groupId`: WorkoutGroup
- `order`: number
- `isRestDay`: boolean
- `createdAt`: datetime

**Operations**

- `addExercise()`
- `removeExercise(exerciseId)`
- `reorderExercises(order[])`

---

### `Exercise`

- `id`: string
- `dayId`: WorkoutDay
- `name`: string
- `notes`: string
- `targetReps`: number
- `targetSets`: number
- `createdAt`: datetime

**Operations**

- `edit()`
- `viewDetails()`

---

### `ExerciseCompletion`

- `id`: string
- `exerciseId`: Exercise
- `userId`: User
- `weights`: array of numbers
- `reps`: array of numbers
- `notes`: string
- `completedAt`: datetime

**Operations**

- `submitCompletion()`
- `editCompletion()`
- `undoCompletion()`

---

### `WorkoutAssignment`

- `id`: string
- `senderId`: User
- `recipientId`: User
- `planId`: WorkoutPlan
- `assignedAt`: datetime

**Operations**

- `assignPlanToUser(userId)`
- `trackAssignmentProgress()`
