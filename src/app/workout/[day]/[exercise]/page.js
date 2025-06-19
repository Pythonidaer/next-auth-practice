import { dummyUserWorkoutData } from '@/data/dummyUserWorkoutData';
import { ExerciseCard } from '@/components/ExerciseCard/ExerciseCard';
import { ExerciseActions } from '@/components/ExerciseCard/ExerciseActions';
import getFirstName from '@/utils/getFirstName';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
import styles from '@/app/workout/[day]/[exercise]/page.module.css';

export default async function ExercisePage({ params }) {
  const resolvedParams = await params;
  const { day, exercise } = resolvedParams;
  const dayIndex = parseInt(day, 10) - 1;
  const exerciseIndex = parseInt(exercise, 10);
  const testName = 'Jonathan Hammond';
  // const { data: session } = useSession();

  const dayData = dummyUserWorkoutData[dayIndex];
  const exerciseData = dayData?.exercises?.[exerciseIndex];
  const currentExerciseNumber = exerciseIndex + 1;

  if (!dayData || !exerciseData) {
    return <div>Exercise not found.</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.flexGrow}>
        <ExerciseCard
          exerciseName={exerciseData.name}
          repCount={exerciseData.reps}
          warmupSetCount={exerciseData.warmupSets}
          workingSetsCount={exerciseData.workoutSets}
          exerciseDetails={exerciseData.details}
        />
      </div>
      <div className={styles.stickyBottom}>
        <ExerciseActions exerciseId={exerciseData.id} />
        <div className={styles.footerSection}>
          <div className={styles.footerTitle}>
            {getFirstName(testName)}&apos;S GET SWOLE WORKOUT
          </div>
          <div className={styles.footerSubtitle}>
            {currentExerciseNumber}/{dayData.exercises.length}
          </div>
        </div>
      </div>
    </div>
  );
}
