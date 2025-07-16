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

  // Fetch the current completion status when component mounts
  useEffect(() => {
    const checkCompletionStatus = async () => {
      try {
        const response = await fetch(`/api/exercises/${exerciseId}/completion`);
        if (response.ok) {
          const data = await response.json();
          setIsCompleted(data.isCompleted);
        }
      } catch (err) {
        console.error('Error checking completion status:', err);
        // Don't set error state here to avoid showing error on initial load
      }
    };

    if (exerciseId) {
      checkCompletionStatus();
    }
  }, [exerciseId]);

  const handleComplete = async () => {
    if (isLoading || isCompleted) return;

    setIsLoading(true);
    setError(null);

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
      {/* <Button
        color="blue"
        label="START SET TIMER"
        icon={<FaStopwatch />}
        onClick={() => {}}
      />
      <Button
        color="blue"
        label="record weights"
        icon={<PiSparkleFill />}
        onClick={() => {}}
      /> */}
      {error && <div className={styles.error}>{error}</div>}
      <Button
        color={isCompleted ? 'green' : 'red'}
        label={isCompleted ? 'Completed' : 'Complete'}
        onClick={handleComplete}
        disabled={isLoading || isCompleted}
      />
    </div>
  );
}
