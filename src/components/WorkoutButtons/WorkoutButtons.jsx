'use client';

import React, { useState } from 'react';
import Button from '../Button/Button';
import { useRouter } from 'next/navigation';
import styles from './WorkoutButtons.module.css';

export default function WorkoutButtons({
  firstIncompleteDay,
  programId,
  groupId,
  dayNumber,
  isRestDay,
  isProgramComplete,
  activeWorkoutGroup,
}) {
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Function to handle rest day completion
  const handleRestDayComplete = async () => {
    if (!firstIncompleteDay || !programId || !groupId) return;

    setIsCompleting(true);
    try {
      const response = await fetch(
        `/api/workout-days/${firstIncompleteDay.id}/complete`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            programId,
            groupId,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();

        // Check if a group was completed
        if (data.isNewGroupComplete) {
          setMessage('Week completed! Starting new week! 🎉');
        } else {
          setMessage('Rest day completed! 🎉');
        }

        setMessageType('success');

        // Refresh the page after a short delay to show the next day
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to complete rest day');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error completing rest day:', error);
      setMessage('Error completing rest day');
      setMessageType('error');
    } finally {
      setIsCompleting(false);
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    }
  };

  return (
    <div className={styles.buttonGroup}>
      <Button
        color="white"
        label="Workouts"
        onClick={() => router.push('/workouts')}
      />

      {isProgramComplete ? (
        <div className={`${styles.message} ${styles.success}`}>
          <h3>Workout Program Completed! 🎉</h3>
          <p>Congratulations on completing your workout program!</p>
        </div>
      ) : (
        firstIncompleteDay && (
          <>
            {isRestDay ? (
              <Button
                color="green"
                label="Rest Day (Mark to Complete)"
                onClick={handleRestDayComplete}
                disabled={isCompleting}
              />
            ) : (
              <Button
                color="red"
                label={`Day ${dayNumber || firstIncompleteDay.dayNumber}`}
                onClick={() => {
                  // Use the correct route structure for the exercise page
                  // The route should be /workout/[day]/[exercise]
                  const dayNum = dayNumber || firstIncompleteDay.dayNumber;

                  // Use the actual day ID from the firstIncompleteDay object
                  // This ensures we're navigating to the correct day in the database
                  const dayId = firstIncompleteDay?.id;

                  // If we have a day ID, use that for navigation
                  // Otherwise, fall back to the day number
                  if (dayId) {
                    console.warn('Navigating to workout day by ID:', dayId);
                    router.push(`/workout/${dayId}/0`);
                    return;
                  }

                  // Fallback to using the day number directly if no day ID is available
                  console.warn(
                    'No day ID available, using day number:',
                    dayNum,
                  );

                  router.push(`/workout/${dayNum}/0`);
                }}
              />
            )}
          </>
        )
      )}

      {/* Message display */}
      {message && (
        <div className={`${styles.message} ${styles[messageType]}`}>
          {message}
        </div>
      )}
    </div>
  );
}
