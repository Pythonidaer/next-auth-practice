// src/components/ExerciseCard/ExerciseActions.jsx
'use client';
import React, { useState, useEffect } from 'react';
import Button from '@/components/Button/Button';
import styles from './ExerciseActions.module.css';
import { FaStopwatch } from 'react-icons/fa';
import { PiSparkleFill } from 'react-icons/pi';

export default function ExerciseActions({ exerciseId }) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [message, setMessage] = useState(null); // For success/completion messages
  const [dayCompleted, setDayCompleted] = useState(false); // Track if day was completed

  // Fetch the current completion status when component mounts
  useEffect(() => {
    const checkCompletionStatus = async () => {
      setIsInitialLoading(true);
      try {
        console.log(`Checking completion for exercise ID: ${exerciseId}`);
        const response = await fetch(`/api/exercises/${exerciseId}/completion`);
        if (response.ok) {
          const data = await response.json();
          console.log('Completion status response:', data);
          setIsCompleted(data.isCompleted);
        } else {
          console.error(
            'Error response from completion check:',
            await response.text(),
          );
        }
      } catch (err) {
        console.error('Error checking completion status:', err);
        // Don't set error state here to avoid showing error on initial load
      } finally {
        setIsInitialLoading(false);
      }
    };

    if (exerciseId) {
      checkCompletionStatus();
    }
  }, [exerciseId]);

  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleComplete = async () => {
    if (isLoading || isCompleted) return;

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`/api/exercises/${exerciseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete exercise');
      }

      const data = await response.json();

      // Check if this completion triggered a day completion
      // The API doesn't directly tell us, but we can check the response for clues
      // or make another API call to check day status

      // For now, we'll use a simple approach - check if all exercises for this day are completed
      const dayStatusResponse = await fetch(
        `/api/exercises/${exerciseId}/day-status`,
      );
      if (dayStatusResponse.ok) {
        const dayStatus = await dayStatusResponse.json();
        if (dayStatus.isCompleted) {
          setDayCompleted(true);
          setMessage({
            type: 'success',
            text: '🎉 Workout Day Completed! 🎉',
          });
        }
      }

      // Update local state to reflect completion
      setIsCompleted(true);
    } catch (err) {
      console.error('Error completing exercise:', err);
      setError(err.message || 'Failed to complete exercise');
    } finally {
      setIsLoading(false);
    }
  };

  // Future extensibility: Add functions for timer, recording weights, etc.
  // Future extensibility: Add function to undo completion

  return (
    <div className={styles.buttonGroup}>
      {/* Success/error messages */}
      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      {/* Action buttons */}
      <Button
        color={isCompleted ? 'green' : 'red'}
        label={isCompleted ? 'Completed' : 'Complete'}
        onClick={handleComplete}
        disabled={isLoading || isCompleted}
        isLoading={isInitialLoading}
      />
    </div>
  );
}
