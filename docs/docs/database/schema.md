# Database Schema (PostgreSQL)

This document outlines the PostgreSQL database schema for the Meatbag application, based on the finalized domain model. It includes CREATE TABLE statements for each entity, defining columns, data types, primary keys, foreign keys, and other constraints.

## Table of Contents

- [Schema Overview](#schema-overview)
- [Table Definitions](#table-definitions)
  - [Users Table](#users-table)
  - [WorkoutPrograms Table](#workoutprograms-table)
  - [WorkoutGroups Table](#workoutgroups-table)
  - [WorkoutDays Table](#workoutdays-table)
  - [Exercises Table](#exercises-table)
  - [ExerciseCompletions Table](#exercisecompletions-table)
  - [WorkoutDayCompletions Table](#workoutdaycompletions-table)
  - [WorkoutGroupCompletions Table](#workoutgroupcompletions-table)
  - [WorkoutAssignments Table](#workoutassignments-table)
  - [UserWorkoutStats Table](#userworkoutstats-table)

---

## 1. Schema Overview

The database schema is designed to support the core functionalities of creating, managing, tracking, and sharing workout programs. Relationships are established using foreign keys to ensure data integrity.

---

## 2. Table Definitions

### Users Table

Stores information about the application's users.

```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    auth_provider VARCHAR(50) NOT NULL, -- e.g., 'google'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### WorkoutPrograms Table

Stores details of workout programs created by users.

```sql
CREATE TABLE workout_programs (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT, -- NULLABLE
    created_by_user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT fk_created_by_user
        FOREIGN KEY (created_by_user_id)
        REFERENCES users (id)
        ON DELETE CASCADE -- If user is deleted, their programs are deleted
);
```

### WorkoutGroups Table

Organizes workout days within a program (e.g., "Week 1").

```sql
CREATE TABLE workout_groups (
    id VARCHAR(255) PRIMARY KEY,
    program_id VARCHAR(255) NOT NULL,
    "order" INT NOT NULL, -- 'order' is a reserved keyword, using quotes
    title VARCHAR(255), -- NULLABLE, e.g., "Week 1"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT fk_program
        FOREIGN KEY (program_id)
        REFERENCES workout_programs (id)
        ON DELETE CASCADE -- If program is deleted, its groups are deleted
);
```

### WorkoutDays Table

Represents a single day within a workout group, potentially a rest day or containing exercises.

```sql
CREATE TABLE workout_days (
    id VARCHAR(255) PRIMARY KEY,
    group_id VARCHAR(255) NOT NULL,
    "order" INT NOT NULL, -- 'order' is a reserved keyword
    is_rest_day BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT fk_group
        FOREIGN KEY (group_id)
        REFERENCES workout_groups (id)
        ON DELETE CASCADE -- If group is deleted, its days are deleted
);
```

### Exercises Table

Details for individual exercises within a workout day.

```sql
CREATE TABLE exercises (
    id VARCHAR(255) PRIMARY KEY,
    day_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    notes TEXT, -- NULLABLE
    target_warmup_sets INT NOT NULL,
    target_working_sets INT NOT NULL,
    target_reps VARCHAR(50) NOT NULL, -- e.g., '8-10 reps', '20 reps'
    "order" INT NOT NULL, -- 'order' is a reserved keyword
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT fk_day
        FOREIGN KEY (day_id)
        REFERENCES workout_days (id)
        ON DELETE CASCADE -- If day is deleted, its exercises are deleted
);
```

### ExerciseCompletions Table

Records a user's completion of a specific exercise. Simplified for MVP.

```sql
CREATE TABLE exercise_completions (
    id VARCHAR(255) PRIMARY KEY,
    exercise_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    workout_day_id VARCHAR(255) NOT NULL, -- Redundant but useful for direct lookup
    program_id VARCHAR(255) NOT NULL,     -- Redundant but useful for direct lookup
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_notes TEXT, -- NULLABLE

    CONSTRAINT fk_exercise_completion_exercise
        FOREIGN KEY (exercise_id)
        REFERENCES exercises (id)
        ON DELETE CASCADE, -- If exercise is deleted, its completions are deleted
    CONSTRAINT fk_exercise_completion_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE, -- If user is deleted, their completions are deleted
    CONSTRAINT fk_exercise_completion_day
        FOREIGN KEY (workout_day_id)
        REFERENCES workout_days (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_exercise_completion_program
        FOREIGN KEY (program_id)
        REFERENCES workout_programs (id)
        ON DELETE CASCADE,
    -- Ensure an exercise is completed only once per user per day for MVP simplicity
    UNIQUE (exercise_id, user_id, workout_day_id)
);
```

### WorkoutDayCompletions Table

Records when a user completes an entire workout day (implicitly triggered).

```sql
CREATE TABLE workout_day_completions (
    id VARCHAR(255) PRIMARY KEY,
    day_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    workout_group_id VARCHAR(255) NOT NULL, -- Redundant but useful for direct lookup
    program_id VARCHAR(255) NOT NULL,       -- Redundant but useful for direct lookup
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT fk_day_completion_day
        FOREIGN KEY (day_id)
        REFERENCES workout_days (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_day_completion_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_day_completion_group
        FOREIGN KEY (workout_group_id)
        REFERENCES workout_groups (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_day_completion_program
        FOREIGN KEY (program_id)
        REFERENCES workout_programs (id)
        ON DELETE CASCADE,
    UNIQUE (day_id, user_id) -- A user completes a specific day only once
);
```

### WorkoutGroupCompletions Table

Records when a user completes an entire workout group (implicitly triggered).

```sql
CREATE TABLE workout_group_completions (
    id VARCHAR(255) PRIMARY KEY,
    group_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    program_id VARCHAR(255) NOT NULL, -- Redundant but useful for direct lookup
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT fk_group_completion_group
        FOREIGN KEY (group_id)
        REFERENCES workout_groups (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_group_completion_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_group_completion_program
        FOREIGN KEY (program_id)
        REFERENCES workout_programs (id)
        ON DELETE CASCADE,
    UNIQUE (group_id, user_id) -- A user completes a specific group only once
);
```

### WorkoutAssignments Table

Records which workout programs have been assigned from one user to another.

```sql
CREATE TABLE workout_assignments (
    id VARCHAR(255) PRIMARY KEY,
    sender_id VARCHAR(255) NOT NULL,
    recipient_id VARCHAR(255) NOT NULL,
    program_id VARCHAR(255) NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,

    CONSTRAINT fk_assignment_sender
        FOREIGN KEY (sender_id)
        REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_assignment_recipient
        FOREIGN KEY (recipient_id)
        REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_assignment_program
        FOREIGN KEY (program_id)
        REFERENCES workout_programs (id)
        ON DELETE CASCADE,
    UNIQUE (recipient_id, program_id) -- A recipient can only be assigned a specific program once (active or not)
);
```

### UserWorkoutStats Table

Aggregates high-level statistics for a user's progress within a specific program.

```sql
CREATE TABLE user_workout_stats (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    program_id VARCHAR(255) NOT NULL,
    completed_day_count INT DEFAULT 0 NOT NULL,
    last_completed_day_id VARCHAR(255), -- NULLABLE
    last_completed_at TIMESTAMP WITH TIME ZONE, -- NULLABLE
    program_start_date TIMESTAMP WITH TIME ZONE, -- NULLABLE, when user first started this program

    CONSTRAINT fk_stats_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_stats_program
        FOREIGN KEY (program_id)
        REFERENCES workout_programs (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_stats_last_day
        FOREIGN KEY (last_completed_day_id)
        REFERENCES workout_days (id)
        ON DELETE SET NULL, -- If the day definition is deleted, don't delete the stat record
    UNIQUE (user_id, program_id) -- One stats record per user per program
);
```
