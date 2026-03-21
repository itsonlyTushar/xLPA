import { MCProblem } from "../types";

export const dataDisplayProblems: MCProblem[] = [
  {
    id: "mc-19",
    chapterId: 3,
    title: "Data Table with Sorting",
    difficulty: "medium",
    description:
      "Build a data table component with sortable columns. Clicking a column header sorts the data by that column. Clicking again reverses the sort order. Show a sort indicator arrow.",
    requirements: [
      "Render a table with headers and rows from data prop",
      "Clicking a column header sorts by that column (ascending)",
      "Clicking the same header again toggles to descending",
      "Show ▲/▼ indicator on the sorted column",
      "Support sorting strings and numbers correctly",
    ],
    starterCode: `const { useState, useMemo } = React;

function DataTable({ columns, data }) {
  // columns = [{ key: string, label: string }]
  // data = [{ name: string, age: number, city: string }]
  return <table>Implement DataTable</table>;
}

const columns = [
  { key: "name", label: "Name" },
  { key: "age", label: "Age" },
  { key: "city", label: "City" },
];

const data = [
  { name: "Alice", age: 30, city: "New York" },
  { name: "Bob", age: 25, city: "London" },
  { name: "Charlie", age: 35, city: "Paris" },
  { name: "Diana", age: 28, city: "Tokyo" },
  { name: "Eve", age: 32, city: "Berlin" },
  { name: "Frank", age: 22, city: "Sydney" },
];

function App() {
  return (
    <div style={{ padding: 24 }}>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const headers = document.querySelectorAll('[data-testid="table-header"]');
console.assert(headers.length === 3, 'Test 1: Three column headers');

const rows = document.querySelectorAll('[data-testid="table-row"]');
console.assert(rows.length === 6, 'Test 2: Six data rows');

// Click Age header to sort ascending
headers[1].click();
await new Promise(r => setTimeout(r, 50));
const firstCell = document.querySelector('[data-testid="table-row"] td:nth-child(2)');
console.assert(firstCell.textContent === "22", 'Test 3: Sorted ascending by age');

// Click again for descending
headers[1].click();
await new Promise(r => setTimeout(r, 50));
const firstCellDesc = document.querySelector('[data-testid="table-row"] td:nth-child(2)');
console.assert(firstCellDesc.textContent === "35", 'Test 4: Sorted descending by age');`,
    tags: ["sorting", "derived-state", "table"],
    order: 1,
    timeEstimate: "20-25 min",
    hints: [
      "Store sortKey and sortDirection in state",
      "Use useMemo to derive sorted data from the original data + sort state",
      "Compare with localeCompare for strings, subtraction for numbers",
    ],
    keyInsight: "Never mutate the data prop — derive sorted data with useMemo. The sort state (key + direction) controls the view. This derived-data pattern is core to any data-heavy UI.",
    solution: `const { useState, useMemo } = React;

function DataTable({ columns, data }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey], bVal = b[sortKey];
      const cmp = typeof aVal === "number" ? aVal - bVal : String(aVal).localeCompare(String(bVal));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const thStyle = { padding: "10px 16px", textAlign: "left", cursor: "pointer", borderBottom: "2px solid #334155", color: "#94a3b8", fontSize: 13, userSelect: "none" };
  const tdStyle = { padding: "10px 16px", borderBottom: "1px solid #1e293b", color: "#e2e8f0", fontSize: 14 };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} data-testid="table-header" onClick={() => handleSort(col.key)} style={thStyle}>
              {col.label} {sortKey === col.key ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((row, i) => (
          <tr key={i} data-testid="table-row" style={{ background: i % 2 === 0 ? "transparent" : "#0f172a10" }}>
            {columns.map((col) => (
              <td key={col.key} style={tdStyle}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}`,
    solutionExplanation: "Sort state (key + direction) controls the useMemo-derived sorted array. Clicking the same header toggles direction; clicking a new header resets to ascending. Data is never mutated.",
  },
  {
    id: "mc-20",
    chapterId: 3,
    title: "Pagination Component",
    difficulty: "medium",
    description:
      "Build a pagination component that splits a list into pages. Show page numbers, previous/next buttons, and the current page's items. Support configurable items per page.",
    requirements: [
      "Display a configurable number of items per page",
      "Page number buttons to navigate directly",
      "Previous/Next buttons with disabled state at boundaries",
      "Show current page info (e.g. 'Showing 1-10 of 50')",
      "Highlight the current active page number",
    ],
    starterCode: `const { useState, useMemo } = React;

function Pagination({ items, itemsPerPage = 5 }) {
  // Implement paginated list
  return <div>Implement Pagination</div>;
}

const allItems = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: "Item " + (i + 1),
}));

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <h3 style={{ color: "#e2e8f0", marginBottom: 16 }}>Items</h3>
      <Pagination items={allItems} itemsPerPage={5} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const pageItems = document.querySelectorAll('[data-testid="page-item"]');
console.assert(pageItems.length === 5, 'Test 1: Five items on first page');

const pageButtons = document.querySelectorAll('[data-testid="page-btn"]');
console.assert(pageButtons.length === 5, 'Test 2: Five page buttons (23 items / 5 per page)');

const nextBtn = document.querySelector('[data-testid="next-btn"]');
nextBtn.click();
await new Promise(r => setTimeout(r, 50));

const pageInfo = document.querySelector('[data-testid="page-info"]');
console.assert(pageInfo.textContent.includes("6"), 'Test 3: Page info updates to show items 6-10');

const prevBtn = document.querySelector('[data-testid="prev-btn"]');
console.assert(prevBtn.disabled === false, 'Test 4: Prev button enabled on page 2');`,
    tags: ["pagination", "derived-state", "math"],
    order: 2,
    timeEstimate: "15-20 min",
    hints: [
      "Total pages = Math.ceil(items.length / itemsPerPage)",
      "Current page items = items.slice((page - 1) * perPage, page * perPage)",
      "Page numbers array = Array.from({ length: totalPages }, (_, i) => i + 1)",
    ],
    keyInsight: "Pagination is pure math on the source array: slice((page-1)*perPage, page*perPage). The page state is just an index multiplier. Same logic works client-side or as offset/limit for APIs.",
    solution: `const { useState, useMemo } = React;

function Pagination({ items, itemsPerPage = 5 }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const pageItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, page, itemsPerPage]);

  const start = (page - 1) * itemsPerPage + 1;
  const end = Math.min(page * itemsPerPage, items.length);

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        {pageItems.map((item) => (
          <div key={item.id} data-testid="page-item" style={{ padding: "8px 12px", borderBottom: "1px solid #1e293b", color: "#e2e8f0", fontSize: 14 }}>
            {item.name}
          </div>
        ))}
      </div>
      <div data-testid="page-info" style={{ color: "#64748b", fontSize: 12, marginBottom: 8 }}>
        Showing {start}-{end} of {items.length}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <button data-testid="prev-btn" onClick={() => setPage((p) => p - 1)} disabled={page === 1}
          style={{ padding: "4px 10px", background: page === 1 ? "#1e293b" : "#334155", color: page === 1 ? "#475569" : "#e2e8f0", border: "none", borderRadius: 4, cursor: page === 1 ? "not-allowed" : "pointer", fontSize: 13 }}>
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button key={p} data-testid="page-btn" onClick={() => setPage(p)}
            style={{ padding: "4px 10px", background: p === page ? "#3b82f6" : "#1e293b", color: p === page ? "white" : "#94a3b8", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13 }}>
            {p}
          </button>
        ))}
        <button data-testid="next-btn" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}
          style={{ padding: "4px 10px", background: page === totalPages ? "#1e293b" : "#334155", color: page === totalPages ? "#475569" : "#e2e8f0", border: "none", borderRadius: 4, cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: 13 }}>
          Next
        </button>
      </div>
    </div>
  );
}`,
    solutionExplanation: "Page state (1-based) controls which slice of items to show. totalPages derived via Math.ceil. pageItems derived via useMemo slice. Prev/Next disabled at boundaries.",
  },
  {
    id: "mc-21",
    chapterId: 3,
    title: "Infinite Scroll List",
    difficulty: "hard",
    description:
      "Build an infinite scroll component that loads more items when the user scrolls near the bottom. Show a loading indicator during fetch and handle the 'no more items' state.",
    requirements: [
      "Initially load first 10 items",
      "Load 10 more when scrolled within 100px of the bottom",
      "Show a loading spinner during data fetch",
      "Show 'No more items' when all data is loaded",
      "Prevent duplicate fetches while one is in progress",
    ],
    starterCode: `const { useState, useEffect, useRef, useCallback } = React;

// Simulated API
function fetchItems(page, limit = 10) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * limit;
      const total = 45;
      const items = Array.from({ length: Math.min(limit, total - start) }, (_, i) => ({
        id: start + i + 1,
        title: "Post #" + (start + i + 1),
        body: "This is the content of post " + (start + i + 1),
      }));
      resolve({ items, hasMore: start + limit < total });
    }, 500);
  });
}

function InfiniteScroll() {
  // Implement infinite scroll list
  return <div>Implement InfiniteScroll</div>;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <h3 style={{ color: "#e2e8f0", marginBottom: 16 }}>Feed</h3>
      <InfiniteScroll />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `// Wait for initial load
await new Promise(r => setTimeout(r, 600));
let items = document.querySelectorAll('[data-testid="scroll-item"]');
console.assert(items.length === 10, 'Test 1: Initial 10 items loaded');

const container = document.querySelector('[data-testid="scroll-container"]');
console.assert(container !== null, 'Test 2: Scroll container exists');

// Scroll to bottom
container.scrollTop = container.scrollHeight;
container.dispatchEvent(new Event('scroll'));
await new Promise(r => setTimeout(r, 600));

items = document.querySelectorAll('[data-testid="scroll-item"]');
console.assert(items.length === 20, 'Test 3: 20 items after scrolling');`,
    tags: ["scroll-events", "async", "loading-state", "pagination"],
    order: 3,
    timeEstimate: "25-30 min",
    hints: [
      "Use onScroll on a fixed-height container with overflow-y: auto",
      "Check: scrollTop + clientHeight >= scrollHeight - threshold",
      "Use a loading ref (not state) to prevent duplicate fetches — state updates are async",
    ],
    keyInsight: "Infinite scroll combines scroll detection + async loading + deduplication. The loading guard (ref, not state) prevents race conditions. Same pattern drives Twitter feeds, chat apps, and any virtualized list.",
    solution: `const { useState, useEffect, useRef, useCallback } = React;

function InfiniteScroll() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    const { items: newItems, hasMore: more } = await fetchItems(pageRef.current);
    setItems((prev) => [...prev, ...newItems]);
    setHasMore(more);
    pageRef.current++;
    setLoading(false);
    loadingRef.current = false;
  }, [hasMore]);

  useEffect(() => { loadMore(); }, []);

  const handleScroll = useCallback((e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 100) loadMore();
  }, [loadMore]);

  return (
    <div data-testid="scroll-container" onScroll={handleScroll}
      style={{ height: 400, overflowY: "auto", border: "1px solid #1e293b", borderRadius: 8 }}>
      {items.map((item) => (
        <div key={item.id} data-testid="scroll-item" style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 500 }}>{item.title}</div>
          <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>{item.body}</div>
        </div>
      ))}
      {loading && <div style={{ padding: 16, textAlign: "center", color: "#64748b" }}>Loading...</div>}
      {!hasMore && <div style={{ padding: 16, textAlign: "center", color: "#475569", fontSize: 13 }}>No more items</div>}
    </div>
  );
}`,
    solutionExplanation: "Fixed-height container with onScroll. When near bottom, trigger loadMore(). loadingRef prevents double requests. Items accumulate via spread. hasMore flag stops at end.",
  },
  {
    id: "mc-22",
    chapterId: 3,
    title: "Filterable Product Grid",
    difficulty: "medium",
    description:
      "Build a product grid with category filter buttons and a search bar. Products can be filtered by category AND searched by name simultaneously. Show a count of matching products.",
    requirements: [
      "Display products in a responsive grid",
      "Category filter buttons (All, and each category)",
      "Search input that filters by product name",
      "Filters work together (category AND search)",
      "Show count of filtered results",
    ],
    starterCode: `const { useState, useMemo } = React;

