// IMPORTANT: For API route tests, mock NextAuth
// and providers to avoid real network calls.
var mockGoogleProvider;

jest.mock('next-auth/providers/google', () => {
  mockGoogleProvider = jest.fn(() => ({}));
  return {
    __esModule: true,
    default: mockGoogleProvider,
  };
});

// IMPORTANT: Ensure this mock is set up correctly and consistently.
// It needs to return a function that can be called,
// and it should also allow for its 'mock.calls' to be inspected.
jest.mock('next-auth', () => {
  const actualNextAuth = jest.fn((options) =>
    jest.fn((req, res) => res && res.end('mocked')),
  );
  return {
    __esModule: true,
    default: actualNextAuth,
    // If you need other exports from next-auth, add them here
  };
});

import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import * as nextAuthModule from 'next-auth'; // Keep this for type hinting/understanding
import GoogleProvider from 'next-auth/providers/google'; // Keep this for type hinting/understanding
import * as route from './route'; // Import the route module

// Mock environment variables
const OLD_ENV = process.env;
beforeEach(() => {
  jest.resetModules();
  process.env = {
    ...OLD_ENV,
    GOOGLE_CLIENT_ID: 'test_id',
    GOOGLE_CLIENT_SECRET: 'test_secret',
  };
  mockGoogleProvider.mockClear();
  // Clear mock calls for nextAuthModule.default as well
  nextAuthModule.default.mockClear();
});
afterAll(() => {
  process.env = OLD_ENV;
});

describe('NextAuth API route', () => {
  // It's good practice to re-require modules within tests if they depend on mocks
  // that are reset/changed between tests (e.g., in beforeEach).
  // This ensures you get a fresh module instance with the applied mocks.

  it('exports GET and POST handlers', () => {
    // You might need to re-require the route here if its exports are dynamic
    // or if you want to ensure it's loaded after all mocks are set up.
    // For simple exports, the top-level import might be sufficient,
    // but re-requiring is safer in complex mocking scenarios.
    const routeModule = require('./route');
    expect(typeof routeModule.GET).toBe('function');
    expect(typeof routeModule.POST).toBe('function');
  });

  it('calls NextAuth with correct providers and options', () => {
    // Ensure NextAuth is called by importing the route or its dependencies
    // that trigger the call to NextAuth.
    // The previous `require('./route')` inside this test is correct.
    const routeModule = require('./route'); // This re-imports the route, triggering NextAuth call
    const GoogleProviderMock = require('next-auth/providers/google').default; // Get the mocked GoogleProvider
    const nextAuthMock = require('next-auth').default; // Get the mocked NextAuth function

    expect(GoogleProviderMock).toHaveBeenCalledWith({
      clientId: 'test_id',
      clientSecret: 'test_secret',
    });

    expect(nextAuthMock).toHaveBeenCalledWith(
      expect.objectContaining({
        providers: expect.arrayContaining([expect.any(Object)]),
        pages: expect.objectContaining({ signIn: '/auth/signin' }),
        callbacks: expect.objectContaining({
          redirect: expect.any(Function),
        }),
      }),
    );
  });

  it('redirect callback always returns baseUrl', async () => {
    // To ensure NextAuth.default has been called, it's best to call it
    // or trigger its call within this test if it hasn't been guaranteed by a previous test.
    // However, if the `it('calls NextAuth with correct providers and options')` test
    // successfully calls NextAuth, then its `mock.calls` should be populated.

    // A safer way is to explicitly trigger the import of the route module
    // which then, in turn, calls NextAuth.
    const routeModule = require('./route'); // Re-import to ensure NextAuth is called if not already

    // Now, access the mock calls
    const nextAuthMock = require('next-auth').default; // Get the mocked NextAuth function
    const configArg = nextAuthMock.mock.calls[0][0]; // This should now be populated

    expect(configArg).toBeDefined(); // Add a check to be sure
    expect(configArg.callbacks).toBeDefined(); // Add a check to be sure

    const { redirect } = configArg.callbacks;
    const result = await redirect({
      baseUrl: 'http://localhost:3000',
      url: 'http://malicious.com',
    });
    expect(result).toBe('http://localhost:3000');
  });

  it('handler responds to GET/POST (mocked)', async () => {
    const req = {};
    const res = { end: jest.fn() };
    // Ensure the route module is imported/required to set up handlers
    const routeModule = require('./route');
    await routeModule.GET(req, res);
    await routeModule.POST(req, res);
    expect(res.end).toHaveBeenCalledWith('mocked');
  });
});

/**
 * Test Quality Notes:
 * - Follows UNIT_TESTING_BEST_PRACTICES.md and project
 * conventions for API routes.
 * - Mocks all providers and NextAuth to avoid real OAuth/network calls.
 * - Tests only the contract: exports, provider config,
 * callback logic, and handler output.
 * - Does not inspect NextAuth internals or implementation details.
 * - Expand with more scenarios if the route logic grows.
 */
