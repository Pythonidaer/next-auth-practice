// src/components/Navbar/Navbar.test.jsx
import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from './Navbar';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: jest.fn(),
}));

// Mock next/link to render children directly
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, ...props }) => <a {...props}>{children}</a>,
}));

// Mock next/image to render img
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));

// Mock react-icons
jest.mock('react-icons/fi', () => ({
  FiMenu: () => <span>menu</span>,
  FiX: () => <span>close</span>,
}));
jest.mock('react-icons/fa', () => ({ FaSpinner: () => <span>spinner</span> }));

// --- CORRECTED MOCK FOR NAVITEMS ---
const mockNavItemsData = [];

jest.mock('./navItems', () => ({
  __esModule: true,
  get default() {
    return mockNavItemsData;
  },
}));

const { useSession, signIn, signOut } = require('next-auth/react');

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavItemsData.length = 0;
  });

  it('renders logo and brand text', () => {
    useSession.mockReturnValue({ status: 'unauthenticated' });
    render(<Navbar />);
    expect(screen.getByAltText(/meatbag logo/i)).toBeInTheDocument();
    expect(screen.getByText(/meatbag/i)).toBeInTheDocument();
  });

  it('shows loading spinner when session is loading', () => {
    useSession.mockReturnValue({ status: 'loading' });
    render(<Navbar />);
    expect(screen.getByText(/spinner/i)).toBeInTheDocument();
  });

  it('returns null for unknown session status (fallback branch)', () => {
    useSession.mockReturnValue({ status: 'unexpected' });
    render(<Navbar />);
    expect(
      screen.queryByRole('button', { name: /log in/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /log out/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/spinner/i)).not.toBeInTheDocument();
  });

  it('shows login button when unauthenticated', () => {
    useSession.mockReturnValue({ status: 'unauthenticated' });
    render(<Navbar />);
    const loginBtn = screen.getByRole('button', { name: /log in/i });
    expect(loginBtn).toBeInTheDocument();
    fireEvent.click(loginBtn);
    expect(signIn).toHaveBeenCalled();
  });

  it('shows logout button when authenticated', () => {
    useSession.mockReturnValue({ status: 'authenticated' });
    render(<Navbar />);
    const logoutBtn = screen.getByRole('button', { name: /log out/i });
    expect(logoutBtn).toBeInTheDocument();
    fireEvent.click(logoutBtn);
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/' });
  });

  // Updated Test: opens and closes sidebar on hamburger/close click
  it('opens and closes sidebar on hamburger/close click', () => {
    // Removed 'async'
    useSession.mockReturnValue({ status: 'unauthenticated' });
    render(<Navbar />);

    const openBtn = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(openBtn);

    // Assert that the sidebar is open and close button is visible
    const closeBtn = screen.getByRole('button', { name: /close menu/i });
    expect(closeBtn).toBeInTheDocument();
    expect(screen.getByText(/close/i)).toBeInTheDocument();

    fireEvent.click(closeBtn);

    // Directly assert that the element is not in the document immediately after the click
    expect(
      screen.queryByRole('button', { name: /close menu/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/close/i)).not.toBeInTheDocument();
  });

  // Updated Test: renders navItems in main nav and sidebar and closes sidebar on link click
  it('renders navItems in main nav and sidebar and closes sidebar on link click', () => {
    // Removed 'async'
    mockNavItemsData.push(
      { label: 'TestLink', href: '/test' },
      { label: 'AnotherLink', href: '/another' },
    );

    useSession.mockReturnValue({ status: 'unauthenticated' });
    render(<Navbar />);

    // Main nav - expect to find both items
    expect(screen.getByRole('link', { name: 'TestLink' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'AnotherLink' }),
    ).toBeInTheDocument();

    // Open sidebar
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));

    // Sidebar nav - expect to find both items again (total of 4 links in the DOM: 2 main, 2 sidebar)
    const allTestLinks = screen.getAllByRole('link', { name: 'TestLink' });
    const allAnotherLinks = screen.getAllByRole('link', {
      name: 'AnotherLink',
    });

    expect(allTestLinks.length).toBe(2);
    expect(allAnotherLinks.length).toBe(2);

    const closeBtn = screen.getByRole('button', { name: /close menu/i });
    expect(closeBtn).toBeInTheDocument();

    // Click sidebar link to close sidebar
    fireEvent.click(allTestLinks[1]);

    // Directly assert that the element is not in the document immediately after the click
    expect(
      screen.queryByRole('button', { name: /close menu/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/close/i)).not.toBeInTheDocument();
  });
});

/**
 * Test Quality Explanation (see UNIT_TESTING_BEST_PRACTICES.md):
 * - Mocks Next.js and next-auth dependencies so tests focus on Navbar's contract.
 * - Asserts user-visible output: logo, text, auth buttons, spinner, and sidebar.
 * - Simulates user interactions: clicking login, logout, hamburger, and close.
 * - Covers navItems rendering in both nav and sidebar, and the fallback null branch.
 * - Avoids testing implementation details or internal state.
 * - Queries by role, alt text, and visible labels for accessibility and user-centric checks.
 */
