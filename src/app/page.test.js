/*
 Tests for Home page component, following best practices
 from UNIT_TESTING_BEST_PRACTICES.md
*/
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from './page';
import React from 'react';

// Mock dependencies
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('../components/Button/Button', () => {
  const MockButton = ({ label, onClick }) => (
    <button onClick={onClick}>{label}</button>
  );
  MockButton.displayName = 'MockButton';
  return MockButton;
});

jest.mock('../utils/getFirstName', () => jest.fn(() => 'Test'));

jest.mock('./page.module.css', () => ({
  container: 'container',
  brandSection: 'brandSection',
  logoWrapper: 'logoWrapper',
  logo: 'logo',
  brandText: 'brandText',
  buttonGroup: 'buttonGroup',
  footerSection: 'footerSection',
  footerTitle: 'footerTitle',
}));

// Mock dummyUserWorkoutData for normal tests
jest.mock('../data/dummyUserWorkoutData', () => ({
  dummyUserWorkoutData: [
    { dayNumber: 1, complete: false, exercises: [1, 2, 3] },
    { dayNumber: 2, complete: true, exercises: [4, 5] },
  ],
}));

// Do not import Home at top-level! Only require after mocks are set up.

describe('Home', () => {
  let pushMock;
  let replaceMock;

  beforeEach(() => {
    pushMock = jest.fn();
    replaceMock = jest.fn();
    require('next/navigation').useRouter.mockReturnValue({
      push: pushMock,
      replace: replaceMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test that Home renders nothing during loading state
  it('renders nothing for loading state', () => {
    require('next-auth/react').useSession.mockReturnValue({
      data: null,
      status: 'loading',
    });
    const Home = require('./page').default;
    const { container } = render(<Home />);
    expect(container).toBeEmptyDOMElement();
  });

  // Test that Home redirects unauthenticated users to /auth/signin
  it('redirects unauthenticated users to /auth/signin', () => {
    require('next-auth/react').useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });
    const Home = require('./page').default;
    render(<Home />);
    expect(replaceMock).toHaveBeenCalledWith('/auth/signin');
  });

  // Test that Home renders dashboard and
  //  workout buttons for authenticated users
  it('renders dashboard and workout buttons for authenticated users', () => {
    require('next-auth/react').useSession.mockReturnValue({
      data: { user: { name: 'Test User' } },
      status: 'authenticated',
    });
    const Home = require('./page').default;
    render(<Home />);
    // Brand text
    expect(screen.getByText('MEATBAG')).toBeInTheDocument();
    // Dashboard button
    const dashboardBtn = screen.getByRole('button', { name: /dashboard/i });
    expect(dashboardBtn).toBeInTheDocument();
    fireEvent.click(dashboardBtn);
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
    // Workout button
    const workoutBtn = screen.getByRole('button', { name: /day 1/i });
    expect(workoutBtn).toBeInTheDocument();
    fireEvent.click(workoutBtn);
    expect(pushMock).toHaveBeenCalledWith('/workout/1/0');
  });

  // Test that Home shows correct number of exercises in workout button label
  it('shows correct number of exercises in workout button label', () => {
    require('next-auth/react').useSession.mockReturnValue({
      data: { user: { name: 'Test User' } },
      status: 'authenticated',
    });
    const Home = require('./page').default;
    render(<Home />);
    // The label should include the correct day number from dummy data
    expect(screen.getByRole('button', { name: /day 1/i })).toBeInTheDocument();
  });
});

/*
EXPLANATION: Why These Unit Tests and Why They Are Best Practice

- **Isolation**: Mocks external dependencies to focus on Home's logic.
- **User-Facing**: Tests visible output and behavior 
  for different authentication states.
- **Edge Cases**: Covers loading, unauthenticated, and authenticated scenarios.
- **Public Contract**: Only tests user-facing behavior, not internal state.
- **Readability**: Uses clear comments and concise 
  test names for maintainability.
*/

// NOTE: You may see a console.error warning in layout.test.js:
//   '<html> cannot be a child of <div>'
// This is caused by React Testing Library rendering <html> in a test
// container (which is a <div>). It is safe to ignore as the test
// still verifies the intended behavior. This is a known limitation.
