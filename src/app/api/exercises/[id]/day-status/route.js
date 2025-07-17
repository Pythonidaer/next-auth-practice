// src/app/api/exercises/[id]/day-status/route.js
import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/utils/prisma';

/**
 * GET /api/exercises/[id]/day-status
 *
 * Checks if all exercises in the same day as the specified exercise are completed
 * Returns { isCompleted: boolean, totalExercises: number, completedExercises: number }
 */
export async function GET(request, { params }) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const exerciseId = params.id;

    // Get the exercise to find its day
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: {
        day: true,
      },
    });

    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 },
      );
    }

    const workoutDayId = exercise.day.id;

    // Get all exercises for this day
    const allExercisesInDay = await prisma.exercise.findMany({
      where: { dayId: workoutDayId },
      select: { id: true },
    });

    // Get completed exercises for this day by this user
    const completedExercises = await prisma.exerciseCompletion.findMany({
      where: {
        workoutDayId,
        userId,
        exercise: {
          dayId: workoutDayId,
        },
      },
      select: { exerciseId: true },
    });

    // Check if the day is completed (all exercises are completed)
    const totalExercises = allExercisesInDay.length;
    const completedCount = completedExercises.length;
    const isCompleted = completedCount === totalExercises && totalExercises > 0;

    // Check if day completion record exists
    const dayCompletionExists = await prisma.workoutDayCompletion.findUnique({
      where: {
        dayId_userId: {
          dayId: workoutDayId,
          userId,
        },
      },
    });

    return NextResponse.json({
      isCompleted,
      totalExercises,
      completedExercises: completedCount,
      dayCompletionExists: !!dayCompletionExists,
    });
  } catch (error) {
    console.error('Error checking day completion status:', error);
    return NextResponse.json(
      { error: 'Failed to check day completion status' },
      { status: 500 },
    );
  }
}
