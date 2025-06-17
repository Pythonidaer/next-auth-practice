/*
 Tests for getFirstName utility, following best practices 
 from UNIT_TESTING_BEST_PRACTICES.md
*/
import getFirstName from './getFirstName';

describe('getFirstName', () => {
  it('returns the first word for a normal full name', () => {
    expect(getFirstName('John Doe')).toBe('John');
    expect(getFirstName('Jane Mary Smith')).toBe('Jane');
  });

  it('trims whitespace and returns the first word', () => {
    expect(getFirstName('   Alice Johnson  ')).toBe('Alice');
  });

  it('returns the full string if only one word is provided', () => {
    expect(getFirstName('Plato')).toBe('Plato');
  });

  it('returns an empty string if input is empty', () => {
    expect(getFirstName('')).toBe('');
  });

  it('returns an empty string if input is null or undefined', () => {
    expect(getFirstName()).toBe('');
    expect(getFirstName(null)).toBe('');
    expect(getFirstName(undefined)).toBe('');
  });

  it('handles names with multiple spaces between words', () => {
    expect(getFirstName('  Bob   Marley  ')).toBe('Bob');
  });

  it('handles non-string input gracefully', () => {
    /*
    The function expects a string, but if passed 
    a number or object, should return ''
    */
    expect(getFirstName(123)).toBe('');
    expect(getFirstName({})).toBe('');
    expect(getFirstName([])).toBe('');
  });
});

/*
EXPLANATION: Why These Unit Tests and Why They Are Best Practice

These tests were designed according to the guidelines in
UNIT_TESTING_BEST_PRACTICES.md:

- **Covers Typical and Edge Cases:**
  Tests include common names, single names, names with extra spaces, and
  empty strings. This ensures the function works for all expected user inputs.
- **Handles Invalid Input:**
  Tests explicitly check non-string, null, and undefined inputs. This
  prevents runtime errors and ensures graceful failure—an essential aspect
  of robust utility functions.
- **Focuses on Public Contract:**
  The tests only check the output of getFirstName, not its internal
  implementation. This follows the principle of testing the contract,
  not the implementation details.
- **Readability and Maintainability:**
  Each test case is isolated and clearly describes its scenario. This makes
  it easy for future maintainers to understand and extend.
- **Regression Protection:**
  By covering a wide range of inputs, these tests help catch regressions if
  the function is modified in the future.

Following these practices ensures that the utility is reliable, maintainable,
and its behavior is well-documented through tests.
*/
