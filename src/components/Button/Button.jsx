import React from 'react';
import styles from './Button.module.css';
import classNames from 'classnames'; // optional but helpful
import { ReactNode } from 'react';

export default function Button({
  color = 'blue', // red | green | white | blue
  label,
  icon = null,
  onClick,
  type = 'button',
  disabled = false,
  isLoading = false,
  skeletonWidth = null, // Optional custom width for skeleton
}) {
  // Determine if we should show skeleton
  const showSkeleton = isLoading;

  return (
    <button
      type={type}
      className={classNames(
        styles.button,
        styles[color],
        disabled && styles.disabled,
        showSkeleton && styles.skeleton,
      )}
      onClick={onClick}
      disabled={disabled || showSkeleton}
      style={skeletonWidth ? { width: skeletonWidth } : {}}
    >
      {!showSkeleton && icon && <span className={styles.icon}>{icon}</span>}
      <span>{showSkeleton ? '' : label}</span>
    </button>
  );
}
