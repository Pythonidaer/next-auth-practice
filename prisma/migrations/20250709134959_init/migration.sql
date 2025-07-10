-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "auth_provider" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_programs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workout_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_groups" (
    "id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workout_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_days" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "is_rest_day" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workout_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" TEXT NOT NULL,
    "day_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "target_warmup_sets" INTEGER NOT NULL,
    "target_working_sets" INTEGER NOT NULL,
    "target_reps" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_completions" (
    "id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "workout_day_id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_notes" TEXT,

    CONSTRAINT "exercise_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_day_completions" (
    "id" TEXT NOT NULL,
    "day_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "workout_group_id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workout_day_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_group_completions" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workout_group_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_assignments" (
    "id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "workout_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_workout_stats" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "completed_day_count" INTEGER NOT NULL DEFAULT 0,
    "last_completed_day_id" TEXT,
    "last_completed_at" TIMESTAMP(3),
    "program_start_date" TIMESTAMP(3),

    CONSTRAINT "user_workout_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "workout_programs_created_by_user_id_idx" ON "workout_programs"("created_by_user_id");

-- CreateIndex
CREATE INDEX "workout_groups_program_id_idx" ON "workout_groups"("program_id");

-- CreateIndex
CREATE INDEX "workout_days_group_id_idx" ON "workout_days"("group_id");

-- CreateIndex
CREATE INDEX "exercises_day_id_idx" ON "exercises"("day_id");

-- CreateIndex
CREATE INDEX "exercise_completions_exercise_id_idx" ON "exercise_completions"("exercise_id");

-- CreateIndex
CREATE INDEX "exercise_completions_user_id_idx" ON "exercise_completions"("user_id");

-- CreateIndex
CREATE INDEX "exercise_completions_workout_day_id_idx" ON "exercise_completions"("workout_day_id");

-- CreateIndex
CREATE INDEX "exercise_completions_program_id_idx" ON "exercise_completions"("program_id");

-- CreateIndex
CREATE UNIQUE INDEX "exercise_completions_exercise_id_user_id_workout_day_id_key" ON "exercise_completions"("exercise_id", "user_id", "workout_day_id");

-- CreateIndex
CREATE INDEX "workout_day_completions_day_id_idx" ON "workout_day_completions"("day_id");

-- CreateIndex
CREATE INDEX "workout_day_completions_user_id_idx" ON "workout_day_completions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "workout_day_completions_day_id_user_id_key" ON "workout_day_completions"("day_id", "user_id");

-- CreateIndex
CREATE INDEX "workout_group_completions_group_id_idx" ON "workout_group_completions"("group_id");

-- CreateIndex
CREATE INDEX "workout_group_completions_user_id_idx" ON "workout_group_completions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "workout_group_completions_group_id_user_id_key" ON "workout_group_completions"("group_id", "user_id");

-- CreateIndex
CREATE INDEX "workout_assignments_sender_id_idx" ON "workout_assignments"("sender_id");

-- CreateIndex
CREATE INDEX "workout_assignments_recipient_id_idx" ON "workout_assignments"("recipient_id");

-- CreateIndex
CREATE INDEX "workout_assignments_program_id_idx" ON "workout_assignments"("program_id");

-- CreateIndex
CREATE UNIQUE INDEX "workout_assignments_recipient_id_program_id_key" ON "workout_assignments"("recipient_id", "program_id");

-- CreateIndex
CREATE INDEX "user_workout_stats_user_id_idx" ON "user_workout_stats"("user_id");

-- CreateIndex
CREATE INDEX "user_workout_stats_program_id_idx" ON "user_workout_stats"("program_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_workout_stats_user_id_program_id_key" ON "user_workout_stats"("user_id", "program_id");

-- AddForeignKey
ALTER TABLE "workout_programs" ADD CONSTRAINT "workout_programs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_groups" ADD CONSTRAINT "workout_groups_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "workout_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_days" ADD CONSTRAINT "workout_days_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "workout_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "workout_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_completions" ADD CONSTRAINT "exercise_completions_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_completions" ADD CONSTRAINT "exercise_completions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_completions" ADD CONSTRAINT "exercise_completions_workout_day_id_fkey" FOREIGN KEY ("workout_day_id") REFERENCES "workout_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_completions" ADD CONSTRAINT "exercise_completions_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "workout_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_day_completions" ADD CONSTRAINT "workout_day_completions_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "workout_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_day_completions" ADD CONSTRAINT "workout_day_completions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_day_completions" ADD CONSTRAINT "workout_day_completions_workout_group_id_fkey" FOREIGN KEY ("workout_group_id") REFERENCES "workout_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_day_completions" ADD CONSTRAINT "workout_day_completions_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "workout_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_group_completions" ADD CONSTRAINT "workout_group_completions_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "workout_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_group_completions" ADD CONSTRAINT "workout_group_completions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_group_completions" ADD CONSTRAINT "workout_group_completions_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "workout_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_assignments" ADD CONSTRAINT "workout_assignments_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_assignments" ADD CONSTRAINT "workout_assignments_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_assignments" ADD CONSTRAINT "workout_assignments_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "workout_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workout_stats" ADD CONSTRAINT "user_workout_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workout_stats" ADD CONSTRAINT "user_workout_stats_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "workout_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workout_stats" ADD CONSTRAINT "user_workout_stats_last_completed_day_id_fkey" FOREIGN KEY ("last_completed_day_id") REFERENCES "workout_days"("id") ON DELETE SET NULL ON UPDATE CASCADE;
