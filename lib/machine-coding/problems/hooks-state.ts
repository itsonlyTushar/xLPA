import { MCProblem } from "../types";

export const hooksStateProblems: MCProblem[] = [
  {
    id: "mc-45",
    chapterId: 6,
    title: "useDebounce Hook",
    difficulty: "medium",
    description:
      "Implement a custom useDebounce hook that delays updating a value until a specified delay has passed since the last change. Use it to build a search input that only triggers after the user stops typing.",
    requirements: [
      "Create a useDebounce(value, delay) custom hook",
      "The debounced value should update only after the delay",
      "Clearing the input should also debounce",
      "Show both the raw input and the debounced value",
    ],
    starterCode: `const { useState, useEffect } = React;

function useDebounce(value, delay) {
  // Implement the hook
  return value;
}

function App() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>Debounced Search</h2>
      <input
        data-testid="search-input"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Type to search..."
        style={{
          width: "100%", padding: "10px 14px", borderRadius: 8,
          border: "1px solid #333", background: "#1a1a2e", color: "#fff",
          fontSize: 14, outline: "none"
        }}
      />
      <div style={{ marginTop: 16 }}>
        <p style={{ fontSize: 13, color: "#888" }}>
          Raw: <span data-testid="raw-value" style={{ color: "#fff" }}>{search}</span>
        </p>
        <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
          Debounced: <span data-testid="debounced-value" style={{ color: "#4ade80" }}>{debouncedSearch}</span>
        </p>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const input = document.querySelector('[data-testid="search-input"]');
console.assert(input !== null, 'Test 1: Search input rendered');

const rawVal = document.querySelector('[data-testid="raw-value"]');
const debVal = document.querySelector('[data-testid="debounced-value"]');
console.assert(rawVal !== null, 'Test 2: Raw value display exists');
console.assert(debVal !== null, 'Test 3: Debounced value display exists');
console.assert(debVal.textContent === '', 'Test 4: Initial debounced value is empty');`,
    tags: ["custom-hooks", "debounce", "useEffect", "setTimeout"],
    order: 1,
    timeEstimate: "15-20 min",
    hints: [
      "Use useState to hold the debounced value inside the hook",
      "Use useEffect with a setTimeout that updates the debounced value after the delay",
      "Return a cleanup function from useEffect that clears the timeout",
    ],
    keyInsight:
      "useDebounce is one of the most common custom hooks in production. The key pattern: useEffect sets a timeout to update state, and the cleanup function clears it — so rapid changes keep resetting the timer.",
    solution: `const { useState, useEffect } = React;

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function App() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>Debounced Search</h2>
      <input
        data-testid="search-input"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Type to search..."
        style={{
          width: "100%", padding: "10px 14px", borderRadius: 8,
          border: "1px solid #333", background: "#1a1a2e", color: "#fff",
          fontSize: 14, outline: "none"
        }}
      />
      <div style={{ marginTop: 16 }}>
        <p style={{ fontSize: 13, color: "#888" }}>
          Raw: <span data-testid="raw-value" style={{ color: "#fff" }}>{search}</span>
        </p>
        <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
          Debounced: <span data-testid="debounced-value" style={{ color: "#4ade80" }}>{debouncedSearch}</span>
        </p>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-46",
    chapterId: 6,
    title: "useLocalStorage Hook",
    difficulty: "easy",
    description:
      "Build a custom useLocalStorage hook that syncs state with localStorage. The hook should work like useState but persist the value across page reloads.",
    requirements: [
      "Create useLocalStorage(key, initialValue) hook",
      "Read initial value from localStorage if it exists",
      "Write to localStorage on every state change",
      "Handle JSON serialization/deserialization",
    ],
    starterCode: `const { useState, useEffect } = React;

function useLocalStorage(key, initialValue) {
  // Implement the hook
  return [initialValue, () => {}];
}

function App() {
  const [name, setName] = useLocalStorage("user-name", "");
  const [theme, setTheme] = useLocalStorage("user-theme", "dark");

  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>Persistent Settings</h2>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 13, color: "#888", display: "block", marginBottom: 4 }}>Name</label>
        <input
          data-testid="name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          style={{
            width: "100%", padding: "10px 14px", borderRadius: 8,
            border: "1px solid #333", background: "#1a1a2e", color: "#fff", fontSize: 14, outline: "none"
          }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 13, color: "#888", display: "block", marginBottom: 4 }}>Theme</label>
        <div style={{ display: "flex", gap: 8 }}>
          {["dark", "light", "system"].map((t) => (
            <button
              key={t}
              data-testid={"theme-" + t}
              onClick={() => setTheme(t)}
              style={{
                padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                border: theme === t ? "1px solid #6366f1" : "1px solid #333",
                background: theme === t ? "#6366f1" + "22" : "#1a1a2e",
                color: theme === t ? "#818cf8" : "#888",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <p data-testid="display" style={{ fontSize: 13, color: "#888", marginTop: 16 }}>
        Stored: name=<span style={{ color: "#fff" }}>{name}</span>, theme=<span style={{ color: "#fff" }}>{theme}</span>
      </p>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const nameInput = document.querySelector('[data-testid="name-input"]');
console.assert(nameInput !== null, 'Test 1: Name input rendered');

const themeButtons = document.querySelectorAll('[data-testid^="theme-"]');
console.assert(themeButtons.length === 3, 'Test 2: Three theme buttons rendered');

const display = document.querySelector('[data-testid="display"]');
console.assert(display !== null, 'Test 3: Display area exists');
console.assert(display.textContent.includes('theme=dark'), 'Test 4: Default theme is dark');`,
    tags: ["custom-hooks", "localStorage", "persistence", "useState"],
    order: 2,
    timeEstimate: "15-20 min",
    hints: [
      "Initialize state with a function that reads from localStorage first",
      "Use useEffect to write to localStorage whenever the value changes",
      "Wrap localStorage reads/writes in try-catch for safety",
    ],
    keyInsight:
      "useLocalStorage replaces useState with a persisted version. The lazy initializer pattern (passing a function to useState) ensures localStorage is only read once on mount, not on every render.",
    solution: `const { useState, useEffect } = React;

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Ignore write errors
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

function App() {
  const [name, setName] = useLocalStorage("user-name", "");
  const [theme, setTheme] = useLocalStorage("user-theme", "dark");

  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>Persistent Settings</h2>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 13, color: "#888", display: "block", marginBottom: 4 }}>Name</label>
        <input
          data-testid="name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          style={{
            width: "100%", padding: "10px 14px", borderRadius: 8,
            border: "1px solid #333", background: "#1a1a2e", color: "#fff", fontSize: 14, outline: "none"
          }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 13, color: "#888", display: "block", marginBottom: 4 }}>Theme</label>
        <div style={{ display: "flex", gap: 8 }}>
          {["dark", "light", "system"].map((t) => (
            <button
              key={t}
              data-testid={"theme-" + t}
              onClick={() => setTheme(t)}
              style={{
                padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                border: theme === t ? "1px solid #6366f1" : "1px solid #333",
                background: theme === t ? "#6366f1" + "22" : "#1a1a2e",
                color: theme === t ? "#818cf8" : "#888",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <p data-testid="display" style={{ fontSize: 13, color: "#888", marginTop: 16 }}>
        Stored: name=<span style={{ color: "#fff" }}>{name}</span>, theme=<span style={{ color: "#fff" }}>{theme}</span>
      </p>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-47",
    chapterId: 6,
    title: "usePrevious Hook",
    difficulty: "easy",
    description:
      "Create a usePrevious hook that returns the previous value of a variable. Build a counter that shows both the current and previous count values.",
    requirements: [
      "Create usePrevious(value) that returns the previous value",
      "Should return undefined on initial render",
      "Must update after every render (using useRef + useEffect)",
      "Display both current and previous values",
    ],
    starterCode: `const { useState, useRef, useEffect } = React;

function usePrevious(value) {
  // Implement the hook
  return undefined;
}

function App() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>Counter with History</h2>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <button
          data-testid="decrement"
          onClick={() => setCount((c) => c - 1)}
          style={{
            padding: "10px 20px", borderRadius: 8, border: "1px solid #333",
            background: "#1a1a2e", color: "#fff", cursor: "pointer", fontSize: 18
          }}
        >
          −
        </button>
        <div data-testid="current" style={{ fontSize: 32, fontWeight: 700, minWidth: 60, textAlign: "center" }}>
          {count}
        </div>
        <button
          data-testid="increment"
          onClick={() => setCount((c) => c + 1)}
          style={{
            padding: "10px 20px", borderRadius: 8, border: "1px solid #333",
            background: "#1a1a2e", color: "#fff", cursor: "pointer", fontSize: 18
          }}
        >
          +
        </button>
      </div>
      <p data-testid="previous" style={{ fontSize: 14, color: "#888" }}>
        Previous value: <span style={{ color: "#f59e0b" }}>{prevCount !== undefined ? prevCount : "—"}</span>
      </p>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const current = document.querySelector('[data-testid="current"]');
console.assert(current && current.textContent === '0', 'Test 1: Initial count is 0');

const previous = document.querySelector('[data-testid="previous"]');
console.assert(previous && previous.textContent.includes('—'), 'Test 2: Previous is undefined initially');

const incBtn = document.querySelector('[data-testid="increment"]');
console.assert(incBtn !== null, 'Test 3: Increment button exists');

const decBtn = document.querySelector('[data-testid="decrement"]');
console.assert(decBtn !== null, 'Test 4: Decrement button exists');`,
    tags: ["custom-hooks", "useRef", "useEffect", "previous-state"],
    order: 3,
    timeEstimate: "10-15 min",
    hints: [
      "Use useRef to store the previous value — refs persist across renders without causing re-renders",
      "Use useEffect to update the ref AFTER the render completes",
      "The ref holds the 'stale' value during render, then is updated by useEffect",
    ],
    keyInsight:
      "usePrevious exploits the timing of useRef + useEffect: during render, the ref still holds the old value. After render, useEffect updates it. This 'one render behind' pattern is the entire trick.",
    solution: `const { useState, useRef, useEffect } = React;

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function App() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>Counter with History</h2>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <button
          data-testid="decrement"
          onClick={() => setCount((c) => c - 1)}
          style={{
            padding: "10px 20px", borderRadius: 8, border: "1px solid #333",
            background: "#1a1a2e", color: "#fff", cursor: "pointer", fontSize: 18
          }}
        >
          −
        </button>
        <div data-testid="current" style={{ fontSize: 32, fontWeight: 700, minWidth: 60, textAlign: "center" }}>
          {count}
        </div>
        <button
          data-testid="increment"
          onClick={() => setCount((c) => c + 1)}
          style={{
            padding: "10px 20px", borderRadius: 8, border: "1px solid #333",
            background: "#1a1a2e", color: "#fff", cursor: "pointer", fontSize: 18
          }}
        >
          +
        </button>
      </div>
      <p data-testid="previous" style={{ fontSize: 14, color: "#888" }}>
        Previous value: <span style={{ color: "#f59e0b" }}>{prevCount !== undefined ? prevCount : "—"}</span>
      </p>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-48",
    chapterId: 6,
    title: "Undo/Redo with useReducer",
    difficulty: "hard",
    description:
      "Build an undo/redo system using useReducer. Implement a simple drawing pad or text editor where users can undo and redo their actions with a full history stack.",
    requirements: [
      "Use useReducer to manage state with past/present/future stacks",
      "Support undo (move present to future, pop past to present)",
      "Support redo (move present to past, pop future to present)",
      "New actions clear the future stack",
    ],
    starterCode: `const { useReducer } = React;

function undoReducer(state, action) {
  // Implement undo/redo reducer
  return state;
}

function init(initialPresent) {
  return { past: [], present: initialPresent, future: [] };
}

function App() {
  const [state, dispatch] = useReducer(undoReducer, [], init);
  const { past, present, future } = state;

  const addItem = () => {
    const item = "Item " + (past.length + present.length + 1);
    dispatch({ type: "SET", newPresent: [...present, item] });
  };

  const removeItem = (idx) => {
    dispatch({ type: "SET", newPresent: present.filter((_, i) => i !== idx) });
  };

  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>Undo/Redo List</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          data-testid="undo-btn"
          onClick={() => dispatch({ type: "UNDO" })}
          disabled={past.length === 0}
          style={{
            padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer",
            border: "1px solid #333", background: past.length ? "#1a1a2e" : "#111",
            color: past.length ? "#fff" : "#444"
          }}
        >
          ↩ Undo ({past.length})
        </button>
        <button
          data-testid="redo-btn"
          onClick={() => dispatch({ type: "REDO" })}
          disabled={future.length === 0}
          style={{
            padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer",
            border: "1px solid #333", background: future.length ? "#1a1a2e" : "#111",
            color: future.length ? "#fff" : "#444"
          }}
        >
          ↪ Redo ({future.length})
        </button>
        <button
          data-testid="add-btn"
          onClick={addItem}
          style={{
            padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer",
            border: "1px solid #6366f1", background: "#6366f1" + "22", color: "#818cf8",
            marginLeft: "auto"
          }}
        >
          + Add Item
        </button>
      </div>
      <div data-testid="item-list" style={{ minHeight: 100 }}>
        {present.length === 0 ? (
          <p style={{ color: "#555", fontSize: 13 }}>No items. Click "Add Item" to start.</p>
        ) : (
          present.map((item, i) => (
            <div
              key={i}
              data-testid="list-item"
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 12px", borderRadius: 8, border: "1px solid #333",
                marginBottom: 4, background: "#1a1a2e"
              }}
            >
              <span style={{ fontSize: 14 }}>{item}</span>
              <button
                onClick={() => removeItem(i)}
                style={{
                  background: "none", border: "none", color: "#f87171",
                  cursor: "pointer", fontSize: 16
                }}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const addBtn = document.querySelector('[data-testid="add-btn"]');
const undoBtn = document.querySelector('[data-testid="undo-btn"]');
const redoBtn = document.querySelector('[data-testid="redo-btn"]');
console.assert(addBtn !== null, 'Test 1: Add button exists');
console.assert(undoBtn !== null, 'Test 2: Undo button exists');
console.assert(redoBtn !== null, 'Test 3: Redo button exists');

const itemList = document.querySelector('[data-testid="item-list"]');
console.assert(itemList !== null, 'Test 4: Item list container exists');

// Initially no items
const items = document.querySelectorAll('[data-testid="list-item"]');
console.assert(items.length === 0, 'Test 5: No items initially');`,
    tags: ["useReducer", "undo-redo", "state-management", "immutable"],
    order: 4,
    timeEstimate: "25-30 min",
    hints: [
      "The state shape is { past: [...], present: current, future: [...] }",
      "UNDO: push present onto future, pop last from past as new present",
      "REDO: push present onto past, pop last from future as new present",
      "SET: push present onto past, set new present, clear future",
    ],
    keyInsight:
      "Undo/redo is a classic 'three-stack' pattern: past, present, future. Every new action pushes the current state to past and clears future. Undo pops from past. Redo pops from future. This is the foundation of command pattern in UIs.",
    solution: `const { useReducer } = React;

function undoReducer(state, action) {
  const { past, present, future } = state;
  switch (action.type) {
    case "UNDO": {
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, -1);
      return { past: newPast, present: previous, future: [present, ...future] };
    }
    case "REDO": {
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return { past: [...past, present], present: next, future: newFuture };
    }
    case "SET":
      return { past: [...past, present], present: action.newPresent, future: [] };
    default:
      return state;
  }
}

function init(initialPresent) {
  return { past: [], present: initialPresent, future: [] };
}

function App() {
  const [state, dispatch] = useReducer(undoReducer, [], init);
  const { past, present, future } = state;

  const addItem = () => {
    const item = "Item " + (past.length + present.length + 1);
    dispatch({ type: "SET", newPresent: [...present, item] });
  };

  const removeItem = (idx) => {
    dispatch({ type: "SET", newPresent: present.filter((_, i) => i !== idx) });
  };

  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>Undo/Redo List</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          data-testid="undo-btn"
          onClick={() => dispatch({ type: "UNDO" })}
          disabled={past.length === 0}
          style={{
            padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer",
            border: "1px solid #333", background: past.length ? "#1a1a2e" : "#111",
            color: past.length ? "#fff" : "#444"
          }}
        >
          ↩ Undo ({past.length})
        </button>
        <button
          data-testid="redo-btn"
          onClick={() => dispatch({ type: "REDO" })}
          disabled={future.length === 0}
          style={{
            padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer",
            border: "1px solid #333", background: future.length ? "#1a1a2e" : "#111",
            color: future.length ? "#fff" : "#444"
          }}
        >
          ↪ Redo ({future.length})
        </button>
        <button
          data-testid="add-btn"
          onClick={addItem}
          style={{
            padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer",
            border: "1px solid #6366f1", background: "#6366f1" + "22", color: "#818cf8",
            marginLeft: "auto"
          }}
        >
          + Add Item
        </button>
      </div>
      <div data-testid="item-list" style={{ minHeight: 100 }}>
        {present.length === 0 ? (
          <p style={{ color: "#555", fontSize: 13 }}>No items. Click "Add Item" to start.</p>
        ) : (
          present.map((item, i) => (
            <div
              key={i}
              data-testid="list-item"
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 12px", borderRadius: 8, border: "1px solid #333",
                marginBottom: 4, background: "#1a1a2e"
              }}
            >
              <span style={{ fontSize: 14 }}>{item}</span>
              <button
                onClick={() => removeItem(i)}
                style={{
                  background: "none", border: "none", color: "#f87171",
                  cursor: "pointer", fontSize: 16
                }}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-49",
    chapterId: 6,
    title: "useClickOutside Hook",
    difficulty: "medium",
    description:
      "Build a useClickOutside hook that detects clicks outside a referenced element. Use it to build a dropdown that closes when clicking outside.",
    requirements: [
      "Create useClickOutside(ref, handler) custom hook",
      "Handler fires only when clicking outside the ref element",
      "Use document event listeners with proper cleanup",
      "Build a dropdown menu that closes on outside click",
    ],
    starterCode: `const { useState, useRef, useEffect } = React;

function useClickOutside(ref, handler) {
  // Implement the hook
}

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const options = ["Profile", "Settings", "Notifications", "Help", "Logout"];

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        data-testid="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "10px 20px", borderRadius: 8, border: "1px solid #333",
          background: "#1a1a2e", color: "#fff", cursor: "pointer", fontSize: 14
        }}
      >
        Menu ▾
      </button>
      {isOpen && (
        <div
          data-testid="dropdown-menu"
          style={{
            position: "absolute", top: "100%", left: 0, marginTop: 4,
            background: "#1e1e3a", border: "1px solid #333", borderRadius: 8,
            minWidth: 180, overflow: "hidden", zIndex: 10
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              data-testid="dropdown-item"
              style={{
                display: "block", width: "100%", padding: "10px 16px",
                textAlign: "left", background: "none", border: "none",
                color: "#ccc", fontSize: 14, cursor: "pointer"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2a4a")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>Click Outside Demo</h2>
      <p style={{ marginBottom: 16, fontSize: 13, color: "#888" }}>
        Open the dropdown, then click outside to close it.
      </p>
      <Dropdown />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const trigger = document.querySelector('[data-testid="dropdown-trigger"]');
console.assert(trigger !== null, 'Test 1: Dropdown trigger rendered');

// Initially closed
let menu = document.querySelector('[data-testid="dropdown-menu"]');
console.assert(menu === null, 'Test 2: Dropdown initially closed');

// Click to open
trigger.click();
await new Promise(r => setTimeout(r, 50));
menu = document.querySelector('[data-testid="dropdown-menu"]');
console.assert(menu !== null, 'Test 3: Dropdown opens on click');

const items = document.querySelectorAll('[data-testid="dropdown-item"]');
console.assert(items.length === 5, 'Test 4: Five dropdown items rendered');`,
    tags: ["custom-hooks", "useRef", "event-listeners", "click-outside"],
    order: 5,
    timeEstimate: "15-20 min",
    hints: [
      "Add a mousedown event listener to document inside useEffect",
      "In the handler, check if ref.current exists and if the click target is outside ref.current using .contains()",
      "Return a cleanup function that removes the listener",
    ],
    keyInsight:
      "useClickOutside uses ref.current.contains(event.target) to check if the click was inside or outside. Using mousedown (not click) avoids edge cases with drag-selecting. Always clean up document listeners.",
    solution: `const { useState, useRef, useEffect } = React;

function useClickOutside(ref, handler) {
  useEffect(() => {
    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, handler]);
}

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const options = ["Profile", "Settings", "Notifications", "Help", "Logout"];

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        data-testid="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "10px 20px", borderRadius: 8, border: "1px solid #333",
          background: "#1a1a2e", color: "#fff", cursor: "pointer", fontSize: 14
        }}
      >
        Menu ▾
      </button>
      {isOpen && (
        <div
          data-testid="dropdown-menu"
          style={{
            position: "absolute", top: "100%", left: 0, marginTop: 4,
            background: "#1e1e3a", border: "1px solid #333", borderRadius: 8,
            minWidth: 180, overflow: "hidden", zIndex: 10
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              data-testid="dropdown-item"
              style={{
                display: "block", width: "100%", padding: "10px 16px",
                textAlign: "left", background: "none", border: "none",
                color: "#ccc", fontSize: 14, cursor: "pointer"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2a4a")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>Click Outside Demo</h2>
      <p style={{ marginBottom: 16, fontSize: 13, color: "#888" }}>
        Open the dropdown, then click outside to close it.
      </p>
      <Dropdown />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-50",
    chapterId: 6,
    title: "useFetch Hook",
    difficulty: "medium",
    description:
      "Create a useFetch hook that handles data fetching with loading, error, and data states. Simulate API calls and build a user profile card that uses the hook.",
    requirements: [
      "Create useFetch(url) that returns { data, loading, error }",
      "Show loading state while fetching",
      "Handle errors gracefully",
      "Support refetch functionality",
    ],
    starterCode: `const { useState, useEffect, useCallback } = React;

// Simulated API (no real fetch needed)
function fakeFetch(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url.includes("error")) {
        reject(new Error("Failed to fetch data"));
      } else {
        resolve({
          name: "Jane Smith",
          email: "jane@example.com",
          role: "Senior Engineer",
          avatar: "👩‍💻",
        });
      }
    }, 800);
  });
}

function useFetch(url) {
  // Implement the hook
  return { data: null, loading: false, error: null, refetch: () => {} };
}

function ProfileCard() {
  const { data, loading, error, refetch } = useFetch("/api/user");

  if (loading) {
    return (
      <div data-testid="loading" style={{ padding: 24, color: "#888" }}>
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div data-testid="error" style={{ padding: 24, color: "#f87171" }}>
        <p>Error: {error.message}</p>
        <button onClick={refetch} style={{ marginTop: 8, color: "#818cf8", background: "none", border: "none", cursor: "pointer" }}>
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div data-testid="profile-card" style={{
      padding: 24, borderRadius: 12, border: "1px solid #333",
      background: "#1a1a2e", maxWidth: 300
    }}>
      <div style={{ fontSize: 48, textAlign: "center", marginBottom: 12 }}>{data.avatar}</div>
      <h3 data-testid="profile-name" style={{ textAlign: "center", fontSize: 18, fontWeight: 600 }}>{data.name}</h3>
      <p style={{ textAlign: "center", color: "#888", fontSize: 13, marginTop: 4 }}>{data.role}</p>
      <p style={{ textAlign: "center", color: "#666", fontSize: 12, marginTop: 2 }}>{data.email}</p>
      <button
        data-testid="refetch-btn"
        onClick={refetch}
        style={{
          display: "block", width: "100%", marginTop: 16, padding: "8px",
          borderRadius: 8, border: "1px solid #333", background: "#2a2a4a",
          color: "#ccc", cursor: "pointer", fontSize: 13
        }}
      >
        Refresh
      </button>
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>User Profile</h2>
      <ProfileCard />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `// Check loading state appears first
const loading = document.querySelector('[data-testid="loading"]');
console.assert(loading !== null, 'Test 1: Loading state shown initially');

// Wait for data
await new Promise(r => setTimeout(r, 1000));

const card = document.querySelector('[data-testid="profile-card"]');
console.assert(card !== null, 'Test 2: Profile card rendered after loading');

const name = document.querySelector('[data-testid="profile-name"]');
console.assert(name && name.textContent === 'Jane Smith', 'Test 3: Profile name is correct');

const refetchBtn = document.querySelector('[data-testid="refetch-btn"]');
console.assert(refetchBtn !== null, 'Test 4: Refetch button exists');`,
    tags: ["custom-hooks", "data-fetching", "loading-state", "error-handling"],
    order: 6,
    timeEstimate: "20-25 min",
    hints: [
      "Track three pieces of state: data, loading, error",
      "Use useEffect to trigger the fetch when the URL changes",
      "Set loading=true before fetching, then set data or error",
      "Create a refetch function with useCallback that re-triggers the effect",
    ],
    keyInsight:
      "useFetch encapsulates the loading/data/error state machine that appears in almost every component that fetches data. A refetch counter or key that increments forces useEffect to re-run.",
    solution: `const { useState, useEffect, useCallback } = React;

function fakeFetch(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url.includes("error")) {
        reject(new Error("Failed to fetch data"));
      } else {
        resolve({
          name: "Jane Smith",
          email: "jane@example.com",
          role: "Senior Engineer",
          avatar: "👩‍💻",
        });
      }
    }, 800);
  });
}

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fakeFetch(url)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [url, fetchKey]);

  const refetch = useCallback(() => setFetchKey((k) => k + 1), []);

  return { data, loading, error, refetch };
}

function ProfileCard() {
  const { data, loading, error, refetch } = useFetch("/api/user");

  if (loading) {
    return (
      <div data-testid="loading" style={{ padding: 24, color: "#888" }}>
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div data-testid="error" style={{ padding: 24, color: "#f87171" }}>
        <p>Error: {error.message}</p>
        <button onClick={refetch} style={{ marginTop: 8, color: "#818cf8", background: "none", border: "none", cursor: "pointer" }}>
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div data-testid="profile-card" style={{
      padding: 24, borderRadius: 12, border: "1px solid #333",
      background: "#1a1a2e", maxWidth: 300
    }}>
      <div style={{ fontSize: 48, textAlign: "center", marginBottom: 12 }}>{data.avatar}</div>
      <h3 data-testid="profile-name" style={{ textAlign: "center", fontSize: 18, fontWeight: 600 }}>{data.name}</h3>
      <p style={{ textAlign: "center", color: "#888", fontSize: 13, marginTop: 4 }}>{data.role}</p>
      <p style={{ textAlign: "center", color: "#666", fontSize: 12, marginTop: 2 }}>{data.email}</p>
      <button
        data-testid="refetch-btn"
        onClick={refetch}
        style={{
          display: "block", width: "100%", marginTop: 16, padding: "8px",
          borderRadius: 8, border: "1px solid #333", background: "#2a2a4a",
          color: "#ccc", cursor: "pointer", fontSize: 13
        }}
      >
        Refresh
      </button>
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>User Profile</h2>
      <ProfileCard />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-51",
    chapterId: 6,
    title: "useIntersectionObserver Hook",
    difficulty: "medium",
    description:
      "Build a useIntersectionObserver hook that detects when an element enters the viewport. Use it to create a lazy-loading image gallery with fade-in animations.",
    requirements: [
      "Create useIntersectionObserver that returns [ref, isIntersecting]",
      "Support threshold and rootMargin options",
      "Clean up observer on unmount",
      "Build a gallery where images fade in when scrolled into view",
    ],
    starterCode: `const { useState, useRef, useEffect } = React;

function useIntersectionObserver(options) {
  // Implement the hook
  const ref = useRef(null);
  return [ref, false];
}

const images = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  color: ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][i % 6],
  label: "Image " + (i + 1),
}));

function LazyImage({ image }) {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      data-testid="lazy-image"
      style={{
        height: 200, borderRadius: 12, display: "flex",
        alignItems: "center", justifyContent: "center",
        background: isVisible ? image.color : "#1a1a2e",
        border: "1px solid #333",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.5s ease",
      }}
    >
      {isVisible && (
        <span style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}>
          {image.label}
        </span>
      )}
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 600 }}>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>Lazy Gallery</h2>
      <p style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>Scroll down to see images appear</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {images.map((img) => (
          <LazyImage key={img.id} image={img} />
        ))}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const lazyImages = document.querySelectorAll('[data-testid="lazy-image"]');
console.assert(lazyImages.length === 12, 'Test 1: 12 lazy images rendered');

// First few should be visible (in viewport)
await new Promise(r => setTimeout(r, 200));
const firstImage = lazyImages[0];
console.assert(firstImage !== null, 'Test 2: First image element exists');

const computedStyle = firstImage.style.opacity;
console.assert(computedStyle === '1' || computedStyle === '0', 'Test 3: Image has opacity transition style');
console.assert(lazyImages.length > 6, 'Test 4: Multiple images for scroll effect');`,
    tags: ["custom-hooks", "IntersectionObserver", "lazy-loading", "animation"],
    order: 7,
    timeEstimate: "20-25 min",
    hints: [
      "Use useRef to hold a ref for the target element",
      "Create an IntersectionObserver in useEffect that watches the ref element",
      "Update a boolean state when the entry.isIntersecting changes",
      "Disconnect the observer in the cleanup function",
    ],
    keyInsight:
      "IntersectionObserver is the modern way to detect element visibility — no scroll listeners needed. The hook pattern of returning [ref, isVisible] makes it composable: any component can become 'viewport-aware' by just calling the hook.",
    solution: `const { useState, useRef, useEffect } = React;

function useIntersectionObserver(options = {}) {
  const ref = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, { threshold: options.threshold || 0, rootMargin: options.rootMargin || "0px" });

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return [ref, isIntersecting];
}

const images = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  color: ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][i % 6],
  label: "Image " + (i + 1),
}));