const products = [
  { id: 1, name: "Wireless Mouse", category: "Electronics", price: 29.99 },
  { id: 2, name: "React Book", category: "Books", price: 39.99 },
  { id: 3, name: "USB-C Hub", category: "Electronics", price: 49.99 },
  { id: 4, name: "Desk Lamp", category: "Home", price: 24.99 },
  { id: 5, name: "JavaScript Guide", category: "Books", price: 34.99 },
  { id: 6, name: "Mechanical Keyboard", category: "Electronics", price: 89.99 },
  { id: 7, name: "Plant Pot", category: "Home", price: 14.99 },
  { id: 8, name: "CSS Handbook", category: "Books", price: 29.99 },
  { id: 9, name: "Monitor Stand", category: "Home", price: 44.99 },
  { id: 10, name: "Webcam HD", category: "Electronics", price: 59.99 },
];

function ProductGrid() {
  // Implement filterable product grid
  return <div>Implement ProductGrid</div>;
}

function App() {
  return (
    <div style={{ padding: 24 }}>
      <ProductGrid />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const filterBtns = document.querySelectorAll('[data-testid="filter-btn"]');
console.assert(filterBtns.length >= 4, 'Test 1: Filter buttons exist (All + categories)');

let cards = document.querySelectorAll('[data-testid="product-card"]');
console.assert(cards.length === 10, 'Test 2: All 10 products shown initially');

// Filter by Electronics
filterBtns[1].click();
await new Promise(r => setTimeout(r, 50));
cards = document.querySelectorAll('[data-testid="product-card"]');
console.assert(cards.length === 4, 'Test 3: Four electronics products');

// Add search filter
const searchInput = document.querySelector('[data-testid="search-input"]');
searchInput.value = "Mouse";
searchInput.dispatchEvent(new Event('change', { bubbles: true }));
await new Promise(r => setTimeout(r, 50));
cards = document.querySelectorAll('[data-testid="product-card"]');
console.assert(cards.length === 1, 'Test 4: One product matches Electronics + Mouse');`,
    tags: ["filtering", "derived-state", "grid-layout"],
    order: 4,
    timeEstimate: "20-25 min",
    hints: [
      "Derive unique categories from the products array with Set",
      "Use useMemo to filter products based on both activeCategory and searchQuery",
      "Chain filters: first category, then search",
    ],
    keyInsight: "Multiple filters compose by chaining .filter() calls. Each filter is independent state, and the displayed list is derived. This pattern scales to any number of filter dimensions.",
    solution: `const { useState, useMemo } = React;

function ProductGrid() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filtered = useMemo(() => {
    return products
      .filter((p) => category === "All" || p.category === category)
      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [category, search]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {categories.map((cat) => (
          <button key={cat} data-testid="filter-btn" onClick={() => setCategory(cat)}
            style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13,
              background: category === cat ? "#3b82f6" : "#1e293b", color: category === cat ? "white" : "#94a3b8" }}>
            {cat}
          </button>
        ))}
      </div>
      <input data-testid="search-input" value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        style={{ width: "100%", padding: "8px 12px", background: "#1e293b", border: "1px solid #334155", borderRadius: 6, color: "#e2e8f0", fontSize: 14, marginBottom: 12 }} />
      <div style={{ color: "#64748b", fontSize: 12, marginBottom: 12 }}>{filtered.length} products</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
        {filtered.map((p) => (
          <div key={p.id} data-testid="product-card" style={{ background: "#1e293b", borderRadius: 8, padding: 16 }}>
            <div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 500 }}>{p.name}</div>
            <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>{p.category}</div>
            <div style={{ color: "#3b82f6", fontSize: 16, fontWeight: 600, marginTop: 8 }}>\${p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}`,
    solutionExplanation: "Two independent filter states: category and search. Filtered products derived via useMemo with chained .filter() calls. Categories extracted with Set. Grid uses CSS auto-fill.",
  },
  {
    id: "mc-23",
    chapterId: 3,
    title: "Tree View / File Explorer",
    difficulty: "hard",
    description:
      "Build a recursive tree view component like a file explorer. Folders can be expanded/collapsed to show children. Files are leaf nodes. Support nested folders to any depth.",
    requirements: [
      "Render a tree structure with folders and files",
      "Clicking a folder toggles its children visibility",
      "Show different icons for folders (open/closed) and files",
      "Support arbitrary nesting depth",
      "Indent children to show hierarchy",
    ],
    starterCode: `const { useState } = React;

const fileTree = {
  name: "src",
  type: "folder",
  children: [
    { name: "components",
      type: "folder",
      children: [
        { name: "Header.tsx", type: "file" },
        { name: "Footer.tsx", type: "file" },
        { name: "ui", type: "folder", children: [
          { name: "Button.tsx", type: "file" },
          { name: "Modal.tsx", type: "file" },
        ]},
      ],
    },
    { name: "hooks", type: "folder", children: [
      { name: "useAuth.ts", type: "file" },
      { name: "useFetch.ts", type: "file" },
    ]},
    { name: "App.tsx", type: "file" },
    { name: "index.tsx", type: "file" },
  ],
};

function TreeView({ node, depth }) {
  // Implement recursive tree view
  return <div>Implement TreeView</div>;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 360 }}>
      <h3 style={{ color: "#e2e8f0", marginBottom: 12 }}>File Explorer</h3>
      <TreeView node={fileTree} depth={0} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const folders = document.querySelectorAll('[data-testid="tree-folder"]');
console.assert(folders.length >= 1, 'Test 1: At least one folder rendered');

const files = document.querySelectorAll('[data-testid="tree-file"]');
console.assert(files.length >= 1, 'Test 2: At least one file rendered');

// Click the first folder to toggle
folders[0].click();
await new Promise(r => setTimeout(r, 50));

// Click again to verify toggle
folders[0].click();
await new Promise(r => setTimeout(r, 50));
console.assert(true, 'Test 3: Folder toggles without error');`,
    tags: ["recursion", "tree-structure", "component-composition"],
    order: 5,
    timeEstimate: "20-25 min",
    hints: [
      "The component recursively renders itself for each child node",
      "A folder node manages its own expanded state independently",
      "Depth prop controls the left padding/indentation",
    ],
    keyInsight: "Recursive components render themselves for children. Each folder instance manages its own expanded state. This pattern builds file trees, org charts, nested comments, and navigation menus.",
    solution: `const { useState } = React;

function TreeView({ node, depth = 0 }) {
  const [expanded, setExpanded] = useState(depth === 0);
  const isFolder = node.type === "folder";

  return (
    <div>
      <div
        data-testid={isFolder ? "tree-folder" : "tree-file"}
        onClick={(e) => { e.stopPropagation(); if (isFolder) setExpanded(!expanded); }}
        style={{
          display: "flex", alignItems: "center", gap: 6, padding: "4px 8px",
          paddingLeft: depth * 16 + 8, cursor: isFolder ? "pointer" : "default",
          color: "#e2e8f0", fontSize: 14, borderRadius: 4,
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#1e293b"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        <span style={{ fontSize: 13 }}>
          {isFolder ? (expanded ? "📂" : "📁") : "📄"}
        </span>
        <span style={{ color: isFolder ? "#e2e8f0" : "#94a3b8" }}>{node.name}</span>
      </div>
      {isFolder && expanded && node.children && (
        <div>
          {node.children.map((child, i) => (
            <TreeView key={child.name + i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}`,
    solutionExplanation: "Each TreeView instance is either a file (leaf) or folder (expandable). Folders have local expanded state. Children are rendered recursively with depth+1. Depth controls indentation via paddingLeft.",
  },
  {
    id: "mc-24",
    chapterId: 3,
    title: "Virtualized List",
    difficulty: "hard",
    description:
      "Build a virtualized/windowed list that efficiently renders only the visible items in a scrollable container. Handle 10,000+ items without performance issues.",
    requirements: [
      "Render only visible items (plus a small buffer)",
      "Smooth scrolling with no jank for 10,000+ items",
      "Fixed item height for simplified calculation",
      "Scroll position determines which items to render",
      "Show a scroll bar proportional to total content height",
    ],
    starterCode: `const { useState, useRef, useCallback } = React;

const ITEM_HEIGHT = 40;
const VISIBLE_COUNT = 15;
const BUFFER = 5;

function VirtualList({ items }) {
  // Render only visible items based on scroll position
  return <div>Implement VirtualList</div>;
}

const items = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: "Item #" + (i + 1),
}));

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <h3 style={{ color: "#e2e8f0", marginBottom: 12 }}>10,000 Items (Virtualized)</h3>
      <VirtualList items={items} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const container = document.querySelector('[data-testid="virtual-container"]');
console.assert(container !== null, 'Test 1: Virtual container exists');

const rendered = document.querySelectorAll('[data-testid="virtual-item"]');
console.assert(rendered.length < 50, 'Test 2: Far fewer than 10000 items rendered');
console.assert(rendered.length > 0, 'Test 3: Some items are rendered');

// Scroll down
container.scrollTop = 5000;
container.dispatchEvent(new Event('scroll'));
await new Promise(r => setTimeout(r, 50));

const afterScroll = document.querySelectorAll('[data-testid="virtual-item"]');
console.assert(afterScroll.length < 50, 'Test 4: Still only renders visible items after scroll');`,
    tags: ["virtualization", "performance", "scroll"],
    order: 6,
    timeEstimate: "25-30 min",
    hints: [
      "Total height = items.length * ITEM_HEIGHT (set on an inner spacer div)",
      "startIndex = Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER",
      "Each visible item positioned with position: absolute + top: index * ITEM_HEIGHT",
    ],
    keyInsight: "Virtualization renders only visible DOM nodes while faking total height with a spacer. Start index derived from scrollTop / itemHeight. This is how react-window and tanstack-virtual work internally.",
    solution: `const { useState, useRef, useCallback } = React;

function VirtualList({ items }) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerHeight = VISIBLE_COUNT * ITEM_HEIGHT;

  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER);
  const endIndex = Math.min(items.length, Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT) + BUFFER);
  const visibleItems = items.slice(startIndex, endIndex);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return (
    <div data-testid="virtual-container" onScroll={handleScroll}
      style={{ height: containerHeight, overflowY: "auto", border: "1px solid #1e293b", borderRadius: 8, position: "relative" }}>
      <div style={{ height: items.length * ITEM_HEIGHT, position: "relative" }}>
        {visibleItems.map((item, i) => (
          <div key={item.id} data-testid="virtual-item" style={{
            position: "absolute", top: (startIndex + i) * ITEM_HEIGHT,
            left: 0, right: 0, height: ITEM_HEIGHT,
            display: "flex", alignItems: "center", padding: "0 16px",
            borderBottom: "1px solid #0f172a", color: "#e2e8f0", fontSize: 14
          }}>
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    solutionExplanation: "Container has fixed viewport height. Inner div has full content height (items * itemHeight). Only visible items (start to end index ± buffer) are rendered with absolute positioning. ScrollTop drives the window.",
  },
  {
    id: "mc-25",
    chapterId: 3,
    title: "Kanban Board",
    difficulty: "hard",
    description:
      "Build a simple Kanban board with three columns (Todo, In Progress, Done). Cards can be moved between columns using buttons. Support adding new cards to the Todo column.",
    requirements: [
      "Three columns: Todo, In Progress, Done",
      "Cards display a title and can be moved to adjacent columns",
      "Add new cards to the Todo column via an input",
      "Cards can be deleted",
      "Show card count in each column header",
    ],
    starterCode: `const { useState } = React;

function KanbanBoard() {
  // Implement Kanban board with three columns
  return <div>Implement KanbanBoard</div>;
}

function App() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: "#e2e8f0", marginBottom: 16 }}>Project Board</h2>
      <KanbanBoard />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const columns = document.querySelectorAll('[data-testid="kanban-column"]');
console.assert(columns.length === 3, 'Test 1: Three columns exist');

const addInput = document.querySelector('[data-testid="add-card-input"]');
const addBtn = document.querySelector('[data-testid="add-card-btn"]');
console.assert(addInput !== null, 'Test 2: Add card input exists');

// Add a card
addInput.value = "New Task";
addInput.dispatchEvent(new Event('change', { bubbles: true }));
addBtn.click();
await new Promise(r => setTimeout(r, 50));

let todoCards = columns[0].querySelectorAll('[data-testid="kanban-card"]');
console.assert(todoCards.length >= 1, 'Test 3: Card added to Todo column');

// Move card to next column
const moveBtn = todoCards[0].querySelector('[data-testid="move-right"]');
moveBtn.click();
await new Promise(r => setTimeout(r, 50));

const inProgressCards = columns[1].querySelectorAll('[data-testid="kanban-card"]');
console.assert(inProgressCards.length >= 1, 'Test 4: Card moved to In Progress');`,
    tags: ["multi-column", "state-management", "cards"],
    order: 7,
    timeEstimate: "25-30 min",
    hints: [
      "Store cards as an array with a status field: 'todo' | 'inProgress' | 'done'",
      "Moving a card just changes its status field",
      "Each column filters cards by status",
    ],
    keyInsight: "Kanban is a single flat array with a status field on each item. Moving cards between columns = changing the status property. The columns are just filtered views of the same data.",
    solution: `const { useState } = React;

let cardId = 0;
const COLUMNS = [
  { key: "todo", label: "Todo", color: "#64748b" },
  { key: "inProgress", label: "In Progress", color: "#f59e0b" },
  { key: "done", label: "Done", color: "#22c55e" },
];

function KanbanBoard() {
  const [cards, setCards] = useState([]);
  const [input, setInput] = useState("");

  const addCard = () => {
    if (!input.trim()) return;
    setCards((prev) => [...prev, { id: ++cardId, title: input.trim(), status: "todo" }]);
    setInput("");
  };

  const moveCard = (id, newStatus) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
  };

  const deleteCard = (id) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const colIdx = (key) => COLUMNS.findIndex((c) => c.key === key);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input data-testid="add-card-input" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCard()}
          placeholder="New task..."
          style={{ flex: 1, padding: "8px 12px", background: "#1e293b", border: "1px solid #334155", borderRadius: 6, color: "#e2e8f0", fontSize: 14 }} />
        <button data-testid="add-card-btn" onClick={addCard}
          style={{ padding: "8px 16px", background: "#3b82f6", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14 }}>Add</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {COLUMNS.map((col, ci) => {
          const colCards = cards.filter((c) => c.status === col.key);
          return (
            <div key={col.key} data-testid="kanban-column" style={{ background: "#0f172a", borderRadius: 8, padding: 12, minHeight: 200 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ color: col.color, fontSize: 14, fontWeight: 600 }}>{col.label}</span>
                <span style={{ color: "#475569", fontSize: 12 }}>{colCards.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {colCards.map((card) => (
                  <div key={card.id} data-testid="kanban-card" style={{ background: "#1e293b", padding: 12, borderRadius: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#e2e8f0", fontSize: 13 }}>{card.title}</span>
                    <div style={{ display: "flex", gap: 4 }}>
                      {ci > 0 && <button data-testid="move-left" onClick={() => moveCard(card.id, COLUMNS[ci - 1].key)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 12 }}>◀</button>}
                      {ci < 2 && <button data-testid="move-right" onClick={() => moveCard(card.id, COLUMNS[ci + 1].key)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 12 }}>▶</button>}
                      <button onClick={() => deleteCard(card.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 12 }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}`,
    solutionExplanation: "Flat cards array with status field. Columns filter by status. Move changes status to the adjacent column's key. Delete filters by ID. Column index determines which arrows to show.",
  },
  {
    id: "mc-26",
    chapterId: 3,
    title: "Expandable Table Rows",
    difficulty: "medium",
    description:
      "Build a table where clicking a row expands an additional detail section below it. Only one row can be expanded at a time. The expanded section shows extra information about the item.",
    requirements: [
      "Table with clickable rows",
      "Clicking a row expands a details section below it",
      "Only one row expanded at a time",
      "Click again to collapse the expanded row",
      "Show an expand/collapse indicator",
    ],
    starterCode: `const { useState } = React;

const employees = [
  { id: 1, name: "Alice Johnson", role: "Engineer", email: "alice@company.com", department: "Engineering", joined: "2022-03-15", location: "New York" },
  { id: 2, name: "Bob Smith", role: "Designer", email: "bob@company.com", department: "Design", joined: "2021-07-20", location: "London" },
  { id: 3, name: "Carol Williams", role: "PM", email: "carol@company.com", department: "Product", joined: "2023-01-10", location: "San Francisco" },
  { id: 4, name: "David Brown", role: "Engineer", email: "david@company.com", department: "Engineering", joined: "2020-11-05", location: "Berlin" },
];

function ExpandableTable() {
  // Implement table with expandable rows
  return <table>Implement ExpandableTable</table>;
}

function App() {
  return (
    <div style={{ padding: 24 }}>
      <ExpandableTable />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const rows = document.querySelectorAll('[data-testid="table-row"]');
console.assert(rows.length === 4, 'Test 1: Four table rows');

// Click first row to expand
rows[0].click();
await new Promise(r => setTimeout(r, 50));
let details = document.querySelectorAll('[data-testid="row-details"]');
console.assert(details.length === 1, 'Test 2: One expanded section');

// Click second row
rows[1].click();
await new Promise(r => setTimeout(r, 50));
details = document.querySelectorAll('[data-testid="row-details"]');
console.assert(details.length === 1, 'Test 3: Still only one expanded (switched)');

// Click second row again to collapse
rows[1].click();
await new Promise(r => setTimeout(r, 50));
details = document.querySelectorAll('[data-testid="row-details"]');
console.assert(details.length === 0, 'Test 4: Collapsed after clicking same row');`,
    tags: ["table", "expand-collapse", "single-open"],
    order: 8,
    timeEstimate: "15-20 min",
    hints: [
      "Same pattern as accordion — track expandedId (or null)",
      "Render the detail row as a <tr> with a full-width <td colSpan>",
    ],
    keyInsight: "Expandable table rows are just an accordion in table layout. The detail row uses colSpan to span all columns. Single-open controlled by one state value.",
    solution: `const { useState } = React;

function ExpandableTable() {
  const [expandedId, setExpandedId] = useState(null);
  const toggle = (id) => setExpandedId(expandedId === id ? null : id);

  const thStyle = { padding: "10px 16px", textAlign: "left", borderBottom: "2px solid #334155", color: "#94a3b8", fontSize: 13 };
  const tdStyle = { padding: "10px 16px", borderBottom: "1px solid #1e293b", color: "#e2e8f0", fontSize: 14 };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr><th style={thStyle}></th><th style={thStyle}>Name</th><th style={thStyle}>Role</th><th style={thStyle}>Email</th></tr>
      </thead>
      <tbody>
        {employees.map((emp) => (
          <React.Fragment key={emp.id}>
            <tr data-testid="table-row" onClick={() => toggle(emp.id)} style={{ cursor: "pointer" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#1e293b"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
              <td style={tdStyle}>{expandedId === emp.id ? "▼" : "▶"}</td>
              <td style={tdStyle}>{emp.name}</td>
              <td style={tdStyle}>{emp.role}</td>
              <td style={tdStyle}>{emp.email}</td>
            </tr>
            {expandedId === emp.id && (
              <tr data-testid="row-details">
                <td colSpan={4} style={{ padding: "16px", background: "#0f172a", color: "#94a3b8", fontSize: 13 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                    <div><strong style={{ color: "#64748b" }}>Department:</strong> {emp.department}</div>
                    <div><strong style={{ color: "#64748b" }}>Joined:</strong> {emp.joined}</div>
                    <div><strong style={{ color: "#64748b" }}>Location:</strong> {emp.location}</div>
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}`,
    solutionExplanation: "Single expandedId state. Toggle compares clicked ID. Detail row rendered with colSpan={4}. Fragment wraps row + optional details. Same active-index pattern as accordion/tabs.",
  },
];
