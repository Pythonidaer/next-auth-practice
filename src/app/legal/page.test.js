// IMPORTANT: For .js files using JSX, you must
// import both React and '@testing-library/jest-dom' at the top.
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Legal from './page';

describe('Legal Page', () => {
  it('renders a heading with text "Legal"', () => {
    render(<Legal />);
    const heading = screen.getByRole('heading', { name: /legal/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders a wrapping div', () => {
    render(<Legal />);
    const div = screen.getByText(/legal/i).closest('div');
    expect(div).toBeInTheDocument();
  });
});

/**
 * Test Quality Notes:
 * - Follows UNIT_TESTING_BEST_PRACTICES.md and project conventions.
 * - Tests only visible output, avoids implementation details.
 * - Uses accessible queries (getByRole, getByText).
 * - No props or side effects to mock for this static component.
 * - IMPORTANT: Because this file (and the component) ends in .js, not .jsx:
 *    - You must import React at the top to ensure
 * JSX works in all environments.
 *    - You must also import '@testing-library/jest-dom'
 * so that custom matchers like toBeInTheDocument work.
 * - Expand with more scenarios if the component grows.
 */
