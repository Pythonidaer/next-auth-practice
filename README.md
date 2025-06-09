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
