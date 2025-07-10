# Architecture Overview

This document outlines the architecture of the Meatbag fitness application MVP.

---

## 1. Architectural Style

- **Monolithic web app** using [Next.js](https://nextjs.org/)
- **Client–Server** architecture with hybrid rendering (SSR + CSR)
- **Component-based** UI (React)
- **Data-driven** interaction model (PostgreSQL backend)
- Built as a **fullstack app** deployed on [Vercel](https://vercel.com/)

---

## 2. Architectural Characteristics

| Characteristic             | Rationale                                                      |
| -------------------------- | -------------------------------------------------------------- |
| **Simplicity & Usability** | UX must feel focused and help users answer "What should I do?" |
| **Performance**            | Mobile-first experience, minimal delays                        |
| **Modifiability**          | MVP will evolve; need flexibility in adding features           |
| **Deployability**          | Using Vercel for fast, CI-enabled deploys                      |
| **Security**               | NextAuth for user authentication; user data is private         |
| **Timeliness**             | Workout programs are sequential and time-based                 |
| **Effectiveness**          | UX needs to help users stay on track with fitness plans        |
| **Learnability**           | App must feel intuitive even without a tutorial                |
| **Testability**            | Unit tests (Jest) in place, but not critical to MVP launch     |

---

## 3. Architectural Decisions

| Decision/Tool            | Reason / Notes                                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------------- |
| **Next.js**              | App framework: routing, SSR, App Router, React Server Components, API routes, fullstack capabilities    |
| **React**                | UI library: component model, hooks, ecosystem, supports Server/Client Components                        |
| **NextAuth.js**          | Auth: Google OAuth, future credential/magic-link, Prisma adapter, RSC compatible                        |
| **PostgreSQL**           | Relational DB: structured user/workout data, supported by Prisma/NextAuth, scalable, open source        |
| **Prisma**               | ORM: schema-first, type-safe queries, migrations, Next.js/NextAuth integration, essential for MVP       |
| **Vercel**               | Hosting/CI/CD: zero-config, monorepo-aware, preview deployments, GitHub integration                     |
| **Docusaurus**           | Docs: Markdown-based, sidebar nav, versioning, easy DX, monorepo deploy, future Typedoc integration     |
| **Jest**                 | Unit testing: Next.js/React compatible, co-located tests, React Testing Library, 85%+ aspirational cov. |
| **ESLint + Prettier**    | Linting/Formatting: JS/React code quality, Prettier for style, Husky/lint-staged for pre-commit         |
| **Stylelint (planned)**  | CSS linting: global and module CSS, planned for CI/CD and commit checks                                 |
| **Monorepo**             | Structure: app and docs in one repo, unified tooling, easier refactoring, future Nx/Turborepo possible  |
| **Storybook (deferred)** | UI docs: not used for MVP—manual docs in Docusaurus, revisit post-MVP                                   |
| **Windsurf (future)**    | Workflow automation: rule-based code consistency, naming, auto-tasks, proposed for post-MVP             |
| **TypeScript (future)**  | Type safety: planned incremental adoption post-MVP, Typedoc for API docs, improves maintainability      |

---

## 4. Logical Components

| Component     | Description                                          |
| ------------- | ---------------------------------------------------- |
| `app/`        | Next.js App Router (pages, layouts, routes)          |
| `components/` | Reusable UI components with co-located tests and CSS |
| `hooks/`      | Custom React hooks (e.g. `useHydrated`)              |
| `context/`    | Global state (e.g. authentication, workout plans)    |
| `app/api/`    | Next.js API routes for handling server logic         |
| `prisma/`     | Prisma schema for database models and migrations     |
| `utils/`      | Pure helper functions                                |
| `docs/`       | Docusaurus-powered documentation                     |
| `public/`     | Static assets (images, favicon, etc.)                |

---

## 🧩 Future Considerations

- Document user flows with visual diagrams (C4 Model)
- Consider extracting backend into a separate service as scale grows
- Update Architecture Overview to reflect API and database usage
- Add TypeScript for better DX and API documentation via Typedoc

---

_Last updated: 2025-07-10_
