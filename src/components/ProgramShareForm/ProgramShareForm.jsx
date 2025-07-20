'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './ProgramShareForm.module.css';

export default function ProgramShareForm({ programs, users, currentUserId }) {
  const router = useRouter();
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [setAsActive, setSetAsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProgram || !selectedUser) {
      setMessage({
        type: 'error',
        text: 'Please select both a program and a user.',
      });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/programs/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          programId: selectedProgram,
          recipientId: selectedUser,
          setAsActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to share program');
      }

      setMessage({
        type: 'success',
        text: `Program successfully shared with ${users.find((u) => u.id === selectedUser)?.name || 'user'}.`,
      });

      // Reset form
      setSelectedProgram('');
      setSelectedUser('');
      setSetAsActive(true);

      // Refresh the page data
      router.refresh();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="program" className={styles.label}>
            Select Program to Share:
          </label>
          <select
            id="program"
            className={styles.select}
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">-- Select a Program --</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.title} ({program.workoutGroups.length} groups)
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="user" className={styles.label}>
            Select User to Share With:
          </label>
          <select
            id="user"
            className={styles.select}
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">-- Select a User --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={setAsActive}
              onChange={(e) => setSetAsActive(e.target.checked)}
              disabled={isSubmitting}
            />
            Set as user's active program
          </label>
        </div>

        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <div className={styles.buttonGroup}>
          <Link href="/programs" className={styles.cancelButton}>
            Cancel
          </Link>
          <button
            type="submit"
            className={styles.shareButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sharing...' : 'Share Program'}
          </button>
        </div>
      </form>
    </div>
  );
}
