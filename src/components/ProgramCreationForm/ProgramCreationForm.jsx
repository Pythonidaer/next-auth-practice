'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEdit, FaTrash, FaGripLines, FaPlus } from 'react-icons/fa';
import styles from './ProgramCreationForm.module.css';

// Step components
import ProgramDetailsStep from './steps/ProgramDetailsStep';
import WorkoutGroupsStep from './steps/WorkoutGroupsStep';
import WorkoutDaysStep from './steps/WorkoutDaysStep';
import ExercisesStep from './steps/ExercisesStep';
import ReviewStep from './steps/ReviewStep';

export default function ProgramCreationForm({ userId }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form state
  const [formData, setFormData] = useState({
    programDetails: {
      title: '',
      description: '',
    },
    workoutGroups: [
      {
        id: 'temp-group-1',
        title: 'Week 1',
        order: 1,
        days: [],
      },
    ],
  });

  const steps = [
    { number: 1, label: 'Program Details' },
    { number: 2, label: 'Workout Groups' },
    { number: 3, label: 'Workout Days' },
    { number: 4, label: 'Exercises' },
    { number: 5, label: 'Review' },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (section, data) => {
    setFormData({
      ...formData,
      [section]: data,
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    // Validate that non-rest days have at least one exercise
    const emptyWorkoutDays = [];
    formData.workoutGroups.forEach((group, groupIndex) => {
      group.days.forEach((day, dayIndex) => {
        if (!day.isRestDay && (!day.exercises || day.exercises.length === 0)) {
          emptyWorkoutDays.push({
            group: group.title,
            day: `Day ${day.order}`,
          });
        }
      });
    });

    if (emptyWorkoutDays.length > 0) {
      setMessage({
        type: 'error',
        text: `Please add at least one exercise to the following non-rest days: ${emptyWorkoutDays
          .map((d) => `${d.group} ${d.day}`)
          .join(', ')}`,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          createdByUserId: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create program');
      }

      setMessage({
        type: 'success',
        text: 'Program created successfully!',
      });

      // Redirect to programs page after a short delay
      setTimeout(() => {
        router.push('/programs');
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className={styles.stepIndicator}>
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {index > 0 && (
              <div
                className={`${styles.stepLine} ${
                  currentStep > index ? styles.stepLineCompleted : ''
                } ${currentStep === index + 1 ? styles.stepLineActive : ''}`}
              />
            )}
            <div
              className={`${styles.step} ${
                currentStep === step.number ? styles.stepActive : ''
              } ${currentStep > step.number ? styles.stepCompleted : ''}`}
            >
              {step.number}
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProgramDetailsStep
            programDetails={formData.programDetails}
            updateFormData={(data) => updateFormData('programDetails', data)}
          />
        );
      case 2:
        return (
          <WorkoutGroupsStep
            workoutGroups={formData.workoutGroups}
            updateFormData={(data) => updateFormData('workoutGroups', data)}
          />
        );
      case 3:
        return (
          <WorkoutDaysStep
            workoutGroups={formData.workoutGroups}
            updateFormData={(data) => updateFormData('workoutGroups', data)}
          />
        );
      case 4:
        return (
          <ExercisesStep
            workoutGroups={formData.workoutGroups}
            updateFormData={(data) => updateFormData('workoutGroups', data)}
          />
        );
      case 5:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.formContainer}>
      {renderStepIndicator()}

      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      {renderCurrentStep()}

      <div className={styles.buttonGroup}>
        {currentStep > 1 ? (
          <button
            type="button"
            className={`${styles.button} ${styles.secondaryButton}`}
            onClick={handleBack}
            disabled={isSubmitting}
          >
            Back
          </button>
        ) : (
          <Link
            href="/programs"
            className={`${styles.button} ${styles.cancelButton}`}
          >
            Cancel
          </Link>
        )}

        {currentStep < steps.length ? (
          <button
            type="button"
            className={`${styles.button} ${styles.primaryButton}`}
            onClick={handleNext}
            disabled={isSubmitting}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            className={`${styles.button} ${styles.primaryButton}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Program'}
          </button>
        )}
      </div>
    </div>
  );
}
