import React from 'react';
import styles from './programs.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <h1>Select a Workout Program</h1>
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading workout programs...</p>
      </div>
    </div>
  );
}
