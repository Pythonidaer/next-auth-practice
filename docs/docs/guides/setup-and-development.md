# Setup & Development Guide

This guide provides step-by-step instructions for setting up your PostgreSQL database (locally, on Vercel, and for production), configuring your Next.js application, installing dependencies, populating initial data, and following a recommended Git workflow for development.

---

## PostgreSQL Database Setup

You will need a PostgreSQL database instance for both development and production.

### Local Database Setup (Development)

For local development, using Docker is highly recommended as it provides a consistent and isolated environment.

**Install Docker Desktop:**
If you don't have it, download and install Docker Desktop for your operating system: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

**Create a `docker-compose.yml` file in your project root:**

```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_DB: meatbag_db # Your database name
      POSTGRES_USER: meatbag_user # Your database user
      POSTGRES_PASSWORD: meatbag_password # Your database password
    ports:
      - '5432:5432' # Host:Container port mapping
    volumes:
      - db_data:/var/lib/postgresql/data # Persist data

volumes:
  db_data:
```

Start the PostgreSQL container:

```sh
docker-compose up -d
```

This will pull the postgres:15 image (if not already present), create and start a container, and expose it on localhost:5432.

Database Connection String (for .env.local):

```env
DATABASE_URL="postgresql://meatbag_user:meatbag_password@localhost:5432/meatbag_db?schema=public"
```

### Vercel PostgreSQL Setup (Preview & Production)

Vercel offers an integrated PostgreSQL database service, ideal for seamless deployment and managed infrastructure.

**To set up a database on Vercel:**

