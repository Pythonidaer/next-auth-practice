import { redirect } from 'next/navigation';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/utils/prisma';
import ExerciseCard from '@/components/ExerciseCard/ExerciseCard';
import ExerciseActions from '@/components/ExerciseCard/ExerciseActions';
import ExerciseNavigation from '@/components/ExerciseNavigation/ExerciseNavigation';
import getFirstName from '@/utils/getFirstName';
import styles from '@/app/workout/[day]/[exercise]/page.module.css';

/**
 * Fetches workout day data with exercises for a specific day
 */
async function fetchWorkoutDayData(userId, groupId, dayNumber) {
  if (!userId || !groupId) {
    console.error('Missing required parameters in fetchWorkoutDayData', {
      userId,
      groupId,
    });
    return null;
  }

  try {
    const workoutDay = await prisma.workoutDay.findFirst({
      where: {
        group: {
          id: groupId,
        },
        order: parseInt(dayNumber, 10),
      },
      include: {
        exercises: {
          orderBy: {
            order: 'asc',
          },
        },
        group: {
          include: {
            program: true,
          },
        },
      },
    });

    return workoutDay;
  } catch (error) {
    console.error('Error fetching workout day data:', error);
    return null;
  }
}

/**
 * Fetches user with active workout program
 */
async function fetchUserWithActiveProgram(userId) {
  if (!userId) {
    console.error('User ID is undefined in fetchUserWithActiveProgram');
    return null;
  }

  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      activeWorkoutProgram: {
        include: {
          workoutGroups: true,
        },
      },
    },
  });
}

/**
 * Renders the exercise card component
 */
function renderExerciseCard(exerciseData) {
  return (
    <ExerciseCard
      exerciseName={exerciseData.name}
      repCount={exerciseData.targetReps}
      warmupSetCount={exerciseData.targetWarmupSets}
      workingSetsCount={exerciseData.targetWorkingSets}
      exerciseDetails={exerciseData.notes}
    />
  );
}

/**
 * Renders the footer section
 */
function renderFooterSection(
  userName,
  programTitle,
  currentNumber,
  totalExercises,
) {
  return (
    <div className={styles.footerSection}>
      <div className={styles.footerTitle}>
        {`${getFirstName(userName)}'S ${programTitle || 'WORKOUT'}`}
      </div>
      <div className={styles.footerSubtitle}>
        {currentNumber}/{totalExercises}
      </div>
    </div>
  );
}

export default async function ExercisePage({ params }) {
  // Get the session using the auth helper
  const session = await auth();

  // Redirect if not authenticated
  if (!session || !session.user) {
    redirect('/auth/signin');
  }

  // Ensure we have a user ID
  if (!session.user.id) {
    console.error('User ID is missing from session');
    return <div>Authentication error. Please try signing in again.</div>;
  }

  const { day, exercise: exerciseParam } = params;
  const exerciseIndex = parseInt(exerciseParam, 10);

  // Fetch user with active program
  const user = await fetchUserWithActiveProgram(session.user.id);

  if (!user) {
    return <div>User not found. Please try signing in again.</div>;
  }

  // Get the active group ID from the user's active program
  const activeGroupId = user?.activeWorkoutProgram?.workoutGroups?.[0]?.id;
  if (!activeGroupId) {
    return <div>No active workout program found.</div>;
  }

  // Fetch workout day data
  const workoutDay = await fetchWorkoutDayData(
    session.user.id,
    activeGroupId,
    day,
  );

  if (!workoutDay || !workoutDay.exercises?.length) {
    return <div>Workout day or exercises not found.</div>;
  }

  // Get the current exercise
  const exerciseData = workoutDay.exercises[exerciseIndex];
  if (!exerciseData) {
    return <div>Exercise not found.</div>;
  }

  const currentExerciseNumber = exerciseIndex + 1;
  const programTitle = workoutDay.group.program.title;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.flexGrow}>{renderExerciseCard(exerciseData)}</div>
      <div className={styles.stickyBottom}>
        {/* Add the ExerciseNavigation component for swipe/carousel functionality */}
        <ExerciseNavigation
          dayNumber={day}
          currentExerciseIndex={exerciseIndex}
          totalExercises={workoutDay.exercises.length}
        />
        <ExerciseActions exerciseId={exerciseData.id} />
        {renderFooterSection(
          session.user.name,
          programTitle,
          currentExerciseNumber,
          workoutDay.exercises.length,
        )}
      </div>
    </div>
  );
}
