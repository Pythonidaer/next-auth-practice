import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import About from './page';

// Basic rendering test for About page

describe('About Page', () => {
  it('renders a heading with text "About"', () => {
    render(<About />);
    const heading = screen.getByRole('heading', { name: /about/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders a wrapping div', () => {
    render(<About />);
    const div = screen.getByText(/about/i).closest('div');
    expect(div).toBeInTheDocument();
  });
});

/**
 * Test Quality Notes:
 * - Follows UNIT_TESTING_BEST_PRACTICES.md: tests
 * visible output only, avoids implementation details.
 * - Uses accessible queries (getByRole, getByText).
 * - No props or side effects to mock for this static component.
 * - If the component is expanded in the future, add
 * tests for additional visible output or states.
 */
