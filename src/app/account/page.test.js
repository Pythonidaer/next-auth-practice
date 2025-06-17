import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Account from './page';

describe('Account Page', () => {
  it('renders a heading with text "Account"', () => {
    render(<Account />);
    const heading = screen.getByRole('heading', { name: /account/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders a wrapping div', () => {
    render(<Account />);
    const div = screen.getByText(/account/i).closest('div');
    expect(div).toBeInTheDocument();
  });
});

/**
 * Test Quality Notes:
 * - Follows UNIT_TESTING_BEST_PRACTICES.md and SplashScreen.test.js notes.
 * - Only tests visible output and DOM structure.
 * - Uses accessible queries (getByRole, getByText).
 * - No implementation details or internal state tested.
 * - Expand with more scenarios if component grows.
 */
