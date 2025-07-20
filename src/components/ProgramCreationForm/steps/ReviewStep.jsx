'use client';

import React from 'react';
import styles from '../ProgramCreationForm.module.css';

export default function ReviewStep({ formData }) {
  const { programDetails, workoutGroups } = formData;

  const countExercises = () => {
    let total = 0;
    workoutGroups.forEach((group) => {
      group.days.forEach((day) => {
        if (!day.isRestDay && day.exercises) {
          total += day.exercises.length;
        }
      });
    });
    return total;
  };

  const countWorkoutDays = () => {
    let total = 0;
    workoutGroups.forEach((group) => {
      group.days.forEach((day) => {
        if (!day.isRestDay) {
          total += 1;
        }
      });
    });
    return total;
  };

  const countRestDays = () => {
    let total = 0;
    workoutGroups.forEach((group) => {
      group.days.forEach((day) => {
        if (day.isRestDay) {
          total += 1;
        }
      });
    });
    return total;
  };

  return (
    <div>
      <h2>Review Your Program</h2>
      <p>Review the details of your workout program before creating it.</p>

      <div className={styles.card}>
        <h3>Program Details</h3>
        <div>
          <strong>Title:</strong> {programDetails.title || 'Untitled Program'}
        </div>
        {programDetails.description && (
          <div style={{ marginTop: '0.5rem' }}>
            <strong>Description:</strong> {programDetails.description}
          </div>
        )}
      </div>

      <div className={styles.card}>
        <h3>Program Structure</h3>
        <div>
          <strong>Groups:</strong> {workoutGroups.length}
        </div>
        <div>
          <strong>Workout Days:</strong> {countWorkoutDays()}
        </div>
        <div>
          <strong>Rest Days:</strong> {countRestDays()}
        </div>
        <div>
          <strong>Total Exercises:</strong> {countExercises()}
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h3>Detailed Structure</h3>

        {workoutGroups.map((group) => (
          <div key={group.id} className={styles.card}>
            <h4>{group.title || `Week ${group.order}`}</h4>

            {group.days.length === 0 ? (
              <p>No days added to this group.</p>
            ) : (
              <div>
                {group.days.map((day) => (
                  <div
                    key={day.id}
                    className={styles.card}
                    style={{ marginLeft: '1rem', marginTop: '0.5rem' }}
                  >
                    <h5>
                      {day.title ||
                        (day.isRestDay ? 'Rest Day' : `Day ${day.order}`)}
                      {day.isRestDay && ' (Rest)'}
                    </h5>

                    {!day.isRestDay && (
                      <>
                        {!day.exercises || day.exercises.length === 0 ? (
                          <p>No exercises added to this day.</p>
                        ) : (
                          <ul style={{ paddingLeft: '1.5rem' }}>
                            {day.exercises.map((exercise) => (
                              <li key={exercise.id}>
                                <strong>{exercise.name}</strong>
                                {(exercise.targetWarmupSets > 0 ||
                                  exercise.targetWorkingSets > 0 ||
                                  exercise.targetReps) && (
                                  <span>
                                    {' - '}
                                    {exercise.targetWarmupSets > 0 &&
                                      `${exercise.targetWarmupSets} warmup sets`}
                                    {exercise.targetWarmupSets > 0 &&
                                      exercise.targetWorkingSets > 0 &&
                                      ' + '}
                                    {exercise.targetWorkingSets > 0 &&
                                      `${exercise.targetWorkingSets} working sets`}
                                    {(exercise.targetWarmupSets > 0 ||
                                      exercise.targetWorkingSets > 0) &&
                                      exercise.targetReps &&
                                      ' × '}
                                    {exercise.targetReps &&
                                      `${exercise.targetReps} reps`}
                                  </span>
                                )}
                                {exercise.notes && (
                                  <div
                                    style={{
                                      fontStyle: 'italic',
                                      fontSize: '0.9rem',
                                    }}
                                  >
                                    {exercise.notes}
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
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
