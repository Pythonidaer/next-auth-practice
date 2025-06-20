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

| Decision             | Reason                                                      |
| -------------------- | ----------------------------------------------------------- |
| **Next.js**          | Handles routing, SSR, and fullstack needs                   |
| **React**            | Component reusability, ecosystem, DX                        |
| **NextAuth.js**      | Built-in Google auth + future credential/magic-link support |
| **PostgreSQL**       | Relational DB for structured user/workout data              |
| **Prisma (planned)** | ORM to interface with PostgreSQL                            |
| **Vercel**           | Seamless hosting, CI/CD, and team collaboration             |
| **Docusaurus**       | Lightweight documentation site with good DX                 |
| **Jest**             | Compatible with Next.js for unit testing                    |
| **Monorepo**         | Keeps app and documentation in one Git project              |

---

## 4. Logical Components

| Component           | Description                                         |
| ------------------- | --------------------------------------------------- |
| `pages/`            | App routes (dashboard, login, etc.)                 |
| `components/`       | Reusable UI components (Button, SplashScreen, etc.) |
| `hooks/`            | Custom React hooks (e.g. `useHydrated`)             |
| `context/`          | Global state (e.g. authentication, workout plans)   |
| `api/`              | Next.js API routes for handling server logic        |
| `models/` (planned) | Prisma schema for `User`, `Workout`, etc.           |
| `utils/`            | Pure helper functions                               |
| `tests/`            | Unit tests with Jest                                |
| `docs/`             | Docusaurus-powered documentation                    |
| `public/`           | Static assets (images, favicon, etc.)               |
| `styles/`           | CSS modules or global styles                        |

---

## 🧩 Future Considerations

- Document user flows with visual diagrams (C4 Model)
- Consider extracting backend into a separate service as scale grows
- Add jsdoc comments for API documentation
- Update Architecture Overview to reflect API and database usage
- Add TypeScript for better DX and API documentation via Typedoc

---

_Last updated: 2025-06-20_
