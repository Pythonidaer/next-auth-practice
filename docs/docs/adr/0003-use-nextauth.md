# ADR 0003: Use NextAuth.js for Authentication

## Status

Accepted

## Context

The Meatbag app requires a secure and flexible authentication solution. The goal is to:

- Allow users to sign in with third-party providers (e.g. Google)
- Support future authentication methods like credentials or magic-link login
- Seamlessly integrate with our database to associate users with custom workout data
- Minimize time spent maintaining authentication flows

Since the app uses the Next.js App Router, we require a solution that is:

- Fully compatible with `app/` and React Server Components (RSC)
- Works within Vercel’s serverless model
- Easy to extend with custom database logic

## Decision

We chose **[NextAuth.js](https://next-auth.js.org/)** as the authentication framework for Meatbag.

Benefits include:

- First-class integration with **Next.js App Router**
- Support for **OAuth providers** (e.g. Google, GitHub)
- Future extensibility with **Credentials Provider** and **magic-link** auth
- Built-in support for **JWT sessions**, **database sessions**, and **callbacks**
- Developer-friendly configuration using `auth.ts` or `auth.js`

## Consequences

- We'll manage auth state using the `useSession()` hook or RSC helpers like `getServerSession`
- NextAuth will act as the bridge between frontend sessions and database user models
- We'll eventually configure an **adapter** (e.g. Prisma Adapter) to persist sessions and users in PostgreSQL
- Auth-related routes and callbacks will be defined inside the `/app/api/auth/` route segment

## Trade-offs

- Customizing the NextAuth session flow (e.g. role-based auth or onboarding logic) may require detailed callback functions
- Magic-link and credentials-based login will require extra configuration and security precautions
- Tight coupling with Next.js makes portability harder if the app ever leaves this ecosystem (low risk)

---

_Created: 2025-06-20_
