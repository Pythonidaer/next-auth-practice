// src/app/api/exercises/[id]/route.js
import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/utils/prisma';

/**
 * PATCH /api/exercises/[id]
 *
 * Updates an exercise's completion status
 *
 * Future extensibility:
 * - This endpoint could be extended to support undoing completion
 * - Could also support updating exercise details (reps, weights, sets)
 * - Could add user notes for the completion
 */
// Helper function to check if a completion record exists
async function checkExistingCompletion(exerciseId, userId, workoutDayId) {
  return await prisma.exerciseCompletion.findUnique({
    where: {
      exerciseId_userId_workoutDayId: {
        exerciseId,
        userId,
        workoutDayId,
      },
    },
  });
}

// Helper function to check and create day completion
async function handleDayCompletion(
  workoutDayId,
  userId,
  workoutGroupId,
  programId,
) {
  // Check if day is already marked as completed
  const existingDayCompletion = await prisma.workoutDayCompletion.findUnique({
    where: {
      dayId_userId: {
        dayId: workoutDayId,
        userId,
      },
    },
  });

  // Only create day completion if it doesn't exist
  if (!existingDayCompletion) {
    await prisma.workoutDayCompletion.create({
      data: {
        day: { connect: { id: workoutDayId } },
        user: { connect: { id: userId } },
        workoutGroup: { connect: { id: workoutGroupId } },
        program: { connect: { id: programId } },
        // Note: The mere existence of this record indicates completion
      },
    });

    return true; // Day was newly completed
  }

  return false; // Day was already completed
}

// Helper function to check and create group completion
async function handleGroupCompletion(workoutGroupId, userId, programId) {
  // Check if group is already marked as completed
  const existingGroupCompletion =
    await prisma.workoutGroupCompletion.findUnique({
      where: {
        groupId_userId: {
          groupId: workoutGroupId,
          userId,
        },
      },
    });

  // Only create group completion if it doesn't exist
  if (!existingGroupCompletion) {
    await prisma.workoutGroupCompletion.create({
      data: {
        group: { connect: { id: workoutGroupId } },
        user: { connect: { id: userId } },
        program: { connect: { id: programId } },
      },
    });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const exerciseId = params.id;
    const { completed = true } = await request.json();

    // Get the exercise to complete
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: {
        day: {
          include: {
            group: {
              include: {
                program: true,
              },
            },
          },
        },
      },
    });

    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 },
      );
    }

    const workoutDayId = exercise.day.id;
    const workoutGroupId = exercise.day.group.id;
    const programId = exercise.day.group.program.id;

    // Check if the exercise is already completed by this user
    const existingCompletion = await checkExistingCompletion(
      exerciseId,
      userId,
      workoutDayId,
    );

    // If already completed and we're setting to completed, just return the existing completion
    if (existingCompletion && completed) {
      return NextResponse.json(existingCompletion);
    }

    // If already completed and we're setting to not completed, delete the completion (future feature)
    // This is commented out as it's not in scope for MVP but shows future extensibility
    /*
    if (existingCompletion && !completed) {
      const deletedCompletion = await prisma.exerciseCompletion.delete({
        where: {
          id: existingCompletion.id
        }
      });
      
      // TODO: Check if we need to update day/group completion status
      
      return NextResponse.json(deletedCompletion);
    }
    */

    // Create a new completion record
    const exerciseCompletion = await prisma.exerciseCompletion.create({
      data: {
        exercise: { connect: { id: exerciseId } },
        user: { connect: { id: userId } },
        workoutDay: { connect: { id: workoutDayId } },
        program: { connect: { id: programId } },
        // Future: userNotes could be added here
      },
    });

    // Check if all exercises for this day are completed
    const allExercisesInDay = await prisma.exercise.findMany({
      where: { dayId: workoutDayId },
    });

    const completedExercises = await prisma.exerciseCompletion.findMany({
      where: {
        workoutDayId,
        userId,
        exercise: {
          dayId: workoutDayId,
        },
      },
    });

    // If all exercises are completed, mark the day as completed
    if (completedExercises.length === allExercisesInDay.length) {
      // Handle day completion and check if it was newly completed
      const dayNewlyCompleted = await handleDayCompletion(
        workoutDayId,
        userId,
        workoutGroupId,
        programId,
      );

      // Only check for group completion if the day was newly completed
      if (dayNewlyCompleted) {
        // Check if all days in the group are completed
        const allDaysInGroup = await prisma.workoutDay.findMany({
          where: { groupId: workoutGroupId },
        });

        const completedDays = await prisma.workoutDayCompletion.findMany({
          where: {
            workoutGroupId,
            userId,
            day: {
              groupId: workoutGroupId,
            },
          },
        });

        // If all days in group are completed, mark the group as completed
        if (completedDays.length === allDaysInGroup.length) {
          // Handle group completion
          await handleGroupCompletion(workoutGroupId, userId, programId);
        }
      }
    }

    return NextResponse.json(exerciseCompletion);
  } catch (error) {
    console.error('Error completing exercise:', error);
    return NextResponse.json(
      { error: 'Failed to complete exercise' },
      { status: 500 },
    );
  }
}
