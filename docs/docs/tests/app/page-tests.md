# Tests: Home Page Component

This document describes the test suite for the Home page component located at `src/app/page.js`.

## Component Overview

The Home page component serves as the application's landing page and:

- Redirects unauthenticated users to the sign-in page
- Displays the application logo and brand name for authenticated users
- Shows navigation buttons to the dashboard and current workout
- Displays personalized workout information using the user's first name
- Shows the number of exercises in the current workout day

## Test Cases

The test suite in `src/app/page.test.js` covers the following scenarios:

### Authentication States

- **Loading State**: Tests the component's appearance during authentication loading

  - Verifies that nothing is rendered during the loading state

- **Unauthenticated State**: Tests redirection for unauthenticated users

  - Confirms that unauthenticated users are redirected to the sign-in page
  - Verifies the `replace` method is called with the correct path

- **Authenticated State**: Tests the component when user is logged in
  - Verifies the brand text "MEATBAG" is displayed
  - Confirms both dashboard and workout buttons are rendered
  - Tests that clicking the dashboard button navigates to the dashboard
  - Tests that clicking the workout button navigates to the correct workout page

### Content Display

- **Workout Information**: Tests the display of workout-specific information
  - Verifies the correct day number is shown in the workout button
  - Confirms the user's first name is extracted and displayed correctly
  - Tests that the number of exercises is correctly displayed

## Testing Techniques Applied

This test suite demonstrates several advanced testing techniques:

1. **Comprehensive Dependency Mocking**:

   - Mocks next-auth/react for authentication state
   - Mocks next/navigation for routing functions
   - Mocks the Button component to simplify testing
   - Mocks CSS modules to avoid styling dependencies
   - Mocks the getFirstName utility for consistent name display
   - Mocks workout data to ensure predictable test conditions

2. **Authentication State Testing**:

   - Tests all authentication states (loading, unauthenticated, authenticated)
   - Verifies correct behavior for each state

3. **User Interaction Simulation**:

   - Uses fireEvent to simulate clicks on navigation buttons
   - Verifies correct routing behavior for each interaction

4. **Module Reloading Pattern**:
   - Uses require() inside tests to ensure fresh component instances with updated mocks
   - Clears mocks between tests to prevent test pollution

## Why These Tests Matter

These tests are important because:

1. **Core Navigation**: The Home page is a critical entry point to the application
2. **Authentication Integration**: Tests verify proper handling of authentication states
3. **User Experience**: Confirms that authenticated users see personalized content
4. **Routing Logic**: Ensures navigation buttons direct users to the correct pages

The test suite follows best practices by:

- Focusing on component behavior and user-visible output
- Testing all authentication states thoroughly
- Mocking external dependencies to isolate the component
- Using clear test descriptions for maintainability
