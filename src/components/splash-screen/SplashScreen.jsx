'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './SplashScreen.module.css';
import transition from '../shared/AppTransition.module.css'; // Import your transition styles

export default function SplashScreen() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Wait for next tick to trigger transition
    const t = setTimeout(() => setLoaded(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`${styles.splashScreen} ${transition.pageWrapper} ${loaded ? transition.loaded : ''}`}
    >
      <Image
        src="/logo.png"
        alt="Meatbag Logo"
        width={140}
        height={110}
        className={styles.logo}
        priority
      />
      <div className={styles.brandText}>MEATBAG</div>
    </div>
  );
}
