'use client'
import { signIn, signOut, useSession } from 'next-auth/react'
import React, { useState, useEffect } from "react"; // Removed duplicate useState as useClientState
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import styles from "./Navbar.module.css";

const navItems = [
  { label: "Auth Test Page", href: "/authorization-test" },
  { label: "Sign Up", href: "#" },
];

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false); // Use standard useState

  const { data: session, status } = useSession();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Helper function to render auth buttons/greeting
  const renderAuthControls = () => {
    // If not on client yet, render nothing or a minimal placeholder
    if (!isClient) {
      // You could add a placeholder div here to reserve space if needed
      // return <div style={{ minWidth: '100px', height: '30px' }}></div>;
      return null;
    }

    // While session is loading, show a loading indicator or placeholder
    if (status === "loading") {
      return (
        <li key="auth-loading">
          <div className={styles.authPlaceholder}></div> {/* Use a placeholder div */}
        </li>
      );
    }

    // If authenticated, show user greeting and logout button
    if (status === "authenticated") {
      return (
        <>
          <li className={styles.userGreeting} key="user-greeting">
            Hello, {session.user?.name || session.user?.email}
          </li>
          <li key="logout">
            <button className={styles.navButton} type="button" onClick={() => signOut({ callbackUrl: '/' })}>Log Out</button>
          </li>
        </>
      );
    }

    // If unauthenticated, show login button
    if (status === "unauthenticated") {
      return (
        <li key="login">
          <button className={styles.navButton} type="button" onClick={() => signIn()}>Log In</button>
        </li>
      );
    }

    // Fallback in case status is unexpected
    return null;
  };

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logoSection}>
        <span className={styles.logoIcon}>▲</span>
        <span className={styles.logoText}>Auth App</span>
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
        <span className={styles.hamburgerIcon}><FiMenu /></span>
      </button>

      {sidebarOpen && (
        <div className={styles.sidebarOverlay}>
          <aside className={styles.sidebar}>
            <button
              className={styles.closeButton}
              aria-label="Close menu"
              onClick={() => setSidebarOpen(false)}
            >
              <span className={styles.closeIcon}><FiX /></span>
            </button>
            <ul className={styles.sidebarNavItems}>
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} onClick={() => setSidebarOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              ))}
              {/* Also use the helper function for sidebar */}
              {renderAuthControls()}
            </ul>
          </aside>
        </div>
      )}
    </nav>
  );
}