function LazyImage({ image }) {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      data-testid="lazy-image"
      style={{
        height: 200, borderRadius: 12, display: "flex",
        alignItems: "center", justifyContent: "center",
        background: isVisible ? image.color : "#1a1a2e",
        border: "1px solid #333",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.5s ease",
      }}
    >
      {isVisible && (
        <span style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}>
          {image.label}
        </span>
      )}
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 600 }}>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>Lazy Gallery</h2>
      <p style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>Scroll down to see images appear</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {images.map((img) => (
          <LazyImage key={img.id} image={img} />
        ))}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-52",
    chapterId: 6,
    title: "useThrottle Hook",
    difficulty: "medium",
    description:
      "Build a useThrottle hook that limits how frequently a value updates. Use it to build a window resize tracker that updates at most once every 200ms.",
    requirements: [
      "Create useThrottle(value, interval) custom hook",
      "The throttled value should update at most once per interval",
      "Should fire immediately on first change, then throttle subsequent updates",
      "Build a resize tracker that displays throttled window dimensions",
    ],
    starterCode: `const { useState, useEffect, useRef } = React;

function useThrottle(value, interval) {
  // Implement the hook
  return value;
}

function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const throttledPos = useThrottle(mousePos, 200);
  const [moveCount, setMoveCount] = useState(0);
  const [throttledCount, setThrottledCount] = useState(0);

  useEffect(() => {
    function handleMouseMove(e) {
      setMousePos({ x: e.clientX, y: e.clientY });
      setMoveCount((c) => c + 1);
    }
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    setThrottledCount((c) => c + 1);
  }, [throttledPos]);

  return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>Throttled Mouse Tracker</h2>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
        Move your mouse around to see throttling in action
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ padding: 16, borderRadius: 8, border: "1px solid #333", background: "#1a1a2e" }}>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>RAW POSITION</div>
          <div data-testid="raw-pos" style={{ fontFamily: "monospace", fontSize: 16 }}>
            ({mousePos.x}, {mousePos.y})
          </div>
          <div data-testid="raw-count" style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
            Updates: {moveCount}
          </div>
        </div>
        <div style={{ padding: 16, borderRadius: 8, border: "1px solid #6366f1", background: "#6366f1" + "11" }}>
          <div style={{ fontSize: 11, color: "#818cf8", marginBottom: 4 }}>THROTTLED (200ms)</div>
          <div data-testid="throttled-pos" style={{ fontFamily: "monospace", fontSize: 16, color: "#818cf8" }}>
            ({throttledPos.x}, {throttledPos.y})
          </div>
          <div data-testid="throttled-count" style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
            Updates: {throttledCount}
          </div>
        </div>
      </div>
      <div
        data-testid="visual-tracker"
        style={{
          height: 200, borderRadius: 12, border: "1px solid #333",
          background: "#1a1a2e", position: "relative", overflow: "hidden"
        }}
      >
        <div style={{
          position: "absolute", width: 12, height: 12, borderRadius: "50%",
          background: "#6366f1",
          left: Math.min(throttledPos.x % 500, 488),
          top: Math.min(throttledPos.y % 200, 188),
          transition: "all 0.1s ease"
        }} />
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const rawPos = document.querySelector('[data-testid="raw-pos"]');
console.assert(rawPos !== null, 'Test 1: Raw position display exists');

const throttledPos = document.querySelector('[data-testid="throttled-pos"]');
console.assert(throttledPos !== null, 'Test 2: Throttled position display exists');

const rawCount = document.querySelector('[data-testid="raw-count"]');
console.assert(rawCount !== null, 'Test 3: Raw update count exists');

const throttledCount = document.querySelector('[data-testid="throttled-count"]');
console.assert(throttledCount !== null, 'Test 4: Throttled update count exists');

const tracker = document.querySelector('[data-testid="visual-tracker"]');
console.assert(tracker !== null, 'Test 5: Visual tracker area exists');`,
    tags: ["custom-hooks", "throttle", "useRef", "performance"],
    order: 8,
    timeEstimate: "20-25 min",
    hints: [
      "Use useRef to track the last time the throttled value was updated",
      "Use useState for the throttled value",
      "In useEffect, check if enough time has passed since the last update",
      "If not enough time has passed, set a timeout for the remaining time",
    ],
    keyInsight:
      "Throttle vs debounce: debounce waits for a pause, throttle ensures regular updates at a maximum rate. The implementation uses a ref to track the last execution time and a timeout for the trailing edge.",
    solution: `const { useState, useEffect, useRef } = React;

function useThrottle(value, interval) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef(Date.now());
  const timeoutRef = useRef(null);

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastUpdated.current;

    if (elapsed >= interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval - elapsed);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, interval]);

  return throttledValue;
}

function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const throttledPos = useThrottle(mousePos, 200);
  const [moveCount, setMoveCount] = useState(0);
  const [throttledCount, setThrottledCount] = useState(0);

  useEffect(() => {
    function handleMouseMove(e) {
      setMousePos({ x: e.clientX, y: e.clientY });
      setMoveCount((c) => c + 1);
    }
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    setThrottledCount((c) => c + 1);
  }, [throttledPos]);

  return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>Throttled Mouse Tracker</h2>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
        Move your mouse around to see throttling in action
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ padding: 16, borderRadius: 8, border: "1px solid #333", background: "#1a1a2e" }}>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>RAW POSITION</div>
          <div data-testid="raw-pos" style={{ fontFamily: "monospace", fontSize: 16 }}>
            ({mousePos.x}, {mousePos.y})
          </div>
          <div data-testid="raw-count" style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
            Updates: {moveCount}
          </div>
        </div>
        <div style={{ padding: 16, borderRadius: 8, border: "1px solid #6366f1", background: "#6366f1" + "11" }}>
          <div style={{ fontSize: 11, color: "#818cf8", marginBottom: 4 }}>THROTTLED (200ms)</div>
          <div data-testid="throttled-pos" style={{ fontFamily: "monospace", fontSize: 16, color: "#818cf8" }}>
            ({throttledPos.x}, {throttledPos.y})
          </div>
          <div data-testid="throttled-count" style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
            Updates: {throttledCount}
          </div>
        </div>
      </div>
      <div
        data-testid="visual-tracker"
        style={{
          height: 200, borderRadius: 12, border: "1px solid #333",
          background: "#1a1a2e", position: "relative", overflow: "hidden"
        }}
      >
        <div style={{
          position: "absolute", width: 12, height: 12, borderRadius: "50%",
          background: "#6366f1",
          left: Math.min(throttledPos.x % 500, 488),
          top: Math.min(throttledPos.y % 200, 188),
          transition: "all 0.1s ease"
        }} />
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
];
