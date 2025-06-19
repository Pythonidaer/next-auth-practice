/**
 * @module components/ExerciseCard/ExerciseCard
 */
import React from 'react';
import styles from './ExerciseCard.module.css';

/**
 * @typedef {Object} ExerciseCardProps
 * @property {string} exerciseName - Name of the exercise
 * @property {number} repCount - Number of repetitions
 * @property {number} [warmupSetCount] - Number of warmup sets (optional)
 * @property {number} workingSetsCount - Number of working sets
 * @property {string} [exerciseDetails] - Additional details or notes (optional)
 */

/**
 * Displays information about a specific exercise, including its name, rep count,
 * warmup sets, working sets, and any additional details. Used in workout pages
 * to present a summary of each exercise in a card format.
 *
 * @function ExerciseCard
 * @memberof module:components/ExerciseCard/ExerciseCard
 * @param {ExerciseCardProps} props - Props for ExerciseCard
 * @returns {JSX.Element} The rendered exercise card
 */
export function ExerciseCard({
  exerciseName,
  repCount,
  warmupSetCount,
  workingSetsCount,
  exerciseDetails,
}) {
  return (
    <div className={styles.card}>
      <h1 className={styles.exerciseName}>{exerciseName}</h1>
      <p className={styles.repCount}>{repCount} reps</p>
      {warmupSetCount && (
        <p className={styles.warmup}>{warmupSetCount} warmup</p>
      )}
      <p className={styles.workingSets}>
        {workingSetsCount} {warmupSetCount ? 'working sets' : 'sets'}
      </p>
      {exerciseDetails && <p className={styles.details}>{exerciseDetails}</p>}
    </div>
  );
}
