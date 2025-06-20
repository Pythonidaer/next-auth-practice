# Architectural Requirements

This is a living document with the architectural requirements of Meatbag’s workout planning and tracking web application.

For more information, check out the [Project Spec](./project-spec.md).

---

## Business Goals

| Stakeholder            | Goal                                                          | Context                                                                                                            |
| ---------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Client                 | Allow users to share workout plans in a simple, intuitive way | The client wants collaboration between users to be easy — people should be able to guide or receive plans fluidly. |
| Developer              | Ship features comfortably without breaking things             | The developer needs architecture that enables safe iteration, testing, and quick deployment.                       |
| User (Gymgoer Persona) | Know “What should I do today?” when opening the app           | The app should make it obvious what workout is scheduled for today, reducing mental overhead.                      |

---

## Constraints

| Constraint                                                              | Context                                                                                                     |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [Technical] Must be deployed to Vercel                                  | The Developer is using Vercel to deploy the frontend and backend of the monolithic Next.js app.             |
| [Technical] Must work with PostgreSQL                                   | Postgres is the planned primary data store, and will be accessed through Prisma.                            |
| [Technical] No email system or multi-user auth beyond OAuth (for now)   | The MVP will rely on Google sign-in via NextAuth.js; additional auth methods may be added later.            |
| [Business] Project must remain simple and focused on core workout flows | Complexity (e.g., real-time sync, chat, push notifications) is out of scope for MVP.                        |
| [Time] MVP is under active development                                  | The documentation and architecture must support incremental feature rollout and onboarding of contributors. |

---

## Quality Attributes

| Quality Attribute | Scenario                                                                                                    | Priority |
| ----------------- | ----------------------------------------------------------------------------------------------------------- | -------- |
| Usability         | A user can open the app and immediately understand what workout to do next.                                 | High     |
| Simplicity        | The app should maintain minimal UI clutter to help users focus on workouts, not navigation.                 | High     |
| Performance       | The dashboard and pages should load in under 1 second on 4G or broadband connections.                       | High     |
| Modifiability     | Developer should be able to add or update features (e.g., exercise logging, plan sharing) with confidence.  | High     |
| Deployability     | Code should be committed and automatically deployed to Vercel in less than 10 minutes.                      | Medium   |
| Learnability      | The Docusaurus docs should support new contributors in setting up locally and understanding code structure. | Medium   |
| Timeliness        | Users should progress through workout days sequentially, with completion state persisting reliably.         | Medium   |
| Effectiveness     | UX and dashboard should encourage consistency and clearly display fitness progress.                         | Medium   |
| Security          | Users must authenticate securely via NextAuth; workout data must be scoped and private to their account.    | Medium   |
| Testability       | Unit tests (via Jest) should run before commit and prevent regressions in key logic.                        | Low      |
| Real-time Sync    | Not required for MVP, but architecture should support future polling, SWR, or pub/sub later.                | Low      |

---

## Influential Functional Requirements

- **Users can create, edit, and assign workout plans to other users**  
  The core of the collaborative fitness experience and a primary feature of the app’s value proposition.

- **Workout plans are composed of nested structures: Plan → Group (7 days) → Day → Exercises**  
  This hierarchy directly impacts data modeling, form rendering, and navigation logic.

- **Exercises can be tracked, completed, and logged with detailed information (sets, reps, weights, notes)**  
  Requires a flexible schema and UX patterns that support partial completion, saving, and inline editing.

- **Users can navigate workouts through gestures (e.g., swiping) and view one exercise at a time**  
  Drives decisions around mobile-first design, accessibility, and focus modes in the UI.

- **Users can view and track their historical workout logs and completion state via a dashboard**  
  Impacts database indexing and design for efficient querying and UI components for charting progress.

- **Workout plan sharing must support sending and receiving between users with clear ownership and attribution**  
  Introduces user relationships, shared ownership patterns, and considerations for version control.

- **The app must clearly communicate what the user should do next (e.g., current day in a plan)**  
  Requires both UI/UX design clarity and business logic to determine default user state.

- **Plans and workouts must support reordering and previews before assignment**  
  Affects drag-and-drop implementation, temporary state handling, and saving consistent ordering.

---

## Other Influencers

- The app is a monorepo hosted on GitHub, containing the Next.js app and documentation (Docusaurus).
- The current stack includes Next.js (App Router, RSC), NextAuth.js, PostgreSQL, Prisma (planned), and Jest for testing.
- The Developer has more experience with Monorepos and plain CSS, and will not use Tailwind or Storybook for now.
- TypeScript is a future consideration, but the MVP is being built in JavaScript for faster iteration.
