import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/utils/prisma';

// GET /api/programs - Get all programs for the current user
export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const programs = await prisma.workoutProgram.findMany({
      where: {
        createdByUserId: userId,
      },
      include: {
        workoutGroups: {
          include: {
            workoutDays: {
              include: {
                exercises: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ programs });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 },
    );
  }
}

// POST /api/programs - Create a new program
export async function POST(request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const data = await request.json();
    const { programDetails, workoutGroups } = data;

    // Validate required fields
    if (!programDetails.title) {
      return NextResponse.json(
        { error: 'Program title is required' },
        { status: 400 },
      );
    }

    // Create the program
    const program = await prisma.workoutProgram.create({
      data: {
        title: programDetails.title,
        description: programDetails.description || '',
        createdByUserId: userId,
        workoutGroups: {
          create: workoutGroups.map((group) => ({
            title: group.title,
            order: group.order,
            workoutDays: {
              create: group.days.map((day) => ({
                order: day.order,
                isRestDay: day.isRestDay || false,
                exercises: {
                  create: day.isRestDay
                    ? []
                    : (day.exercises || []).map((exercise) => ({
                        name: exercise.name,
                        targetWarmupSets:
                          parseInt(exercise.targetWarmupSets) || 0,
                        targetWorkingSets:
                          parseInt(exercise.targetWorkingSets) || 0,
                        targetReps: exercise.targetReps || '',
                        notes: exercise.notes || '',
                        order: exercise.order,
                      })),
                },
              })),
            },
          })),
        },
      },
      include: {
        workoutGroups: {
          include: {
            workoutDays: {
              include: {
                exercises: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Program created successfully',
      program,
    });
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json(
      { error: 'Failed to create program' },
      { status: 500 },
    );
  }
}
