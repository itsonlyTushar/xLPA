import { MCProblem } from "../types";

export const uiComponentProblems: MCProblem[] = [
  {
    id: "mc-01",
    chapterId: 1,
    title: "Accordion Component",
    difficulty: "easy",
    description:
      "Build an accordion component that expands and collapses sections. Only one section should be open at a time. Clicking an open section closes it.",
    requirements: [ 
      "Show a +/- indicator for open/closed state",
      "Smooth visual transition between states",
    ],
    starterCode: `const { useState } = React;

const sections = [
  { title: "What is React?", content: "React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small, isolated pieces of code called components." },
  { title: "What are hooks?", content: "Hooks are functions that let you use state and other React features in functional components. useState and useEffect are the most common hooks." },
  { title: "What is JSX?", content: "JSX is a syntax extension for JavaScript that lets you write HTML-like markup inside JavaScript. It gets compiled to React.createElement calls." },
];

function Accordion({ sections }) {
  return <div>Implement Accordion</div>;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>FAQ</h2>
      <Accordion sections={sections} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const items = document.querySelectorAll('[data-testid="accordion-item"]');
console.assert(items.length === 3, 'Test 1: Three accordion items rendered');

const firstTitle = document.querySelector('[data-testid="accordion-title"]');
console.assert(firstTitle, 'Test 2: Accordion title exists');

// Initially no content visible
const visibleContent = document.querySelectorAll('[data-testid="accordion-content"]');
console.assert(visibleContent.length === 0, 'Test 3: No content visible initially');

// Click first section
firstTitle.click();
await new Promise(r => setTimeout(r, 50));
const opened = document.querySelectorAll('[data-testid="accordion-content"]');
console.assert(opened.length === 1, 'Test 4: One section opened after click');

// Click second section — first should close
const titles = document.querySelectorAll('[data-testid="accordion-title"]');
titles[1].click();
await new Promise(r => setTimeout(r, 50));
const afterSecond = document.querySelectorAll('[data-testid="accordion-content"]');
console.assert(afterSecond.length === 1, 'Test 5: Only one section open at a time');`,
    tags: ["state", "conditional-rendering", "toggle"],
    order: 1,
    timeEstimate: "15-20 min",
    hints: [
      "Use a single state variable to track the open section index (or null if none)",
      "Conditionally render content only when section index matches active index",
      "Clicking the same index should set state to null (close it)",
    ],
    keyInsight:
      "Single-open accordion is controlled by one piece of state — the active index. Toggling is: if same index, set null; else, set new index. This 'single selection' pattern appears everywhere in UIs.",
    solution: `const { useState } = React;

const sections = [
  { title: "What is React?", content: "React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small, isolated pieces of code called components." },
  { title: "What are hooks?", content: "Hooks are functions that let you use state and other React features in functional components. useState and useEffect are the most common hooks." },
  { title: "What is JSX?", content: "JSX is a syntax extension for JavaScript that lets you write HTML-like markup inside JavaScript. It gets compiled to React.createElement calls." },
];

function Accordion({ sections }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(prev => prev === index ? null : index);
  };

  return (
    <div>
      {sections.map((section, i) => (
        <div key={i} data-testid="accordion-item" style={{ borderBottom: "1px solid #333", marginBottom: 4 }}>
          <button
            data-testid="accordion-title"
            onClick={() => toggle(i)}
            style={{
              width: "100%", textAlign: "left", padding: "12px 0",
              background: "none", border: "none", color: "inherit",
              cursor: "pointer", fontSize: 16, fontWeight: 500,
              display: "flex", justifyContent: "space-between"
            }}
          >
            {section.title}
            <span>{activeIndex === i ? "−" : "+"}</span>
          </button>
          {activeIndex === i && (
            <div data-testid="accordion-content" style={{ padding: "0 0 12px", color: "#999", lineHeight: 1.5 }}>
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>FAQ</h2>
      <Accordion sections={sections} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-02",
    chapterId: 1,
    title: "Modal Dialog",
    difficulty: "easy",
    description:
      "Build a modal dialog component with an overlay backdrop. The modal can be opened, closed via a button, or dismissed by clicking the backdrop. Content is passed as children.",
    requirements: [
      "Show/hide modal via isOpen prop",
      "Render a dark semi-transparent backdrop overlay",
      "Center the modal content on screen",
      "Close button inside the modal",
      "Clicking the backdrop also closes the modal",
      "Prevent body scroll when modal is open",
    ],
    starterCode: `const { useState } = React;

function Modal({ isOpen, onClose, title, children }) {
  return isOpen ? <div>Implement Modal</div> : null;
}

function App() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: 24 }}>
      <button
        data-testid="open-btn"
        onClick={() => setOpen(true)}
        style={{ padding: "8px 16px", background: "#3b82f6", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}
      >
        Open Modal
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Confirmation">
        <p>Are you sure you want to proceed?</p>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button style={{ padding: "6px 16px", background: "#3b82f6", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>Confirm</button>
          <button onClick={() => setOpen(false)} style={{ padding: "6px 16px", background: "#333", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `// Initially no modal
let modal = document.querySelector('[data-testid="modal"]');
console.assert(!modal, 'Test 1: Modal not visible initially');

// Open modal
document.querySelector('[data-testid="open-btn"]').click();
await new Promise(r => setTimeout(r, 50));
modal = document.querySelector('[data-testid="modal"]');
console.assert(modal, 'Test 2: Modal visible after open');

const backdrop = document.querySelector('[data-testid="modal-backdrop"]');
console.assert(backdrop, 'Test 3: Backdrop exists');

// Close via close button
document.querySelector('[data-testid="modal-close"]').click();
await new Promise(r => setTimeout(r, 50));
modal = document.querySelector('[data-testid="modal"]');
console.assert(!modal, 'Test 4: Modal closed via close button');

// Open again and close via backdrop
document.querySelector('[data-testid="open-btn"]').click();
await new Promise(r => setTimeout(r, 50));
document.querySelector('[data-testid="modal-backdrop"]').click();
await new Promise(r => setTimeout(r, 50));
modal = document.querySelector('[data-testid="modal"]');
console.assert(!modal, 'Test 5: Modal closed via backdrop click');`,
    tags: ["portal", "overlay", "controlled-component"],
    order: 2,
    timeEstimate: "15-20 min",
    hints: [
      "Use conditional rendering based on isOpen",
      "The backdrop should be a fixed full-screen div behind the modal",
      "Use e.target === e.currentTarget to detect backdrop click vs content click",
    ],
    keyInsight:
      "Modals use a controlled open/close pattern. The key trick for backdrop dismiss is checking e.target === e.currentTarget so clicking inside the modal content doesn't close it.",
    solution: `const { useState } = React;

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div
      data-testid="modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50
      }}
    >
      <div data-testid="modal" style={{
        background: "#1a1a2e", borderRadius: 12, padding: 24,
        minWidth: 350, maxWidth: 500, position: "relative", border: "1px solid #333"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600 }}>{title}</h3>
          <button data-testid="modal-close" onClick={onClose}
            style={{ background: "none", border: "none", color: "#999", fontSize: 20, cursor: "pointer" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function App() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: 24 }}>
      <button data-testid="open-btn" onClick={() => setOpen(true)}
        style={{ padding: "8px 16px", background: "#3b82f6", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
        Open Modal
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Confirmation">
        <p>Are you sure you want to proceed?</p>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button style={{ padding: "6px 16px", background: "#3b82f6", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>Confirm</button>
          <button onClick={() => setOpen(false)} style={{ padding: "6px 16px", background: "#333", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-03",
    chapterId: 1,
    title: "Tabs Component",
    difficulty: "easy",
    description:
      "Build a tabs component that switches between content panels. The active tab should be visually highlighted. Only one panel is shown at a time.",
    requirements: [
      "Render tab buttons from a tabs array",
      "Highlight the active tab with a bottom border or background",
      "Show only the content of the active tab",
      "First tab is active by default",
      "Tab transitions should feel instant",
    ],
    starterCode: `const { useState } = React;

const tabData = [
  { label: "Profile", content: "Name: John Doe\\nEmail: john@example.com\\nRole: Frontend Developer" },
  { label: "Settings", content: "Theme: Dark\\nLanguage: English\\nNotifications: Enabled" },
  { label: "Activity", content: "Last login: 2 hours ago\\nProblems solved: 42\\nStreak: 7 days" },
];

function Tabs({ tabs }) {
  return <div>Implement Tabs</div>;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <Tabs tabs={tabData} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const tabBtns = document.querySelectorAll('[data-testid="tab-button"]');
console.assert(tabBtns.length === 3, 'Test 1: Three tab buttons');

const panel = document.querySelector('[data-testid="tab-panel"]');
console.assert(panel.textContent.includes("John Doe"), 'Test 2: First tab content shown by default');

// Click second tab
tabBtns[1].click();
await new Promise(r => setTimeout(r, 50));
const panel2 = document.querySelector('[data-testid="tab-panel"]');
console.assert(panel2.textContent.includes("Dark"), 'Test 3: Second tab content shown');

// Click third tab
tabBtns[2].click();
await new Promise(r => setTimeout(r, 50));
const panel3 = document.querySelector('[data-testid="tab-panel"]');
console.assert(panel3.textContent.includes("42"), 'Test 4: Third tab content shown');`,
    tags: ["tabs", "state", "conditional-rendering"],
    order: 3,
    timeEstimate: "10-15 min",
    hints: [
      "Track activeIndex in state, default to 0",
      "Map over tabs for the buttons, render only tabs[activeIndex].content for the panel",
      "Use inline styles or className to highlight the active tab button",
    ],
    keyInsight:
      "Tabs are the simplest single-selection pattern: one state variable (activeIndex) controls which panel renders. The buttons are a controlled radio-like group.",
    solution: `const { useState } = React;

const tabData = [
  { label: "Profile", content: "Name: John Doe\\nEmail: john@example.com\\nRole: Frontend Developer" },
  { label: "Settings", content: "Theme: Dark\\nLanguage: English\\nNotifications: Enabled" },
  { label: "Activity", content: "Last login: 2 hours ago\\nProblems solved: 42\\nStreak: 7 days" },
];

function Tabs({ tabs }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div style={{ display: "flex", borderBottom: "1px solid #333" }}>
        {tabs.map((tab, i) => (
          <button key={i} data-testid="tab-button" onClick={() => setActive(i)}
            style={{
              padding: "10px 20px", background: "none", border: "none",
              borderBottom: active === i ? "2px solid #3b82f6" : "2px solid transparent",
              color: active === i ? "#3b82f6" : "#999", cursor: "pointer", fontWeight: active === i ? 600 : 400
            }}>
            {tab.label}
          </button>
        ))}
      </div>
      <div data-testid="tab-panel" style={{ padding: "16px 0", whiteSpace: "pre-line", color: "#ccc" }}>
        {tabs[active].content}
      </div>
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <Tabs tabs={tabData} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-04",
    chapterId: 1,
    title: "Tooltip Component",
    difficulty: "easy",
    description:
      "Build a tooltip component that shows a floating message when hovering over a trigger element. The tooltip should appear above the trigger by default.",
    requirements: [
      "Show tooltip on mouse enter, hide on mouse leave",
      "Position tooltip above the trigger element",
      "Accept tooltip text as a prop",
      "Tooltip should have an arrow pointing to the trigger",
      "Small delay before showing (200ms)",
    ],
    starterCode: `const { useState, useRef, useCallback } = React;

function Tooltip({ text, children }) {
  return <span>{children}</span>;
}

function App() {
  return (
    <div style={{ padding: 80, display: "flex", gap: 16 }}>
      <Tooltip text="Copy to clipboard">
        <button data-testid="trigger-1" style={{ padding: "8px 16px", background: "#333", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
          Copy
        </button>
      </Tooltip>
      <Tooltip text="Save your progress">
        <button data-testid="trigger-2" style={{ padding: "8px 16px", background: "#333", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
          Save
        </button>
      </Tooltip>
      <Tooltip text="Delete this item permanently">
        <button data-testid="trigger-3" style={{ padding: "8px 16px", background: "#ef4444", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
          Delete
        </button>
      </Tooltip>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `// Initially no tooltip
let tooltip = document.querySelector('[data-testid="tooltip"]');
console.assert(!tooltip, 'Test 1: No tooltip visible initially');

// Hover first trigger
const trigger = document.querySelector('[data-testid="trigger-1"]');
trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
await new Promise(r => setTimeout(r, 300));
tooltip = document.querySelector('[data-testid="tooltip"]');
console.assert(tooltip, 'Test 2: Tooltip appears on hover');
console.assert(tooltip.textContent.includes("clipboard"), 'Test 3: Correct tooltip text');

// Mouse leave
trigger.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
await new Promise(r => setTimeout(r, 100));
tooltip = document.querySelector('[data-testid="tooltip"]');
console.assert(!tooltip, 'Test 4: Tooltip hidden on mouse leave');`,
    tags: ["hover", "positioning", "delay", "useRef"],
    order: 4,
    timeEstimate: "15-20 min",
    hints: [
      "Use onMouseEnter/onMouseLeave to toggle visibility state",
      "Use setTimeout for the delay and clear it on mouseleave",
      "Position with absolute positioning relative to a wrapper div",
    ],
    keyInsight:
      "Tooltips combine hover state with delayed show/hide. The key is clearing the timeout on mouseleave to prevent stale tooltips from appearing after the user has already moved away.",
    solution: `const { useState, useRef, useCallback } = React;

function Tooltip({ text, children }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(true), 200);
  }, []);

  const hide = useCallback(() => {
    clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  return (
    <span style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {visible && (
        <span data-testid="tooltip" style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
          transform: "translateX(-50%)", padding: "6px 12px",
          background: "#222", color: "#eee", borderRadius: 6,
          fontSize: 13, whiteSpace: "nowrap", zIndex: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
        }}>
          {text}
          <span style={{
            position: "absolute", top: "100%", left: "50%",
            transform: "translateX(-50%)", border: "5px solid transparent",
            borderTopColor: "#222"
          }} />
        </span>
      )}
    </span>
  );
}

function App() {
  return (
    <div style={{ padding: 80, display: "flex", gap: 16 }}>
      <Tooltip text="Copy to clipboard">
        <button data-testid="trigger-1" style={{ padding: "8px 16px", background: "#333", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Copy</button>
      </Tooltip>
      <Tooltip text="Save your progress">
        <button data-testid="trigger-2" style={{ padding: "8px 16px", background: "#333", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Save</button>
      </Tooltip>
      <Tooltip text="Delete this item permanently">
        <button data-testid="trigger-3" style={{ padding: "8px 16px", background: "#ef4444", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Delete</button>
      </Tooltip>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-05",
    chapterId: 1,
    title: "Toast Notification System",
    difficulty: "medium",
    description:
      "Build a toast notification system that can show multiple stacked notifications. Toasts should auto-dismiss after a timeout and support manual dismiss.",
    requirements: [
      "Add toasts with a message and type (success, error, info)",
      "Stack toasts vertically in the top-right corner",
      "Auto-dismiss after 3 seconds",
      "Manual dismiss via close button",
      "Different colors for different toast types",
      "Smooth entry animation",
    ],
    starterCode: `const { useState, useCallback, useRef, useEffect } = React;

function ToastContainer({ toasts, removeToast }) {
  return <div>Implement ToastContainer</div>;
}

function useToast() {
  // Return { toasts, addToast, removeToast }
  return { toasts: [], addToast: () => {}, removeToast: () => {} };
}

function App() {
  const { toasts, addToast, removeToast } = useToast();
  return (
    <div style={{ padding: 24, display: "flex", gap: 8 }}>
      <button data-testid="add-success" onClick={() => addToast("File saved successfully!", "success")}
        style={{ padding: "8px 16px", background: "#22c55e", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
        Success Toast
      </button>
      <button data-testid="add-error" onClick={() => addToast("Something went wrong!", "error")}
        style={{ padding: "8px 16px", background: "#ef4444", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
        Error Toast
      </button>
      <button data-testid="add-info" onClick={() => addToast("New update available", "info")}
        style={{ padding: "8px 16px", background: "#3b82f6", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
        Info Toast
      </button>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `// Initially no toasts
let toasts = document.querySelectorAll('[data-testid="toast"]');
console.assert(toasts.length === 0, 'Test 1: No toasts initially');

// Add a success toast
document.querySelector('[data-testid="add-success"]').click();
await new Promise(r => setTimeout(r, 50));
toasts = document.querySelectorAll('[data-testid="toast"]');
console.assert(toasts.length === 1, 'Test 2: One toast after click');

// Add another toast
document.querySelector('[data-testid="add-error"]').click();
await new Promise(r => setTimeout(r, 50));
toasts = document.querySelectorAll('[data-testid="toast"]');
console.assert(toasts.length === 2, 'Test 3: Two toasts stacked');

// Manual dismiss via close button
const closeBtn = document.querySelector('[data-testid="toast-close"]');
closeBtn.click();
await new Promise(r => setTimeout(r, 50));
toasts = document.querySelectorAll('[data-testid="toast"]');
console.assert(toasts.length === 1, 'Test 4: Toast dismissed manually');`,
    tags: ["custom-hook", "auto-dismiss", "list-management"],
    order: 5,
    timeEstimate: "20-25 min",
    hints: [
      "Create a custom hook that manages a toasts array in state",
      "Each toast needs a unique ID — use useRef with a counter",
      "Use useEffect inside each toast to set up auto-dismiss timeout",
    ],
    keyInsight:
      "Toast systems demonstrate the power of custom hooks for reusable state logic. The ID-based list pattern (add by appending, remove by filtering) is fundamental to dynamic list UIs.",
    solution: `const { useState, useCallback, useRef, useEffect } = React;

function Toast({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const colors = { success: "#22c55e", error: "#ef4444", info: "#3b82f6" };
  return (
    <div data-testid="toast" style={{
      background: "#1a1a2e", border: "1px solid " + colors[toast.type],
      borderLeft: "4px solid " + colors[toast.type], borderRadius: 8,
      padding: "12px 16px", display: "flex", justifyContent: "space-between",
      alignItems: "center", minWidth: 280, boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
    }}>
      <span style={{ color: "#eee", fontSize: 14 }}>{toast.message}</span>
      <button data-testid="toast-close" onClick={() => onRemove(toast.id)}
        style={{ background: "none", border: "none", color: "#999", cursor: "pointer", fontSize: 16, marginLeft: 12 }}>×</button>
    </div>
  );
}

function ToastContainer({ toasts, removeToast }) {
  return (
    <div style={{ position: "fixed", top: 16, right: 16, display: "flex", flexDirection: "column", gap: 8, zIndex: 100 }}>
      {toasts.map(t => <Toast key={t.id} toast={t} onRemove={removeToast} />)}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);
  const addToast = useCallback((message, type) => {
    setToasts(prev => [...prev, { id: ++idRef.current, message, type }]);
  }, []);
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  return { toasts, addToast, removeToast };
}

function App() {
  const { toasts, addToast, removeToast } = useToast();
  return (
    <div style={{ padding: 24, display: "flex", gap: 8 }}>
      <button data-testid="add-success" onClick={() => addToast("File saved successfully!", "success")}
        style={{ padding: "8px 16px", background: "#22c55e", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Success Toast</button>
      <button data-testid="add-error" onClick={() => addToast("Something went wrong!", "error")}
        style={{ padding: "8px 16px", background: "#ef4444", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Error Toast</button>
      <button data-testid="add-info" onClick={() => addToast("New update available", "info")}
        style={{ padding: "8px 16px", background: "#3b82f6", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Info Toast</button>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-06",
    chapterId: 1,
    title: "Dropdown Select",
    difficulty: "easy",
    description:
      "Build a custom dropdown select component. Clicking the trigger opens a list of options. Selecting an option updates the displayed value and closes the dropdown.",
    requirements: [
      "Show selected value in the trigger button",
      "Toggle dropdown open/close on trigger click",
      "Selecting an option updates the value and closes dropdown",
      "Close dropdown when clicking outside",
      "Highlight the currently selected option in the list",
    ],
    starterCode: `const { useState, useRef, useEffect } = React;

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "SolidJS" },
];

function Dropdown({ options, value, onChange, placeholder }) {
  return <div>Implement Dropdown</div>;
}

function App() {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ padding: 24 }}>
      <p style={{ marginBottom: 8, color: "#999" }}>Choose a framework:</p>
      <Dropdown options={options} value={selected} onChange={setSelected} placeholder="Select framework..." />
      {selected && <p style={{ marginTop: 16, color: "#ccc" }}>You selected: {selected}</p>}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const trigger = document.querySelector('[data-testid="dropdown-trigger"]');
console.assert(trigger, 'Test 1: Dropdown trigger exists');
console.assert(trigger.textContent.includes("Select"), 'Test 2: Placeholder shown');

// Open dropdown
trigger.click();
await new Promise(r => setTimeout(r, 50));
const items = document.querySelectorAll('[data-testid="dropdown-item"]');
console.assert(items.length === 5, 'Test 3: Five options shown');

// Select an option
items[0].click();
await new Promise(r => setTimeout(r, 50));
const updated = document.querySelector('[data-testid="dropdown-trigger"]');
console.assert(updated.textContent.includes("React"), 'Test 4: Selected value shown');

const closed = document.querySelectorAll('[data-testid="dropdown-item"]');
console.assert(closed.length === 0, 'Test 5: Dropdown closed after selection');`,
    tags: ["dropdown", "click-outside", "controlled-component"],
    order: 6,
    timeEstimate: "15-20 min",
    hints: [
      "Track isOpen state for the dropdown visibility",
      "Use a ref on the container and a document click listener to detect outside clicks",
      "Remember to clean up the event listener in useEffect",
    ],
    keyInsight:
      "The 'click outside to close' pattern is essential. Attach a document-level click listener and check if the click target is inside your component's ref. Always clean up listeners.",
    solution: `const { useState, useRef, useEffect } = React;

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "SolidJS" },
];

function Dropdown({ options, value, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} style={{ position: "relative", width: 240 }}>
      <button data-testid="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%", padding: "10px 14px", background: "#1a1a2e",
          border: "1px solid #333", borderRadius: 8, color: selected ? "#eee" : "#666",
          textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between"
        }}>
        {selected ? selected.label : placeholder}
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, width: "100%",
          background: "#1a1a2e", border: "1px solid #333", borderRadius: 8,
          overflow: "hidden", zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
        }}>
          {options.map(o => (
            <div key={o.value} data-testid="dropdown-item"
              onClick={() => { onChange(o.value); setIsOpen(false); }}
              style={{
                padding: "10px 14px", cursor: "pointer",
                background: o.value === value ? "#3b82f6" : "transparent",
                color: o.value === value ? "white" : "#ccc"
              }}
              onMouseEnter={e => { if (o.value !== value) e.currentTarget.style.background = "#2a2a3e"; }}
              onMouseLeave={e => { if (o.value !== value) e.currentTarget.style.background = "transparent"; }}>
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ padding: 24 }}>
      <p style={{ marginBottom: 8, color: "#999" }}>Choose a framework:</p>
      <Dropdown options={options} value={selected} onChange={setSelected} placeholder="Select framework..." />
      {selected && <p style={{ marginTop: 16, color: "#ccc" }}>You selected: {selected}</p>}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-07",
    chapterId: 1,
    title: "Breadcrumb Navigation",
    difficulty: "easy",
    description:
      "Build a breadcrumb component that displays a navigation trail. Each item is a clickable link except the last one which represents the current page.",
    requirements: [
      "Render breadcrumb items with separator between them",
      "All items except the last are clickable links",
      "Last item is styled as current page (not a link)",
      "Use '/' or '>' as separator",
      "Accept an onNavigate callback for link clicks",
    ],
    starterCode: `const { useState } = React;

function Breadcrumb({ items, onNavigate }) {
  return <nav>Implement Breadcrumb</nav>;
}

function App() {
  const [path, setPath] = useState([
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Electronics", href: "/products/electronics" },
    { label: "Laptops", href: "/products/electronics/laptops" },
  ]);

  const handleNavigate = (href, index) => {
    setPath(path.slice(0, index + 1));
  };

  return (
    <div style={{ padding: 24 }}>
      <Breadcrumb items={path} onNavigate={handleNavigate} />
      <div style={{ marginTop: 24, padding: 16, background: "#1a1a2e", borderRadius: 8, border: "1px solid #333" }}>
        <p style={{ color: "#999" }}>Current page: <strong style={{ color: "#eee" }}>{path[path.length - 1].label}</strong></p>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const items = document.querySelectorAll('[data-testid="breadcrumb-item"]');
console.assert(items.length === 4, 'Test 1: Four breadcrumb items');

const links = document.querySelectorAll('[data-testid="breadcrumb-link"]');
console.assert(links.length === 3, 'Test 2: Three clickable links');

const current = document.querySelector('[data-testid="breadcrumb-current"]');
console.assert(current.textContent === "Laptops", 'Test 3: Last item is current page');

// Click second item to navigate
links[1].click();
await new Promise(r => setTimeout(r, 50));
const afterNav = document.querySelectorAll('[data-testid="breadcrumb-item"]');
console.assert(afterNav.length === 2, 'Test 4: Breadcrumb truncated after navigation');`,
    tags: ["navigation", "list-rendering", "callback"],
    order: 7,
    timeEstimate: "10-15 min",
    hints: [
      "Map over items and check if each is the last one",
      "Render a separator span between items (not after the last)",
      "Use onClick with the index to notify the parent on navigation",
    ],
    keyInsight:
      "Breadcrumbs show the power of declarative list rendering with conditional logic for the last item. The parent controls the path array — clicking navigates by slicing the array.",
    solution: `const { useState } = React;

function Breadcrumb({ items, onNavigate }) {
  return (
    <nav style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14 }}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} data-testid="breadcrumb-item" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {i > 0 && <span style={{ color: "#555" }}>/</span>}
            {isLast ? (
              <span data-testid="breadcrumb-current" style={{ color: "#eee", fontWeight: 500 }}>{item.label}</span>
            ) : (
              <a data-testid="breadcrumb-link" href="#" onClick={(e) => { e.preventDefault(); onNavigate(item.href, i); }}
                style={{ color: "#3b82f6", textDecoration: "none" }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
                {item.label}
              </a>
            )}
          </span>
        );
      })}
    </nav>
  );
}

function App() {
  const [path, setPath] = useState([
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Electronics", href: "/products/electronics" },
    { label: "Laptops", href: "/products/electronics/laptops" },
  ]);
  const handleNavigate = (href, index) => { setPath(path.slice(0, index + 1)); };
  return (
    <div style={{ padding: 24 }}>
      <Breadcrumb items={path} onNavigate={handleNavigate} />
      <div style={{ marginTop: 24, padding: 16, background: "#1a1a2e", borderRadius: 8, border: "1px solid #333" }}>
        <p style={{ color: "#999" }}>Current page: <strong style={{ color: "#eee" }}>{path[path.length - 1].label}</strong></p>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-08",
    chapterId: 1,
    title: "Image Carousel",
    difficulty: "medium",
    description:
      "Build an image carousel that cycles through a set of images. Include previous/next buttons and dot indicators for the current slide.",
    requirements: [
      "Display one image at a time with smooth transition",
      "Previous and Next navigation buttons",
      "Dot indicators showing current position",
      "Clicking dots navigates to that slide",
      "Wrap around: Next on last goes to first, Prev on first goes to last",
    ],
    starterCode: `const { useState } = React;

const slides = [
  { id: 1, color: "#3b82f6", title: "Slide 1", desc: "Introduction to React" },
  { id: 2, color: "#22c55e", title: "Slide 2", desc: "Component Patterns" },
  { id: 3, color: "#ef4444", title: "Slide 3", desc: "State Management" },
  { id: 4, color: "#f59e0b", title: "Slide 4", desc: "Performance Tips" },
];

function Carousel({ slides }) {
  return <div>Implement Carousel</div>;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <Carousel slides={slides} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const slide = document.querySelector('[data-testid="slide"]');
console.assert(slide, 'Test 1: Current slide visible');
console.assert(slide.textContent.includes("Slide 1"), 'Test 2: First slide shown initially');

// Click next
document.querySelector('[data-testid="next-btn"]').click();
await new Promise(r => setTimeout(r, 50));
const slide2 = document.querySelector('[data-testid="slide"]');
console.assert(slide2.textContent.includes("Slide 2"), 'Test 3: Next slide shown');

// Click dot 3
const dots = document.querySelectorAll('[data-testid="dot"]');
console.assert(dots.length === 4, 'Test 4: Four dot indicators');
dots[2].click();
await new Promise(r => setTimeout(r, 50));
const slide3 = document.querySelector('[data-testid="slide"]');
console.assert(slide3.textContent.includes("Slide 3"), 'Test 5: Dot navigation works');

// Click prev from slide 1 -> should go to slide 4 (wrap)
dots[0].click();
await new Promise(r => setTimeout(r, 50));
document.querySelector('[data-testid="prev-btn"]').click();
await new Promise(r => setTimeout(r, 50));
const slideWrap = document.querySelector('[data-testid="slide"]');
console.assert(slideWrap.textContent.includes("Slide 4"), 'Test 6: Wraps to last slide');`,
    tags: ["carousel", "index-management", "navigation"],
    order: 8,
    timeEstimate: "20-25 min",
    hints: [
      "Track currentIndex in state",
      "Use modular arithmetic for wrapping: (index + 1) % length",
      "For prev wrap: (index - 1 + length) % length",
    ],
    keyInsight:
      "Carousels are index management problems. The wrapping behavior uses modular arithmetic: (i + 1) % n for next, (i - 1 + n) % n for previous. This pattern generalizes to any cyclical navigation.",
    solution: `const { useState } = React;

const slides = [
  { id: 1, color: "#3b82f6", title: "Slide 1", desc: "Introduction to React" },
  { id: 2, color: "#22c55e", title: "Slide 2", desc: "Component Patterns" },
  { id: 3, color: "#ef4444", title: "Slide 3", desc: "State Management" },
  { id: 4, color: "#f59e0b", title: "Slide 4", desc: "Performance Tips" },
];

function Carousel({ slides }) {
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent((current + 1) % slides.length);
  const prev = () => setCurrent((current - 1 + slides.length) % slides.length);
  const slide = slides[current];
  return (
    <div>
      <div data-testid="slide" style={{
        background: slide.color, borderRadius: 12, padding: 48,
        textAlign: "center", color: "white", minHeight: 200,
        display: "flex", flexDirection: "column", justifyContent: "center"
      }}>
        <h2 style={{ fontSize: 28, fontWeight: 700 }}>{slide.title}</h2>
        <p style={{ marginTop: 8, opacity: 0.8 }}>{slide.desc}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
        <button data-testid="prev-btn" onClick={prev}
          style={{ padding: "8px 16px", background: "#333", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>← Prev</button>
        <div style={{ display: "flex", gap: 8 }}>
          {slides.map((_, i) => (
            <button key={i} data-testid="dot" onClick={() => setCurrent(i)}
              style={{
                width: 10, height: 10, borderRadius: "50%", border: "none", cursor: "pointer",
                background: i === current ? "#3b82f6" : "#555"
              }} />
          ))}
        </div>
        <button data-testid="next-btn" onClick={next}
          style={{ padding: "8px 16px", background: "#333", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Next →</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <Carousel slides={slides} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-09",
    chapterId: 1,
    title: "Chip / Tag Input",
    difficulty: "medium",
    description:
      "Build a chip input where users can type values that become removable chips/tags. Pressing Enter adds the current text as a chip, and each chip has a remove button.",
    requirements: [
      "Text input to type new tags",
      "Pressing Enter adds the text as a chip and clears input",
      "Each chip has a × remove button",
      "Prevent duplicate tags",
      "Backspace on empty input removes the last chip",
    ],
    starterCode: `const { useState, useRef } = React;

function ChipInput({ chips, onAdd, onRemove }) {
  return <div>Implement ChipInput</div>;
}

function App() {
  const [tags, setTags] = useState(["React", "TypeScript"]);
  const addTag = (tag) => {
    if (tag && !tags.includes(tag)) setTags([...tags, tag]);
  };
  const removeTag = (tag) => setTags(tags.filter(t => t !== tag));

  return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <h3 style={{ marginBottom: 12, fontSize: 16, fontWeight: 600 }}>Skills</h3>
      <ChipInput chips={tags} onAdd={addTag} onRemove={removeTag} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const chips = document.querySelectorAll('[data-testid="chip"]');
console.assert(chips.length === 2, 'Test 1: Two initial chips');

// Add a new chip
const input = document.querySelector('[data-testid="chip-input"]');
input.value = "NextJS";
input.dispatchEvent(new Event("input", { bubbles: true }));
input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
await new Promise(r => setTimeout(r, 50));
const after = document.querySelectorAll('[data-testid="chip"]');
console.assert(after.length === 3, 'Test 2: Chip added on Enter');

// Try duplicate
input.value = "React";
input.dispatchEvent(new Event("input", { bubbles: true }));
input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
await new Promise(r => setTimeout(r, 50));
const afterDup = document.querySelectorAll('[data-testid="chip"]');
console.assert(afterDup.length === 3, 'Test 3: Duplicate prevented');

// Remove a chip
document.querySelector('[data-testid="chip-remove"]').click();
await new Promise(r => setTimeout(r, 50));
const afterRemove = document.querySelectorAll('[data-testid="chip"]');
console.assert(afterRemove.length === 2, 'Test 4: Chip removed');`,
    tags: ["input", "keyboard-events", "list-management"],
    order: 9,
    timeEstimate: "15-20 min",
    hints: [
      "Track input value in local state",
      "Listen for Enter key to add chip, Backspace on empty to remove last",
      "Parent controls the chips array — this is a controlled component pattern",
    ],
    keyInsight:
      "Chip inputs combine controlled input with keyboard event handling. The Backspace-to-remove-last pattern is elegant: check if input is empty before removing. This component follows the controlled pattern — parent owns the data.",
    solution: `const { useState, useRef } = React;

function ChipInput({ chips, onAdd, onRemove }) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && text.trim()) {
      onAdd(text.trim());
      setText("");
    } else if (e.key === "Backspace" && !text && chips.length > 0) {
      onRemove(chips[chips.length - 1]);
    }
  };

  return (
    <div onClick={() => inputRef.current?.focus()}
      style={{
        display: "flex", flexWrap: "wrap", gap: 6, padding: 8,
        border: "1px solid #333", borderRadius: 8, background: "#1a1a2e", cursor: "text"
      }}>
      {chips.map(chip => (
        <span key={chip} data-testid="chip" style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          background: "#3b82f6", color: "white", padding: "4px 10px",
          borderRadius: 16, fontSize: 13
        }}>
          {chip}
          <button data-testid="chip-remove" onClick={() => onRemove(chip)}
            style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 14, lineHeight: 1 }}>×</button>
        </span>
      ))}
      <input ref={inputRef} data-testid="chip-input" value={text}
        onChange={e => setText(e.target.value)} onKeyDown={handleKeyDown}
        placeholder={chips.length === 0 ? "Add a skill..." : ""}
        style={{
          flex: 1, minWidth: 80, border: "none", outline: "none",
          background: "transparent", color: "#eee", padding: "4px 0", fontSize: 14
        }} />
    </div>
  );
}

function App() {
  const [tags, setTags] = useState(["React", "TypeScript"]);
  const addTag = (tag) => { if (tag && !tags.includes(tag)) setTags([...tags, tag]); };
  const removeTag = (tag) => setTags(tags.filter(t => t !== tag));
  return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <h3 style={{ marginBottom: 12, fontSize: 16, fontWeight: 600 }}>Skills</h3>
      <ChipInput chips={tags} onAdd={addTag} onRemove={removeTag} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-10",
    chapterId: 1,
    title: "Stepper / Wizard Component",
    difficulty: "medium",
    description:
      "Build a multi-step stepper component with step indicators, Next/Back navigation, and step validation. Each step shows different content and the progress bar shows completion.",
    requirements: [
      "Show numbered step indicators at the top",
      "Highlight current step, show completed steps differently",
      "Next and Back buttons to navigate between steps",
      "Final step has a Submit button instead of Next",
      "Disable Next until step is 'valid' (simulated with checkbox)",
    ],
    starterCode: `const { useState } = React;

const steps = [
  { title: "Personal", content: "Enter your personal information" },
  { title: "Address", content: "Enter your address details" },
  { title: "Payment", content: "Enter payment information" },
  { title: "Review", content: "Review and confirm your order" },
];

function Stepper({ steps }) {
  return <div>Implement Stepper</div>;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <Stepper steps={steps} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const indicators = document.querySelectorAll('[data-testid="step-indicator"]');
console.assert(indicators.length === 4, 'Test 1: Four step indicators');

const content = document.querySelector('[data-testid="step-content"]');
console.assert(content.textContent.includes("Personal"), 'Test 2: First step content shown');

// Click next
document.querySelector('[data-testid="next-btn"]').click();
await new Promise(r => setTimeout(r, 50));
const content2 = document.querySelector('[data-testid="step-content"]');
console.assert(content2.textContent.includes("Address"), 'Test 3: Next step shown');

// Click back
document.querySelector('[data-testid="back-btn"]').click();
await new Promise(r => setTimeout(r, 50));
const content3 = document.querySelector('[data-testid="step-content"]');
console.assert(content3.textContent.includes("Personal"), 'Test 4: Back to previous step');

// Navigate to last step
document.querySelector('[data-testid="next-btn"]').click();
await new Promise(r => setTimeout(r, 50));
document.querySelector('[data-testid="next-btn"]').click();
await new Promise(r => setTimeout(r, 50));
document.querySelector('[data-testid="next-btn"]').click();
await new Promise(r => setTimeout(r, 50));
const submitBtn = document.querySelector('[data-testid="submit-btn"]');
console.assert(submitBtn, 'Test 5: Submit button on last step');`,
    tags: ["wizard", "multi-step", "form-flow"],
    order: 10,
    timeEstimate: "20-25 min",
    hints: [
      "Track currentStep as an index in state",
      "Render step indicators by mapping over steps with conditional styling",
      "Show different button sets based on whether it is first, middle, or last step",
    ],
    keyInsight:
      "Steppers are bounded index navigation. The UI is driven entirely by a single currentStep state. Step indicators derive their status from comparing their index to currentStep (completed < current < upcoming).",
    solution: `const { useState } = React;

const steps = [
  { title: "Personal", content: "Enter your personal information" },
  { title: "Address", content: "Enter your address details" },
  { title: "Payment", content: "Enter payment information" },
  { title: "Review", content: "Review and confirm your order" },
];

function Stepper({ steps }) {
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
        <h2 style={{ fontSize: 24, fontWeight: 600 }}>All Done!</h2>
        <p style={{ color: "#999", marginTop: 8 }}>Your submission was successful.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
        {steps.map((step, i) => (
          <div key={i} style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <div data-testid="step-indicator" style={{
              width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 600, flexShrink: 0,
              background: i <= current ? "#3b82f6" : "#333",
              color: i <= current ? "white" : "#999"
            }}>
              {i < current ? "✓" : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < current ? "#3b82f6" : "#333", margin: "0 8px" }} />
            )}
          </div>
        ))}
      </div>
      <div data-testid="step-content" style={{
        padding: 32, background: "#1a1a2e", borderRadius: 12, border: "1px solid #333",
        textAlign: "center", minHeight: 120, display: "flex", flexDirection: "column", justifyContent: "center"
      }}>
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{steps[current].title}</h3>
        <p style={{ color: "#999" }}>{steps[current].content}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
        {current > 0 ? (
          <button data-testid="back-btn" onClick={() => setCurrent(c => c - 1)}
            style={{ padding: "10px 20px", background: "#333", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>
            ← Back
          </button>
        ) : <div />}
        {current < steps.length - 1 ? (
          <button data-testid="next-btn" onClick={() => setCurrent(c => c + 1)}
            style={{ padding: "10px 20px", background: "#3b82f6", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>
            Next →
          </button>
        ) : (
          <button data-testid="submit-btn" onClick={() => setSubmitted(true)}
            style={{ padding: "10px 20px", background: "#22c55e", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>
            Submit ✓
          </button>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <Stepper steps={steps} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
];
