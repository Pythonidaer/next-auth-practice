import React from 'react';
import { auth } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import styles from './create.module.css';

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

      {/* Placeholder for the program creation form */}
      <div className={styles.formPlaceholder}>
        <h2>Coming Soon</h2>
        <p>
          The program creation feature is currently under development. Check
          back soon to create your own custom workout programs!
        </p>
        <Link href="/programs" className={styles.backLink}>
          Back to Programs
        </Link>
      </div>
    </div>
  );
}
