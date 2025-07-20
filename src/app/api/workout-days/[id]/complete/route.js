import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/utils/prisma';

/**
 * POST /api/workout-days/[id]/complete
 * Marks a workout day as complete for the current user
 * Also checks if all days in the group are complete and marks the group as complete if needed
 */
export async function POST(request, { params }) {
  try {
    // Await params.id to get the dayId (Next.js requires awaiting params)
    const dayId = await params.id;
    const session = await auth();

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to complete a workout day' },
        { status: 401 },
      );
    }

    const userId = session.userId;

    // Validate the workout day exists
    const workoutDay = await prisma.workoutDay.findUnique({
      where: { id: dayId },
      include: {
        group: true,
        dayCompletions: {
          where: { userId },
        },
      },
    });

    if (!workoutDay) {
      return NextResponse.json(
        { error: 'Workout day not found' },
        { status: 404 },
      );
    }

    // Check if the day is already completed
    if (workoutDay.dayCompletions.length > 0) {
      return NextResponse.json(
        { error: 'Workout day already completed' },
        { status: 400 },
      );
    }

    // Get the program ID from the workout group
    const programId = workoutDay.group.programId;
    const workoutGroupId = workoutDay.groupId;

    // Create a workout day completion record with all required fields
    const completion = await prisma.workoutDayCompletion.create({
      data: {
        dayId,
        userId,
        workoutGroupId,
        programId,
      },
    });

    // Check if all days in the group are now complete
    const workoutGroup = await prisma.workoutGroup.findUnique({
      where: { id: workoutGroupId },
      include: {
        workoutDays: {
          include: {
            dayCompletions: {
              where: { userId },
            },
          },
        },
        groupCompletions: {
          where: { userId },
        },
      },
    });

    let groupCompletion = null;
    let isNewGroupComplete = false;

    // If the group exists and has no completion record yet
    if (workoutGroup && workoutGroup.groupCompletions.length === 0) {
      // Check if all days in the group are complete
      const allDaysComplete = workoutGroup.workoutDays.every(
        (day) => day.dayCompletions.length > 0,
      );

      // If all days are complete, create a group completion record
      if (allDaysComplete) {
        groupCompletion = await prisma.workoutGroupCompletion.create({
          data: {
            groupId: workoutGroupId,
            userId,
            programId,
          },
        });

        isNewGroupComplete = true;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Workout day marked as complete',
      completion,
      groupCompletion,
      isNewGroupComplete,
    });
  } catch (error) {
    console.error('Error completing workout day:', error);
    return NextResponse.json(
      { error: 'Failed to complete workout day' },
      { status: 500 },
    );
  }
}
