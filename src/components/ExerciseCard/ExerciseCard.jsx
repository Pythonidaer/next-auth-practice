import React from 'react';
import styles from './ExerciseCard.module.css';

export default function ExerciseCard({
  exerciseName,
  repCount,
  warmupSetCount,
  workingSetsCount,
  exerciseDetails,
}) {
  // Log the values to see what's happening
  console.log('ExerciseCard props:', {
    exerciseName,
    repCount,
    warmupSetCount,
    workingSetsCount,
    exerciseDetails,
    types: {
      warmupSetCount: typeof warmupSetCount,
      workingSetsCount: typeof workingSetsCount,
    },
  });

  // Only show sets if greater than 0
  const showWarmupSets = warmupSetCount && warmupSetCount > 0;
  const showWorkingSets = workingSetsCount && workingSetsCount > 0;

  // Use singular 'set' when there's only 1 set
  const workingSetsText =
    workingSetsCount === 1 ? 'working set' : 'working sets';
  const warmupSetsText = warmupSetCount === 1 ? 'warm up' : 'warm ups';

  // Check if there's any direct text rendering of the values
  const directTextCheck = `${warmupSetCount}${workingSetsCount}`;
  console.log('Direct text check:', directTextCheck);

  // Create an array of elements to render
  const elements = [
    <h1 key="name" className={styles.exerciseName}>
      {exerciseName}
    </h1>,
  ];

  if (repCount) {
    elements.push(
      <p key="reps" className={styles.repCount}>
        {repCount} reps
      </p>,
    );
  }

  if (showWarmupSets) {
    elements.push(
      <p key="warmup" className={styles.warmup}>
        {warmupSetCount} {warmupSetsText}
      </p>,
    );
  }

  if (showWorkingSets) {
    elements.push(
      <p key="working" className={styles.workingSets}>
        {workingSetsCount} {workingSetsText}
      </p>,
    );
  }

  if (exerciseDetails) {
    elements.push(
      <p key="details" className={styles.details}>
        {exerciseDetails}
      </p>,
    );
  }

  return <div className={styles.card}>{elements}</div>;
}
