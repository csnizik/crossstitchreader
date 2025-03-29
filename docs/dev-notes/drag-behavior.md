# Choosing Between `onDragMove` and `onDragEnd` in Konva + React

When using draggable nodes in `react-konva`, you have two key events for updating component state or triggering behavior: `onDragMove` and `onDragEnd`. This guide helps decide when to use each in the context of building interactive canvas tools such as floating toolbars, overlays, or grid elements.

---

## `onDragMove`

Fires **continuously** while dragging — potentially dozens of times per second.

**Best Use Cases:**

- Real-time feedback (e.g., showing alignment guides or snapping behavior)
- Temporary overlays or live interaction previews
- Custom cursor/tooltip position tied to the dragged object

**Caution:**

- **Performance-sensitive** — React state updates during drag can introduce lag
- Avoid triggering re-renders unless absolutely needed
- Prefer direct manipulation via Konva refs over `setState` when possible

```ts
// Instead of triggering re-render
nodeRef.current.x(e.target.x());
nodeRef.current.y(e.target.y());
```

---

## `onDragEnd`

Fires **once**, when dragging stops and the object is released.

**Best Use Cases:**

- Committing a change to app state (e.g., saving new position of a floating toolbar)
- Updating persisted layout
- Logging, analytics, or undo history snapshots

**Benefits:**

- Avoids excessive `setState` calls
- Keeps React state as the single source of truth
- Better performance for most React-managed components

---

### Decision Cheat Sheet

| Scenario                                 | Use          |
|------------------------------------------|---------------|
| Show object movement **in real-time**    | `onDragMove`  |
| Save position after movement finishes    | `onDragEnd`   |
| Update app state or trigger re-renders   | `onDragEnd`   |
| Snap or constrain movement dynamically   | `onDragMove`  |
| Animate or visually guide drag           | `onDragMove`  |
| Avoid extra renders                      | Prefer `onDragEnd` |

---

### Project Recommendations

**Floating UI components (e.g., toolbar, key panel):**

- Use `onDragEnd` to commit position into state
- Optionally use `onDragMove` for local-only feedback (e.g., snap previews)

**Interactive overlays or stitch handles (future):**

- Use `onDragMove` only if real-time feedback is critical
- Sync final position using `onDragEnd`

---

**Note:** `react-konva` handles internal canvas redraws asynchronously and efficiently. As long as your `setState` logic is clean and batched, `onDragEnd` is safe for most state-syncing tasks.
