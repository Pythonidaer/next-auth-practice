// src/components/ExerciseCard/ExerciseActions.jsx
'use client';
import React from 'react';
import Button from '@/components/Button/Button';
import styles from './ExerciseActions.module.css';
import { FaStopwatch } from 'react-icons/fa';
import { PiSparkleFill } from 'react-icons/pi';

export default function ExerciseActions({ exerciseId }) {
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
