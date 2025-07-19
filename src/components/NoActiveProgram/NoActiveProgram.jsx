'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '../Button/Button';
import styles from './NoActiveProgram.module.css';

export default function NoActiveProgram() {
  const router = useRouter();

  return (
    <div className={styles.buttonGroup}>
      <Button
        color="white"
        label="Select Program"
        onClick={() => router.push('/programs')}
      />
      <Button
        color="green"
        label="Create Program"
        onClick={() => router.push('/programs/create')}
        disabled={false} // Now enabled since we have a basic route
      />
    </div>
  );
}
