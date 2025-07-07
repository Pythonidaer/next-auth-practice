# Tests: ExerciseCard Component

This document describes the test suite for the `ExerciseCard` component located at `src/components/ExerciseCard/ExerciseCard.jsx`.

## Component Overview

The `ExerciseCard` component displays exercise information in a card format:

- Shows the exercise name as a heading
- Displays repetition count
- Shows the number of warmup sets (if applicable)
- Shows the number of working sets
- Displays additional exercise details (if provided)
- Adapts its display based on the presence of optional props

## Test Cases

The test suite in `src/components/ExerciseCard/ExerciseCard.test.jsx` covers the following scenarios:

### Complete Rendering

- **Full Props Set**: Tests rendering with all possible props provided
  - Verifies exercise name appears as a heading
  - Confirms rep count is displayed correctly
  - Checks that warmup set count is shown
  - Ensures working sets count is displayed with correct wording
  - Confirms exercise details are visible

### Optional Props Handling

- **Missing Optional Props**: Tests rendering without optional props
  - Verifies the component renders correctly without warmupSetCount
  - Confirms the component renders correctly without exerciseDetails
  - Checks that "sets" is used instead of "working sets" when no warmup sets are specified
  - Ensures no warmup-related text appears when warmupSetCount is not provided
  - Confirms no details section appears when exerciseDetails is not provided

## Testing Techniques Applied

This test suite demonstrates several testing techniques:

1. **Comprehensive Props Testing**: Tests all supported props and their combinations
2. **Conditional Rendering**: Verifies that conditional UI elements appear or don't appear based on props
3. **Text Content Verification**: Checks that text content is correctly displayed based on the provided props
4. **Accessibility Testing**: Uses role-based queries to find elements by their accessible roles
5. **Negative Assertions**: Uses `queryByText` with `not.toBeInTheDocument()` to verify elements are not present

## Why These Tests Matter

These tests are important because:

1. **UI Consistency**: Ensures the exercise card displays information consistently
2. **Conditional Logic**: Verifies that conditional rendering logic works correctly
3. **Prop Handling**: Confirms the component handles both required and optional props appropriately
4. **User Experience**: Ensures users see the correct information based on available exercise data

The test suite follows the project's best practices for React component testing, focusing on user-visible output rather than implementation details.
