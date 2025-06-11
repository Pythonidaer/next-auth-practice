# Meatbag

Working on NextAuth in this iteration.

---

## Linting & Formatting

### Run ESLint

- Lint your codebase:
  ```sh
  npx eslint .
  ```
- Print your ESLint config:
  ```sh
  npx eslint --print-config .eslintrc.mjs
  ```
- [Next.js ESLint Docs](https://nextjs.org/docs/app/api-reference/config/eslint)

- Add the ESLint extension to your editor to see squigglies for the rules in .eslintrc.mjs

### Run Prettier

- Format your entire codebase:
  ```sh
  npx prettier --write .
  ```
- (Optional) For explicit file types, consider this future script in `package.json`:
  ```json
  "format": "prettier --write \"**/*.{js,jsx,ts,tsx,mjs,cjs,json,css,md}\""
  ```
- Add the Prettier extension to your editor for best experience.

---

## Pre-Commit Hooks (Husky & lint-staged)

This project uses **Husky** and **lint-staged** to automatically lint and format your code before each commit.

### How it works

- On every `git commit`, Husky runs lint-staged, which:
  - Lints and auto-formats staged JS/TS files with ESLint and Prettier
  - Formats staged JSON, CSS, and Markdown files with Prettier
- If any lint or format errors are found, the commit is blocked until they are fixed.

### Setup (already configured)

- Husky and lint-staged are installed as devDependencies.
- Husky is initialized in your repo (see `prepare` script in `package.json`).
- The `.husky/pre-commit` file runs `npx lint-staged`.
- The `lint-staged` config is in `package.json`.

### Usage

- Just stage your changes and commit as usual:
  ```sh
  git add <file>
  git commit -m "your message"
  ```
- If there are any lint/format errors, the commit will fail with an explanation.
- Fix the errors, re-stage, and try again.

---

## Testing

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## Cyclomatic Complexity

- For more info, try tools like "Cognitive Complexity Reducer GPT".
- **General formula:**
  ```
  M = E - N + 2P
  ```
  - **M** = Cyclomatic Complexity
  - **E** = Number of edges
  - **N** = Number of nodes
  - **P** = Number of connected components (usually 1 per function)
- **Simple rule of thumb:**
  ```
  Cyclomatic Complexity = Number of decision points + 1
  ```

---

## ClientLayout Splash Screen & Hydration Logic

This section documents the logic and rationale behind the splash screen and hydration strategy implemented in `ClientLayout.jsx`.

### Splash Screen Display Logic

- The splash screen is always shown for a fixed duration (`splashDuration`, e.g., 3000ms) on every page load.
- The presence of a `sessionStorage` token (`splashShown`) is used only to prevent the token from being set more than once per session, **not** to skip the splash screen.
- The splash screen will always be visible for the specified duration, regardless of whether the session token is present.
- The session token is set after the splash is shown for the first time in a session, but does not affect the splash display on subsequent loads within the session.

### Hydration Strategy

- The component uses a custom `useHydrated` hook to determine if the app has been hydrated on the client.
- On the server (SSR), the splash screen is always rendered to avoid hydration mismatches.
- Once hydration is complete, the splash logic and transition to the main content are handled on the client.

### TO DO:

- Tie splash screen to auth state
- Reconsider which pages should show splash screen
  - This also ties into user journey and restricted entry points
