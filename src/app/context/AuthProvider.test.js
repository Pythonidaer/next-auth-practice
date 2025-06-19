import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from './AuthProvider';

// Mock next-auth/react's SessionProvider
jest.mock('next-auth/react', () => {
  const MockSessionProvider = ({ children }) => (
    <div data-testid="mock-session-provider">{children}</div>
  );
  MockSessionProvider.displayName = 'MockSessionProvider';
  return { SessionProvider: MockSessionProvider };
});

describe('AuthProvider', () => {
  it('wraps children with SessionProvider', () => {
    render(
      <AuthProvider>
        <span>TestChild</span>
      </AuthProvider>,
    );
    // Check that the mock provider is rendered and contains the child
    const provider = screen.getByTestId('mock-session-provider');
    expect(provider).toBeInTheDocument();
    expect(provider).toContainElement(screen.getByText('TestChild'));
  });
});

/*
Explanation block for AuthProvider.test.js unit tests:

- **Mocks Provider:** Mocks next-auth/react's SessionProvider 
  so the test focuses on AuthProvider's contract and structure.
- **Tests User-Visible Output:** Asserts that children are rendered 
  and wrapped by the provider.
- **No Implementation Details:** Does not inspect internal state or 
  private methods, only the contract and visible output.
- **React Import & Display Name:** Ensures React is imported and mock 
  provider has a display name for clarity in debugging.
- **Error & Resolution:**
  - During initial testing, a `ReferenceError: React is not defined`
  occurred because `AuthProvider.js` used JSX but 
  did not explicitly import React. 
  This is required for `.js` files in Next.js and Jest environments.
  - The issue was resolved by adding `import React from 'react';` 
  at the top of `AuthProvider.js`.
  - Future maintainers: Always ensure React is imported in any `.js` 
  file using JSX, even if not strictly required by the Next.js build, 
  to maintain compatibility with testing tools and avoid runtime errors.
*/
