# ADR 0006: Use Vercel as the Deployment Platform

## Status

Accepted

## Context

We needed to choose a platform to deploy the Meatbag app and its supporting documentation. Key goals include:

- **Fast iteration cycles** with preview environments
- **Zero-config Next.js support**
- Seamless integration with GitHub and CI/CD
- Low ops overhead — no server provisioning or Docker setup
- Monorepo support for deploying both the app and the documentation (`/docs`)

Alternatives considered:

- **Hostinger** — low-cost, general-purpose web hosting with easy WordPress and static site deployment. Not well-suited for modern Next.js or Docusaurus monorepo deployments, lacks first-class SSR and CI/CD support, and limited developer workflow integration.
- **Netlify** — strong Jamstack support, weaker native Next.js SSR support
- **Render / Railway** — good flexibility, more backend-focused
- **AWS / GCP** — more control, but too complex for this stage
- **Vercel** — first-party Next.js platform with the least friction

## Decision

We chose **[Vercel](https://vercel.com/)** to deploy both the main Meatbag application and the Docusaurus-powered documentation.

Benefits:

- First-class support for **Next.js**, including App Router and RSC
- **Instant preview deployments** on pull requests
- Built-in CI/CD with GitHub integration
- Free tier suitable for MVP and internal testing
- Monorepo-aware: separate build targets for `/` (app) and `/docs` (docs site)
- Serverless-friendly: zero server configuration required

## Consequences

- Our default deployment strategy will rely on Vercel’s CI pipeline
- Both the **main app** and the **docs site** will be deployed as separate Vercel projects from the same repo
- Environment variables must be managed via Vercel’s dashboard or `vercel env`
- We’ll use Vercel’s built-in analytics and performance tools (optionally)

## Trade-offs

- Some limitations on long-lived server connections (e.g. WebSockets)
- Vendor lock-in if switching later
- Limited backend control — ideal for MVP, but might need to externalize DB or auth services as the app grows

---

_Created: 2025-06-20_
