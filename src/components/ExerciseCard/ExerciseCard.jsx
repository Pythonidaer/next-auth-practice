import styles from './ExerciseCard.module.css';

export default function ExerciseCard({
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
