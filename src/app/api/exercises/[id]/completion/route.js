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

    // Get the exercise
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

    return NextResponse.json({
      isCompleted: !!completion,
      completedAt: completion?.completedAt || null,
    });
  } catch (error) {
    console.error('Error checking exercise completion:', error);
    return NextResponse.json(
      { error: 'Failed to check exercise completion' },
      { status: 500 },
    );
  }
}
