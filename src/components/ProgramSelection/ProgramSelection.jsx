'use client';

import React, { useState } from 'react';
import styles from './ProgramSelection.module.css';

export default function ProgramSelection({
  programs,
  activeWorkoutProgramId,
  userId,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState(
    activeWorkoutProgramId,
  );
  const [message, setMessage] = useState(null);

  const handleSelectProgram = async (programId) => {
    if (programId === selectedProgramId) {
      return; // Already selected
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/users/me/active-program', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ programId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update active program');
      }

      setSelectedProgramId(programId);
      setMessage({
        type: 'success',
        text: 'Workout program updated successfully!',
      });
    } catch (error) {
      console.error('Error updating active program:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update workout program. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.programSelection}>
      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.programGrid}>
        {programs.map((program) => (
          <div
            key={program.id}
            className={`${styles.programCard} ${program.id === selectedProgramId ? styles.activeProgram : ''}`}
          >
            <h2>{program.title}</h2>
            <p>{program.description}</p>
            <button
              className={styles.selectButton}
              onClick={() => handleSelectProgram(program.id)}
              disabled={isLoading || program.id === selectedProgramId}
            >
              {program.id === selectedProgramId
                ? 'Active Program'
                : 'Select Program'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
