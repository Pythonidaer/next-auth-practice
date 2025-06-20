# ADR 0004: Use PostgreSQL as the Primary Database

## Status

Accepted

## Context

The Meatbag app requires a structured, reliable database to store:

- User profiles and authentication data
- Workout plans and scheduled exercises
- Daily progress, completion states, and shared workouts
- Potential future integrations with teams, messaging, or analytics

We considered a few options:

- **MongoDB** – flexible and fast for unstructured data
- **SQLite** – fast to prototype, but lacks cloud-scale production support
- **PostgreSQL** – relational, strongly typed, scalable, well-supported by Prisma and NextAuth

We expect the data to be highly relational (e.g., Users → WorkoutPlans → Exercises), and to evolve with business rules, such as scheduling logic, constraints, or joins.

## Decision

We selected **PostgreSQL** as the primary relational database for the Meatbag app.

Reasons include:

- Excellent support for relational data modeling
- Native support with **Prisma** and **NextAuth** adapters
- Well-supported in Vercel-compatible cloud services (e.g. Supabase, Neon, Railway)
- Open source, mature, and scalable for future business needs
- Supports ACID guarantees and transactional integrity

## Consequences

- We will write our Prisma schema with a **PostgreSQL provider**
- Our deployment strategy must include **a cloud-hosted Postgres service**
- Prisma migrations will become the standard for schema evolution
- In production, we must manage connection pooling and long-lived connections carefully (especially on serverless)

## Trade-offs

- Requires more upfront schema design compared to document stores
- Slightly more overhead when modeling unstructured or deeply nested data
- Local development may require a running Postgres instance or Docker setup

---

_Created: 2025-06-20_
