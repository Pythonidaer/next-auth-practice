'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from './ExerciseNavigation.module.css';

/**
 * Component for navigating between exercises with swipe/carousel functionality
 */
export default function ExerciseNavigation({
  dayNumber,
  currentExerciseIndex,
  totalExercises,
}) {
  const router = useRouter();

  // Navigate to the previous exercise
  const goToPrevious = () => {
    if (currentExerciseIndex > 0) {
      router.push(`/workout/${dayNumber}/${currentExerciseIndex - 1}`);
    }
  };

  // Navigate to the next exercise
  const goToNext = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      router.push(`/workout/${dayNumber}/${currentExerciseIndex + 1}`);
    }
  };

  // Handle swipe gestures
  const [touchStart, setTouchStart] = React.useState(null);
  const [touchEnd, setTouchEnd] = React.useState(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  return (
    <div
      className={styles.navigationContainer}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <button
        className={`${styles.navButton} ${styles.prevButton}`}
        onClick={goToPrevious}
        disabled={currentExerciseIndex === 0}
        aria-label="Previous exercise"
      >
        <FaChevronLeft />
      </button>

      <div className={styles.paginationIndicator}>
        {Array.from({ length: totalExercises }).map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === currentExerciseIndex ? styles.activeDot : ''}`}
            onClick={() => router.push(`/workout/${dayNumber}/${index}`)}
          />
        ))}
      </div>

      <button
        className={`${styles.navButton} ${styles.nextButton}`}
        onClick={goToNext}
        disabled={currentExerciseIndex === totalExercises - 1}
        aria-label="Next exercise"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}
