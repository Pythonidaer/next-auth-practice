'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import SplashScreen from './splash-screen/SplashScreen';
import styles from '@/components/shared/AppTransition.module.css';

// TO DO: Determine if this should be in a hooks/ folder
function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}

export default function ClientLayout({ children }) {
  const hydrated = useHydrated();
  const [showSplash, setShowSplash] = useState(true);
  const splashDuration = 3000;

  useEffect(() => {
    if (!hydrated) return;
    const splashAlreadyShown = window.sessionStorage.getItem('splashShown');
    const timer = setTimeout(() => {
      setShowSplash(false);
      if (!splashAlreadyShown) {
        window.sessionStorage.setItem('splashShown', 'true');
      }
    }, splashDuration);
    return () => clearTimeout(timer);
  }, [hydrated, splashDuration]); // Add splashDuration to dependency array

  if (!hydrated) {
    return (
      <div className={styles.splashWrapper}>
        <SplashScreen />
      </div>
    );
  }

  return (
    <>
      <div
        data-testid="splash-container"
        className={`${styles.splashWrapper} ${!showSplash ? styles.splashHidden : ''}`}
      >
        <SplashScreen />
      </div>
      <div
        data-testid="children-container"
        className={`${styles.pageWrapper} ${!showSplash ? styles.loaded : ''}`}
      >
        {children}
      </div>
    </>
  );
}
