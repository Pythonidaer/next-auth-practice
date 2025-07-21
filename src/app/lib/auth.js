// src/app/lib/auth.js
import { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '../../utils/prisma';

// Define auth options for NextAuth.js v4
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin', // Your custom sign-in page
  },
  callbacks: {
    // Fix the redirect callback to properly handle the callbackUrl
    async redirect({ url, baseUrl }) {
      // If the url is relative (starts with /), prepend the baseUrl
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // If the url is already absolute and on the same site, allow it
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Otherwise, redirect to the base URL
      return baseUrl;
    },
    // lets you customize the session object returned to the client.
    async session({ session, user }) {
      // Add the user ID to both session.userId and session.user.id for compatibility
      session.userId = user.id;
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};

// Helper function to get the session on the server
export async function auth() {
  return getServerSession(authOptions);
}
