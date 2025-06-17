import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import ExerciseCard from './ExerciseCard';

describe('ExerciseCard', () => {
  it('renders exercise name, rep count, working sets, and details', () => {
    render(
      <ExerciseCard
        exerciseName="Bench Press"
        repCount={10}
        warmupSetCount={2}
        workingSetsCount={4}
        exerciseDetails="Use full range of motion."
      />,
    );
    expect(
      screen.getByRole('heading', { name: /bench press/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('10 reps')).toBeInTheDocument();
    expect(screen.getByText('2 warmup')).toBeInTheDocument();
    expect(screen.getByText('4 working sets')).toBeInTheDocument();
    expect(screen.getByText(/full range of motion/i)).toBeInTheDocument();
  });

  it('renders without warmupSetCount and exerciseDetails', () => {
    render(
      <ExerciseCard exerciseName="Squat" repCount={5} workingSetsCount={3} />,
    );
    expect(screen.getByRole('heading', { name: /squat/i })).toBeInTheDocument();
    expect(screen.getByText('5 reps')).toBeInTheDocument();
    expect(screen.queryByText(/warmup/i)).not.toBeInTheDocument();
    expect(screen.getByText('3 sets')).toBeInTheDocument();
    // Details should not be present
    expect(screen.queryByText(/details/i)).not.toBeInTheDocument();
  });
});