- Go to your [Vercel Dashboard](https://vercel.com/dashboard).
- Import your Git repository (for new projects) or select your existing project.
- Navigate to the **Storage** tab in project settings.
- Click **Connect Store** → **PostgreSQL** → **Create a new PostgreSQL database**.
- Name it (e.g., `meatbag-db-prod` or `meatbag-db-staging`).
- Connect it to your Next.js project. Vercel will inject `POSTGRES_PRISMA_URL` and `DATABASE_URL` as environment variables.

**Environment Variables:**

- Vercel provides `POSTGRES_PRISMA_URL` and `DATABASE_URL` for your database.
- **Preview Deployments:** Vercel sets up separate variables for preview deployments (e.g., `POSTGRES_PRISMA_URL_PREVIEW`).
  - By default, these may point to production unless you configure otherwise.
  - For isolation, create a "Staging/Preview" database and set the preview variable accordingly.
- **Production:** The primary `POSTGRES_PRISMA_URL` is used.

> **MVP Note:**
> For early MVPs, it’s acceptable (but risky) to let preview deployments share the production DB. For real users or broader testing, always use a dedicated staging/preview database to avoid data contamination or accidental data loss.

---

## Install Dependencies

Install the following packages:

**Next.js & React Core:**

```sh
npm install react react-dom next
```

**Prisma (ORM):**

```sh
npm install prisma @prisma/client
npm install -D prisma # Prisma CLI as a dev dependency
```

**NextAuth.js (Authentication):**

```sh
npm install next-auth
```

**Tailwind CSS (optional, for styling):**

```sh
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

_Remember to configure `tailwind.config.js` and import Tailwind into `globals.css`._

**Environment Variable Management:**

- Next.js automatically loads `.env.local` and `.env.production`. Ensure your required variables are present.

Prisma handles the database driver, so you don't typically install pg directly unless doing raw SQL or specific database interactions outside of Prisma.

Initializing Prisma
After installing Prisma, initialize it in your project:

```sh
npx prisma init
```

This command will create a prisma folder with schema.prisma and a .env file. You'll then configure schema.prisma based on your database model.

3. What to Populate (Seed Data)
   Seed data is crucial for populating your development (and sometimes staging) database with initial users, workout programs, and other necessary records.

Why seed data?

Development: Quickly get your application into a usable state for testing features.

Demonstration: Showcase functionality without manually creating data.

Testing: Provide consistent data for integration or end-to-end tests.

What to populate:

Users: At least one default User account for easy login and testing.

WorkoutPrograms: A few sample programs with nested WorkoutGroups, WorkoutDays (including rest days), and Exercises. This allows you to immediately test the program viewing and management features.

WorkoutAssignments: Optionally, a few assignments to test the sharing/getting features.

How to Create a Seed Script with Prisma
Create a seed.ts (or seed.js) file: Inside your prisma directory, create a seed.ts file.

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs'; // If you're hashing passwords for local users later

const prisma = new PrismaClient();

async function main() {
  // 1. Create a test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      id: 'user_test_123', // You might use a UUID generator in real app
      name: 'Test User',
      email: 'test@example.com',
      authProvider: 'google', // Or 'credentials' if you add it
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log(`Created test user: ${testUser.name}`);

  // 2. Create a sample Workout Program for the test user
  const sampleProgram = await prisma.workoutProgram.upsert({
    where: { id: 'prog_sample_1' },
    update: {},
    create: {
      id: 'prog_sample_1',
      title: 'Full Body Blast',
      description: 'A comprehensive 2-week full-body workout program.',
      createdByUserId: testUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log(`Created sample program: ${sampleProgram.title}`);

  // 3. Create Workout Groups (e.g., Week 1, Week 2) for the program
  const week1Group = await prisma.workoutGroup.upsert({
    where: { id: 'group_week1' },
    update: {},
    create: {
      id: 'group_week1',
      programId: sampleProgram.id,
      order: 1,
      title: 'Week 1',
      createdAt: new Date(),
    },
  });
  console.log(`Created group: ${week1Group.title}`);

  // 4. Create Workout Days (7 days per group) for Week 1
  const day1 = await prisma.workoutDay.upsert({
    where: { id: 'day_week1_1' },
    update: {},
    create: {
      id: 'day_week1_1',
      groupId: week1Group.id,
      order: 1,
      isRestDay: false,
      createdAt: new Date(),
    },
  });
  console.log(`Created day: Day ${day1.order}`);

  // 5. Create Exercises for Day 1
  await prisma.exercise.upsert({
    where: { id: 'ex_day1_1' },
    update: {},
    create: {
      id: 'ex_day1_1',
      dayId: day1.id,
      name: 'Squats',
      notes: 'Focus on form, deep squat.',
      targetWarmupSets: 1,
      targetWorkingSets: 3,
      targetReps: '8-12 reps',
      order: 1,
      createdAt: new Date(),
    },
  });
  // ... continue for other days and exercises to complete 7 days for the group
  // Remember to make some days `isRestDay: true`
  console.log('Sample exercises created for Day 1');

  // Example for a rest day
  await prisma.workoutDay.upsert({
    where: { id: 'day_week1_7' },
    update: {},
    create: {
      id: 'day_week1_7',
      groupId: week1Group.id,
      order: 7,
      isRestDay: true,
      createdAt: new Date(),
    },
  });
  console.log('Created Day 7 (Rest Day)');

  // You can add more programs, groups, days, exercises, and even assign workouts here.
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Update package.json: Add a seed script to your package.json:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate",
    "db:seed": "ts-node prisma/seed.ts"
  }
}
```

(Note: You might need `npm install -D ts-node` if you use TypeScript for the seed script).

Run the seed script:

```bash
npm run db:seed
```

4. Database Setup with Data and Endpoints Working
   Here's the workflow to get your database populated and API endpoints functioning:

Define Prisma Schema (prisma/schema.prisma):
Translate your PostgreSQL database schema markdown into Prisma's schema definition language. This will define your models (tables) and their relationships.

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                       String           @id @default(cuid())
  name                     String
  email                    String           @unique
  authProvider             String // "google"
  createdAt                DateTime         @default(now())
  updatedAt                DateTime         @updatedAt
  workoutPrograms          WorkoutProgram[]
  exerciseCompletions      ExerciseCompletion[]
  workoutDayCompletions    WorkoutDayCompletion[]
  workoutGroupCompletions  WorkoutGroupCompletion[]
  sentAssignments          WorkoutAssignment[] @relation("SenderAssignments")
  receivedAssignments      WorkoutAssignment[] @relation("RecipientAssignments")
  userWorkoutStats         UserWorkoutStats[]
}

