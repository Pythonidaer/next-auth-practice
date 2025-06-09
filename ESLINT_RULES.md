# ESLint Rules Reference

## 1. Rules Already Set
Below are some key rules currently active in your ESLint config:

* **no-console**: error (disallows all console statements)
* **import/no-anonymous-default-export**: warn (warns on anonymous default exports)
* **react/display-name**: error
* **react/jsx-key**: error
* **react/jsx-no-duplicate-props**: error
* **react/no-find-dom-node**: error
* **react-hooks/rules-of-hooks**: error
* **react-hooks/exhaustive-deps**: warn
* **jsx-a11y/alt-text**: warn
* **jsx-a11y/aria-props**: warn
* **@next/next/no-img-element**: warn
* ...and many more from Next.js, React, accessibility, and import plugins.

**Severity legend:**
* `2` = "error"
* `1` = "warn"
* `0` = "off"

---

## 2. How to Check a Rule
* Search for your desired rule in the `rules` section of your ESLint config.
  * If it’s there, you can change its severity or options, but don’t add it again.
  * If it’s not there, you can safely add it.

**Examples:**
* Want to add `"semi": ["error", "always"]`? Not present above, so you can add it.
* Want to add `"no-console": "warn"`? Already present as "error"—you'd be overriding the existing setting.

---

## 3. Common Rules Not Present (Safe to Add)
These rules are not present and are safe to add:
* `semi` (require semicolons)
* `quotes` (single/double quote style)
* `indent` (spaces/tabs)
* `comma-dangle`
* `eqeqeq`
* `curly`
* `no-var`
* `prefer-const`
* `object-curly-spacing`
* `arrow-body-style`
* `no-unused-vars` (the plain version, not the TypeScript one)

If you want to add any of these, specify your preferences (e.g., semicolons required or not, single/double quotes, etc.) and the config lines can be provided.

---

## 4. Plugin Rules
You currently have rules from these plugins:
* `react`
* `react-hooks`
* `@next/next`
* `import`
* `jsx-a11y`

Want to add rules from other plugins (like Prettier, TypeScript, etc.)? Just ask!

---

## TL;DR
* Search for your desired rule in the `rules` section.
* If it’s there, adjust its value if needed.
* If it’s not, you can safely add it.
* Tell me which rules or code style you want, and I’ll check for you and generate the config!