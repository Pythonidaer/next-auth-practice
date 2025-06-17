// src/components/Navbar/Navbar.jsx
'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import React, { useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import styles from './Navbar.module.css';
import Image from 'next/image';

// Import navItems from its dedicated file
import navItems from './navItems'; // <--- This line is the key change!

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // can also destructure and alias data: session if needed below:
  const { status } = useSession();

  // Helper function to render auth buttons/greeting
  const renderAuthControls = () => {
    // While session is loading, show a loading indicator or placeholder
    if (status === 'loading') {
      return (
        <li key="auth-loading">
          <div className={styles.authPlaceholder}>
            <FaSpinner className={styles.spinner} />
          </div>
        </li>
      );
    }

    // If authenticated, show user greeting and logout button
    if (status === 'authenticated') {
      return (
        <li key="logout">
          <button
            className={styles.navButton}
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            Log Out
          </button>
        </li>
      );
    }

    // If unauthenticated, show login button
    if (status === 'unauthenticated') {
      return (
        <li key="login">
          <button
            className={styles.navButton}
            type="button"
            onClick={() => signIn()}
          >
            Log In
          </button>
        </li>
      );
    }

    // Fallback in case status is unexpected
    return null;
  };

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logoSection}>
        <Image
          src="/logo.png"
          alt="Meatbag Logo"
          width={62}
          height={51}
          className={styles.logoIcon}
        />
        <span className={styles.logoText}>Meatbag</span>
      </Link>

      <ul className={styles.navItems}>
        {navItems.map((item) => (
          <li key={item.label}>
            <Link href={item.href} onClick={() => setSidebarOpen(false)}>
              {item.label}
            </Link>
          </li>
        ))}
        {renderAuthControls()} {/* Call the helper function here */}
      </ul>

      <button
        className={styles.hamburger}
        aria-label="Open menu"
        onClick={() => setSidebarOpen(true)}
      >
        <span className={styles.hamburgerIcon}>
          <FiMenu />
        </span>
      </button>

      {sidebarOpen && (
        <div className={styles.sidebarOverlay}>
          <aside className={styles.sidebar}>
            <button
              className={styles.closeButton}
              aria-label="Close menu"
              onClick={() => setSidebarOpen(false)}
            >
              <span className={styles.closeIcon}>
                <FiX />
              </span>
            </button>
            <ul className={styles.sidebarNavItems}>
              {navItems.map(
                (
                  item, // Now using the imported navItems
                ) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
              {renderAuthControls()}
            </ul>
          </aside>
        </div>
      )}
    </nav>
  );
}