model WorkoutProgram {
  id                     String                   @id @default(cuid())
  title                  String
  description            String?
  createdByUserId        String
  createdAt              DateTime                 @default(now())
  updatedAt              DateTime                 @updatedAt
  createdBy              User                     @relation(fields: [createdByUserId], references: [id], onDelete: Cascade)
  workoutGroups          WorkoutGroup[]
  workoutAssignments     WorkoutAssignment[]
  userWorkoutStats       UserWorkoutStats[]
  exerciseCompletions    ExerciseCompletion[]
  workoutDayCompletions  WorkoutDayCompletion[]
  workoutGroupCompletions WorkoutGroupCompletion[]
}

// ... continue defining all other models (WorkoutGroup, WorkoutDay, Exercise,
// ExerciseCompletion, WorkoutDayCompletion, WorkoutGroupCompletion,
// WorkoutAssignment, UserWorkoutStats) based on your database schema.
// Pay close attention to optional fields (?), default values (@default),
// and relationships (@relation).

// Example for ExerciseCompletion:
model ExerciseCompletion {
  id              String    @id @default(cuid())
  exerciseId      String
  userId          String
  workoutDayId    String
  programId       String
  completedAt     DateTime  @default(now())
  userNotes       String?

  exercise        Exercise         @relation(fields: [exerciseId], references: [id], onDelete: Cascade)
  user            User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  workoutDay      WorkoutDay       @relation(fields: [workoutDayId], references: [id], onDelete: Cascade)
  workoutProgram  WorkoutProgram   @relation(fields: [programId], references: [id], onDelete: Cascade)

  @@unique([exerciseId, userId, workoutDayId]) // Ensure uniqueness as per DB schema
}
```

(Note: cuid() is a good default ID generator for Prisma if you don't have a specific UUID strategy.)

Generate Prisma Client:

```bash
npx prisma generate
```

This creates the Prisma Client based on your schema, allowing you to interact with your database using type-safe methods.

Run Database Migrations:

```bash
npx prisma migrate dev --name init
```

This command will:

Create a new migration file.

Apply the schema changes to your database (creating tables, columns, constraints).

--name init gives the initial migration a name. For subsequent changes, run npx prisma migrate dev again.

Seed Your Database:
After migrations, populate with initial data:

npm run db:seed

Develop API Endpoints:
Create your API routes in src/app/api/.../route.js (or .ts).

Example: src/app/api/programs/route.ts (GET and POST for programs)

```typescript
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth'; // For authentication
import { authOptions } from '../../api/auth/[...nextauth]/route'; // Adjust path as needed
import prisma from '@/lib/prisma'; // Create a centralized Prisma client instance

