import React from 'react';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/utils/prisma';
import ProgramSelection from '@/components/ProgramSelection/ProgramSelection';
import styles from './programs.module.css';

export default async function ProgramsPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className={styles.container}>
        <h1>Programs</h1>
        <p>Please sign in to view and select workout programs.</p>
      </div>
    );
  }

  // Fetch programs that are either:
  // 1. Created by the current user for themselves
  // 2. Assigned to the current user by someone else
  const programs = await prisma.workoutProgram.findMany({
    where: {
      OR: [
        // Programs created by the current user for themselves
        {
          createdByUserId: session.user.id,
          // Exclude programs that have been assigned to other users
          NOT: {
            assignments: {
              some: {
                senderId: session.user.id,
                recipientId: { not: session.user.id }, // Not self-assigned
              },
            },
          },
        },
        // Programs assigned to the current user (by anyone)
        {
          assignments: {
            some: {
              recipientId: session.user.id,
              isActive: true,
            },
          },
        },
      ],
    },
    select: {
      id: true,
      title: true,
      description: true,
      createdByUserId: true, // Include this to show who created the program
    },
    orderBy: {
      title: 'asc',
    },
  });

  // Get the user's current active program
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      activeWorkoutProgramId: true,
    },
  });

  const activeWorkoutProgramId = user?.activeWorkoutProgramId || null;

  return (
    <div className={styles.container}>
      <h1>Select a Workout Program</h1>
      <ProgramSelection
        programs={programs}
        activeWorkoutProgramId={activeWorkoutProgramId}
        userId={session.user.id}
      />
    </div>
  );
}
