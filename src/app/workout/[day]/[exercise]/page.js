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

/**
 * Validates the user session and returns user data or an error component
 */
async function validateUserSession(userId) {
  // Fetch user with active program
  const user = await fetchUserWithActiveProgram(userId);

  if (!user) {
    return {
      error: <div>User not found. Please try signing in again.</div>,
      user: null,
    };
  }

  if (!user.activeWorkoutProgram) {
    return {
      error: <div>No active workout program found.</div>,
      user: null,
    };
  }

  return { user, error: null };
}

/**
 * Resolves the workout day information based on the day parameter
 */
async function resolveWorkoutDay(day, user) {
  // Check if the day parameter is a UUID (day ID) or a number (global day number)
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(day);

  let activeGroupId;
  let relativeDayInWeek;

  if (isUuid) {
    // If it's a UUID, fetch the workout day directly by ID
    const dayData = await prisma.workoutDay.findUnique({
      where: { id: day },
      include: {
        group: true,
      },
    });

    if (!dayData) {
      return {
        error: <div>Workout day not found.</div>,
        dayInfo: null,
      };
    }

    activeGroupId = dayData.groupId;
    relativeDayInWeek = dayData.order;
  } else {
    // If it's a number, use the original logic
    const dayNumber = parseInt(day, 10);
    const weekIndex = Math.floor((dayNumber - 1) / 7);

    // Get the correct group ID based on the week index
    activeGroupId = user.activeWorkoutProgram.workoutGroups[weekIndex]?.id;
    if (!activeGroupId) {
      return {
        error: <div>Workout week not found for day {day}.</div>,
        dayInfo: null,
      };
    }

    // Calculate the relative day within the week (1-7)
    relativeDayInWeek = ((dayNumber - 1) % 7) + 1;
  }

  return {
    dayInfo: { activeGroupId, relativeDayInWeek, isUuid },
    error: null,
  };
}

/**
 * Fetches exercise data for the given workout day and exercise index
 */
async function getExerciseData(userId, dayInfo, exerciseIndex) {
  // Fetch workout day data
  const workoutDay = await fetchWorkoutDayData(
    userId,
    dayInfo.activeGroupId,
    dayInfo.relativeDayInWeek,
  );

  if (!workoutDay || !workoutDay.exercises?.length) {
    return {
      error: <div>Workout day or exercises not found.</div>,
      exerciseData: null,
      workoutDay: null,
    };
  }

  // Get the current exercise
  const exerciseData = workoutDay.exercises[exerciseIndex];
  if (!exerciseData) {
    return {
      error: <div>Exercise not found.</div>,
      exerciseData: null,
      workoutDay,
    };
  }

  return { exerciseData, workoutDay, error: null };
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

  // Properly await params
  const { day, exercise: exerciseParam } = await Promise.resolve(params);
  const exerciseIndex = parseInt(exerciseParam, 10);

  // Validate user session
  const { user, error: userError } = await validateUserSession(session.user.id);
  if (userError) {
    return userError;
  }

  // Resolve workout day information
  const { dayInfo, error: dayError } = await resolveWorkoutDay(day, user);
  if (dayError) {
    return dayError;
  }

  // Get exercise data
  const {
    exerciseData,
    workoutDay,
    error: exerciseError,
  } = await getExerciseData(session.user.id, dayInfo, exerciseIndex);
  if (exerciseError) {
    return exerciseError;
  }

  // Debug logging
  console.warn('DEBUG - Exercise data:', {
    dayParam: day,
    exerciseParam: exerciseParam,
    isUuid: dayInfo.isUuid,
    relativeDayInWeek: dayInfo.relativeDayInWeek,
    exerciseId: exerciseData.id,
    exerciseName: exerciseData.name,
    workoutDayId: workoutDay.id,
  });

  const currentExerciseNumber = exerciseIndex + 1;
  const programTitle = workoutDay.group.program.title;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.flexGrow}>
        {/* Wrap in fragment to prevent stray text nodes */}
        <>{renderExerciseCard(exerciseData)}</>
      </div>
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
