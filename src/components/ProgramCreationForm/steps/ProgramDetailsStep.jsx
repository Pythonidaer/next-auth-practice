'use client';

import React, { useState } from 'react';
import styles from '../ProgramCreationForm.module.css';

export default function ProgramDetailsStep({ programDetails, updateFormData }) {
  const [title, setTitle] = useState(programDetails.title || '');
  const [description, setDescription] = useState(
    programDetails.description || '',
  );

  // Update parent form data when fields change
  const handleChange = (field, value) => {
    const updatedDetails = {
      ...programDetails,
      [field]: value,
    };

    // Update the parent form data
    updateFormData(updatedDetails);

    // Update local state
    if (field === 'title') setTitle(value);
    if (field === 'description') setDescription(value);
  };

  return (
    <div>
      <h2>Program Details</h2>
      <p>Start by providing basic information about your workout program.</p>

      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          Program Title*
        </label>
        <input
          id="title"
          type="text"
          className={styles.input}
          value={title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., 12-Week Strength Building"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Program Description
        </label>
        <textarea
          id="description"
          className={styles.textarea}
          value={description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe the goals and focus of this workout program..."
        />
      </div>
    </div>
  );
}
