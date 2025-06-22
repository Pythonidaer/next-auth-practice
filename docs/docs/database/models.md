# Database Model

This document describes the database model for the Meatbag application, providing a detailed breakdown of each table, its columns, data types, and relationships. This model serves as a blueprint for the physical database implementation and is derived directly from the application's domain model and functional requirements.

---

## 1. Model Overview

The Meatbag database is designed to store all essential application data, including user profiles, workout program definitions, exercise details, and user-specific completion and statistics data. Data integrity is maintained through the use of primary and foreign keys, ensuring consistency across related entities.

---

## 2. Model Definitions

Each section below details a specific table (model) in the PostgreSQL database.

### 2.1. Users

**Table Name:** `users`

**Purpose:** Stores user authentication and profile information.

**Columns:**

- `id` (VARCHAR(255)): Primary Key. Unique identifier for the user.
- `name` (VARCHAR(255)): The user's display name. Not nullable.
- `email` (VARCHAR(255)): The user's email address. Unique and not nullable, used for identification and communication.
- `auth_provider` (VARCHAR(50)): The authentication provider used (e.g., 'google'). Not nullable.
- `created_at` (TIMESTAMP WITH TIME ZONE): Timestamp of when the user record was created. Defaults to current timestamp.
- `updated_at` (TIMESTAMP WITH TIME ZONE): Timestamp of the last update to the user record. Defaults to current timestamp.

**Relationships:**

- One-to-Many: A users record can create many workout_programs.
- One-to-Many: A users record can be associated with many exercise_completions, workout_day_completions, and workout_group_completions.
- One-to-Many: A users record can be a sender or recipient in many workout_assignments.
- One-to-One: A users record has one user_workout_stats record per workout program they are following (represented as a unique constraint on user_id and program_id in user_workout_stats).

**Indexes:**

- `idx_users_email` (Unique Index on email)

---

### 2.2. WorkoutPrograms

**Table Name:** `workout_programs`

**Purpose:** Defines individual workout programs created by users.

**Columns:**

- `id` (VARCHAR(255)): Primary Key. Unique identifier for the workout program.
- `title` (VARCHAR(255)): The title of the workout program. Not nullable.
- `description` (TEXT): A detailed description of the program. Nullable.
- `created_by_user_id` (VARCHAR(255)): Foreign Key referencing users.id. Identifies the user who created this program. Not nullable.
- `created_at` (TIMESTAMP WITH TIME ZONE): Timestamp of program creation. Defaults to current timestamp.
- `updated_at` (TIMESTAMP WITH TIME ZONE): Timestamp of the last update to the program. Defaults to current timestamp.

**Relationships:**

- Many-to-One: Belongs to one users record (created_by_user_id).
- One-to-Many: Contains many workout_groups.
- One-to-Many: Can be assigned in many workout_assignments.
- One-to-Many: Is tracked by many user_workout_stats records (one per user following the program).
- One-to-Many: Is referenced by exercise_completions, workout_day_completions, and workout_group_completions.

**Indexes:**

- `idx_workout_programs_created_by_user_id` (Index on created_by_user_id)

---

### 2.3. WorkoutGroups

**Table Name:** `workout_groups`

**Purpose:** Organizes workout_days within a workout_program, often representing weeks or phases.

**Columns:**

- `id` (VARCHAR(255)): Primary Key. Unique identifier for the workout group.
- `program_id` (VARCHAR(255)): Foreign Key referencing workout_programs.id. The program this group belongs to. Not nullable.
- `order` (INT): The display order of this group within its program. Not nullable.
- `title` (VARCHAR(255)): An optional title for the group (e.g., "Week 1"). Nullable.
- `created_at` (TIMESTAMP WITH TIME ZONE): Timestamp of group creation. Defaults to current timestamp.

**Relationships:**

- Many-to-One: Belongs to one workout_program.
- One-to-Many: Contains exactly 7 workout_days.
- One-to-Many: Can have many workout_group_completions.

**Indexes:**

- `idx_workout_groups_program_id` (Index on program_id)

---

### 2.4. WorkoutDays

**Table Name:** `workout_days`

**Purpose:** Represents a single day's workout or a rest day within a workout_group.

**Columns:**

- `id` (VARCHAR(255)): Primary Key. Unique identifier for the workout day.
- `group_id` (VARCHAR(255)): Foreign Key referencing workout_groups.id. The group this day belongs to. Not nullable.
- `order` (INT): The display order of this day within its group (expected 1-7). Not nullable.
- `is_rest_day` (BOOLEAN): Flag indicating if this day is a rest day (TRUE) or has exercises (FALSE). Defaults to FALSE. Not nullable.
- `created_at` (TIMESTAMP WITH TIME ZONE): Timestamp of day creation. Defaults to current timestamp.

