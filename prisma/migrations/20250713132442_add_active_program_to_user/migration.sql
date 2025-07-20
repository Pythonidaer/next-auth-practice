-- AlterTable
ALTER TABLE "users" ADD COLUMN     "active_workout_program_id" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_active_workout_program_id_fkey" FOREIGN KEY ("active_workout_program_id") REFERENCES "workout_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
