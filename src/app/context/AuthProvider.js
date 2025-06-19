/**
 * @module context/AuthProvider
 */
'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';

/**
 * Provides authentication session context to child components using NextAuth.
 *
 * The session context contains information about the currently authenticated user
 * (if any), such as their name, email, authentication status, and provider details.
 * Components wrapped by this provider can access session data and authentication
 * state via the `useSession` hook from `next-auth/react`.
 *
 * This provider is typically placed near the root of your app (e.g., in layout.js) so
 * that all components needing authentication/session info can access it.
 *
 * @see https://next-auth.js.org/getting-started/client#sessionprovider
 *
 * @memberof module:context/AuthProvider
 * @param {object} props
 * @param {React.ReactNode} props.children - Components that require session context
 * @returns {JSX.Element} React node with session context available
 */
export function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