**Relationships:**

- Many-to-One: Belongs to one workout_group.
- One-to-Many: Contains many exercises.
- One-to-Many: Can have many workout_day_completions.
- One-to-Many: Can be referenced as last_completed_day_id in user_workout_stats.

**Indexes:**

- `idx_workout_days_group_id` (Index on group_id)

---

### 2.5. Exercises

**Table Name:** `exercises`

**Purpose:** Defines individual exercises within a workout_day.

**Columns:**

- `id` (VARCHAR(255)): Primary Key. Unique identifier for the exercise.
- `day_id` (VARCHAR(255)): Foreign Key referencing workout_days.id. The workout day this exercise belongs to. Not nullable.
- `name` (VARCHAR(255)): The name of the exercise (e.g., "Chin Ups"). Not nullable.
- `notes` (TEXT): Specific instructions or tips for this exercise. Nullable.
- `target_warmup_sets` (INT): The number of target warmup sets. Not nullable.
- `target_working_sets` (INT): The number of target working sets. Not nullable.
- `target_reps` (VARCHAR(50)): The target repetitions (e.g., "8-10 reps", "20 reps"). Stored as string to allow ranges. Not nullable.
- `order` (INT): The display order of this exercise within its day. Not nullable.
- `created_at` (TIMESTAMP WITH TIME ZONE): Timestamp of exercise creation. Defaults to current timestamp.

**Relationships:**

- Many-to-One: Belongs to one workout_day.
- One-to-Many: Can have many exercise_completions.

**Indexes:**

- `idx_exercises_day_id` (Index on day_id)

---

### 2.6. ExerciseCompletions

**Table Name:** `exercise_completions`

**Purpose:** Records a user's completion of a specific exercise. Simplified for MVP focus.

**Columns:**

- `id` (VARCHAR(255)): Primary Key. Unique identifier for this completion record.
- `exercise_id` (VARCHAR(255)): Foreign Key referencing exercises.id. The exercise that was completed. Not nullable.
- `user_id` (VARCHAR(255)): Foreign Key referencing users.id. The user who completed the exercise. Not nullable.
- `workout_day_id` (VARCHAR(255)): Foreign Key referencing workout_days.id. The specific day this completion occurred within (useful for direct lookup). Not nullable.
- `program_id` (VARCHAR(255)): Foreign Key referencing workout_programs.id. The program this completion occurred within (useful for direct lookup). Not nullable.
- `completed_at` (TIMESTAMP WITH TIME ZONE): Timestamp of when the exercise was marked as complete. Defaults to current timestamp.
- `user_notes` (TEXT): Optional notes provided by the user for this specific completion instance. Nullable.

**Constraints:**

- UNIQUE (exercise_id, user_id, workout_day_id): Ensures a user can only have one completion record for a given exercise within a specific workout day instance.

**Relationships:**

- Many-to-One: Belongs to one exercise.
- Many-to-One: Belongs to one user.
- Many-to-One: Belongs to one workout_day.
- Many-to-One: Belongs to one workout_program.

**Indexes:**

- `idx_exercise_completions_exercise_id` (Index on exercise_id)
- `idx_exercise_completions_user_id` (Index on user_id)
- `idx_exercise_completions_workout_day_id` (Index on workout_day_id)
- `idx_exercise_completions_program_id` (Index on program_id)

---

### 2.7. WorkoutDayCompletions

**Table Name:** `workout_day_completions`

**Purpose:** Records when a user completes an entire workout_day. This is implicitly triggered.

**Columns:**

- `id` (VARCHAR(255)): Primary Key. Unique identifier for this day completion record.
- `day_id` (VARCHAR(255)): Foreign Key referencing workout_days.id. The workout day that was completed. Not nullable.
- `user_id` (VARCHAR(255)): Foreign Key referencing users.id. The user who completed the day. Not nullable.
- `workout_group_id` (VARCHAR(255)): Foreign Key referencing workout_groups.id. The group this day completion occurred within. Not nullable.
- `program_id` (VARCHAR(255)): Foreign Key referencing workout_programs.id. The program this day completion occurred within. Not nullable.
- `completed_at` (TIMESTAMP WITH TIME ZONE): Timestamp of when the workout day was marked as complete. Defaults to current timestamp.

**Constraints:**

