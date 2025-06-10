'use client';
import { useEffect, useState } from 'react';
import SplashScreen from './splash-screen/SplashScreen';
import styles from '@/components/shared/AppTransition.module.css';

export default function ClientLayout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only show splash if not previously shown in this session
    // Sessions only last for the duration of the page load
    const splashShown = window.sessionStorage.getItem('splashShown');
    if (splashShown) {
      setLoading(false);
      return;
    }
    const timer = setTimeout(() => {
      setLoading(false);
      window.sessionStorage.setItem('splashShown', 'true');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <SplashScreen />}
      <div className={`${styles.pageWrapper} ${!loading ? styles.loaded : ''}`}>
        {children}
      </div>{' '}
    </>
  );
}