// Create a centralized Prisma client instance (e.g., src/lib/prisma.ts)
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// export default prisma;

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    });
  }

  try {
    const userId = session.user.id; // Assuming you extended session type to include user ID

    const programs = await prisma.workoutProgram.findMany({
      where: {
        OR: [
          { createdByUserId: userId },
          {
            workoutAssignments: {
              some: { recipientId: userId, isActive: true },
            },
          },
        ],
      },
      include: {
        workoutGroups: {
          include: {
            workoutDays: {
              include: {
                exercises: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(programs);
  } catch (error) {
    console.error('Failed to fetch programs:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    });
  }

  try {
    const { title, description, groups } = await request.json();
    const createdByUserId = session.user.id;

    const newProgram = await prisma.workoutProgram.create({
      data: {
        title,
        description,
        createdByUserId,
        workoutGroups: {
          create: groups.map((group: any, groupIndex: number) => ({
            order: groupIndex + 1,
            title: group.title,
            workoutDays: {
              create: group.days.map((day: any, dayIndex: number) => ({
                order: dayIndex + 1,
                isRestDay: day.isRestDay,
                exercises: {
                  create: day.exercises.map(
                    (exercise: any, exerciseIndex: number) => ({
                      name: exercise.name,
                      notes: exercise.notes,
                      targetWarmupSets: exercise.targetWarmupSets,
                      targetWorkingSets: exercise.targetWorkingSets,
                      targetReps: exercise.targetReps,
                      order: exerciseIndex + 1,
                    }),
                  ),
                },
              })),
            },
          })),
        },
      },
    });

    return NextResponse.json(newProgram, { status: 201 });
  } catch (error) {
    console.error('Failed to create program:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 },
    );
  }
}
```

Test Endpoints:

Run your Next.js application locally: npm run dev

Use tools like Postman, Insomnia, or your browser's developer tools to make requests to http://localhost:3000/api/... and verify responses.

5. How to Update Code Files and Project Repo (Git Workflow)
   A standard Git workflow will help manage your project effectively.

Branching Strategy:

main (or master): This branch should always reflect the production-ready code. No direct commits to main.

develop: All new features and bug fixes are integrated into this branch first.

Feature Branches: For every new feature, improvement, or significant bug fix, create a new branch off develop.

**Branch Naming Convention:**

Use these patterns for your branch names:

```text
feature/<feature-name>
bugfix/<bug-description>
chore/<task-description>
```

Example: ```sh
git checkout -b feature/program-creation

````


Development Cycle:

Pull develop: git checkout develop && git pull origin develop

Create Feature Branch: ```sh
git checkout -b feature/your-new-feature
````

Code & Commit: Write code, commit frequently with clear, concise messages.

git add .

```sh
git commit -m "feat: implement program creation form"
```

**Push Feature Branch:**

```sh
git push origin feature/your-new-feature
```

**Open Pull Request (PR):**
Open a PR from `feature/your-new-feature` to `develop`.

**Code Review:**
Get your code reviewed by peers.

**Merge to develop:**
Once reviewed and approved, merge your PR into `develop`.

**Deployment to Preview:**
Changes merged to `develop` (if your Vercel project is configured for it) will trigger a preview deployment.

**Deployment to Production:**
When `develop` is stable and ready for a release, create a PR from `develop` to `main`.
Once this PR is reviewed and merged, Vercel will automatically trigger a production deployment from the `main` branch.

---

## 6. Suggested Branch Order / Plan Guide (MVP Roadmap)

This plan prioritizes core functionality and a logical flow for building your MVP, following a module-by-module approach. Each point implies creating the necessary frontend pages/components, API routes, and Prisma schema updates.

### Foundational Setup (One-time, on `develop` or a setup branch):

- **Initial Project Setup:** Basic Next.js app.
- **Install All Dependencies:** next, react, prisma, next-auth, tailwindcss.
- **Configure Tailwind CSS.**
- **Set up `.env.local` and `.env.production`** with necessary variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).
- **Initialize Prisma:**
  ```sh
  npx prisma init
  ```
  Define the full `schema.prisma` based on your Database Model document.
- **Run initial migration:**
  ```sh
  npx prisma migrate dev --name init
  ```
- **Create `prisma/seed.ts`** with basic user and a dummy program, group, day, and exercise.
- **Run seed script:**
  ```sh
  npm run db:seed
  ```

### Module 1: Authentication & Basic User Flow (`feature/auth-setup`)

- **NextAuth.js Setup:** Configure `api/auth/[...nextauth]/route.ts`.
- **Login Page:** Create `app/auth/login/page.js` with Google sign-in buttons.
- **Root Page (`/`):** Implement `useSession` to display user info or redirect to login if not authenticated. Add sign-out button.
- **Global Layout (`layout.js`):** Implement basic Navbar (with auth status) and overall app structure.
- **Test:** Login/logout, ensure session persists.

### Module 2: Workout Program Definition (Read-Only) (`feature/program-read-only`)

- **API Route:** `GET /api/programs` to fetch all accessible programs (initially, just those createdBy the user).
- **Programs Page:** Create `app/programs/page.js` to list programs.
- **Program Details Page:** Create `app/programs/[programId]/page.js` to display program details, including nested groups, days, and exercises (read-only for now).

### Module 3: Workout Program Creation (`feature/program-creation`)

- **API Route:** `POST /api/programs` to create a new program.
- **Create Program Page:** Create `app/programs/create/page.js` with a form to define a new WorkoutProgram, including dynamically adding WorkoutGroups, WorkoutDays (7 per group), and Exercises. This will be the most complex form.
- **Test:** Create a new program, verify it appears in the list.

### Module 4: Workout Execution (Today's Workout & Completion) (`feature/workout-today`)

- **API Route:** `GET /api/workout/today` to fetch the current user's active workout day.
- **Today's Workout Page:** Create `app/workout/today/page.js` to display the exercises for the current day.
- **Exercise Completion:**
  - **API Route:** `POST /api/workout/complete-exercise`.
  - Implement "Complete" button on ExerciseCard to call this API.
  - Implement logic to mark exercises as complete in UI.
  - Implement logic to automatically complete day/group/program.
- **Test:** Mark exercises complete, verify day/group completion.

### Module 5: Program Editing & Deletion (`feature/program-editing`)

- **API Routes:** `PUT /api/programs/[programId]` and `DELETE /api/programs/[programId]`.
- **Program Editing:** Enhance `app/programs/[programId]/page.js` to allow editing program details, adding/removing groups/days/exercises, and reordering.
- **Test:** Modify a program, delete a program.

### Module 6: Collaboration & Sharing (MVP) (`feature/sharing-mvp`)

- **API Route:** `GET /api/users` (to fetch users for sharing).
- **API Route:** `POST /api/share/program`.
- **Share Page:** Create `app/share/page.js` to allow users to select a program and choose recipients.
- **API Route:** `GET /api/assignments/incoming`.
- **Get Programs Page:** Create `app/get/page.js` to list programs assigned to the user.
- **Test:** Share a program, verify it appears for the recipient.

### Module 7: Workout History (Read-Only) (`feature/workout-history`)

- **API Route:** `GET /api/workout/history`.
- **History Page:** Create `app/workout/history/page.js` to list completed workout days.
- **API Route:** `GET /api/workout/history/[workoutDayCompletionId]`.
- **Detailed History Page:** Create `app/workout/history/[workoutDayCompletionId]/page.js` to show details of a past workout day.

### Module 8: User Account & Settings (`feature/account-settings`)

- **API Route:** `PUT /api/users/[userId]`.
- **Account Page:** Create `app/account/page.js` with a form to update user details.

### Module 9: Basic Stats View (`feature/basic-stats`)

- **API Route:** `GET /api/stats/user/[userId]/program/[programId]` (or a more general stats endpoint).
- **Stats Page:** Create `app/stats/page.js` to display the `completedDayCount` and `lastCompletedAt` for the user's current program.

---

This plan provides a logical progression from core functionality to more advanced features, ensuring you have a working MVP that can be iteratively improved. Remember to test thoroughly at each stage!

```sh
docker-compose up -d
```

This will pull the `postgres:15` image (if not already present), create and start a container, and expose it on `localhost:5432`.

- **Database Connection String (for `.env.local`):**

```
DATABASE_URL="postgresql://meatbag_user:meatbag_password@localhost:5432/meatbag_db?schema=public"
```

### 1.2. Vercel PostgreSQL Setup (Preview & Production)

Vercel offers an integrated PostgreSQL database service, which is ideal for seamless deployment and managed infrastructure.

- **Connect a New Project or Existing Project:**

  - Go to your [Vercel Dashboard](https://vercel.com/dashboard).
  - If you're creating a new project, follow the steps to import your Git repository.
  - For an existing project, select it.

- **Navigate to "Storage" Tab:** In your project settings, find the "Storage" tab on the left sidebar.

- **Create a New PostgreSQL Database:**

  - Click "Connect Store" and choose "PostgreSQL".
  - Select "Create a new PostgreSQL database".
  - Give it a name (e.g., `meatbag-db-prod` or `meatbag-db-staging`).

- **Connect to your Next.js Project:**

  - After creation, Vercel will prompt you to connect it to your Next.js project.
  - This will automatically inject the `POSTGRES_PRISMA_URL` (or similar) and `DATABASE_URL` environment variables into your Vercel project settings.

- **Environment Variables:**
  - Vercel provides the `POSTGRES_PRISMA_URL` and `DATABASE_URL` for your specific database.
  - **Preview Deployments:** Vercel automatically sets up separate environment variables for preview deployments (e.g., `POSTGRES_PRISMA_URL_PREVIEW`).
    - By default, these might point to your production database unless configured otherwise.
    - For isolation in previews, consider creating a separate "Staging/Preview" database and configuring the preview environment variable accordingly.
  - **Production:** The primary `POSTGRES_PRISMA_URL` will be used.

### 1.3. "Preview" URL for Auth/DB

For MVP, it's generally fine for preview URLs to share the same database as production if that's easier to set up, but with a strong caveat:

- **Pros:** Simpler setup, direct testing of production data interactions.
- **Cons:**
  - Data contamination: Preview deployments might write test or incomplete data to your production database.
  - Security risk: Bugs could damage production data.
  - State management: Harder to test features that rely on a clean database state.

**Recommendation:** For an MVP, sharing is acceptable if only you are testing. For broader testing, always use a dedicated staging/preview database.

---

## 2. What to Install (Dependencies)

**Next.js & React Core:**

```sh
npm install react react-dom next
```

**Prisma (ORM):**

```sh
npm install prisma @prisma/client
npm install -D prisma # Prisma CLI as a dev dependency
```

**NextAuth.js (Authentication):**

```sh
npm install next-auth
```

**Tailwind CSS (optional, for styling):**

```sh
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

(Remember to configure `tailwind.config.js` and import Tailwind into `globals.css`)

**Environment Variable Management:**

- Next.js handles `.env.local`, `.env.production` automatically. Ensure you have the required variables.

---

## 3. Initializing Prisma

After installing Prisma, initialize it in your project:

```sh
npx prisma init
```

This creates a `prisma` folder with `schema.prisma` and a `.env` file. Configure `schema.prisma` based on your database model.

---

## 4. What to Populate (Seed Data)

Seed data is crucial for development, demonstration, and testing. Populate with:

- Users: At least one default user account.
- WorkoutPrograms: A few sample programs with nested groups, days, and exercises.
- WorkoutAssignments: Optionally, a few assignments for sharing/testing features.

**How to Create a Seed Script with Prisma:**

- Create `prisma/seed.ts` (or `seed.js`) and add sample data (see example in the full guide).
- Update `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate",
    "db:seed": "ts-node prisma/seed.ts"
  }
}
```

- Run the seed script:

```sh
npm run db:seed
```

---

## 5. Database Setup with Data and Endpoints Working

- **Define Prisma Schema:** Translate your PostgreSQL schema into `prisma/schema.prisma`.
- **Generate Prisma Client:**

```sh
npx prisma generate
```

- **Run Database Migrations:**

```sh
npx prisma migrate dev --name init
```

- **Seed Your Database:**

```sh
npm run db:seed
```

- **Develop API Endpoints:** Create API routes in `src/app/api/.../route.js` (or `.ts`).

---

## 6. Git Workflow & Branching Strategy

- **main:** Always production-ready code. No direct commits.
- **develop:** Integrate new features and bug fixes here first.
- **Feature Branches:** For every new feature, improvement, or bug fix, create a branch off `develop`.
  - Naming: `feature/<feature-name>`, `bugfix/<desc>`, `chore/<desc>`
- **Development Cycle:**
  - Pull `develop`: `git checkout develop && git pull origin develop`
  - Create feature branch: `git checkout -b feature/your-feature`
  - Code & commit: `git add .` / `git commit -m "feat: ..."`
  - Push: `git push origin feature/your-feature`
  - Open PR to `develop`, review, merge
  - Deploy preview (Vercel auto-deploys from `develop`)
  - Merge to `main` for production deployment

---

## 7. Suggested MVP Build Order

1. Initial Project Setup (Next.js, dependencies, Tailwind, Prisma, NextAuth, .env)
2. Authentication & Basic User Flow
3. Workout Program Definition (Read-Only)
4. Workout Program Creation
5. Workout Execution (Today's Workout & Completion)
6. Program Editing & Deletion
7. Collaboration & Sharing (MVP)
8. Workout History (Read-Only)
9. User Account & Settings
10. Basic Stats View

Each module involves updating the frontend, backend (API), and Prisma schema as needed.

---

**For full details, see the inline code comments and the database model/schema documentation.**
