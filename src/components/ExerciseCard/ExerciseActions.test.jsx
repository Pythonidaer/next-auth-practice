import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ExerciseActions } from './ExerciseActions';

describe('ExerciseActions', () => {
  it('renders all action buttons with correct labels and icons', () => {
    render(<ExerciseActions exerciseId="ex1" />);
    // Button: START SET TIMER
    expect(
      screen.getByRole('button', { name: /start set timer/i }),
    ).toBeInTheDocument();
    // Button: record weights
    expect(
      screen.getByRole('button', { name: /record weights/i }),
    ).toBeInTheDocument();
    // Button: Complete
    expect(
      screen.getByRole('button', { name: /complete/i }),
    ).toBeInTheDocument();
  });

  it('does not crash if exerciseId is missing', () => {
    render(<ExerciseActions />);
    expect(
      screen.getByRole('button', { name: /start set timer/i }),
    ).toBeInTheDocument();
  });
});
