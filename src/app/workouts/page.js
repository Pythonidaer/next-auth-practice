'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from './workouts.module.css';
import { redirect } from 'next/navigation';

export default function WorkoutsPage() {
  const { data: session, status } = useSession();
  const [workoutData, setWorkoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (!session) {
      redirect('/api/auth/signin');
      return;
    }

    // Fetch workout data
    const fetchWorkoutData = async () => {
      try {
        const response = await fetch('/api/workouts');
        if (!response.ok) {
          throw new Error('Failed to fetch workout data');
        }
        const data = await response.json();
        setWorkoutData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching workout data:', err);
        setError('Failed to load workout data. Please try again later.');
        setLoading(false);
      }
    };

    fetchWorkoutData();
  }, [session, status]);

  if (status === 'loading' || loading) {
    return <div className={styles.loading}>Loading workout data...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!workoutData || !workoutData.program) {
    return (
      <div className={styles.noProgram}>
        No active workout program selected.
      </div>
    );
  }

  const { program, completedDays, totalDays } = workoutData;
  const isProgramComplete = completedDays === totalDays;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>WORKOUT</h1>

      <div className={styles.programInfo}>
        <h2 className={styles.programName}>
          {session.user.name.split(' ')[0]}&apos;s{' '}
          {program.name ? program.name.toLowerCase() : 'workout'}
        </h2>
        {isProgramComplete ? (
          <p className={styles.completionStatus}>
            Program completed! ({totalDays} days)
          </p>
        ) : (
          <p className={styles.completionStatus}>
            {completedDays} days completed!
          </p>
        )}
      </div>

      <div className={styles.workoutDays}>
        {workoutData.days.map((day) => (
          <div key={day.id} className={styles.daySection}>
            <h3 className={styles.dayHeading}>DAY {day.order}</h3>
            {day.isRestDay ? (
              <div className={styles.restDay}>REST</div>
            ) : (
              <div>
                {day.exercises &&
                  day.exercises.map((exercise, index) => (
                    <div key={exercise.id} className={styles.exercise}>
                      <div className={styles.exerciseName}>
                        {exercise.name || `Exercise ${index + 1}`}
                      </div>
                      <div className={styles.exerciseDetails}>
                        {exercise.reps
                          ? isNaN(Number(exercise.reps))
                            ? `${exercise.reps} / ${exercise.sets || 3} SETS` // If string
                            : `${exercise.reps}-${Number(exercise.reps) + 2} REPS / 
                            ${exercise.sets || 3} SETS` // If number
                          : '8-10 REPS / 3 SETS'}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
