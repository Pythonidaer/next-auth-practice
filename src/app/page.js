'use client';
import React from 'react';
import { useEffect } from 'react';
import Button from '../components/Button/Button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import getFirstName from '../utils/getFirstName';
import Image from 'next/image';
import styles from './page.module.css';
import { dummyUserWorkoutData } from '../data/dummyUserWorkoutData';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const firstIncompleteDay = dummyUserWorkoutData.find((day) => !day.complete);
  // Not testing for this because this is dummy data
  // The data model will likely look very different
  const numExercises = firstIncompleteDay?.exercises?.length || 0;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin');
    }
  }, [status, router]);

  // if (status === 'loading') {
  //   return <h1>Loading...</h1>;
  // }

  if (status === 'authenticated') {
    return (
      <>
        <div className={styles.container}>
          {/* Logo and Brand Text */}
          <div className={styles.brandSection}>
            <div className={styles.logoWrapper}>
              <Image
                src="/logo.png"
                alt="Meatbag Logo"
                className={styles.logo}
                width={190}
                height={110}
                priority
              />
            </div>
            <div className={styles.brandText}>MEATBAG</div>
          </div>
          <p>Welcome, {session.user?.name}!</p>
          <p>Your database ID: {session.userId}</p>
          {/* Buttons */}
          <div className={styles.buttonGroup}>
            <Button
              color="white"
              label="DASHBOARD"
              onClick={() => router.push('/dashboard')}
            />
            <Button
              color="red"
              label={`Day ${firstIncompleteDay.dayNumber}`}
              onClick={() =>
                router.push(`/workout/${firstIncompleteDay.dayNumber}/0`)
              }
            />
          </div>
          <div className={styles.footerSection}>
            <div className={styles.footerTitle}>
              {getFirstName(session?.user?.name)}&apos;S GET SWOLE WORKOUT
            </div>
            <div className={styles.footerSubtitle}>
              {numExercises} EXERCISES
            </div>
          </div>
        </div>
      </>
    );
  }
}
