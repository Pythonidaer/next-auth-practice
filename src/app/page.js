// No 'use client' directive - this is now a Server Component
import React from 'react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { auth } from './lib/auth';
import { prisma } from '../utils/prisma';
import getFirstName from '../utils/getFirstName';
import WorkoutButtons from '../components/WorkoutButtons/WorkoutButtons';
import styles from './page.module.css';

/**
 * Fetches user with their active workout program and related data
 */
async function fetchUserWithActiveProgram(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      activeWorkoutProgram: {
        include: {
          workoutGroups: {
            orderBy: { order: 'asc' },
            include: {
              workoutDays: {
                orderBy: { order: 'asc' },
                include: {
                  exercises: true,
                  dayCompletions: {
                    where: { userId },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

/**
 * Finds the first incomplete workout day in a program
 */
function findFirstIncompleteDay(activeProgram, userId) {
  if (!activeProgram) {
    return {
      firstIncompleteDay: null,
      activeWorkoutGroup: null,
      numExercises: 0,
      dayNumber: 0,
    };
  }

  for (const group of activeProgram.workoutGroups) {
    const incompleteDay = group.workoutDays.find((day) => {
      // Check if this day has no completion record or is not complete
      return !day.dayCompletions.some(
        (comp) => comp.userId === userId && comp.isComplete,
      );
    });

    if (incompleteDay) {
      return {
        firstIncompleteDay: incompleteDay,
        activeWorkoutGroup: group,
        numExercises: incompleteDay.exercises.length,
        dayNumber: incompleteDay.order,
      };
    }
  }

  return {
    firstIncompleteDay: null,
    activeWorkoutGroup: null,
    numExercises: 0,
    dayNumber: 0,
  };
}

/**
 * Renders the active program section if no program is selected
 */
function renderActiveProgramSection(activeProgram) {
  // Only render this section if there's no active program
  if (!activeProgram) {
    return (
      <div className={styles.activeProgramSection}>
        <p>You don&rsquo;t have an active workout program selected.</p>
        <a href="/programs" className={styles.selectProgramLink}>
          Select a Program
        </a>
      </div>
    );
  }

  // Return null if there is an active program
  return null;
}

/**
 * Renders the header section with logo and brand text
 */
function renderHeaderSection() {
  return (
    <div className={styles.brandSection}>
      <div className={styles.logoWrapper}>
        <Image
          src="/logo.png"
          alt="Meatbag Logo"
          className={styles.logo}
          width={190}
          height={110}
          priority
        />
      </div>
      <div className={styles.brandText}>MEATBAG</div>
    </div>
  );
}

/**
 * Renders the footer section with user name and program info
 */
function renderFooterSection(userName, activeProgram, numExercises) {
  return (
    <div className={styles.footerSection}>
      <div className={styles.footerTitle}>
        {`${getFirstName(userName)}'S ${activeProgram?.title || 'WORKOUT'}`}
      </div>
      <div className={styles.footerSubtitle}>{numExercises} EXERCISES</div>
    </div>
  );
}

export default async function Home() {
  // Get the session using the auth helper
  const session = await auth();

  // Redirect if not authenticated
  if (!session || !session.user) {
    redirect('/auth/signin');
  }

  const userId = session.userId;

  // Fetch the user with their active workout program
  const userWithActiveProgram = await fetchUserWithActiveProgram(userId);

  // Get the active program and find the first incomplete day
  const activeProgram = userWithActiveProgram?.activeWorkoutProgram;
  const { firstIncompleteDay, activeWorkoutGroup, numExercises, dayNumber } =
    findFirstIncompleteDay(activeProgram, userId);

  return (
    <div className={styles.container}>
      {/* Logo and Brand Text */}
      {renderHeaderSection()}

      {/* Active Program Section */}
      {renderActiveProgramSection(activeProgram)}

      {/* Buttons - Client Component */}
      <WorkoutButtons
        firstIncompleteDay={firstIncompleteDay}
        programId={activeProgram?.id}
        groupId={activeWorkoutGroup?.id}
        dayNumber={dayNumber}
      />

      {renderFooterSection(session.user?.name, activeProgram, numExercises)}
    </div>
  );
}
