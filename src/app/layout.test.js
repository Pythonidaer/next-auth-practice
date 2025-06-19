/*
 Tests for RootLayout component, following best practices
 from UNIT_TESTING_BEST_PRACTICES.md
*/
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout, { metadata } from './layout';

// Mock child components
jest.mock('../components/Navbar/Navbar', () => ({
  __esModule: true,
  default: () => {
    const MockNavbar = () => <nav data-testid="navbar" />;
    MockNavbar.displayName = 'MockNavbar';
    return <MockNavbar />;
  },
}));

jest.mock('./context/AuthProvider', () => ({
  __esModule: true,
  AuthProvider: ({ children }) => {
    const MockAuthProvider = ({ children }) => (
      <div data-testid="auth-provider">{children}</div>
    );
    MockAuthProvider.displayName = 'MockAuthProvider';
    return <MockAuthProvider>{children}</MockAuthProvider>;
  },
}));

jest.mock('../components/ClientLayout', () => ({
  __esModule: true,
  default: ({ children }) => {
    const MockClientLayout = ({ children }) => (
      <div data-testid="client-layout">{children}</div>
    );
    MockClientLayout.displayName = 'MockClientLayout';
    return <MockClientLayout>{children}</MockClientLayout>;
  },
}));

// Mock next/font/google
jest.mock('next/font/google', () => ({
  League_Spartan: () => ({ className: 'mock-font' }),
}));

describe('RootLayout', () => {
  it('renders children inside providers and layout', () => {
    render(
      <RootLayout>
        <main data-testid="child-content">Hello</main>
      </RootLayout>,
    );
    // Providers and children
    expect(screen.getByTestId('client-layout')).toBeInTheDocument();
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('applies the font class to <body>', () => {
    render(
      <RootLayout>
        <main>Font Test</main>
      </RootLayout>,
    );
    const body = document.body;
    // The class is applied to the <body> element
    expect(body.className).toContain('mock-font');
  });

  it('includes font preload links in <head>', () => {
    render(<RootLayout>child</RootLayout>);
    const preloadLinks = document.head.querySelectorAll(
      'link[rel="preload"][as="font"]',
    );
    expect(preloadLinks.length).toBeGreaterThanOrEqual(2);
    // Check hrefs
    expect(
      Array.from(preloadLinks).some((link) =>
        link.href.endsWith('LeagueGothic-Regular.woff2'),
      ),
    ).toBe(true);
    expect(
      Array.from(preloadLinks).some((link) =>
        link.href.endsWith('LeagueGothic-Regular.woff'),
      ),
    ).toBe(true);
  });

  it('exports correct metadata', () => {
    expect(metadata).toMatchObject({
      title: expect.any(String),
      description: expect.any(String),
    });
  });
});

/*
EXPLANATION: Why These Unit Tests and Why They Are Best Practice

- **Mocks Providers and Components:**
  Mocks context and layout providers so the test focuses 
  on RootLayout's logic and structure.
- **Tests User-Visible Output:**
  Asserts that children and key layout components are 
  rendered, and that font classes and preload links are present.
- **Checks Metadata Export:**
  Ensures the exported metadata object is correct.
- **No Implementation Details:**
  Does not inspect internal state or private methods, 
  only the contract and visible output.
*/
