// src/app/api/exercises/[id]/completion/route.js
import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/utils/prisma';

/**
 * GET /api/exercises/[id]/completion
 *
 * Checks if an exercise is completed by the current user
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

    console.log(
      `Checking completion for exercise ID: ${exerciseId}, user ID: ${userId}`,
    );

    // Get the exercise
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: {
        day: true,
      },
    });

    if (!exercise) {
      console.log(`Exercise not found with ID: ${exerciseId}`);
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 },
      );
    }

    const workoutDayId = exercise.day.id;
    console.log(
      `Found workout day ID: ${workoutDayId} for exercise ID: ${exerciseId}`,
    );

    // Check if the exercise is completed by this user
    const completion = await prisma.exerciseCompletion.findUnique({
      where: {
        exerciseId_userId_workoutDayId: {
          exerciseId,
          userId,
          workoutDayId,
        },
      },
    });

    console.log(
      `Completion result for exercise ID ${exerciseId}:`,
      completion ? 'Found' : 'Not found',
    );

    // For debugging, let's also check if there are any completions for this exercise with any user
    const allCompletions = await prisma.exerciseCompletion.findMany({
      where: { exerciseId },
    });

    console.log(
      `Total completions found for exercise ID ${exerciseId}: ${allCompletions.length}`,
    );
    if (allCompletions.length > 0) {
      console.log('Sample completion:', allCompletions[0]);
    }

    return NextResponse.json({
      isCompleted: !!completion,
      completedAt: completion?.completedAt || null,
      debug: {
        exerciseId,
        userId,
        workoutDayId,
        totalCompletionsForExercise: allCompletions.length,
      },
    });
  } catch (error) {
    console.error('Error checking exercise completion:', error);
    return NextResponse.json(
      { error: 'Failed to check exercise completion' },
      { status: 500 },
    );
  }
}
