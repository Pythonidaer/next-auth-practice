'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Button from '@/components/Button/Button';
import styles from './SignIn.module.css';

export default function SignInPage() {
  return (
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
      {/* Buttons */}
      <div className={styles.buttonGroup}>
        <Button color="white" label="LOGIN" onClick={() => signIn('google')} />
        <Button
          color="red"
          label="SIGNUP WITH GOOGLE"
          onClick={() => signIn('google')}
        />
        {/* <Button
          color="blue"
          label="SIGNUP WITH EMAIL"
          onClick={() => signIn('email')}
        /> */}
      </div>
    </div>
  );
}
