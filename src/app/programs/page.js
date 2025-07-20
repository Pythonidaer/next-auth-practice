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

  // Fetch all available workout programs
  const programs = await prisma.workoutProgram.findMany({
    select: {
      id: true,
      title: true,
      description: true,
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
