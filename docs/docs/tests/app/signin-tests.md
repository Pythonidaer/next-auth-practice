# Tests: Sign-In Page

This document describes the test suite for the Sign-In page component located at `src/app/auth/signin/page.js`.

## Component Overview

The Sign-In page component serves as the authentication entry point and:

- Displays the application logo and brand name
- Provides login and signup buttons that both use Google authentication
- Uses NextAuth's signIn function to initiate the authentication flow
- Features a clean, focused UI with minimal distractions

## Test Cases

The test suite in `src/app/auth/signin/page.test.js` covers the following scenarios:

### Visual Elements

- **Logo and Brand**: Tests that the logo and brand text are rendered correctly
  - Verifies the logo image is in the document with the correct alt text
  - Confirms the brand text "MEATBAG" is displayed

### Authentication Actions

- **Login Button**: Tests the login button functionality

  - Verifies the login button is rendered with the correct label
  - Confirms clicking the login button calls signIn with "google" provider

- **Signup Button**: Tests the signup button functionality
  - Verifies the signup button is rendered with the correct label
  - Confirms clicking the signup button also calls signIn with "google" provider

## Testing Techniques Applied

This test suite demonstrates several testing techniques:

1. **Component Mocking**:

   - Mocks the Next.js Image component to avoid issues with image optimization
   - Mocks the Button component to simplify testing and focus on behavior
   - Mocks NextAuth's signIn function to verify it's called correctly

2. **User Interaction Simulation**:

   - Uses fireEvent to simulate clicks on login and signup buttons
   - Verifies that the correct authentication function is called with the right parameters

3. **Visual Element Verification**:

   - Tests that all key visual elements are present in the rendered output
   - Uses accessible queries like getByRole and getByAltText for robust testing

4. **Best Practices Documentation**:
   - Includes detailed comments explaining the testing approach
   - Documents common issues like missing display names in component mocks
   - Provides guidance for maintaining tests and resolving common problems

## Why These Tests Matter

These tests are important because:

1. **Authentication Entry Point**: The Sign-In page is the critical entry point for user authentication
2. **User Experience**: Ensures the authentication UI is correctly rendered and functional
3. **Integration Verification**: Confirms proper integration with NextAuth's authentication system
4. **Visual Consistency**: Verifies that branding elements appear as expected

The test suite follows best practices by:

- Focusing on user-visible behavior rather than implementation details
- Using accessible queries for robust, maintainable tests
- Properly mocking external dependencies
- Including helpful documentation for future maintainers
