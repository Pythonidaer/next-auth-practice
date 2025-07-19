import React from 'react';
import { auth } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/utils/prisma';
import ProgramShareForm from '@/components/ProgramShareForm/ProgramShareForm';
import styles from './share.module.css';

export default async function ShareProgramPage() {
  const session = await auth();

  if (!session) {
    return redirect('/auth/signin');
  }

  const userId = session.userId;

  // Fetch the user's programs to share
  const userPrograms = await prisma.workoutProgram.findMany({
    where: {
      createdByUserId: userId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      workoutGroups: {
        select: {
          id: true,
          title: true,
          _count: {
            select: {
              workoutDays: true,
            },
          },
        },
      },
    },
  });

  // Fetch other users that programs can be shared with
  const otherUsers = await prisma.user.findMany({
    where: {
      id: {
        not: userId,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Share Workout Program</h1>
      <p className={styles.description}>
        Share your workout programs with other users.
      </p>

      {userPrograms.length === 0 ? (
        <div className={styles.formContainer}>
          <h2>No Programs Available</h2>
          <p>
            You don&apos;t have any workout programs to share. Create a program
            first.
          </p>
          <Link href="/programs" className={styles.backLink}>
            Back to Programs
          </Link>
        </div>
      ) : otherUsers.length === 0 ? (
        <div className={styles.formContainer}>
          <h2>No Users Available</h2>
          <p>There are no other users to share your programs with.</p>
          <Link href="/programs" className={styles.backLink}>
            Back to Programs
          </Link>
        </div>
      ) : (
        <ProgramShareForm
          programs={userPrograms}
          users={otherUsers}
          currentUserId={userId}
        />
      )}
    </div>
  );
}
