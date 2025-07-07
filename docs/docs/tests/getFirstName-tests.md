# Tests: getFirstName Utility

This document describes the test suite for the `getFirstName` utility function located at `src/utils/getFirstName.js`.

## Function Overview

The `getFirstName` utility extracts the first name from a full name string. It:

- Returns the first word in a string (assumed to be the first name)
- Handles whitespace by trimming and splitting on spaces
- Returns an empty string for invalid inputs (null, undefined, non-strings)

## Test Cases

The test suite in `src/utils/getFirstName.test.js` covers the following scenarios:

### Normal Usage

- **Full names**: Verifies that the function correctly extracts the first word from multi-word names
  - Example: `"John Doe"` → `"John"`
  - Example: `"Jane Mary Smith"` → `"Jane"`

### Edge Cases

- **Whitespace handling**: Confirms that leading/trailing spaces are properly trimmed
  - Example: `"   Alice Johnson  "` → `"Alice"`
- **Single word names**: Ensures that single-word names are returned as-is
  - Example: `"Plato"` → `"Plato"`
- **Empty string**: Validates that empty strings return empty strings
  - Example: `""` → `""`
- **Multiple spaces**: Tests that multiple spaces between words are handled correctly
  - Example: `"  Bob   Marley  "` → `"Bob"`

### Error Handling

- **Null/undefined inputs**: Confirms graceful handling of missing inputs
  - Example: `null` → `""`
  - Example: `undefined` → `""`
- **Non-string inputs**: Verifies that non-string inputs (numbers, objects, arrays) return empty strings
  - Example: `123` → `""`
  - Example: `{}` → `""`
  - Example: `[]` → `""`

## Testing Best Practices Applied

This test suite demonstrates several best practices from our Unit Testing Best Practices document:

1. **Comprehensive Input Coverage**: Tests include typical cases, edge cases, and invalid inputs
2. **Focused Test Cases**: Each test case has a clear, specific purpose with descriptive names
3. **Error Handling**: Explicitly tests how the function handles invalid or unexpected inputs
4. **Public Contract Testing**: Tests focus on the function's inputs and outputs, not implementation details
5. **Regression Protection**: The comprehensive test suite helps prevent future regressions

## Why These Tests Matter

These tests are important because:

1. **Utility Function Reliability**: `getFirstName` is a basic utility that may be used throughout the application
2. **Defensive Programming**: The tests ensure the function handles unexpected inputs gracefully
3. **Documentation**: The tests serve as living documentation of how the function should behave
4. **Refactoring Safety**: The tests allow for future refactoring with confidence

The test suite follows our project's commitment to thorough testing of even simple utility functions, ensuring robustness throughout the application.
