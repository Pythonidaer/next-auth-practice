/* 
 Tests for SplashScreen component, following best practices
 from UNIT_TESTING_BEST_PRACTICES.md
*/
jest.mock('next/image', () => {
  // Filter out 'priority' prop so it is not passed to <img>
  const MockImage = ({ priority, ...props }) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  };
  MockImage.displayName = 'MockImage';
  return MockImage;
});

// NOTE: No manual CSS module mocks are needed
// if your Jest config uses identity-obj-proxy for .module.css files.
// See jest.config.js:
//  moduleNameMapper['\\.module\\.css$'] = 'identity-obj-proxy'
// This ensures styles.splashScreen, etc. are string names for class assertions.

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import SplashScreen from './SplashScreen';

// Use fake timers for the transition effect
beforeEach(() => {
  jest.useFakeTimers();
});
afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

import { act } from '@testing-library/react';

describe('SplashScreen', () => {
  it('renders logo and brand text', () => {
    render(<SplashScreen />);
    // Logo
    const logo = screen.getByRole('img', { name: /meatbag logo/i });
    expect(logo).toBeInTheDocument();
    // Brand text
    expect(screen.getByText(/meatbag/i)).toBeInTheDocument();
  });

  it('applies loaded transition after timer', () => {
    const { container } = render(<SplashScreen />);
    // Initially, transition.loaded should not be present
    expect(container.firstChild).not.toHaveClass('loaded');
    // Advance timers to trigger useEffect, wrapped in act
    act(() => {
      jest.advanceTimersByTime(20);
    });
    // Now, the loaded class should be present (and others remain)
    expect(container.firstChild.className).toEqual(
      expect.stringContaining('splashScreen'),
    );
    expect(container.firstChild.className).toEqual(
      expect.stringContaining('pageWrapper'),
    );
    expect(container.firstChild.className).toEqual(
      expect.stringContaining('loaded'),
    );
  });
});

/*
Root cause documentation:
- The next/image mock was passing the 'priority' 
prop to <img>, which is not a valid HTML attribute. Filtering it
 out in the mock resolves the React warning.
- React state updates triggered by timers must be wrapped in act() 
in tests to avoid act warnings and ensure correct assertions.
- Class assertions are made robust by checking for all 
expected classes, as the component applies multiple classes via template string.
*/

/*
Explanation block for SplashScreen.test.js unit tests:

- **Mocks Next.js and CSS Modules:** Mocks next/image and CSS modules
  so the test focuses on SplashScreen's logic and user-visible output.
- **Tests User-Visible Output:** Asserts that the logo and brand text are
  rendered, and that the transition class is applied after the timer.
- **No Implementation Details:** Does not inspect internal state or
  private methods, only the contract and visible output.

---------------------------------------------------------------------

Additional Next.js/React Testing Tips:

- **Mock Next.js Routing/Auth:** Mock `useRouter`, `useSession`, etc.,
  at the top of the test file to control navigation and auth state.
- **Server vs Client Components:** For server components, focus on props
  and output. For client components, test interactivity and effects.
- **Mock Browser APIs:** If components use `window` or `localStorage`,
  mock these in your tests to avoid Node errors.
- **Async Effects:** Use `await waitFor(...)` or wrap timer advances
  in `act()` for effects that run asynchronously or after a delay.
- **Snapshot Testing:** Use sparingly. Prefer explicit assertions about
  visible output to avoid brittle tests.
- **Accessibility Queries:** Use queries like `getByRole`,
  `getByLabelText`, or `getByText` for robust, accessible tests.
- **Avoid Implementation Details:** Only test what the user can see or
  interact with, not internal state or private methods.
- **Edge Cases:** Test empty, error, and loading states, and different
  prop combinations for robust coverage.
- **Consistent Mocking:** Mock CSS modules, images, and external
  dependencies consistently across test files.
- **Jest Config Hygiene:** Ensure `jest.config.js` has proper
  `moduleNameMapper` for CSS, images, and static assets.

// Example: Mock Next.js Router
// jest.mock('next/router', () => ({
//   useRouter: () => ({ push: jest.fn(), prefetch: jest.fn() })
// }));

// Example: Loading State
// it('shows a spinner while loading', () => {
//   render(<MyComponent loading />);
//   expect(screen.getByRole('status')).toBeInTheDocument();
// });
*/
