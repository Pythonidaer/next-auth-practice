import React from 'react';
import { auth } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import styles from './create.module.css';
import ProgramCreationForm from '@/components/ProgramCreationForm/ProgramCreationForm';

export default async function CreateProgramPage() {
  const session = await auth();

  if (!session) {
    return redirect('/auth/signin');
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Create Workout Program</h1>
      <p className={styles.description}>
        Create your own custom workout program with groups, days, and exercises.
      </p>

      <ProgramCreationForm userId={session.user.id} />
    </div>
  );
}
