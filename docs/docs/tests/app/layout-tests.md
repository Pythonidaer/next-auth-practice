# Tests: Root Layout Component

This document describes the test suite for the RootLayout component located at `src/app/layout.js`.

## Component Overview

The RootLayout component serves as the application's root layout and:

- Provides the HTML document structure with proper language attribute
- Sets up font preloading for performance optimization
- Applies the League Spartan font to the entire application
- Wraps the application in necessary providers:
  - ClientLayout for splash screen and session storage management
  - AuthProvider for authentication state management
- Includes the Navbar component on all pages
- Renders child components (page content) within these providers

## Test Cases

The test suite in `src/app/layout.test.js` covers the following scenarios:

### Component Structure

- **Provider Hierarchy**: Tests the correct nesting of providers and components
  - Verifies ClientLayout is the outermost wrapper
  - Confirms AuthProvider is nested within ClientLayout
  - Ensures Navbar is rendered within AuthProvider
  - Checks that child content is rendered within all providers

### Font Configuration

- **Font Application**: Tests that the font is correctly applied
  - Verifies the League Spartan font class is applied to the body element
  - Confirms the class name is correctly passed from the font configuration

### Resource Preloading

- **Font Preloading**: Tests that font resources are properly preloaded
  - Verifies preload links for font files are present in the document head
  - Confirms both WOFF and WOFF2 font formats are preloaded
  - Checks that the preload links have the correct attributes (as="font", crossOrigin)

### Metadata

- **Metadata Export**: Tests the exported metadata object
  - Verifies the metadata object contains the expected properties
  - Confirms title and description are present and of the correct type

## Testing Techniques Applied

This test suite demonstrates several advanced testing techniques:

1. **Component Mocking**:

   - Mocks child components (Navbar, AuthProvider, ClientLayout) to isolate RootLayout testing
   - Uses data-testid attributes to verify component presence and hierarchy

2. **Font Module Mocking**:

   - Mocks the Next.js font module to provide predictable class names
   - Tests font application without relying on actual font loading

3. **DOM Structure Testing**:

   - Tests document structure including head and body elements
   - Verifies link elements and their attributes in the document head

4. **Metadata Testing**:
   - Tests the exported metadata object separately from the component rendering

## Why These Tests Matter

These tests are important because:

1. **Application Foundation**: RootLayout is the foundation for every page in the application
2. **Provider Integration**: Ensures all necessary providers are present and correctly nested
3. **Performance Optimization**: Verifies font preloading for optimal loading performance
4. **Accessibility**: Confirms proper language attribute for accessibility compliance

The test suite follows best practices by:

- Focusing on component structure and visible output
- Testing DOM structure and attributes that affect user experience
- Mocking dependencies to isolate the component under test
- Providing clear explanations of testing techniques and rationale
