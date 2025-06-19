/**
 * @module components/ClientLayout
 */
'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import SplashScreen from './splash-screen/SplashScreen';
import styles from '@/components/shared/AppTransition.module.css';

/**
 * Custom React hook that determines if the component has hydrated on the client side.
 * Sets `hydrated` to true after the first client-side render, allowing conditional rendering
 * based on hydration status (e.g., to avoid mismatches between server and client rendering).
 *
 * @memberof module:components/ClientLayout
 * @returns {boolean} True if the component has hydrated on the client, false otherwise.
 */
function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}

/**
 * @function ClientLayout
 * @component
 * @memberof module:components/ClientLayout
 * @description
 *   A React layout component that waits until client-side hydration is complete
 *   before rendering children. Displays a splash screen on first load for 3 seconds,
 *   and avoids flickering or mismatches during SSR hydration. Uses sessionStorage
 *   to remember if the splash screen has already been shown in the current session.
 *
 * @param {{ children: React.ReactNode }} props - The component's children to render
 *   after hydration.
 * @returns {JSX.Element} The wrapped layout with splash screen and content.
 *
 * @example
 *   <ClientLayout>
 *     <Dashboard />
 *   </ClientLayout>
 *
 * @remarks
 *   Avoids hydration mismatch issues in Next.js SSR by gating rendering behind a
 *   hydration flag. Splash screen duration is set to 3 seconds and is controlled
 *   via sessionStorage per session.
 *
 * @note This component must only be used in client-side context. Declared with
 *   'use client' at the top.
 */
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
