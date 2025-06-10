# Meatbag

Working on NextAuth in this iteration.

---

To DO: Create Splash Flow with Auth Sess

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
