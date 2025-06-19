/**
 * @module api/auth/[...nextauth]/route
 */
/**
 * API Route for NextAuth authentication.
 * Handles OAuth and credential-based authentication for the application.
 *
 * @memberof module:api/auth/[...nextauth]/route
 * @see https://next-auth.js.org/
 *
 * @returns {Promise<Response>} Next.js API route handler for authentication (GET, POST)
 *
 * @requires env.GOOGLE_CLIENT_ID - Google OAuth client ID (required for GoogleProvider)
 * @requires env.GOOGLE_CLIENT_SECRET - Google OAuth client secret (also required)
 *
 * Providers:
 *   - GoogleProvider: Enables Google OAuth authentication (enabled by default).
 *
 * Callbacks:
 *   - redirect: Always redirects to the homepage after sign-in. Customize as needed.
 *
 * Pages:
 *   - signIn: Custom sign-in page at /auth/signin.
 */
import NextAuth from 'next-auth';
// import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin', // optional
  },
  callbacks: {
    // can also pass url as a param
    async redirect({ baseUrl }) {
      // Only allow redirects within your site
      // return url.startsWith(baseUrl) ? url : baseUrl;

      // Always redirect to homepage after sign-in
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };
