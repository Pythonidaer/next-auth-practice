# Setup & Development Guide

This guide provides step-by-step instructions for setting up your PostgreSQL database (locally, on Vercel, and for production), configuring your Next.js application, installing dependencies, populating initial data, and following a recommended Git workflow for development.

---

## 1. PostgreSQL Database Setup

You will need a PostgreSQL database instance for both development and production.

### 1.1. Local Database Setup (Development)

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

### 1.2. Vercel PostgreSQL Setup (Preview & Production)

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

## 2. Install Dependencies

When cloning this project locally, you'll need to install all the dependencies from the package.json file:

```sh
npm install
```

This will install all required packages, including:

- **Next.js & React Core:** The foundation of the application
- **Prisma:** For database ORM functionality
- **NextAuth.js:** For authentication with Google OAuth
- **Docusaurus:** For documentation
- **Other dependencies** defined in package.json

**Additional Development Tools:**

```sh
npm install -D husky
```

Husky is needed if you want to use the pre-commit hooks feature for code quality checks.

**Environment Variables:**

Create both `.env` and `.env.local` files in the project root with the following variables:

```
# Database connection
DATABASE_URL="postgresql://meatbag_user:meatbag_password@localhost:5432/meatbag_db?schema=public"

# NextAuth configuration
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

> **Note:** Both `.env` and `.env.local` files are needed as some packages only read from `.env` while Next.js primarily uses `.env.local`.

## 3. Initialize Prisma

After installing dependencies, initialize Prisma in your project if it's not already set up:

```sh
npx prisma init
```

This command will create a prisma folder with schema.prisma and a .env file. You'll then configure schema.prisma based on your database model.

## 4. Populate Seed Data

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
Create a seed.js file: Inside your prisma directory, create a seed.js file.

```javascript
// prisma/seed.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // 1. Create a test user (NextAuth will create most user fields)
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'test@example.com',
      image: 'https://via.placeholder.com/150',
      emailVerified: new Date(),
    },
  });
  console.log(`Created test user: ${testUser.name}`);

  // 1.1 Create Account record for the test user (required for NextAuth)
  // This simulates a Google OAuth account connection
  await prisma.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: 'google',
        providerAccountId: '123456789',
      },
    },
    update: {},
    create: {
      userId: testUser.id,
      type: 'oauth',
      provider: 'google',
      providerAccountId: '123456789',
      access_token: 'mock-access-token',
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'Bearer',
      scope: 'openid profile email',
      id_token: 'mock-id-token',
    },
  });
  console.log('Created test user account (Google OAuth)');

  // 1.2 Create Session for the test user (optional, but realistic)
  await prisma.session.upsert({
    where: { sessionToken: 'mock-session-token' },
    update: {},
    create: {
      userId: testUser.id,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      sessionToken: 'mock-session-token',
    },
  });
  console.log('Created test user session');

  // 2. Create a sample Workout Program for the test user
  const sampleProgram = await prisma.workoutProgram.upsert({
    where: { id: 'prog_sample_1' },
    update: {},
    create: {
      id: 'prog_sample_1',
      title: 'Full Body Blast',
      description: 'A comprehensive 2-week full-body workout program.',
      createdByUserId: testUser.id,
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
    },
  });
  console.log('Sample exercises created for Day 1');

  // 5.1 Add another exercise to the same day
  await prisma.exercise.upsert({
    where: { id: 'ex_day1_2' },
    update: {},
    create: {
      id: 'ex_day1_2',
      dayId: day1.id,
      name: 'Bench Press',
      notes: 'Keep shoulders back and down.',
      targetWarmupSets: 1,
      targetWorkingSets: 3,
      targetReps: '5-8 reps',
      order: 2,
    },
  });

  // 5.2 Create a rest day example
  await prisma.workoutDay.upsert({
    where: { id: 'day_week1_7' },
    update: {},
    create: {
      id: 'day_week1_7',
      groupId: week1Group.id,
      order: 7,
      isRestDay: true,
    },
  });
  console.log('Created Day 7 (Rest Day)');

  // 6. Create a workout assignment (sharing a program with another user)
  // This would typically happen after you have multiple users
  // For now, we'll just create a placeholder assignment to the same test user
  await prisma.workoutAssignment.upsert({
    where: { id: 'assignment_1' },
    update: {},
    create: {
      id: 'assignment_1',
      senderId: testUser.id,
      recipientId: testUser.id,
      programId: sampleProgram.id,
      isActive: true,
    },
  });
  console.log('Created sample workout assignment');
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
    "db:seed": "node prisma/seed.js"
  }
}
```

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

**Test Endpoints:**

Run your Next.js application locally:

```sh
npm run dev
```

Use tools like Postman, Insomnia, or your browser's developer tools to make requests to http://localhost:3000/api/... and verify responses.

## 5. Git Workflow for Development

A standard Git workflow will help manage your project effectively.

**Branching Strategy:**

- **main:** This branch should always reflect the production-ready code. No direct commits to main.
- **Feature Branches:** For every new feature, improvement, or significant bug fix, create a branch off main.

**Branch Naming Convention:**

Use these patterns for your branch names:

```text
feature/<feature-name>
bugfix/<bug-description>
chore/<task-description>
```

Example:

```sh
git checkout -b feature/program-creation
```

**Development Cycle:**

1. **Pull main:**

```sh
git checkout main && git pull origin main
```

2. **Create Feature Branch:**

```sh
git checkout -b feature/your-new-feature
```

3. **Code & Commit:** Write code, commit frequently with clear, concise messages.

```sh
git add .
git commit -m "feat: implement program creation form"
```

4. **Push Feature Branch:**

```sh
git push origin feature/your-new-feature
```

5. **Open Pull Request (PR):**
   Open a PR from `feature/your-new-feature` to `main`.

6. **Review the Preview:**
   Vercel automatically creates a preview deployment for your PR. Test it thoroughly.

7. **Code Review:**
   Get your code reviewed by peers.

8. **Merge to main:**
   Once reviewed and approved, merge your PR into `main`.

9. **Production Deployment:**
   Vercel automatically deploys the updated `main` branch to production.

---

## 6. Suggested MVP Build Order

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

<!-- Removed duplicate content -->

<!-- Removed duplicate content -->

<!-- Removed duplicate content -->

---

## 7. Local Environment Setup Guide

This section provides instructions for setting up the development environment on a new computer.

### 7.1. Prerequisites

**Install Required Software:**

- **Node.js & npm:** Download and install from [nodejs.org](https://nodejs.org/) (LTS version recommended)
- **Git:** Download and install from [git-scm.com](https://git-scm.com/downloads)
- **Docker Desktop:** Download and install from [docker.com](https://www.docker.com/products/docker-desktop/)
- **DBeaver:** Download and install from [dbeaver.io](https://dbeaver.io/) (optional, for database management)
- **VS Code:** Download and install from [code.visualstudio.com](https://code.visualstudio.com/) (recommended IDE)

### 7.2. Clone the Repository

```sh
git clone https://github.com/your-username/meatbag.git
cd meatbag
```

### 7.3. Environment Setup

**Create Environment Files:**

Create both `.env` and `.env.local` files in the project root:

```env
# Database connection
DATABASE_URL="postgresql://meatbag_user:meatbag_password@localhost:5432/meatbag_db?schema=public"

# NextAuth configuration
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

**Generate a NextAuth Secret:**

You can generate a secure random string for `NEXTAUTH_SECRET` using:

```sh
node -e "console.log(crypto.randomBytes(32).toString('hex'))"
```

**Set Up Google OAuth Credentials:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application", add a name
6. Add authorized JavaScript origins: `http://localhost:3000`
7. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
8. Copy the Client ID and Client Secret to your `.env` and `.env.local` files

### 7.4. Database Setup

**Start PostgreSQL with Docker:**

```sh
docker-compose up -d
```

This will start the PostgreSQL container using the configuration in your `docker-compose.yml` file.

**Connect with DBeaver (Optional):**

1. Open DBeaver
2. Click "New Database Connection"
3. Select PostgreSQL
4. Enter connection details:
   - Host: localhost
   - Port: 5432
   - Database: meatbag_db
   - Username: meatbag_user
   - Password: meatbag_password
5. Test the connection and save

### 7.5. Project Setup

**Install Dependencies:**

```sh
npm install
```

**Initialize Prisma:**

```sh
npx prisma generate
npx prisma migrate dev
```

**Seed the Database:**

```sh
npm run db:seed
```

**Start the Development Server:**

```sh
npm run dev
```

Your application should now be running at [http://localhost:3000](http://localhost:3000).

---

<!-- End of document -->

**For full details, see the inline code comments and the database model/schema documentation.**
