# ADR 0005: Use Prisma as the ORM for Database Access

## Status

Accepted

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

### Implementation Details

#### Prisma Schema

We have implemented a comprehensive Prisma schema in `prisma/schema.prisma` that models our entire database structure. The schema includes:

- **User model** - For user authentication and profile information
- **WorkoutProgram model** - For workout programs created by users
- **WorkoutGroup model** - For organizing workout days (like weeks)
- **WorkoutDay model** - For individual workout days
- **Exercise model** - For exercises within workout days
- **ExerciseCompletion model** - For tracking exercise completions
- **WorkoutDayCompletion model** - For tracking completed workout days
- **WorkoutGroupCompletion model** - For tracking completed workout groups
- **WorkoutAssignment model** - For workout program assignments between users
- **UserWorkoutStat model** - For user progress statistics

Additionally, we've included NextAuth-specific models (Account, Session, etc.) to support authentication.

#### Custom Client Path

We've configured Prisma to generate its client in a custom location for better organization:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}
```

This requires importing the PrismaClient from this custom path rather than the default `@prisma/client` package:

```javascript
// src/utils/prisma.js
import { PrismaClient } from '../generated/prisma';

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export { prisma };
```

#### NextAuth Integration

We've integrated Prisma with NextAuth using the `@auth/prisma-adapter` package, which provides seamless authentication functionality with our database:

```javascript
// src/app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '../../../../utils/prisma.js';

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // Additional configuration...
});

export { handler as GET, handler as POST };
```

This adapter automatically handles the creation and management of users, accounts, and sessions in our database.

## Consequences

- Database schema is defined in `prisma/schema.prisma` file
- We manage database changes through **Prisma Migrate**
- Prisma is used in both API routes and server components
- Integration with NextAuth is handled via the `@auth/prisma-adapter` package
- Prisma Client is generated at build/dev time to `src/generated/prisma`
- Client imports must reference the custom path rather than `@prisma/client`

## Trade-offs

- Requires a build step (`npx prisma generate`) to create client
- Schema modeling uses its own DSL (not SQL directly)
- Extra care needed with connection management in serverless (e.g. avoid multiple Prisma clients)
- Custom client path requires careful import management but improves organization

---

_Created: 2025-06-20_  
_Updated: 2025-07-10_
