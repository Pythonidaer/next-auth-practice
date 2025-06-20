# ADR 0015: No Storybook for MVP

## Status

Rejected (for now)

## Context

[Storybook](https://storybook.js.org/) is a popular tool for developing and documenting UI components in isolation. It allows for visual testing, component previews, and shared design feedback — which is especially helpful in large, design-heavy, or collaborative projects.

We considered adopting Storybook to:

- Build and visualize React components in isolation
- Improve component testing and documentation
- Provide a component explorer for designers or non-dev collaborators

## Decision

We decided **not to use Storybook at this stage** of the project.

### Rationale:

- ⚡ **Speed of delivery is a priority** — the MVP has tight deadlines and requires focus on core features
- 🧠 **Learning curve and setup overhead** — Storybook requires initial configuration, Webpack/Vite adaptation, and style integration
- 📦 **Perceived overkill** — our component set is currently small and closely tied to app context (e.g. routing, session state)
- 🔍 **Not a priority for client or end-user goals** — the client is more focused on usability and business outcomes than on UI documentation

## Consequences

- Component testing and iteration will happen in the live app context
- No visual component explorer or isolated rendering for now
- Component documentation will live in Docusaurus (guides or reference docs) instead of a dynamic UI system

## Future Considerations

- Re-evaluate Storybook **post-MVP**, when:
  - The component set grows in complexity
  - More engineers or designers join the team
  - We need to share or test UI components independently
- Alternatively, explore lightweight visual testing via tools like:
  - Chromatic (for hosted Storybook CI)
  - Playwright snapshot testing
- Integrate `docs/reference/components.md` to document props and usage manually for now

---

_Created: 2025-06-20_