- UNIQUE (day_id, user_id): Ensures a user completes a specific day definition only once.

**Relationships:**

- Many-to-One: Belongs to one workout_day.
- Many-to-One: Belongs to one user.
- Many-to-One: Belongs to one workout_group.
- Many-to-One: Belongs to one workout_program.

**Indexes:**

- `idx_workout_day_completions_day_id` (Index on day_id)
- `idx_workout_day_completions_user_id` (Index on user_id)

---

### 2.8. WorkoutGroupCompletions

**Table Name:** `workout_group_completions`

**Purpose:** Records when a user completes an entire workout_group. This is implicitly triggered.

**Columns:**

- `id` (VARCHAR(255)): Primary Key. Unique identifier for this group completion record.
- `group_id` (VARCHAR(255)): Foreign Key referencing workout_groups.id. The workout group that was completed. Not nullable.
- `user_id` (VARCHAR(255)): Foreign Key referencing users.id. The user who completed the group. Not nullable.
- `program_id` (VARCHAR(255)): Foreign Key referencing workout_programs.id. The program this group completion occurred within. Not nullable.
- `completed_at` (TIMESTAMP WITH TIME ZONE): Timestamp of when the workout group was marked as complete. Defaults to current timestamp.

**Constraints:**

- UNIQUE (group_id, user_id): Ensures a user completes a specific group definition only once.

**Relationships:**

- Many-to-One: Belongs to one workout_group.
- Many-to-One: Belongs to one user.
- Many-to-One: Belongs to one workout_program.

**Indexes:**

- `idx_workout_group_completions_group_id` (Index on group_id)
- `idx_workout_group_completions_user_id` (Index on user_id)

---

### 2.9. WorkoutAssignments

**Table Name:** `workout_assignments`

**Purpose:** Records which workout programs have been assigned from one user to another.

**Columns:**

- `id` (VARCHAR(255)): Primary Key. Unique identifier for the assignment.
- `sender_id` (VARCHAR(255)): Foreign Key referencing users.id. The user who assigned the program. Not nullable.
- `recipient_id` (VARCHAR(255)): Foreign Key referencing users.id. The user who received the program. Not nullable.
- `program_id` (VARCHAR(255)): Foreign Key referencing workout_programs.id. The program that was assigned. Not nullable.
- `assigned_at` (TIMESTAMP WITH TIME ZONE): Timestamp of when the assignment occurred. Defaults to current timestamp.
- `is_active` (BOOLEAN): Flag indicating if the assignment is currently active for the recipient. Defaults to TRUE. Not nullable.

**Constraints:**

- UNIQUE (recipient_id, program_id): Ensures a recipient can only have one active (or historical) assignment record for a specific program.

**Relationships:**

- Many-to-One: sender_id references one user.
- Many-to-One: recipient_id references one user.
- Many-to-One: References one workout_program.

**Indexes:**

- `idx_workout_assignments_sender_id` (Index on sender_id)
- `idx_workout_assignments_recipient_id` (Index on recipient_id)
- `idx_workout_assignments_program_id` (Index on program_id)

---

### 2.10. UserWorkoutStats

**Table Name:** `user_workout_stats`

**Purpose:** Aggregates high-level statistics for a user's progress within a specific program.

**Columns:**

- `id` (VARCHAR(255)): Primary Key. Unique identifier for the stats record.
- `user_id` (VARCHAR(255)): Foreign Key referencing users.id. The user these stats belong to. Not nullable.
- `program_id` (VARCHAR(255)): Foreign Key referencing workout_programs.id. The program these stats relate to. Not nullable.
- `completed_day_count` (INT): Total number of workout_days completed by this user for this program. Defaults to 0. Not nullable.
- `last_completed_day_id` (VARCHAR(255)): Foreign Key referencing workout_days.id. The ID of the most recently completed workout day in this program. Nullable.
- `last_completed_at` (TIMESTAMP WITH TIME ZONE): Timestamp of the most recent workout_day completion for this program. Nullable.
- `program_start_date` (TIMESTAMP WITH TIME ZONE): The date/time when the user first started following this program. Nullable.

**Constraints:**

- UNIQUE (user_id, program_id): Ensures only one stats record per user per program.

**Relationships:**

- Many-to-One: Belongs to one user.
- Many-to-One: Belongs to one workout_program.
- Many-to-One: last_completed_day_id references one workout_day.

**Indexes:**

- `idx_user_workout_stats_user_id` (Index on user_id)
- `idx_user_workout_stats_program_id` (Index on program_id)
