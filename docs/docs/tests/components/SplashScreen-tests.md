# Tests: SplashScreen Component

This document describes the test suite for the `SplashScreen` component located at `src/components/splash-screen/SplashScreen.jsx`.

## Component Overview

The `SplashScreen` component is an animated splash screen that:

- Displays the application logo and brand name during initial loading
- Implements a transition effect using CSS classes
- Uses React's useEffect and useState to manage the transition timing
- Serves as the initial visual element users see when launching the application

## Test Cases

The test suite in `src/components/splash-screen/SplashScreen.test.js` covers the following scenarios:

### Visual Elements

- **Logo and Brand Text**: Verifies that the logo and brand text are rendered correctly
  - Confirms the logo image is in the document with correct alt text
  - Verifies the brand text "MEATBAG" is displayed

### Animation and Transitions

- **CSS Transition Classes**: Tests the application of CSS transition classes
  - Confirms the component initially does not have the "loaded" class
  - Verifies that after a short delay, the "loaded" class is applied
  - Ensures all base classes remain applied during the transition

## Testing Techniques Applied

This test suite demonstrates several advanced testing techniques:

1. **Next.js Component Mocking**:

   - Mocks the Next.js Image component to avoid issues with the "priority" prop
   - Ensures the mock properly filters out props that aren't valid for HTML img elements

2. **CSS Module Handling**:

   - Uses Jest's identity-obj-proxy for CSS modules
   - Allows for class name assertions without manual CSS module mocking

3. **Timer Management**:

   - Uses Jest's fake timers to control and test time-dependent animations
   - Properly cleans up timers between tests to prevent leaks

4. **React Testing Best Practices**:

   - Wraps timer-triggered state updates in act() to avoid React warnings
   - Uses proper cleanup in beforeEach/afterEach hooks

5. **Class Assertions**:
   - Tests for the presence of multiple CSS classes using string containment
   - Verifies both the initial state and the post-transition state

## Why These Tests Matter

These tests are important because:

1. **First User Impression**: The SplashScreen is the first component users see, making its appearance critical
2. **Animation Reliability**: Ensures the transition effect works correctly across browsers and environments
3. **Integration with Next.js**: Verifies proper integration with Next.js Image component
4. **Visual Consistency**: Confirms that logo and branding elements appear as expected

## Additional Testing Notes

The test file includes comprehensive documentation about:

- Root cause analysis for common testing issues
- Next.js and React testing best practices
- Proper mocking techniques for Next.js components
- Handling of CSS modules in tests
- Testing asynchronous effects and transitions

These notes serve as valuable reference material for testing other components in the application, particularly those with animations or that use Next.js-specific features.
