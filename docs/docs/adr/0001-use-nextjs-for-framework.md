# ADR 0001: Use Next.js for the Application Framework

## Status

Accepted

## Context

We need to choose a frontend framework to build the Meatbag MVP. The requirements include:

- Built-in routing based on files
- Server-side rendering (SSR) for fast initial load and SEO
- Client-side interactivity using React
- Fullstack capabilities (API routes and server logic co-located with frontend)
- Active ecosystem with good developer experience (DX)

Next.js is a mature, well-supported framework that satisfies these needs and is widely used for production React apps.

## Decision

We will use **Next.js** as the application framework for Meatbag.

This allows us to:

- Use file-based routing via the **Next.js `/app` directory** (App Router)
- Leverage both SSR and CSR where appropriate
- Add backend logic via API routes inside the same repo
- Maintain a single deployment target on Vercel

## Consequences

- We gain an integrated build and routing pipeline with fullstack support
- We will use the **App Router** (`/app` directory) as the primary routing and layout mechanism
- Testing will require tools compatible with Next.js (e.g., Jest + React Testing Library)
- Devs should follow Next.js conventions, especially around Server and Client Components, to reduce friction

---

_Created: 2025-06-20_
