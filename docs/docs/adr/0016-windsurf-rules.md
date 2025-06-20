# ADR 0016: Plan to Evaluate Windsurf Rules

## Status

Proposed

## Context

As the Meatbag project grows, maintaining consistent code structure, naming conventions, and workflows is increasingly important. Tools like **Windsurf** offer rule-based automation to enforce patterns, speed up repetitive tasks, and align implementation with best practices.

Windsurf rules could help:

- Enforce component naming and folder structure (e.g. `/Button/Button.jsx` + `Button.module.css`)
- Ensure prop name consistency (e.g. camelCase)
- Auto-create test or doc files for new components/hooks
- Nudge or enforce design system constraints
- Reduce manual context-switching

## Decision

We are **planning to evaluate Windsurf rules** to:

- Speed up dev workflows with rule-based file generation/structure
- Improve consistency/readability
- Avoid common mistakes early
- Reduce mental overhead for repetitive tasks

### Why Now?

- Entering a consolidation phase post-MVP
- Rules are easier to implement now than later
- Already using other automation tools (ESLint, Prettier, Husky, etc.)

## Consequences

- No immediate code changes — this is a **forward-looking proposal**
- Once integrated, devs may need to adjust to new guardrails
- Some up-front rule customization/testing required
- May reveal opportunities for more tooling standardization

## Future Considerations

- Build Windsurf rules incrementally based on observed dev patterns
- Prioritize developer experience (DX) — rules should be helpful, not rigid
- Revisit this ADR after pilot implementation for follow-up decision

---

_Created: 2025-06-20_
