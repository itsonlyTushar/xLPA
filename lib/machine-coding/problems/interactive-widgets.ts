import { MCProblem } from "../types";

export const interactiveWidgetProblems: MCProblem[] = [
  {
    id: "mc-27",
    chapterId: 4,
    title: "Star Rating Component",
    difficulty: "easy",
    description:
      "Build a star rating component where users can click to rate from 1-5 stars. Stars should highlight on hover to preview the rating. The component should be controlled via props.",
    requirements: [
      "Render 5 clickable star icons",
      "Clicking a star sets the rating to that value",
      "Hovering previews the rating (highlight stars up to hovered)",
      "Currently selected rating persists when not hovering",
      "Support a readonly mode that disables interaction",
    ],
    starterCode: `const { useState } = React;

function StarRating({ value = 0, onChange, readonly = false }) {
  // Implement star rating with hover preview
  return <div>Implement StarRating</div>;
}

function App() {
  const [rating, setRating] = useState(0);
  return (
    <div style={{ padding: 24 }}>
      <h3 style={{ color: "#e2e8f0", marginBottom: 12 }}>Rate this product</h3>
      <StarRating value={rating} onChange={setRating} />
      <p style={{ color: "#94a3b8", marginTop: 8 }}>Rating: {rating}/5</p>
      <h3 style={{ color: "#e2e8f0", marginTop: 24, marginBottom: 12 }}>Readonly</h3>
      <StarRating value={4} readonly />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const stars = document.querySelectorAll('[data-testid="star"]');
console.assert(stars.length >= 5, 'Test 1: At least 5 stars rendered');

// Click third star
stars[2].click();
await new Promise(r => setTimeout(r, 50));
const filled = document.querySelectorAll('[data-testid="star-filled"]');
console.assert(filled.length === 3, 'Test 2: Three stars filled after clicking third');

// Click fifth star
stars[4].click();
await new Promise(r => setTimeout(r, 50));
const filledAfter = document.querySelectorAll('[data-testid="star-filled"]');
console.assert(filledAfter.length === 5, 'Test 3: Five stars filled after clicking fifth');`,
    tags: ["hover-state", "controlled-component", "events"],
    order: 1,
    timeEstimate: "15-20 min",
    hints: [
      "Use a hoverValue state that overrides the display when hovering",
      "displayValue = hoverValue || value",
      "On mouse leave, reset hoverValue to 0",
    ],
    keyInsight: "The hover preview pattern: maintain a separate hoverValue state. Display = hoverValue || selectedValue. This lets hover temporarily override the selection without changing it.",
    solution: `const { useState } = React;

function StarRating({ value = 0, onChange, readonly = false }) {
  const [hoverValue, setHoverValue] = useState(0);
  const displayValue = hoverValue || value;

  return (
    <div style={{ display: "flex", gap: 4 }} onMouseLeave={() => !readonly && setHoverValue(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} data-testid="star"
          data-testid2={star <= displayValue ? "star-filled" : "star-empty"}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          style={{ cursor: readonly ? "default" : "pointer", fontSize: 28, color: star <= displayValue ? "#f59e0b" : "#334155", transition: "color 0.15s" }}>
          {star <= displayValue ? (
            <span data-testid="star-filled">★</span>
          ) : (
            <span>☆</span>
          )}
        </span>
      ))}
    </div>
  );
}`,
    solutionExplanation: "hoverValue overrides display when non-zero. Each star checks if its index <= displayValue to determine filled/empty. Mouse enter sets hover, mouse leave clears it. Readonly disables all interaction.",
  },
  {
    id: "mc-28",
    chapterId: 4,
    title: "Progress Bar",
    difficulty: "easy",
    description:
      "Build an animated progress bar component. It should fill smoothly to the given percentage, show the percentage text, and support different color variants (success, warning, error).",
    requirements: [
      "Fill bar width based on percentage prop (0-100)",
      "Smooth CSS transition animation when percentage changes",
      "Display percentage text inside or beside the bar",
      "Color variants: blue (default), green (success), yellow (warning), red (error)",
      "Clamp value between 0 and 100",
    ],
    starterCode: `const { useState, useEffect } = React;

function ProgressBar({ value, variant = "default" }) {
  // Implement animated progress bar
  return <div>Implement ProgressBar</div>;
}

function App() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 10));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <h3 style={{ color: "#e2e8f0", marginBottom: 16 }}>Upload Progress</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <ProgressBar value={progress} />
        <ProgressBar value={75} variant="success" />
        <ProgressBar value={45} variant="warning" />
        <ProgressBar value={20} variant="error" />
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const bars = document.querySelectorAll('[data-testid="progress-bar"]');
console.assert(bars.length >= 1, 'Test 1: Progress bars rendered');

const fill = document.querySelector('[data-testid="progress-fill"]');
console.assert(fill !== null, 'Test 2: Progress fill element exists');

const label = document.querySelector('[data-testid="progress-label"]');
console.assert(label !== null, 'Test 3: Progress label exists');`,
    tags: ["css-animation", "props", "variants"],
    order: 2,
    timeEstimate: "10-15 min",
    hints: [
      "Width in percentage: style={{ width: value + '%' }}",
      "Add transition: 'width 0.3s ease' for smooth animation",
      "Map variant to color: { default: blue, success: green, warning: yellow, error: red }",
    ],
    keyInsight: "CSS transitions do the heavy lifting — just change the width value and the browser animates it. No need for requestAnimationFrame or JS animation libraries for simple progress bars.",
    solution: `function ProgressBar({ value, variant = "default" }) {
  const clamped = Math.min(100, Math.max(0, value));
  const colors = { default: "#3b82f6", success: "#22c55e", warning: "#eab308", error: "#ef4444" };
  const color = colors[variant] || colors.default;

  return (
    <div data-testid="progress-bar">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span data-testid="progress-label" style={{ color: "#94a3b8", fontSize: 13 }}>{clamped}%</span>
      </div>
      <div style={{ height: 8, background: "#1e293b", borderRadius: 4, overflow: "hidden" }}>
        <div data-testid="progress-fill" style={{ height: "100%", width: clamped + "%", background: color, borderRadius: 4, transition: "width 0.3s ease" }} />
      </div>
    </div>
  );
}`,
    solutionExplanation: "Clamp value 0-100. Map variant to color. Outer bar has fixed height + background. Inner fill has width as percentage + CSS transition for smooth animation.",
  },
  {
    id: "mc-29",
    chapterId: 4,
    title: "Countdown Timer",
    difficulty: "medium",
    description:
      "Build a countdown timer with start, pause, and reset controls. Display time in MM:SS format. Allow the user to set the initial time in minutes.",
    requirements: [
      "Input to set timer duration in minutes",
      "Start button begins the countdown",
      "Pause button pauses the countdown",
      "Reset button stops and resets to initial value",
      "Display in MM:SS format",
      "Visual/text indication when timer reaches 0",
    ],
    starterCode: `const { useState, useRef, useCallback, useEffect } = React;

function CountdownTimer() {
  // Implement countdown timer with start/pause/reset
  return <div>Implement CountdownTimer</div>;
}

function App() {
  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <CountdownTimer />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const display = document.querySelector('[data-testid="timer-display"]');
console.assert(display !== null, 'Test 1: Timer display exists');

const startBtn = document.querySelector('[data-testid="start-btn"]');
const pauseBtn = document.querySelector('[data-testid="pause-btn"]');
const resetBtn = document.querySelector('[data-testid="reset-btn"]');
console.assert(startBtn !== null, 'Test 2: Start button exists');

// Set to 1 minute
const input = document.querySelector('[data-testid="minutes-input"]');
input.value = "1";
input.dispatchEvent(new Event('change', { bubbles: true }));

// Start
startBtn.click();
await new Promise(r => setTimeout(r, 1100));
console.assert(display.textContent !== "01:00", 'Test 3: Timer is counting down');

// Pause
if (pauseBtn) pauseBtn.click();
const paused = display.textContent;
await new Promise(r => setTimeout(r, 1100));
console.assert(display.textContent === paused, 'Test 4: Timer paused');`,
    tags: ["setInterval", "ref", "time-formatting"],
    order: 3,
    timeEstimate: "20-25 min",
    hints: [
      "Store remaining seconds in state, use useRef for the interval ID",
      "setInterval with 1000ms decrements the seconds",
      "Format: Math.floor(secs/60).toString().padStart(2,'0') + ':' + (secs%60).toString().padStart(2,'0')",
    ],
    keyInsight: "Store interval IDs in refs (not state) so you can clear them reliably. Refs persist across renders without triggering re-renders, making them perfect for timer/interval management.",
    solution: `const { useState, useRef, useCallback } = React;

function CountdownTimer() {
  const [seconds, setSeconds] = useState(60);
  const [inputMin, setInputMin] = useState("1");
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);

  const start = () => {
    if (running || seconds <= 0) return;
    setRunning(true);
    setDone(false);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          setDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pause = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setDone(false);
    setSeconds(parseInt(inputMin) * 60 || 60);
  };

  const handleMinChange = (e) => {
    setInputMin(e.target.value);
    if (!running) {
      setSeconds(parseInt(e.target.value) * 60 || 0);
    }
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <input data-testid="minutes-input" type="number" min="1" value={inputMin} onChange={handleMinChange} disabled={running}
          style={{ width: 60, padding: "6px 10px", background: "#1e293b", border: "1px solid #334155", borderRadius: 6, color: "#e2e8f0", fontSize: 14, textAlign: "center" }} />
        <span style={{ color: "#64748b", fontSize: 13, marginLeft: 8 }}>minutes</span>
      </div>
      <div data-testid="timer-display"
        style={{ fontSize: 64, fontWeight: "bold", fontFamily: "monospace", color: done ? "#ef4444" : seconds <= 10 ? "#f59e0b" : "#e2e8f0", marginBottom: 24 }}>
        {mm}:{ss}
      </div>
      {done && <div style={{ color: "#ef4444", fontSize: 16, marginBottom: 16 }}>Time is up!</div>}
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button data-testid="start-btn" onClick={start} disabled={running}
          style={{ padding: "8px 24px", background: "#22c55e", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14, opacity: running ? 0.5 : 1 }}>Start</button>
        <button data-testid="pause-btn" onClick={pause} disabled={!running}
          style={{ padding: "8px 24px", background: "#f59e0b", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14, opacity: !running ? 0.5 : 1 }}>Pause</button>
        <button data-testid="reset-btn" onClick={reset}
          style={{ padding: "8px 24px", background: "#64748b", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14 }}>Reset</button>
      </div>
    </div>
  );
}`,
    solutionExplanation: "Seconds in state, interval ID in ref. Start creates setInterval that decrements. Pause clears interval. Reset clears and restores. MM:SS formatted with padStart(2, '0').",
  },
  {
    id: "mc-30",
    chapterId: 4,
    title: "Color Picker",
    difficulty: "medium",
    description:
      "Build a color picker with preset color swatches and a custom hex input. Show a preview of the selected color and copy the hex value to clipboard on click.",
    requirements: [
      "Grid of preset color swatches to choose from",
      "Hex color input for custom colors",
      "Large preview of the selected color",
      "Display the hex value text",
      "Copy hex to clipboard button",
      "Validate hex input format",
    ],
    starterCode: `const { useState } = React;

const presetColors = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
  "#0f172a", "#1e293b", "#334155", "#64748b", "#94a3b8",
  "#e2e8f0", "#ffffff", "#000000", "#7c3aed", "#2563eb",
];

function ColorPicker() {
  // Implement color picker
  return <div>Implement ColorPicker</div>;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 360 }}>
      <ColorPicker />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const swatches = document.querySelectorAll('[data-testid="color-swatch"]');
console.assert(swatches.length === 20, 'Test 1: 20 color swatches');

const input = document.querySelector('[data-testid="hex-input"]');
console.assert(input !== null, 'Test 2: Hex input exists');

const preview = document.querySelector('[data-testid="color-preview"]');
console.assert(preview !== null, 'Test 3: Color preview exists');

// Click a swatch
swatches[5].click();
await new Promise(r => setTimeout(r, 50));
console.assert(input.value.toLowerCase() === "#3b82f6", 'Test 4: Input updated to clicked swatch color');`,
    tags: ["color", "clipboard", "input-validation"],
    order: 4,
    timeEstimate: "15-20 min",
    hints: [
      "Store selected color as a hex string in state",
      "Validate hex with regex: /^#[0-9a-fA-F]{6}$/",
      "Use navigator.clipboard.writeText() for copy",
    ],
    keyInsight: "The color picker demonstrates two-way binding: swatches set the input value, and typing in the input updates the preview. The input and preview are two views of the same state.",
    solution: `const { useState } = React;

function ColorPicker() {
  const [color, setColor] = useState("#3b82f6");
  const [copied, setCopied] = useState(false);
  const isValid = /^#[0-9a-fA-F]{6}$/.test(color);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(color);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div>
      <div data-testid="color-preview" style={{ width: "100%", height: 80, borderRadius: 8, background: isValid ? color : "#1e293b", border: "1px solid #334155", marginBottom: 16 }} />
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input data-testid="hex-input" value={color} onChange={(e) => setColor(e.target.value)}
          style={{ flex: 1, padding: "8px 12px", background: "#1e293b", border: "1px solid " + (isValid ? "#334155" : "#ef4444"), borderRadius: 6, color: "#e2e8f0", fontSize: 14, fontFamily: "monospace" }} />
        <button onClick={copy}
          style={{ padding: "8px 16px", background: "#334155", color: "#e2e8f0", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
        {presetColors.map((c) => (
          <button key={c} data-testid="color-swatch" onClick={() => setColor(c)}
            style={{ width: "100%", aspectRatio: "1", borderRadius: 6, background: c, border: color === c ? "2px solid white" : "1px solid #334155", cursor: "pointer" }} />
        ))}
      </div>
    </div>
  );
}`,
    solutionExplanation: "Single color state synced between swatch clicks and hex input. Preview directly uses the color. Copy uses navigator.clipboard with temporary 'Copied!' feedback. Hex validation with regex.",
  },
  {
    id: "mc-31",
    chapterId: 4,
    title: "Stopwatch",
    difficulty: "medium",
    description:
      "Build a stopwatch with start, stop, reset and lap functionality. Display time in MM:SS.ms format. Record lap times and display them as a list.",
    requirements: [
      "Start/Stop toggle button",
      "Reset button clears time and laps",
      "Lap button records current time without stopping",
      "Display in MM:SS.mm format (minutes:seconds.centiseconds)",
      "Lap times listed below, showing both lap time and total time",
    ],
    starterCode: `const { useState, useRef } = React;

function Stopwatch() {
  // Implement stopwatch with laps
  return <div>Implement Stopwatch</div>;
}

function App() {
  return (
    <div style={{ padding: 24, textAlign: "center", maxWidth: 400, margin: "0 auto" }}>
      <Stopwatch />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const display = document.querySelector('[data-testid="stopwatch-display"]');
console.assert(display !== null, 'Test 1: Display exists');
console.assert(display.textContent.includes("00:00"), 'Test 2: Starts at 00:00');

const startBtn = document.querySelector('[data-testid="start-btn"]');
startBtn.click();
await new Promise(r => setTimeout(r, 1100));
console.assert(display.textContent !== "00:00.00", 'Test 3: Timer running');

const lapBtn = document.querySelector('[data-testid="lap-btn"]');
if (lapBtn) {
  lapBtn.click();
  await new Promise(r => setTimeout(r, 50));
  const laps = document.querySelectorAll('[data-testid="lap-item"]');
  console.assert(laps.length === 1, 'Test 4: One lap recorded');
}`,
    tags: ["interval", "ref", "time-formatting", "list"],
    order: 5,
    timeEstimate: "20-25 min",
    hints: [
      "Use setInterval with 10ms for centisecond precision",
      "Track elapsed time by storing start timestamp and computing delta",
      "Laps: record the elapsed time at each lap button click",
    ],
    keyInsight: "For accurate timing, don't increment a counter — store the start timestamp and compute elapsed = Date.now() - startTime. Counter-based timers drift over time due to JS event loop delays.",
    solution: `const { useState, useRef, useCallback } = React;

function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  const start = () => {
    startTimeRef.current = Date.now() - elapsed;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 10);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  };

  const lap = () => {
    setLaps((prev) => [elapsed, ...prev]);
  };

  const format = (ms) => {
    const mins = String(Math.floor(ms / 60000)).padStart(2, "0");
    const secs = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
    const cs = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
    return mins + ":" + secs + "." + cs;
  };

  return (
    <div>
      <div data-testid="stopwatch-display"
        style={{ fontSize: 56, fontFamily: "monospace", fontWeight: "bold", color: "#e2e8f0", marginBottom: 24 }}>
        {format(elapsed)}
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24 }}>
        {running ? (
          <button data-testid="start-btn" onClick={stop} style={{ padding: "8px 24px", background: "#ef4444", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14 }}>Stop</button>
        ) : (
          <button data-testid="start-btn" onClick={start} style={{ padding: "8px 24px", background: "#22c55e", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14 }}>Start</button>
        )}
        {running && (
          <button data-testid="lap-btn" onClick={lap} style={{ padding: "8px 24px", background: "#3b82f6", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14 }}>Lap</button>
        )}
        <button data-testid="reset-btn" onClick={reset} style={{ padding: "8px 24px", background: "#64748b", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14 }}>Reset</button>
      </div>
      {laps.length > 0 && (
        <div style={{ textAlign: "left" }}>
          {laps.map((l, i) => (
            <div key={i} data-testid="lap-item" style={{ display: "flex", justifyContent: "space-between", padding: "6px 12px", borderBottom: "1px solid #1e293b", color: "#94a3b8", fontSize: 14 }}>
              <span>Lap {laps.length - i}</span>
              <span style={{ fontFamily: "monospace" }}>{format(l)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`,
    solutionExplanation: "Track startTime in ref, compute elapsed = Date.now() - startTime on each interval tick. Laps are snapshots of elapsed pushed to front of array. Format function splits ms into MM:SS.cs.",
  },
  {
    id: "mc-32",
    chapterId: 4,
    title: "Drag and Drop List",
    difficulty: "hard",
    description:
      "Build a sortable list using HTML5 drag and drop API. Items can be reordered by dragging and dropping. Show a visual indicator for the drop target position.",
    requirements: [
      "List items are draggable",
      "Drag an item over another to reorder",
      "Visual indicator shows where the item will be dropped",
      "Items reorder in the list after drop",
      "Handle edge cases (drop on self, drag leaving the container)",
    ],
    starterCode: `const { useState, useRef } = React;

function DragDropList() {
  const [items, setItems] = useState([
    "Learn React", "Build a project", "Practice DS&A",
    "Read documentation", "Write tests", "Deploy to production",
  ]);
  // Implement drag and drop reordering
  return <div>Implement DragDropList</div>;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <h3 style={{ color: "#e2e8f0", marginBottom: 12 }}>Drag to Reorder</h3>
      <DragDropList />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const items = document.querySelectorAll('[data-testid="drag-item"]');
console.assert(items.length === 6, 'Test 1: Six draggable items');

// Verify items are draggable
console.assert(items[0].draggable === true, 'Test 2: Items have draggable attribute');

// Check initial order
console.assert(items[0].textContent.includes("Learn React"), 'Test 3: First item is correct');
console.assert(items[5].textContent.includes("Deploy"), 'Test 4: Last item is correct');`,
    tags: ["drag-and-drop", "array-reorder", "html5-api"],
    order: 6,
    timeEstimate: "25-30 min",
    hints: [
      "Use onDragStart, onDragOver (with e.preventDefault()), and onDrop events",
      "Store the dragged index in a ref (not state — avoids re-renders during drag)",
      "On drop: splice the item from old position and insert at new position",
    ],
    keyInsight: "HTML5 drag/drop requires e.preventDefault() on dragOver for the drop zone to work. Store dragged item index in a ref to avoid triggering re-renders during the drag operation.",
    solution: `const { useState, useRef } = React;

function DragDropList() {
  const [items, setItems] = useState([
    "Learn React", "Build a project", "Practice DS&A",
    "Read documentation", "Write tests", "Deploy to production",
  ]);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    dragOverItem.current = index;
    setDragOverIndex(index);
  };

  const handleDrop = () => {
    const from = dragItem.current;
    const to = dragOverItem.current;
    if (from === null || to === null || from === to) {
      setDragOverIndex(null);
      return;
    }
    const updated = [...items];
    const [removed] = updated.splice(from, 1);
    updated.splice(to, 0, removed);
    setItems(updated);
    dragItem.current = null;
    dragOverItem.current = null;
    setDragOverIndex(null);
  };

  return (
    <div>
      {items.map((item, i) => (
        <div key={item} data-testid="drag-item" draggable
          onDragStart={() => handleDragStart(i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDrop={handleDrop}
          onDragEnd={() => setDragOverIndex(null)}
          style={{
            padding: "12px 16px", marginBottom: 4, borderRadius: 6, cursor: "grab",
            background: dragOverIndex === i ? "#1e3a5f" : "#1e293b",
            border: dragOverIndex === i ? "1px dashed #3b82f6" : "1px solid transparent",
            color: "#e2e8f0", fontSize: 14, transition: "background 0.15s",
            display: "flex", alignItems: "center", gap: 8,
          }}>
          <span style={{ color: "#475569" }}>⠿</span> {item}
        </div>
      ))}
    </div>
  );
}`,
    solutionExplanation: "Drag start stores source index in ref. Drag over stores target index and calls preventDefault(). On drop: splice source out, splice into target position. Visual feedback via dragOverIndex state.",
  },
  {
    id: "mc-33",
    chapterId: 4,
    title: "Toggle Switch",
    difficulty: "easy",
    description:
      "Build a custom toggle switch component (like iOS-style toggle). It should animate between on/off states, support disabled state, and work as a controlled component.",
    requirements: [
      "Visually looks like a toggle switch (pill shape with sliding circle)",
      "Smooth animation between on and off states",
      "Changes color based on state (green for on, gray for off)",
      "Support disabled prop that prevents interaction",
      "Controlled via checked and onChange props",
    ],
    starterCode: `const { useState } = React;

function Toggle({ checked, onChange, disabled = false, label }) {
  // Implement toggle switch
  return <div>Implement Toggle</div>;
}

function App() {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);
  const [airplane, setAirplane] = useState(false);

  return (
    <div style={{ padding: 24, maxWidth: 300 }}>
      <h3 style={{ color: "#e2e8f0", marginBottom: 16 }}>Settings</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Toggle checked={wifi} onChange={setWifi} label="Wi-Fi" />
        <Toggle checked={bluetooth} onChange={setBluetooth} label="Bluetooth" />
        <Toggle checked={airplane} onChange={setAirplane} label="Airplane Mode" />
        <Toggle checked={false} onChange={() => {}} disabled label="VPN (unavailable)" />
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const toggles = document.querySelectorAll('[data-testid="toggle"]');
console.assert(toggles.length === 4, 'Test 1: Four toggle switches');

// Click second toggle (bluetooth - initially off)
toggles[1].click();
await new Promise(r => setTimeout(r, 50));

// Click disabled toggle (should not change)
const disabledToggle = toggles[3];
console.assert(disabledToggle.style.opacity === "0.5" || disabledToggle.getAttribute('data-disabled') === 'true', 'Test 2: Disabled toggle is visually distinct');`,
    tags: ["animation", "controlled-component", "accessibility"],
    order: 7,
    timeEstimate: "10-15 min",
    hints: [
      "The track is a pill-shaped div with border-radius: 9999px",
      "The knob is absolutely positioned circle that slides with CSS transition + transform: translateX",
      "Disabled state reduces opacity and disables pointer events",
    ],
    keyInsight: "The sliding knob is just translateX transitioning between 0 and (trackWidth - knobWidth). CSS transitions handle the animation — React only toggles the state.",
    solution: `function Toggle({ checked, onChange, disabled = false, label }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      {label && <span style={{ color: disabled ? "#475569" : "#e2e8f0", fontSize: 14 }}>{label}</span>}
      <button data-testid="toggle" data-disabled={disabled ? "true" : "false"}
        onClick={() => !disabled && onChange(!checked)}
        style={{
          width: 44, height: 24, borderRadius: 9999, border: "none", cursor: disabled ? "not-allowed" : "pointer",
          background: checked ? "#22c55e" : "#475569", position: "relative", transition: "background 0.2s",
          opacity: disabled ? 0.5 : 1, padding: 0,
        }}>
        <span style={{
          position: "absolute", top: 2, left: checked ? 22 : 2,
          width: 20, height: 20, borderRadius: "50%", background: "white",
          transition: "left 0.2s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }} />
      </button>
    </div>
  );
}`,
    solutionExplanation: "Track is a pill button. Knob is absolutely positioned circle. Checked state controls background color and knob position (left: 2 vs 22). CSS transition animates both.",
  },
  {
    id: "mc-34",
    chapterId: 4,
    title: "Emoji Picker",
    difficulty: "medium",
    description:
      "Build an emoji picker popup with category tabs and a search bar. Clicking an emoji adds it to a text area. The picker should toggle open/close and position itself near the trigger.",
    requirements: [
      "Trigger button opens/closes the emoji picker popup",
      "Category tabs (Smileys, Animals, Food, etc.) filter emojis",
      "Search bar to filter emojis by name",
      "Clicking an emoji inserts it into a textarea",
      "Close picker after selection or clicking outside",
    ],
    starterCode: `const { useState, useRef, useEffect } = React;

const emojiData = {
  "Smileys": ["😀","😁","😂","🤣","😊","😍","🥰","😎","🤩","😇","🥳","😋","🤔","😴","🤯","😤","🥺","😈"],
  "Animals": ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🦄"],
  "Food": ["🍎","🍕","🍔","🌮","🍜","🍣","🍰","🍪","🍩","🧁","🍫","🍿","☕","🧃","🍺","🥤","🍉","🍓"],
  "Travel": ["✈️","🚗","🚀","🏠","⛰️","🏖️","🌍","🗼","🎢","🚂","🛳️","🚁","🏕️","🌅","🗽","🎡","⛵","🚲"],
};

function EmojiPicker() {
  // Implement emoji picker with categories and search
  return <div>Implement EmojiPicker</div>;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <EmojiPicker />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const trigger = document.querySelector('[data-testid="emoji-trigger"]');
console.assert(trigger !== null, 'Test 1: Emoji trigger button exists');

const textarea = document.querySelector('[data-testid="emoji-textarea"]');
console.assert(textarea !== null, 'Test 2: Textarea exists');

// Open picker
trigger.click();
await new Promise(r => setTimeout(r, 50));
const picker = document.querySelector('[data-testid="emoji-picker"]');
console.assert(picker !== null, 'Test 3: Picker opens');

// Click an emoji
const emojis = picker.querySelectorAll('[data-testid="emoji-btn"]');
console.assert(emojis.length > 0, 'Test 4: Emojis rendered');
emojis[0].click();
await new Promise(r => setTimeout(r, 50));
console.assert(textarea.value.length > 0, 'Test 5: Emoji inserted into textarea');`,
    tags: ["popup", "categories", "search", "click-outside"],
    order: 8,
    timeEstimate: "25-30 min",
    hints: [
      "Combine the dropdown select pattern (click-outside) with tabs (categories)",
      "Filter emojis across all categories when search is active",
      "Insert emoji at textarea cursor position or append to end",
    ],
    keyInsight: "Complex components are compositions of simple patterns: click-outside (dropdown), tabs (categories), search filter (input), and text insertion (textarea). Break big problems into these known patterns.",
    solution: `const { useState, useRef, useEffect } = React;

function EmojiPicker() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Smileys");
  const [search, setSearch] = useState("");
  const pickerRef = useRef(null);

  useEffect(() => {
    const handle = (e) => { if (pickerRef.current && !pickerRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const filteredEmojis = search
    ? Object.values(emojiData).flat().filter(() => true)
    : emojiData[category] || [];

  const addEmoji = (emoji) => {
    setText((prev) => prev + emoji);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <textarea data-testid="emoji-textarea" value={text} onChange={(e) => setText(e.target.value)}
          rows={3} placeholder="Type a message..."
          style={{ flex: 1, padding: "8px 12px", background: "#1e293b", border: "1px solid #334155", borderRadius: 6, color: "#e2e8f0", fontSize: 14, resize: "none" }} />
      </div>
      <div ref={pickerRef} style={{ position: "relative", display: "inline-block" }}>
        <button data-testid="emoji-trigger" onClick={() => setOpen(!open)}
          style={{ padding: "8px 16px", background: "#1e293b", border: "1px solid #334155", borderRadius: 6, cursor: "pointer", fontSize: 20 }}>
          😀
        </button>
        {open && (
          <div data-testid="emoji-picker" style={{
            position: "absolute", bottom: "calc(100% + 8px)", left: 0, width: 300, background: "#1e293b",
            border: "1px solid #334155", borderRadius: 8, padding: 12, zIndex: 50,
          }}>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
              style={{ width: "100%", padding: "6px 10px", background: "#0f172a", border: "1px solid #334155", borderRadius: 4, color: "#e2e8f0", fontSize: 13, marginBottom: 8 }} />
            {!search && (
              <div style={{ display: "flex", gap: 4, marginBottom: 8, overflowX: "auto" }}>
                {Object.keys(emojiData).map((cat) => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    style={{ padding: "4px 10px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 12, whiteSpace: "nowrap",
                      background: category === cat ? "#334155" : "transparent", color: category === cat ? "#e2e8f0" : "#64748b" }}>
                    {cat}
                  </button>
                ))}
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 4, maxHeight: 180, overflowY: "auto" }}>
              {filteredEmojis.map((emoji, i) => (
                <button key={i} data-testid="emoji-btn" onClick={() => addEmoji(emoji)}
                  style={{ fontSize: 22, background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 4 }}
                  onMouseEnter={(e) => e.target.style.background = "#334155"}
                  onMouseLeave={(e) => e.target.style.background = "none"}>
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}`,
    solutionExplanation: "Combines multiple patterns: click-outside for popup, category tabs, search filter, and emoji insertion into textarea state. State managed separately for each concern.",
  },
];
