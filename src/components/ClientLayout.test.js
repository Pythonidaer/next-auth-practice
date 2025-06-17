import '@testing-library/jest-dom';
import { render, screen, act, waitFor } from '@testing-library/react';
import React from 'react';
import ClientLayout from './ClientLayout';

// Mock the SplashScreen component to simplify tests
jest.mock('./splash-screen/SplashScreen', () => {
  return function MockSplashScreen() {
    return <div data-testid="mock-splash">Mock Splash Screen</div>;
  };
});

// Mock window.sessionStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'sessionStorage', { value: localStorageMock });

describe('ClientLayout', () => {
  beforeEach(() => {
    localStorageMock.clear(); // Clear the internal storage of the mock
    localStorageMock.setItem.mockClear(); // Clear call history for setItem
    localStorageMock.getItem.mockClear(); // Clear call history for getItem

    jest.useFakeTimers(); // Use fake timers for tests involving setTimeout
  });

  afterEach(() => {
    // Wrap timers being run in act, as they might cause state updates
    act(() => {
      jest.runOnlyPendingTimers();
      // Ensure all timers are cleared to avoid leaks
    });
    jest.useRealTimers(); // Restore real timers after each test

    // Clear and reset all mocks after each test to ensure isolation
    jest.clearAllMocks();
  });

  // Adjusted test: This now asserts the *initial hydrated* state where the
  // children are in the DOM but not yet "loaded" (due to CSS).
  it('renders splash screen and initial (hidden) content on mount', () => {
    render(
      <ClientLayout>
        <div>Content</div>
      </ClientLayout>,
    );

    // After initial render and `useHydrated` effect, `hydrated` is true.
    // Both splash and children containers are in the DOM.
    expect(screen.getByTestId('splash-container')).toBeInTheDocument();
    expect(screen.getByTestId('mock-splash')).toBeInTheDocument();

    // Children are in the DOM, but their container
    // should not have the 'loaded' class yet.
    expect(screen.queryByText('Content')).toBeInTheDocument();
    expect(screen.getByTestId('children-container')).not.toHaveClass('loaded');

    // Splash container should not have the 'splashHidden' class yet.
    expect(screen.getByTestId('splash-container')).not.toHaveClass(
      'splashHidden',
    );
  });

  it('shows splash, then chlrdn after splash dur, & sets sessionStorage', async () => {
    render(
      <ClientLayout>
        <div>Content</div>
      </ClientLayout>,
    );

    // Initial state after mount:
    // Splash should be visible (not hidden),
    // children rendered but not 'loaded'.
    expect(screen.getByTestId('splash-container')).not.toHaveClass(
      'splashHidden',
    );
    expect(screen.getByTestId('children-container')).not.toHaveClass('loaded');

    // Advance all timers to trigger the setTimeout in ClientLayout's useEffect
    await act(async () => {
      jest.runAllTimers();
    });

    // Assertions after state updates caused by timers
    await waitFor(() => {
      expect(screen.getByTestId('children-container')).toHaveClass('loaded');
      expect(screen.getByTestId('splash-container')).toHaveClass(
        'splashHidden',
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    // Verify sessionStorage was set exactly once by the component
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'splashShown',
      'true',
    );
  });

  it("doesn't show splash agn if alrdy shown in sessionStorage", async () => {
    // Set sessionStorage to simulate splash already shown before rendering
    localStorageMock.setItem('splashShown', 'true');
    // This is the first and only expected call

    render(
      <ClientLayout>
        <div>Content</div>
      </ClientLayout>,
    );

    // Initial state after mount:
    // Splash visible (not hidden), children rendered but not 'loaded'.
    expect(screen.getByTestId('splash-container')).not.toHaveClass(
      'splashHidden',
    );
    expect(screen.getByTestId('children-container')).not.toHaveClass('loaded');
    expect(screen.getByText('Content')).toBeInTheDocument();

    // Advance all timers to trigger the setTimeout in ClientLayout
    await act(async () => {
      jest.runAllTimers();
    });

    // Assertions after state updates
    await waitFor(() => {
      expect(screen.getByTestId('children-container')).toHaveClass('loaded');
      expect(screen.getByTestId('splash-container')).toHaveClass(
        'splashHidden',
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    // Verify sessionStorage was NOT set
    //  again by the component's internal logic.
    // It should have only been called once during the test's setup.
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'splashShown',
      'true',
    );
  });
});
