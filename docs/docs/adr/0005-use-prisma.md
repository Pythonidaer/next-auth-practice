# ADR 0005: Use Prisma as the ORM for Database Access

## Status

Planned

## Context

The Meatbag app will use **PostgreSQL** as its primary database, and we need a way to:

- Define structured database schemas
- Run migrations safely in development and production
- Access database records with type-safe queries
- Integrate easily with Next.js and NextAuth
- Scale with app complexity while maintaining readability

Alternatives considered:

- **Raw SQL** — powerful but verbose and error-prone
- **Knex.js** — lower-level query builder; less type-safe
- **TypeORM** or **Sequelize** — outdated DX and complex edge cases
- **Prisma** — modern, fully typed, schema-first ORM with great DX

## Decision

We will use **[Prisma](https://www.prisma.io/)** as the Object-Relational Mapper (ORM) for interfacing with PostgreSQL.

Benefits:

- **Schema-first modeling** using `schema.prisma`
- Auto-generated **fully typed client** for queries/mutations
- Built-in **migrations**, seeding, and validation tools
- Native support for **NextAuth adapters**
- Strong **developer experience**, including VSCode integration and Dev UI
- Works well in monorepos and serverless environments

## Consequences

- Database schema will be defined in a `prisma/schema.prisma` file
- We'll manage database changes through **Prisma Migrate**
- Prisma will be used in both API routes and server components
- Integration with NextAuth will require a Prisma Adapter
- Prisma Client will be generated at build/dev time

## Trade-offs

- Requires a build step (`prisma generate`) to create client
- Schema modeling uses its own DSL (not SQL directly)
- Extra care needed with connection management in serverless (e.g. avoid multiple Prisma clients)

---

_Created: 2025-06-20_
