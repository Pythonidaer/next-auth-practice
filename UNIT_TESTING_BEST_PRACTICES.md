# Unit Testing Best Practices

## Testing React Components

When testing React components with React Testing Library (RTL) and Jest:

- **Render with Relevant Props:** Use `render(<MyComponent prop1={...} />)` to mount the component, providing props to cover various scenarios (defaults, optional props).
- **Query by Role/Text:** Use RTL queries like `getByRole`, `getByText`, or `getByLabelText` to find elements. This mimics how a user interacts with the UI, avoiding implementation-specific selectors (e.g., class names).
- **Test State and Events:** Simulate user interactions (`fireEvent.click`, `userEvent.type`) to trigger state changes or event handlers, then assert the resulting UI updates or callback invocations.
- **Assert Visible Output:** Verify that the component renders the expected text or elements given its props and state, and that updates occur correctly.
- **Mock Side Effects:** Mock API calls or context dependencies to focus the test on the component's logic, not external systems.
- **Avoid Implementation Details:** Do not inspect internal component state or methods. Focus on the user-visible aspects.

**Example – Testing a component:**

```javascript
// components/Counter.js
import { useState } from 'react';

export default function Counter({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}
```

```javascript
// components/Counter.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

test('renders with initial count of 0 by default', () => {
  render(<Counter />);
  const heading = screen.getByRole('heading');
  expect(heading).toHaveTextContent('0');
});

test('renders with given initialCount prop', () => {
  render(<Counter initialCount={5} />);
  const heading = screen.getByRole('heading');
  expect(heading).toHaveTextContent('5');
});

test('increments count when button is clicked', () => {
  render(<Counter />);
  const button = screen.getByRole('button', { name: /increment/i });
  fireEvent.click(button);
  expect(screen.getByRole('heading')).toHaveTextContent('1');
});
```

---

## Testing Custom Hooks

To unit-test custom hooks, use RTL's `@testing-library/react-hooks` (or `@testing-library/react`'s `renderHook` for newer versions):

- **Use renderHook:** Utilize `renderHook(() => useMyHook(...))` to get a result object containing the hook's return values.
- **Pass Initial Props:** Provide any initial parameters to the hook within the `renderHook` function or via its options.
- **Test State and Effects:** Assert the initial hook state, then simulate actions. Wrap state updates in `act()` to ensure React processes them before assertions.
- **Avoid the DOM:** Hook tests do not involve rendering components. Instead, query `result.current` for values or functions and call them directly.
- **Mock Dependencies:** Mock any context or external services the hook uses to isolate its logic.

**Example – Testing a custom hook:**

```javascript
// hooks/useCounter.js
import { useState } from 'react';

export default function useCounter(initialCount = 0) {
  const [count, setCount] = useState(initialCount);
  const increment = () => setCount((c) => c + 1);
  const reset = () => setCount(initialCount);
  return { count, increment, reset };
}
```

```javascript
// hooks/useCounter.test.js
import { renderHook, act } from '@testing-library/react';
import useCounter from './useCounter';

test('initializes with default count 0 and increments', () => {
  const { result } = renderHook(() => useCounter());
  expect(result.current.count).toBe(0);

  act(() => {
    result.current.increment();
  });
  expect(result.current.count).toBe(1);
});

test('uses initialCount prop correctly and resets', () => {
  const { result } = renderHook(() => useCounter(10));
  expect(result.current.count).toBe(10);

  act(() => {
    result.current.increment();
  });
  expect(result.current.count).toBe(11);

  act(() => {
    result.current.reset();
  });
  expect(result.current.count).toBe(10); // back to initialCount
});
```

---

## Edge Cases and Error Handling

Thorough testing includes covering "happy paths" as well as less common scenarios:

- **Invalid Inputs:** For functions, test with unexpected values (null, empty arrays) to ensure graceful handling or error throwing.
- **Component Fallback States:** Test how components render when props are missing, empty, or trigger specific UI states (e.g., loading spinners, error messages).
- **Error Boundaries:** Verify that React error boundaries display their fallback UI when child components throw errors.
- **Asynchronous Logic:** Use async/await, RTL's `waitFor`, or Jest's fake timers to handle promises and timers. Assert that promises resolve/reject as expected and that the UI updates accordingly.
- **Performance Modes:** For hooks with effects, ensure correct updates and cleanup functions are called.

**Example – Testing error throwing in a utility:**

```javascript
// utils/parseJson.js
export function parseJSON(str) {
  if (typeof str !== 'string') {
    throw new Error('Input must be a string');
  }
  return JSON.parse(str);
}
```

```javascript
// utils/parseJson.test.js
import { parseJSON } from './parseJson';

test('parses valid JSON string', () => {
  expect(parseJSON('{"a":1}')).toEqual({ a: 1 });
});

test('throws error on non-string input', () => {
  expect(() => parseJSON(123)).toThrow('Input must be a string');
});

test('throws error on invalid JSON', () => {
  expect(() => parseJSON('{bad json')).toThrow();
});
```

---

## Checklist for Writing Thorough Tests

Use this checklist to guide your test creation and ensure comprehensive coverage:

- [ ] **Understand Behavior:** Clearly define the code's purpose, inputs, expected outputs, and side effects.
- [ ] **Cover Inputs and Outputs:** Test with typical, boundary, edge, and invalid values for functions. For components/hooks, consider varied prop values and initial states.
- [ ] **State and Props:** Verify initial rendering with given props and correct re-rendering behavior upon prop or state changes.
- [ ] **User Interactions:** Simulate user events (clicks, typing, submissions) and assert the resulting UI or state changes.
- [ ] **Async Operations:** Handle API calls or timers appropriately using async/await, waitFor, or fake timers.
- [ ] **Error Handling:** Include tests for exceptions, error displays, and graceful degradation.
- [ ] **Isolation:** Mock external dependencies (APIs, libraries) to keep tests focused and independent of network/global state.
- [ ] **Test One Behavior Per Test:** Ensure each test case has a clear, singular purpose with descriptive names.
- [ ] **High Coverage of Logic Paths:** Test not only the "happy path" but also branching logic (if/else, loops, fallback UI).
- [ ] **Regression Targets:** When a bug is found, write a test that reproduces it before fixing, preventing future regressions.

---

## What Not to Test in Unit Tests

To keep unit tests stable and focused, avoid testing the following:

- **Implementation Details:** Do not test private state, internal methods, or how a component internally uses hooks. Instead, focus on the rendered output or emitted events.
- **Third-Party Internals:** Treat external libraries as black boxes. Do not write tests that rely on their internal structure or behavior. Mock external components if necessary.
- **Integration with External Systems:** Unit tests should not make real network requests, database queries, or perform file I/O. These are better suited for integration or end-to-end tests; mock such interactions in unit tests.
- **Excessive Snapshot Testing:** While snapshots can detect unintended UI changes, they should not replace explicit, meaningful assertions. Use them sparingly for truly stable outputs.
- **CSS/Styling Details:** Avoid asserting on specific CSS class names or exact styles. Focus on functionality and content over presentation.
- **Routing and Environment (Next.js Specific):** Do not unit test Next.js framework routing or build-time functions (like `getStaticProps`). Extract their logic into pure functions and test those in isolation, as the framework integration itself is an integration concern.

---

In essence, unit tests should verify the contract of your code – its inputs, outputs, and the user-visible UI for given props – rather than delving into "how" it achieves its results under the hood.
