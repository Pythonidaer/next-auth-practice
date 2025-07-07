# Tests: ClientLayout Component

This document describes the test suite for the `ClientLayout` component located at `src/components/ClientLayout.jsx`.

## Component Overview

The `ClientLayout` component is a wrapper component that:

- Manages the application's splash screen display
- Handles the transition from splash screen to main content
- Uses session storage to track whether the splash screen has been shown
- Provides a consistent layout for client-side rendered pages

## Test Cases

The test suite in `src/components/ClientLayout.test.js` covers the following scenarios:

### Initial Rendering

- **Splash Screen and Initial Content**: Verifies that both the splash screen and the initial (hidden) content are rendered on mount
  - Confirms splash screen is visible
  - Confirms child content is in the DOM but not yet marked as "loaded"

### Transition Animation

- **Transition from Splash to Content**: Tests the complete transition flow
  - Confirms splash screen is initially visible
  - Advances timers to simulate the splash duration
  - Verifies that after the timeout:
    - Child content receives the "loaded" class
    - Splash container receives the "splashHidden" class
    - Content is visible in the document
  - Confirms that sessionStorage is updated to track that the splash has been shown

### Session Storage Integration

- **Splash Screen Skip Logic**: Tests that the splash screen transition logic respects session storage
  - Simulates a scenario where the splash has already been shown (via sessionStorage)
  - Verifies the component still renders correctly
  - Confirms sessionStorage is not updated again unnecessarily

## Testing Techniques Applied

This test suite demonstrates several advanced testing techniques:

1. **Component Mocking**: The SplashScreen component is mocked to simplify tests and focus on ClientLayout's behavior
2. **Browser API Mocking**: The sessionStorage API is mocked to control and verify its usage
3. **Timer Management**: Jest's fake timers are used to control and advance time-dependent animations
4. **Async Testing**: Uses `act()` and `waitFor()` to handle asynchronous state updates
5. **DOM Class Assertions**: Verifies CSS classes are applied/removed at the right times
6. **Test Isolation**: Each test properly cleans up after itself with beforeEach/afterEach hooks

## Why These Tests Matter

These tests are important because:

1. **User Experience**: The ClientLayout controls critical first-impression UX with the splash screen
2. **State Management**: Tests verify proper state transitions in a component with time-dependent behavior
3. **Browser API Integration**: Ensures correct interaction with browser APIs like sessionStorage
4. **Regression Prevention**: Guards against regressions in the application's core layout component

The test suite follows best practices for React component testing, focusing on behavior rather than implementation details while still providing thorough coverage of the component's functionality.
