# Tests: Navbar Component

This document describes the test suite for the `Navbar` component located at `src/components/Navbar/Navbar.jsx`.

## Component Overview

The `Navbar` component is a navigation header that:

- Displays the application logo and brand name
- Shows navigation links from a configurable list
- Handles authentication state (loading, authenticated, unauthenticated)
- Provides login/logout functionality
- Includes a responsive mobile sidebar for smaller screens
- Manages sidebar open/close state

## Test Cases

The test suite in `src/components/Navbar/Navbar.test.jsx` covers the following scenarios:

### Basic Rendering

- **Logo and Brand**: Verifies that the logo image and brand text are rendered
  - Confirms logo is in the document with correct alt text
  - Verifies brand text is displayed

### Authentication States

- **Loading State**: Tests the component's appearance during authentication loading

  - Confirms loading spinner is displayed when session status is "loading"

- **Unauthenticated State**: Tests the component when user is not logged in

  - Verifies login button is displayed
  - Confirms clicking login button calls the signIn function

- **Authenticated State**: Tests the component when user is logged in

  - Verifies logout button is displayed
  - Confirms clicking logout button calls the signOut function with correct callback URL

- **Unknown State Handling**: Tests fallback behavior for unexpected session states
  - Verifies neither login nor logout buttons appear for unknown session status

### Responsive Behavior

- **Sidebar Interaction**: Tests opening and closing the mobile sidebar
  - Confirms hamburger menu button opens the sidebar
  - Verifies close button appears when sidebar is open
  - Ensures close button closes the sidebar when clicked

### Navigation Items

- **Link Rendering**: Tests that navigation links appear in both main nav and sidebar
  - Verifies links appear in the main navigation
  - Confirms links also appear in the sidebar when open
  - Ensures clicking a sidebar link closes the sidebar

## Testing Techniques Applied

This test suite demonstrates several advanced testing techniques:

1. **Dependency Mocking**: Mocks Next.js and NextAuth dependencies to isolate the component

   - Mocks next-auth/react for authentication functions and session state
   - Mocks next/link and next/image for proper rendering
   - Mocks react-icons for icon components

2. **State Management Testing**: Tests component behavior across different states

   - Tests all authentication states (loading, authenticated, unauthenticated)
   - Verifies sidebar open/close state changes

3. **User Interaction Simulation**: Uses fireEvent to simulate clicks on:

   - Login and logout buttons
   - Hamburger menu and close buttons
   - Navigation links

4. **Dynamic Content Testing**: Tests rendering with dynamically loaded navigation items

## Why These Tests Matter

These tests are important because:

1. **Core Navigation**: The Navbar is a critical component present on all pages
2. **Authentication Integration**: Tests verify proper integration with the authentication system
3. **Responsive Design**: Ensures the mobile sidebar works correctly for different screen sizes
4. **User Experience**: Confirms that navigation remains functional across all states

The test suite follows best practices by focusing on component behavior and user-visible output rather than implementation details, while thoroughly testing all possible states and interactions.
