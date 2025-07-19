import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/utils/prisma';

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user with active program
    const userWithActiveProgram = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        activeWorkoutProgram: true,
      },
    });

    if (!userWithActiveProgram || !userWithActiveProgram.activeWorkoutProgram) {
      return NextResponse.json(
        { error: 'No active workout program' },
        { status: 404 },
      );
    }

    const activeProgram = userWithActiveProgram.activeWorkoutProgram;

    // Get all workout groups for the program
    const workoutGroups = await prisma.workoutGroup.findMany({
      where: { programId: activeProgram.id },
      orderBy: { order: 'asc' },
      include: {
        workoutDays: {
          orderBy: { order: 'asc' },
          include: {
            exercises: {
              orderBy: { order: 'asc' },
            },
            dayCompletions: {
              where: { userId },
            },
          },
        },
      },
    });

    // Flatten the days from all groups
    const allDays = [];
    let completedDaysCount = 0;

    workoutGroups.forEach((group) => {
      group.workoutDays.forEach((day) => {
        const isCompleted = day.dayCompletions && day.dayCompletions.length > 0;
        if (isCompleted) {
          completedDaysCount++;
        }

        // Check if it's a rest day
        const isRestDay = day.exercises.length === 0;

        allDays.push({
          id: day.id,
          order: day.order,
          isRestDay,
          isCompleted,
          groupOrder: group.order,
          exercises: isRestDay
            ? []
            : day.exercises.map((exercise) => ({
                id: exercise.id,
                name: exercise.name,
                reps: exercise.targetReps,
                sets: exercise.targetWorkingSets,
              })),
        });
      });
    });

    // Sort days by group order then day order
    allDays.sort((a, b) => {
      if (a.groupOrder !== b.groupOrder) {
        return a.groupOrder - b.groupOrder;
      }
      return a.order - b.order;
    });

    // Count total days
    const totalDays = allDays.length;

    return NextResponse.json({
      program: {
        id: activeProgram.id,
        name: activeProgram.title, // Use title from the WorkoutProgram model
        description: activeProgram.description,
      },
      days: allDays,
      completedDays: completedDaysCount,
      totalDays,
    });
  } catch (error) {
    console.error('Error in GET /api/workouts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
