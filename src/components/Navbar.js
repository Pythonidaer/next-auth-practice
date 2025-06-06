'use client'
import React, { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import styles from "./Navbar.module.css";

const navItems = [
  { label: "Sign Up", href: "#" },
  { label: "Create User", href: "#" },
  { label: "Log Out", href: "#" },
  { label: "Log In", href: "#" },
  { label: "Auth Test", href: "#" },
  { label: "Authorization Test", href: "#" },
];

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logoSection}>
        {/* Placeholder logo icon */}
        <span className={styles.logoIcon}>▲</span>
        <span className={styles.logoText}>Auth App</span>
      </Link>
      <ul className={styles.navItems}>
        {navItems.map((item) => (
          <li key={item.label}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
      <button
        className={styles.hamburger}
        aria-label="Open menu"
        onClick={() => setSidebarOpen(true)}
      >
        {/* Placeholder for hamburger icon */}
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
              {/* Placeholder for close icon */}
              <span className={styles.closeIcon}><FiX /></span>
            </button>
            <ul className={styles.sidebarNavItems}>
              {navItems.map((item) => (
                <li key={item.label}>
                  <a href={item.href} onClick={() => setSidebarOpen(false)}>{item.label}</a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </nav>
  );
}
