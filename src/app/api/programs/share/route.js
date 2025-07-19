import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/utils/prisma';

export async function POST(request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const senderId = session.userId;
    const { programId, recipientId, setAsActive } = await request.json();

    // Validate input
    if (!programId || !recipientId) {
      return NextResponse.json(
        { error: 'Program ID and recipient ID are required' },
        { status: 400 },
      );
    }

    // Check if the program exists and belongs to the sender
    const originalProgram = await prisma.workoutProgram.findFirst({
      where: {
        id: programId,
        createdByUserId: senderId,
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

    if (!originalProgram) {
      return NextResponse.json(
        {
          error: 'Program not found or you do not have permission to share it',
        },
        { status: 404 },
      );
    }

    // Check if the recipient exists
    const recipient = await prisma.user.findUnique({
      where: {
        id: recipientId,
      },
    });

    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 },
      );
    }

    // Create a new program for the recipient (copy structure but not completions)
    const newProgram = await prisma.workoutProgram.create({
      data: {
        title: originalProgram.title,
        description: originalProgram.description,
        createdByUser: {
          connect: {
            id: senderId,
          },
        },
      },
    });

    // Copy workout groups
    for (const group of originalProgram.workoutGroups) {
      const newGroup = await prisma.workoutGroup.create({
        data: {
          title: group.title,
          order: group.order,
          program: {
            connect: {
              id: newProgram.id,
            },
          },
        },
      });

      // Copy workout days
      for (const day of group.workoutDays) {
        const newDay = await prisma.workoutDay.create({
          data: {
            title: day.title,
            order: day.order,
            isRestDay: day.isRestDay,
            group: {
              connect: {
                id: newGroup.id,
              },
            },
          },
        });

        // Copy exercises (if not a rest day)
        if (!day.isRestDay) {
          for (const exercise of day.exercises) {
            await prisma.exercise.create({
              data: {
                name: exercise.name,
                notes: exercise.notes,
                targetReps: exercise.targetReps,
                targetSets: exercise.targetSets,
                targetWeight: exercise.targetWeight,
                targetTime: exercise.targetTime,
                targetDistance: exercise.targetDistance,
                targetWarmupSets: exercise.targetWarmupSets,
                targetWorkingSets: exercise.targetWorkingSets,
                order: exercise.order,
                day: {
                  connect: {
                    id: newDay.id,
                  },
                },
              },
            });
          }
        }
      }
    }

    // Create workout assignment record
    await prisma.workoutAssignment.create({
      data: {
        sender: {
          connect: {
            id: senderId,
          },
        },
        recipient: {
          connect: {
            id: recipientId,
          },
        },
        program: {
          connect: {
            id: newProgram.id,
          },
        },
        isActive: true,
      },
    });

    // Set as active program if requested
    if (setAsActive) {
      await prisma.user.update({
        where: {
          id: recipientId,
        },
        data: {
          activeWorkoutProgram: {
            connect: {
              id: newProgram.id,
            },
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Program shared successfully',
      programId: newProgram.id,
    });
  } catch (error) {
    console.error('Error sharing program:', error);
    return NextResponse.json(
      { error: 'Failed to share program' },
      { status: 500 },
    );
  }
}
