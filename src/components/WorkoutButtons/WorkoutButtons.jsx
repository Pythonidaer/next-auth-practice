'use client';

import React from 'react';
import Button from '../Button/Button';
import { useRouter } from 'next/navigation';
import styles from './WorkoutButtons.module.css';

export default function WorkoutButtons({
  firstIncompleteDay,
  programId,
  groupId,
  dayNumber,
}) {
  const router = useRouter();

  // TODO: This component needs further refactoring to better handle the workout navigation
  // based on the real data structure from the database. The current implementation
  // is a transitional solution that works with both dummy data and real data.
  return (
    <div className={styles.buttonGroup}>
      <Button
        color="white"
        label="Workouts"
        onClick={() => router.push('/dashboard')}
      />
      {firstIncompleteDay && (
        <Button
          color="red"
          label={`Day ${dayNumber || firstIncompleteDay.dayNumber}`}
          onClick={() => {
            // Use the correct route structure for the exercise page
            // The route should be /workout/[day]/[exercise]
            const dayNum = dayNumber || firstIncompleteDay.dayNumber;
            router.push(`/workout/${dayNum}/0`);
          }}
        />
      )}
    </div>
  );
}
