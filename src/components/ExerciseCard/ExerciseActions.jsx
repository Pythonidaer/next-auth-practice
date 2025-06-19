/**
 * @module components/ExerciseCard/ExerciseActions
 */
// src/components/ExerciseCard/ExerciseActions.jsx
'use client';
import React from 'react';
import { Button } from '@/components/shared/Button/Button';
import styles from './ExerciseActions.module.css';
import { FaStopwatch } from 'react-icons/fa';
import { PiSparkleFill } from 'react-icons/pi';

/**
 * @typedef {Object} ExerciseActionsProps
 * @property {string|number} exerciseId - Unique identifier for the exercise
 */

/**
 * Renders action buttons for an exercise card, such as starting a set timer,
 * recording weights, or marking completion. Each button can be hooked up to
 * handlers for timers, data entry, or completion logic as needed.
 *
 * @function ExerciseActions
 * @memberof module:components/ExerciseCard/ExerciseActions
 * @param {ExerciseActionsProps} props - Props for ExerciseActions
 * @returns {JSX.Element} The rendered exercise action buttons
 */
export function ExerciseActions({ exerciseId }) {
  // Handle timers, recording weights, completion, etc.
  return (
    <div className={styles.buttonGroup}>
      <Button
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
      />
      <Button color="red" label="Complete" onClick={() => {}} />
    </div>
  );
}
