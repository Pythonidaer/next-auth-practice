import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignInPage from './page';
import { signIn } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

jest.mock('next/image', () => {
  const MockImage = (props) => {
    // Next.js Image optimization is not needed for tests
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  };
  MockImage.displayName = 'MockNextImage';
  return MockImage;
});

jest.mock('../../../components/Button/Button.jsx', () => {
  const MockButton = (props) => {
    const { color, label, onClick } = props;
    return (
      <button data-color={color} onClick={onClick}>
        {label}
      </button>
    );
  };
  MockButton.displayName = 'MockButton';
  return MockButton;
});

describe('SignInPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders logo, brand text, and both buttons', () => {
    render(<SignInPage />);
    // Logo image
    const logo = screen.getByAltText(/meatbag logo/i);
    expect(logo).toBeInTheDocument();
    // Brand text
    expect(screen.getByText(/meatbag/i)).toBeInTheDocument();
    // Buttons
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signup/i })).toBeInTheDocument();
  });

  it('calls signIn("google") when LOGIN is clicked', () => {
    render(<SignInPage />);
    const loginBtn = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginBtn);
    expect(signIn).toHaveBeenCalledWith('google');
  });

  it('calls signIn("google") when SIGNUP is clicked', () => {
    render(<SignInPage />);
    const signupBtn = screen.getByRole('button', { name: /signup/i });
    fireEvent.click(signupBtn);
    expect(signIn).toHaveBeenCalledWith('google');
  });
});

/**
 * This test file follows project unit testing best practices:
 * - Mocks external providers/components (next/image, signIn, Button)
 * - Queries by role/text, not by class
 * - Asserts user-visible output (logo, brand, buttons)
 * - Simulates user events and checks side effects
 * - No reliance on internal implementation details
 *
 * Common Issue: 'Component definition is missing display name'
 * - When mocking React components as anonymous arrow functions, React and some linters warn if displayName is missing.
 * - To resolve, assign a displayName property to each mock component (see above for example).
 */
