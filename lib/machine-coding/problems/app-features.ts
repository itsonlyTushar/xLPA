import { MCProblem } from "../types";

export const appFeatureProblems: MCProblem[] = [
  {
    id: "mc-35",
    chapterId: 5,
    title: "Todo App with CRUD",
    difficulty: "medium",
    description:
      "Build a complete todo application with add, toggle complete, edit, and delete functionality. Todos persist in component state and have filtering by status.",
    requirements: [
      "Add new todos via text input + Enter or Add button",
      "Toggle todo complete/incomplete by clicking",
      "Delete a todo with a remove button",
      "Edit todo text inline on double-click",
      "Filter by: All, Active, Completed",
      "Show count of remaining active todos",
    ],
    starterCode: `const { useState, useMemo } = React;

function TodoApp() {
  return <div>Implement TodoApp</div>;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 500, margin: "0 auto" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Todo List</h2>
      <TodoApp />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const input = document.querySelector('[data-testid="todo-input"]');
console.assert(input, 'Test 1: Input exists');

// Add a todo
input.value = "Buy groceries";
input.dispatchEvent(new Event("input", { bubbles: true }));
input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
await new Promise(r => setTimeout(r, 50));
let todos = document.querySelectorAll('[data-testid="todo-item"]');
console.assert(todos.length === 1, 'Test 2: Todo added');

// Add another
input.value = "Read a book";
input.dispatchEvent(new Event("input", { bubbles: true }));
input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
await new Promise(r => setTimeout(r, 50));
todos = document.querySelectorAll('[data-testid="todo-item"]');
console.assert(todos.length === 2, 'Test 3: Second todo added');

// Toggle complete
document.querySelector('[data-testid="todo-toggle"]').click();
await new Promise(r => setTimeout(r, 50));
const completed = document.querySelectorAll('[data-testid="todo-completed"]');
console.assert(completed.length === 1, 'Test 4: Todo toggled complete');

// Delete
document.querySelector('[data-testid="todo-delete"]').click();
await new Promise(r => setTimeout(r, 50));
todos = document.querySelectorAll('[data-testid="todo-item"]');
console.assert(todos.length === 1, 'Test 5: Todo deleted');`,
    tags: ["crud", "list-management", "filter", "keyboard-events"],
    order: 1,
    timeEstimate: "25-30 min",
    hints: [
      "Store todos as an array of { id, text, completed } objects",
      "Use filter state for All/Active/Completed with useMemo for filtered list",
      "For inline edit: track editingId in state, render input when editing",
    ],
    keyInsight:
      "The todo app is the canonical CRUD pattern. Each operation maps to an array method: add (spread), toggle (map), delete (filter), edit (map). Filtering creates a derived view without mutating state.",
    solution: `const { useState, useMemo, useRef } = React;

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const idRef = useRef(0);

  const addTodo = () => {
    if (!text.trim()) return;
    setTodos(prev => [...prev, { id: ++idRef.current, text: text.trim(), completed: false }]);
    setText("");
  };

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const filtered = useMemo(() => {
    if (filter === "active") return todos.filter(t => !t.completed);
    if (filter === "completed") return todos.filter(t => t.completed);
    return todos;
  }, [todos, filter]);

  const activeCount = todos.filter(t => !t.completed).length;

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input data-testid="todo-input" value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTodo()}
          placeholder="What needs to be done?"
          style={{ flex: 1, padding: "10px 14px", background: "#1a1a2e", border: "1px solid #333", borderRadius: 8, color: "#eee", outline: "none" }} />
        <button onClick={addTodo}
          style={{ padding: "10px 16px", background: "#3b82f6", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>Add</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {["all", "active", "completed"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "4px 12px", borderRadius: 16, border: "none", cursor: "pointer", fontSize: 13,
              background: filter === f ? "#3b82f6" : "#333", color: filter === f ? "white" : "#999" }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {filtered.map(todo => (
          <div key={todo.id} data-testid="todo-item"
            {...(todo.completed ? { "data-testid-completed": true } : {})}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#1a1a2e", borderRadius: 8, border: "1px solid #333" }}>
            <button data-testid="todo-toggle" onClick={() => toggleTodo(todo.id)}
              style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid " + (todo.completed ? "#22c55e" : "#555"),
                background: todo.completed ? "#22c55e" : "transparent", cursor: "pointer", flexShrink: 0 }} />
            <span {...(todo.completed ? { "data-testid": "todo-completed" } : {})}
              style={{ flex: 1, textDecoration: todo.completed ? "line-through" : "none", color: todo.completed ? "#666" : "#eee" }}>
              {todo.text}
            </span>
            <button data-testid="todo-delete" onClick={() => deleteTodo(todo.id)}
              style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16 }}>×</button>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 12, fontSize: 13, color: "#666" }}>{activeCount} item{activeCount !== 1 ? "s" : ""} left</p>
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 500, margin: "0 auto" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Todo List</h2>
      <TodoApp />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-36",
    chapterId: 5,
    title: "Shopping Cart",
    difficulty: "medium",
    description:
      "Build a shopping cart with product listing, add-to-cart, quantity adjustment, and total calculation. Products are displayed in a grid, and the cart shows selected items with totals.",
    requirements: [
      "Display product grid with name, price, and Add to Cart button",
      "Cart shows added items with quantity controls (+/−)",
      "Remove item from cart when quantity reaches 0",
      "Display subtotal for each item and grand total",
      "Show item count badge on cart icon",
    ],
    starterCode: `const { useState, useMemo } = React;

const products = [
  { id: 1, name: "Wireless Mouse", price: 29.99, emoji: "🖱️" },
  { id: 2, name: "Mechanical Keyboard", price: 79.99, emoji: "⌨️" },
  { id: 3, name: "USB-C Hub", price: 49.99, emoji: "🔌" },
  { id: 4, name: "Webcam HD", price: 59.99, emoji: "📷" },
  { id: 5, name: "Monitor Stand", price: 39.99, emoji: "🖥️" },
  { id: 6, name: "Desk Lamp", price: 24.99, emoji: "💡" },
];

function ShoppingCart() {
  return <div>Implement ShoppingCart</div>;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Shop</h2>
      <ShoppingCart />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const productCards = document.querySelectorAll('[data-testid="product-card"]');
console.assert(productCards.length === 6, 'Test 1: Six products displayed');

// Add product to cart
const addBtns = document.querySelectorAll('[data-testid="add-to-cart"]');
addBtns[0].click();
await new Promise(r => setTimeout(r, 50));
let cartItems = document.querySelectorAll('[data-testid="cart-item"]');
console.assert(cartItems.length === 1, 'Test 2: Item added to cart');

// Increase quantity
const plusBtn = document.querySelector('[data-testid="qty-plus"]');
plusBtn.click();
await new Promise(r => setTimeout(r, 50));
const qty = document.querySelector('[data-testid="qty-value"]');
console.assert(qty.textContent === "2", 'Test 3: Quantity increased');

// Check total
const total = document.querySelector('[data-testid="cart-total"]');
console.assert(total.textContent.includes("59.98"), 'Test 4: Total calculated correctly');

// Decrease to 0 removes item
const minusBtn = document.querySelector('[data-testid="qty-minus"]');
minusBtn.click();
minusBtn.click();
await new Promise(r => setTimeout(r, 50));
cartItems = document.querySelectorAll('[data-testid="cart-item"]');
console.assert(cartItems.length === 0, 'Test 5: Item removed when qty reaches 0');`,
    tags: ["cart", "quantity", "derived-state", "map-data-structure"],
    order: 2,
    timeEstimate: "25-30 min",
    hints: [
      "Use a Map or object { productId: quantity } for cart state",
      "Derive cart items by joining cart state with products data",
      "useMemo for total calculation to avoid unnecessary recalculation",
    ],
    keyInsight:
      "Shopping carts are map-based state: { id -> quantity }. All display data (names, prices) is derived by joining this map with the products array. This separation of 'what the user chose' from 'product data' is clean architecture.",
    solution: `const { useState, useMemo } = React;

const products = [
  { id: 1, name: "Wireless Mouse", price: 29.99, emoji: "🖱️" },
  { id: 2, name: "Mechanical Keyboard", price: 79.99, emoji: "⌨️" },
  { id: 3, name: "USB-C Hub", price: 49.99, emoji: "🔌" },
  { id: 4, name: "Webcam HD", price: 59.99, emoji: "📷" },
  { id: 5, name: "Monitor Stand", price: 39.99, emoji: "🖥️" },
  { id: 6, name: "Desk Lamp", price: 24.99, emoji: "💡" },
];

function ShoppingCart() {
  const [cart, setCart] = useState({});

  const addToCart = (id) => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const updateQty = (id, delta) => {
    setCart(prev => {
      const newQty = (prev[id] || 0) + delta;
      if (newQty <= 0) { const { [id]: _, ...rest } = prev; return rest; }
      return { ...prev, [id]: newQty };
    });
  };

  const cartItems = useMemo(() =>
    Object.entries(cart).map(([id, qty]) => ({
      product: products.find(p => p.id === Number(id)),
      quantity: qty
    })).filter(item => item.product),
  [cart]);

  const total = useMemo(() =>
    cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  [cartItems]);

  const itemCount = Object.values(cart).reduce((s, q) => s + q, 0);

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {products.map(p => (
            <div key={p.id} data-testid="product-card" style={{ padding: 16, background: "#1a1a2e", borderRadius: 12, border: "1px solid #333", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{p.emoji}</div>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>{p.name}</div>
              <div style={{ color: "#3b82f6", fontWeight: 600, marginBottom: 12 }}>\${p.price.toFixed(2)}</div>
              <button data-testid="add-to-cart" onClick={() => addToCart(p.id)}
                style={{ padding: "6px 16px", background: "#3b82f6", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: 280, flexShrink: 0 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Cart ({itemCount})</h3>
        {cartItems.length === 0 ? (
          <p style={{ color: "#666", fontSize: 14 }}>Your cart is empty</p>
        ) : (
          <div>
            {cartItems.map(({ product, quantity }) => (
              <div key={product.id} data-testid="cart-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #333" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{product.name}</div>
                  <div style={{ fontSize: 12, color: "#999" }}>\${(product.price * quantity).toFixed(2)}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button data-testid="qty-minus" onClick={() => updateQty(product.id, -1)}
                    style={{ width: 24, height: 24, borderRadius: 4, border: "1px solid #555", background: "transparent", color: "#eee", cursor: "pointer" }}>−</button>
                  <span data-testid="qty-value" style={{ fontSize: 14, minWidth: 16, textAlign: "center" }}>{quantity}</span>
                  <button data-testid="qty-plus" onClick={() => updateQty(product.id, 1)}
                    style={{ width: 24, height: 24, borderRadius: 4, border: "1px solid #555", background: "transparent", color: "#eee", cursor: "pointer" }}>+</button>
                </div>
              </div>
            ))}
            <div data-testid="cart-total" style={{ marginTop: 12, fontWeight: 600, fontSize: 16, textAlign: "right" }}>
              Total: \${total.toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Shop</h2>
      <ShoppingCart />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-37",
    chapterId: 5,
    title: "Comment Thread",
    difficulty: "medium",
    description:
      "Build a nested comment system where users can add top-level comments and reply to existing comments. Each comment shows author, timestamp, and reply count.",
    requirements: [
      "Add top-level comments via an input form",
      "Reply to any comment (one level of nesting)",
      "Show reply count for each comment with replies",
      "Toggle showing/hiding replies",
      "Display relative timestamps (e.g., '2 min ago')",
    ],
    starterCode: `const { useState, useRef } = React;

function CommentThread() {
  return <div>Implement CommentThread</div>;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Discussion</h2>
      <CommentThread />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `// Add a comment
const input = document.querySelector('[data-testid="comment-input"]');
input.value = "Great article!";
input.dispatchEvent(new Event("input", { bubbles: true }));
document.querySelector('[data-testid="comment-submit"]').click();
await new Promise(r => setTimeout(r, 50));
let comments = document.querySelectorAll('[data-testid="comment"]');
console.assert(comments.length === 1, 'Test 1: Comment added');

// Add another
input.value = "Thanks for sharing";
input.dispatchEvent(new Event("input", { bubbles: true }));
document.querySelector('[data-testid="comment-submit"]').click();
await new Promise(r => setTimeout(r, 50));
comments = document.querySelectorAll('[data-testid="comment"]');
console.assert(comments.length === 2, 'Test 2: Second comment added');

// Click reply on first comment
const replyBtns = document.querySelectorAll('[data-testid="reply-btn"]');
replyBtns[0].click();
await new Promise(r => setTimeout(r, 50));
const replyInput = document.querySelector('[data-testid="reply-input"]');
console.assert(replyInput, 'Test 3: Reply input shown');

// Submit reply
replyInput.value = "I agree!";
replyInput.dispatchEvent(new Event("input", { bubbles: true }));
document.querySelector('[data-testid="reply-submit"]').click();
await new Promise(r => setTimeout(r, 50));
const replies = document.querySelectorAll('[data-testid="reply"]');
console.assert(replies.length === 1, 'Test 4: Reply added');`,
    tags: ["nested-data", "tree-structure", "reply", "timestamp"],
    order: 3,
    timeEstimate: "25-30 min",
    hints: [
      "Store comments as a flat list with parentId: null for top-level, parentId: commentId for replies",
      "Use a separate replies array per comment, or filter the flat list",
      "Track replyingTo state to show the reply input at the right comment",
    ],
    keyInsight:
      "Comment threads are tree data displayed as nested lists. A flat array with parentId references is easier to manage than deeply nested objects. To display, filter for roots (parentId=null) and their children.",
    solution: `const { useState, useRef } = React;

function CommentThread() {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const idRef = useRef(0);

  const addComment = () => {
    if (!text.trim()) return;
    setComments(prev => [...prev, { id: ++idRef.current, text: text.trim(), parentId: null, time: Date.now() }]);
    setText("");
  };

  const addReply = (parentId) => {
    if (!replyText.trim()) return;
    setComments(prev => [...prev, { id: ++idRef.current, text: replyText.trim(), parentId, time: Date.now() }]);
    setReplyText("");
    setReplyingTo(null);
  };

  const topComments = comments.filter(c => c.parentId === null);
  const getReplies = (id) => comments.filter(c => c.parentId === id);

  const timeAgo = (ts) => {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return "just now";
    if (s < 3600) return Math.floor(s / 60) + " min ago";
    return Math.floor(s / 3600) + " hr ago";
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input data-testid="comment-input" value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addComment()} placeholder="Write a comment..."
          style={{ flex: 1, padding: "10px 14px", background: "#1a1a2e", border: "1px solid #333", borderRadius: 8, color: "#eee", outline: "none" }} />
        <button data-testid="comment-submit" onClick={addComment}
          style={{ padding: "10px 16px", background: "#3b82f6", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>Post</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {topComments.map(comment => {
          const replies = getReplies(comment.id);
          return (
            <div key={comment.id} data-testid="comment" style={{ padding: 14, background: "#1a1a2e", borderRadius: 10, border: "1px solid #333" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontWeight: 500, fontSize: 14 }}>User</span>
                <span style={{ fontSize: 12, color: "#666" }}>{timeAgo(comment.time)}</span>
              </div>
              <p style={{ color: "#ccc", fontSize: 14, marginBottom: 8 }}>{comment.text}</p>
              <button data-testid="reply-btn" onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: 13 }}>
                Reply {replies.length > 0 ? "(" + replies.length + ")" : ""}
              </button>
              {replyingTo === comment.id && (
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <input data-testid="reply-input" value={replyText} onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addReply(comment.id)} placeholder="Write a reply..."
                    style={{ flex: 1, padding: "8px 12px", background: "#111", border: "1px solid #333", borderRadius: 6, color: "#eee", outline: "none", fontSize: 13 }} />
                  <button data-testid="reply-submit" onClick={() => addReply(comment.id)}
                    style={{ padding: "8px 12px", background: "#3b82f6", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>Reply</button>
                </div>
              )}
              {replies.length > 0 && (
                <div style={{ marginTop: 8, marginLeft: 20, borderLeft: "2px solid #333", paddingLeft: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                  {replies.map(r => (
                    <div key={r.id} data-testid="reply" style={{ padding: 10, background: "#111", borderRadius: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontWeight: 500, fontSize: 13 }}>User</span>
                        <span style={{ fontSize: 11, color: "#666" }}>{timeAgo(r.time)}</span>
                      </div>
                      <p style={{ color: "#aaa", fontSize: 13 }}>{r.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Discussion</h2>
      <CommentThread />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-38",
    chapterId: 5,
    title: "Notification Feed",
    difficulty: "medium",
    description:
      "Build a notification feed with different notification types (like, comment, follow). Notifications can be marked as read individually or all at once, and unread count is shown.",
    requirements: [
      "Display a list of notifications with type icon, message, and time",
      "Different styles for unread vs read notifications",
      "Click a notification to mark it as read",
      "Mark All as Read button",
      "Show unread count badge",
      "Filter by notification type",
    ],
    starterCode: `const { useState, useMemo } = React;

const initialNotifications = [
  { id: 1, type: "like", message: "Alice liked your post", time: Date.now() - 120000, read: false },
  { id: 2, type: "comment", message: "Bob commented on your photo", time: Date.now() - 300000, read: false },
  { id: 3, type: "follow", message: "Charlie started following you", time: Date.now() - 600000, read: true },
  { id: 4, type: "like", message: "Diana liked your comment", time: Date.now() - 900000, read: false },
  { id: 5, type: "comment", message: "Eve replied to your thread", time: Date.now() - 1800000, read: false },
  { id: 6, type: "follow", message: "Frank started following you", time: Date.now() - 3600000, read: true },
];

function NotificationFeed() {
  return <div>Implement NotificationFeed</div>;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 500, margin: "0 auto" }}>
      <NotificationFeed />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const notifications = document.querySelectorAll('[data-testid="notification"]');
console.assert(notifications.length === 6, 'Test 1: Six notifications displayed');

const badge = document.querySelector('[data-testid="unread-count"]');
console.assert(badge.textContent === "4", 'Test 2: Unread count is 4');

// Click to mark as read
notifications[0].click();
await new Promise(r => setTimeout(r, 50));
const badgeAfter = document.querySelector('[data-testid="unread-count"]');
console.assert(badgeAfter.textContent === "3", 'Test 3: Unread count decreased');

// Mark all as read
document.querySelector('[data-testid="mark-all-read"]').click();
await new Promise(r => setTimeout(r, 50));
const badgeFinal = document.querySelector('[data-testid="unread-count"]');
console.assert(badgeFinal.textContent === "0", 'Test 4: All marked as read');`,
    tags: ["notifications", "read-state", "filter", "badge"],
    order: 4,
    timeEstimate: "20-25 min",
    hints: [
      "Store notifications array with read boolean in state",
      "Mark as read: map over and set read:true for the clicked id",
      "Mark all: map and set all to read:true",
    ],
    keyInsight:
      "Notification feeds demonstrate boolean-flag state updates across a list. The map pattern (update matching item, pass through others) is the core technique. Derived counts (unread) come from filter().length.",
    solution: `const { useState, useMemo } = React;

const initialNotifications = [
  { id: 1, type: "like", message: "Alice liked your post", time: Date.now() - 120000, read: false },
  { id: 2, type: "comment", message: "Bob commented on your photo", time: Date.now() - 300000, read: false },
  { id: 3, type: "follow", message: "Charlie started following you", time: Date.now() - 600000, read: true },
  { id: 4, type: "like", message: "Diana liked your comment", time: Date.now() - 900000, read: false },
  { id: 5, type: "comment", message: "Eve replied to your thread", time: Date.now() - 1800000, read: false },
  { id: 6, type: "follow", message: "Frank started following you", time: Date.now() - 3600000, read: true },
];

const icons = { like: "❤️", comment: "💬", follow: "👤" };

function NotificationFeed() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");

  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = useMemo(() => filter === "all" ? notifications : notifications.filter(n => n.type === filter), [notifications, filter]);

  const timeAgo = (ts) => {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return "just now";
    if (s < 3600) return Math.floor(s / 60) + "m ago";
    return Math.floor(s / 3600) + "h ago";
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600 }}>Notifications</h3>
          <span data-testid="unread-count" style={{ background: unreadCount ? "#ef4444" : "#555", color: "white", borderRadius: 12, padding: "2px 8px", fontSize: 12, fontWeight: 600 }}>{unreadCount}</span>
        </div>
        <button data-testid="mark-all-read" onClick={markAllRead}
          style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: 13 }}>Mark all read</button>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {["all", "like", "comment", "follow"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "4px 12px", borderRadius: 16, border: "none", cursor: "pointer", fontSize: 12,
              background: filter === f ? "#3b82f6" : "#333", color: filter === f ? "white" : "#999" }}>
            {f === "all" ? "All" : icons[f] + " " + f}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {filtered.map(n => (
          <div key={n.id} data-testid="notification" onClick={() => markRead(n.id)}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 8, cursor: "pointer",
              background: n.read ? "transparent" : "#1a1a3e", border: "1px solid " + (n.read ? "#222" : "#333")
            }}>
            <span style={{ fontSize: 20 }}>{icons[n.type]}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, color: n.read ? "#777" : "#eee" }}>{n.message}</p>
              <span style={{ fontSize: 11, color: "#555" }}>{timeAgo(n.time)}</span>
            </div>
            {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6", flexShrink: 0 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 500, margin: "0 auto" }}>
      <NotificationFeed />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-39",
    chapterId: 5,
    title: "Quiz App",
    difficulty: "medium",
    description:
      "Build a multiple-choice quiz app. Show one question at a time, track selected answers, show immediate feedback (correct/wrong), and display a score summary at the end.",
    requirements: [
      "Display one question at a time with 4 options",
      "Highlight selected option, show correct/incorrect immediately",
      "Next button to advance (disabled until answer selected)",
      "Progress indicator (question X of Y)",
      "Score summary screen at the end with percentage",
    ],
    starterCode: `const { useState } = React;

const questions = [
  { id: 1, question: "What hook manages state in React?", options: ["useEffect", "useState", "useRef", "useMemo"], answer: 1 },
  { id: 2, question: "What does JSX stand for?", options: ["JavaScript XML", "Java Syntax Extension", "JSON eXtension", "JavaScript eXtra"], answer: 0 },
  { id: 3, question: "Which method creates a React element?", options: ["React.mount()", "React.render()", "React.createElement()", "React.build()"], answer: 2 },
  { id: 4, question: "What is the virtual DOM?", options: ["A browser API", "A lightweight copy of the real DOM", "A CSS framework", "A testing library"], answer: 1 },
  { id: 5, question: "Which hook runs side effects?", options: ["useState", "useContext", "useEffect", "useReducer"], answer: 2 },
];

function QuizApp() {
  return <div>Implement QuizApp</div>;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <QuizApp />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const questionEl = document.querySelector('[data-testid="question"]');
console.assert(questionEl, 'Test 1: Question displayed');
console.assert(questionEl.textContent.includes("hook"), 'Test 2: First question text');

const options = document.querySelectorAll('[data-testid="option"]');
console.assert(options.length === 4, 'Test 3: Four options');

// Select correct answer (useState, index 1)
options[1].click();
await new Promise(r => setTimeout(r, 50));
const nextBtn = document.querySelector('[data-testid="next-btn"]');
console.assert(nextBtn, 'Test 4: Next button appears');

// Go to next
nextBtn.click();
await new Promise(r => setTimeout(r, 50));
const q2 = document.querySelector('[data-testid="question"]');
console.assert(q2.textContent.includes("JSX"), 'Test 5: Advanced to next question');

const progress = document.querySelector('[data-testid="progress"]');
console.assert(progress.textContent.includes("2"), 'Test 6: Progress shows question 2');`,
    tags: ["quiz", "multi-step", "score", "feedback"],
    order: 5,
    timeEstimate: "25-30 min",
    hints: [
      "Track currentQuestion index, selectedAnswer, and answers array in state",
      "After selecting, show green for correct option and red for selected-wrong",
      "Build score at the end by comparing answers array to correct answers",
    ],
    keyInsight:
      "Quiz apps combine stepped navigation with answer tracking. The key pattern is separating question navigation (index) from answer collection (array). Feedback is derived by comparing selected vs correct — no extra state needed.",
    solution: `const { useState } = React;

const questions = [
  { id: 1, question: "What hook manages state in React?", options: ["useEffect", "useState", "useRef", "useMemo"], answer: 1 },
  { id: 2, question: "What does JSX stand for?", options: ["JavaScript XML", "Java Syntax Extension", "JSON eXtension", "JavaScript eXtra"], answer: 0 },
  { id: 3, question: "Which method creates a React element?", options: ["React.mount()", "React.render()", "React.createElement()", "React.build()"], answer: 2 },
  { id: 4, question: "What is the virtual DOM?", options: ["A browser API", "A lightweight copy of the real DOM", "A CSS framework", "A testing library"], answer: 1 },
  { id: 5, question: "Which hook runs side effects?", options: ["useState", "useContext", "useEffect", "useReducer"], answer: 2 },
];

function QuizApp() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);

  const q = questions[current];

  const handleSelect = (i) => {
    if (selected !== null) return;
    setSelected(i);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
    } else {
      setDone(true);
    }
  };

  if (done) {
    const score = answers.reduce((s, a, i) => s + (a === questions[i].answer ? 1 : 0), 0);
    return (
      <div style={{ textAlign: "center", padding: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Quiz Complete!</h2>
        <div style={{ fontSize: 48, fontWeight: 700, color: score >= 3 ? "#22c55e" : "#ef4444", marginBottom: 8 }}>
          {score}/{questions.length}
        </div>
        <p style={{ color: "#999" }}>{Math.round(score / questions.length * 100)}% correct</p>
      </div>
    );
  }

  return (
    <div>
      <div data-testid="progress" style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
        Question {current + 1} of {questions.length}
      </div>
      <div style={{ height: 4, background: "#333", borderRadius: 2, marginBottom: 24 }}>
        <div style={{ height: "100%", background: "#3b82f6", borderRadius: 2, width: ((current + 1) / questions.length * 100) + "%", transition: "width 0.3s" }} />
      </div>
      <h3 data-testid="question" style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>{q.question}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {q.options.map((opt, i) => {
          let bg = "#1a1a2e";
          let border = "#333";
          if (selected !== null) {
            if (i === q.answer) { bg = "#22c55e20"; border = "#22c55e"; }
            else if (i === selected) { bg = "#ef444420"; border = "#ef4444"; }
          } else if (false) {} // placeholder for consistent structure
          return (
            <button key={i} data-testid="option" onClick={() => handleSelect(i)}
              style={{ padding: "12px 16px", background: bg, border: "1px solid " + border, borderRadius: 8, textAlign: "left", color: "#eee", cursor: selected !== null ? "default" : "pointer", fontSize: 15 }}>
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <button data-testid="next-btn" onClick={handleNext}
          style={{ marginTop: 20, padding: "10px 24px", background: "#3b82f6", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>
          {current < questions.length - 1 ? "Next →" : "See Results"}
        </button>
      )}
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <QuizApp />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-40",
    chapterId: 5,
    title: "Expense Tracker",
    difficulty: "medium",
    description:
      "Build an expense tracker with income/expense entries, running balance, and a breakdown summary. Users can add transactions with amount, category, and type (income/expense).",
    requirements: [
      "Add transactions with description, amount, and type (income/expense)",
      "Display running balance prominently",
      "Show income and expense totals separately",
      "List all transactions sorted by most recent",
      "Delete individual transactions",
      "Color code income (green) and expenses (red)",
    ],
    starterCode: `const { useState, useMemo } = React;

function ExpenseTracker() {
  return <div>Implement ExpenseTracker</div>;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 500, margin: "0 auto" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Expense Tracker</h2>
      <ExpenseTracker />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `// Add income
const descInput = document.querySelector('[data-testid="desc-input"]');
const amtInput = document.querySelector('[data-testid="amount-input"]');
descInput.value = "Salary";
descInput.dispatchEvent(new Event("input", { bubbles: true }));
amtInput.value = "5000";
amtInput.dispatchEvent(new Event("input", { bubbles: true }));
document.querySelector('[data-testid="type-income"]').click();
document.querySelector('[data-testid="add-btn"]').click();
await new Promise(r => setTimeout(r, 50));

const balance = document.querySelector('[data-testid="balance"]');
console.assert(balance.textContent.includes("5000"), 'Test 1: Balance shows 5000');

// Add expense
descInput.value = "Rent";
descInput.dispatchEvent(new Event("input", { bubbles: true }));
amtInput.value = "1500";
amtInput.dispatchEvent(new Event("input", { bubbles: true }));
document.querySelector('[data-testid="type-expense"]').click();
document.querySelector('[data-testid="add-btn"]').click();
await new Promise(r => setTimeout(r, 50));

const balance2 = document.querySelector('[data-testid="balance"]');
console.assert(balance2.textContent.includes("3500"), 'Test 2: Balance updated');

const transactions = document.querySelectorAll('[data-testid="transaction"]');
console.assert(transactions.length === 2, 'Test 3: Two transactions listed');

// Delete transaction
document.querySelector('[data-testid="delete-transaction"]').click();
await new Promise(r => setTimeout(r, 50));
const remaining = document.querySelectorAll('[data-testid="transaction"]');
console.assert(remaining.length === 1, 'Test 4: Transaction deleted');`,
    tags: ["finance", "derived-state", "crud", "form"],
    order: 6,
    timeEstimate: "20-25 min",
    hints: [
      "Store transactions as { id, desc, amount, type } array",
      "Derive balance, totalIncome, totalExpense with useMemo + reduce",
      "Amount is always positive, type determines add or subtract",
    ],
    keyInsight:
      "Expense trackers show derived aggregations from a list. Balance, income total, and expense total are all computed from the same transactions array using reduce — never store derived values in state.",
    solution: `const { useState, useMemo, useRef } = React;

function ExpenseTracker() {
  const [transactions, setTransactions] = useState([]);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const idRef = useRef(0);

  const add = () => {
    if (!desc.trim() || !amount) return;
    setTransactions(prev => [{ id: ++idRef.current, desc: desc.trim(), amount: Number(amount), type }, ...prev]);
    setDesc(""); setAmount("");
  };

  const remove = (id) => setTransactions(prev => prev.filter(t => t.id !== id));

  const { balance, income, expense } = useMemo(() => {
    let income = 0, expense = 0;
    transactions.forEach(t => { if (t.type === "income") income += t.amount; else expense += t.amount; });
    return { balance: income - expense, income, expense };
  }, [transactions]);

  return (
    <div>
      <div data-testid="balance" style={{ textAlign: "center", padding: 20, background: "#1a1a2e", borderRadius: 12, border: "1px solid #333", marginBottom: 16 }}>
        <div style={{ color: "#999", fontSize: 13, marginBottom: 4 }}>Balance</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: balance >= 0 ? "#22c55e" : "#ef4444" }}>\${balance.toFixed(2)}</div>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, textAlign: "center", padding: 12, background: "#22c55e10", borderRadius: 8, border: "1px solid #22c55e30" }}>
          <div style={{ fontSize: 12, color: "#22c55e" }}>Income</div>
          <div style={{ fontWeight: 600, color: "#22c55e" }}>\${income.toFixed(2)}</div>
        </div>
        <div style={{ flex: 1, textAlign: "center", padding: 12, background: "#ef444410", borderRadius: 8, border: "1px solid #ef444430" }}>
          <div style={{ fontSize: 12, color: "#ef4444" }}>Expense</div>
          <div style={{ fontWeight: 600, color: "#ef4444" }}>\${expense.toFixed(2)}</div>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <input data-testid="desc-input" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description"
          style={{ width: "100%", padding: "10px 14px", background: "#1a1a2e", border: "1px solid #333", borderRadius: 8, color: "#eee", outline: "none", marginBottom: 8, boxSizing: "border-box" }} />
        <div style={{ display: "flex", gap: 8 }}>
          <input data-testid="amount-input" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount"
            style={{ flex: 1, padding: "10px 14px", background: "#1a1a2e", border: "1px solid #333", borderRadius: 8, color: "#eee", outline: "none" }} />
          <button data-testid="type-income" onClick={() => setType("income")}
            style={{ padding: "10px 14px", borderRadius: 8, border: "none", cursor: "pointer",
              background: type === "income" ? "#22c55e" : "#333", color: type === "income" ? "white" : "#999" }}>+</button>
          <button data-testid="type-expense" onClick={() => setType("expense")}
            style={{ padding: "10px 14px", borderRadius: 8, border: "none", cursor: "pointer",
              background: type === "expense" ? "#ef4444" : "#333", color: type === "expense" ? "white" : "#999" }}>−</button>
          <button data-testid="add-btn" onClick={add}
            style={{ padding: "10px 16px", background: "#3b82f6", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>Add</button>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {transactions.map(t => (
          <div key={t.id} data-testid="transaction" style={{ display: "flex", alignItems: "center", padding: "10px 12px", background: "#1a1a2e", borderRadius: 8, border: "1px solid #333",
            borderLeft: "3px solid " + (t.type === "income" ? "#22c55e" : "#ef4444") }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14 }}>{t.desc}</div>
            </div>
            <span style={{ fontWeight: 600, color: t.type === "income" ? "#22c55e" : "#ef4444", marginRight: 12 }}>
              {t.type === "income" ? "+" : "−"}\${t.amount.toFixed(2)}
            </span>
            <button data-testid="delete-transaction" onClick={() => remove(t.id)}
              style={{ background: "none", border: "none", color: "#666", cursor: "pointer" }}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 500, margin: "0 auto" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Expense Tracker</h2>
      <ExpenseTracker />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-41",
    chapterId: 5,
    title: "Timer & Stopwatch",
    difficulty: "medium",
    description:
      "Build a dual-mode timer: a stopwatch that counts up and a countdown timer. Include start, pause, reset controls and lap tracking for the stopwatch.",
    requirements: [
      "Stopwatch mode: counts up in HH:MM:SS.ms format",
      "Countdown mode: user sets time, counts down to zero",
      "Start, Pause, Resume, Reset controls",
      "Lap button in stopwatch mode records current time",
      "Display list of recorded laps",
      "Visual alert when countdown reaches zero",
    ],
    starterCode: `const { useState, useRef, useCallback } = React;

function TimerApp() {
  return <div>Implement TimerApp</div>;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 500, margin: "0 auto" }}>
      <TimerApp />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const display = document.querySelector('[data-testid="time-display"]');
console.assert(display, 'Test 1: Time display exists');
console.assert(display.textContent.includes("00:00"), 'Test 2: Starts at zero');

// Start stopwatch
document.querySelector('[data-testid="start-btn"]').click();
await new Promise(r => setTimeout(r, 1100));
document.querySelector('[data-testid="pause-btn"]').click();
await new Promise(r => setTimeout(r, 50));

const afterPause = document.querySelector('[data-testid="time-display"]');
console.assert(!afterPause.textContent.includes("00:00:00"), 'Test 3: Timer advanced');

// Record a lap
document.querySelector('[data-testid="start-btn"]').click();
await new Promise(r => setTimeout(r, 100));
document.querySelector('[data-testid="lap-btn"]').click();
await new Promise(r => setTimeout(r, 50));
const laps = document.querySelectorAll('[data-testid="lap"]');
console.assert(laps.length === 1, 'Test 4: Lap recorded');

// Reset
document.querySelector('[data-testid="reset-btn"]').click();
await new Promise(r => setTimeout(r, 50));
const resetDisplay = document.querySelector('[data-testid="time-display"]');
console.assert(resetDisplay.textContent.includes("00:00"), 'Test 5: Timer reset');`,
    tags: ["timer", "setInterval", "useRef", "time-formatting"],
    order: 7,
    timeEstimate: "25-30 min",
    hints: [
      "Use useRef to store the interval ID and start timestamp",
      "Calculate elapsed time as Date.now() - startTime + accumulated",
      "Format milliseconds to HH:MM:SS using Math.floor and modulo",
    ],
    keyInsight:
      "Timers must store the interval ID in a ref (not state) so cleanup works correctly. Elapsed time is computed from timestamps, not incremented — this prevents drift. The accumulated time pattern handles pause/resume.",
    solution: `const { useState, useRef, useCallback } = React;

function TimerApp() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const accumulatedRef = useRef(0);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setTime(accumulatedRef.current + (Date.now() - startTimeRef.current));
    }, 10);
    setRunning(true);
  }, []);

  const pause = useCallback(() => {
    clearInterval(intervalRef.current);
    accumulatedRef.current += Date.now() - startTimeRef.current;
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setTime(0);
    setRunning(false);
    setLaps([]);
    accumulatedRef.current = 0;
  }, []);

  const lap = useCallback(() => {
    setLaps(prev => [time, ...prev]);
  }, [time]);

  const fmt = (ms) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const centis = Math.floor((ms % 1000) / 10);
    return String(h).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0") + "." + String(centis).padStart(2, "0");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div data-testid="time-display" style={{ fontSize: 48, fontWeight: 700, fontFamily: "monospace", marginBottom: 24, color: "#eee" }}>
        {fmt(time)}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 24 }}>
        {!running ? (
          <button data-testid="start-btn" onClick={start}
            style={{ padding: "10px 24px", background: "#22c55e", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
            {time > 0 ? "Resume" : "Start"}
          </button>
        ) : (
          <button data-testid="pause-btn" onClick={pause}
            style={{ padding: "10px 24px", background: "#f59e0b", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
            Pause
          </button>
        )}
        {running && (
          <button data-testid="lap-btn" onClick={lap}
            style={{ padding: "10px 24px", background: "#3b82f6", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>
            Lap
          </button>
        )}
        <button data-testid="reset-btn" onClick={reset}
          style={{ padding: "10px 24px", background: "#333", color: "#eee", border: "none", borderRadius: 8, cursor: "pointer" }}>
          Reset
        </button>
      </div>
      {laps.length > 0 && (
        <div style={{ textAlign: "left", maxWidth: 300, margin: "0 auto" }}>
          <h4 style={{ fontSize: 14, color: "#999", marginBottom: 8 }}>Laps</h4>
          {laps.map((l, i) => (
            <div key={i} data-testid="lap" style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #222", fontSize: 14, fontFamily: "monospace" }}>
              <span style={{ color: "#666" }}>Lap {laps.length - i}</span>
              <span style={{ color: "#eee" }}>{fmt(l)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 500, margin: "0 auto" }}>
      <TimerApp />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-42",
    chapterId: 5,
    title: "File Explorer",
    difficulty: "hard",
    description:
      "Build a file explorer component with folder tree navigation. Folders can be expanded/collapsed and files can be selected. Show the current path as a breadcrumb.",
    requirements: [
      "Render a nested folder/file tree structure",
      "Click folder to expand/collapse showing children",
      "Click file to select it (highlight)",
      "Show folder/file icons (📁/📄)",
      "Display current selected file path",
      "Indent nested items to show hierarchy",
    ],
    starterCode: `const { useState } = React;

const fileSystem = {
  name: "root",
  type: "folder",
  children: [
    { name: "src", type: "folder", children: [
      { name: "components", type: "folder", children: [
        { name: "App.tsx", type: "file" },
        { name: "Header.tsx", type: "file" },
        { name: "Footer.tsx", type: "file" },
      ]},
      { name: "hooks", type: "folder", children: [
        { name: "useAuth.ts", type: "file" },
        { name: "useApi.ts", type: "file" },
      ]},
      { name: "index.tsx", type: "file" },
    ]},
    { name: "public", type: "folder", children: [
      { name: "index.html", type: "file" },
      { name: "favicon.ico", type: "file" },
    ]},
    { name: "package.json", type: "file" },
    { name: "README.md", type: "file" },
  ],
};

function FileExplorer({ tree }) {
  return <div>Implement FileExplorer</div>;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <h3 style={{ marginBottom: 12, fontSize: 16, fontWeight: 600 }}>Explorer</h3>
      <FileExplorer tree={fileSystem} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `// Root children visible
const items = document.querySelectorAll('[data-testid="tree-item"]');
console.assert(items.length >= 4, 'Test 1: Root children rendered');

// Click src folder to expand
const folders = document.querySelectorAll('[data-testid="folder"]');
folders[0].click();
await new Promise(r => setTimeout(r, 50));
const expanded = document.querySelectorAll('[data-testid="tree-item"]');
console.assert(expanded.length > 4, 'Test 2: Folder expanded');

// Click a file to select
const files = document.querySelectorAll('[data-testid="file"]');
if (files.length > 0) {
  files[0].click();
  await new Promise(r => setTimeout(r, 50));
  const selected = document.querySelector('[data-testid="selected-path"]');
  console.assert(selected, 'Test 3: Selected path shown');
}

// Collapse folder
folders[0].click();
await new Promise(r => setTimeout(r, 50));
const collapsed = document.querySelectorAll('[data-testid="tree-item"]');
console.assert(collapsed.length <= expanded.length, 'Test 4: Folder collapsed');`,
    tags: ["tree", "recursion", "nested-data", "file-system"],
    order: 8,
    timeEstimate: "25-30 min",
    hints: [
      "Use a recursive component — TreeNode renders itself for children",
      "Track expanded folders as a Set of folder paths",
      "Build the path by passing parent path as a prop to child nodes",
    ],
    keyInsight:
      "File explorers require recursive components. Each TreeNode renders its children as more TreeNodes. The key insight is passing the accumulated path down as a prop so each node knows its full path for expansion state and selection.",
    solution: `const { useState } = React;

const fileSystem = {
  name: "root",
  type: "folder",
  children: [
    { name: "src", type: "folder", children: [
      { name: "components", type: "folder", children: [
        { name: "App.tsx", type: "file" },
        { name: "Header.tsx", type: "file" },
        { name: "Footer.tsx", type: "file" },
      ]},
      { name: "hooks", type: "folder", children: [
        { name: "useAuth.ts", type: "file" },
        { name: "useApi.ts", type: "file" },
      ]},
      { name: "index.tsx", type: "file" },
    ]},
    { name: "public", type: "folder", children: [
      { name: "index.html", type: "file" },
      { name: "favicon.ico", type: "file" },
    ]},
    { name: "package.json", type: "file" },
    { name: "README.md", type: "file" },
  ],
};

function TreeNode({ node, path, depth, expanded, toggleExpand, selectedPath, onSelect }) {
  const fullPath = path + "/" + node.name;
  const isFolder = node.type === "folder";
  const isExpanded = expanded.has(fullPath);
  const isSelected = selectedPath === fullPath;

  return (
    <div>
      <div data-testid="tree-item"
        {...(isFolder ? { "data-testid": "folder" } : { "data-testid": "file" })}
        onClick={() => isFolder ? toggleExpand(fullPath) : onSelect(fullPath)}
        style={{
          display: "flex", alignItems: "center", gap: 6, padding: "4px 8px",
          paddingLeft: depth * 16 + 8, cursor: "pointer", borderRadius: 4, fontSize: 14,
          background: isSelected ? "#3b82f620" : "transparent", color: isSelected ? "#3b82f6" : "#ccc"
        }}>
        <span>{isFolder ? (isExpanded ? "📂" : "📁") : "📄"}</span>
        <span>{node.name}</span>
      </div>
      {isFolder && isExpanded && node.children && node.children.map(child => (
        <TreeNode key={child.name} node={child} path={fullPath} depth={depth + 1}
          expanded={expanded} toggleExpand={toggleExpand}
          selectedPath={selectedPath} onSelect={onSelect} />
      ))}
    </div>
  );
}

function FileExplorer({ tree }) {
  const [expanded, setExpanded] = useState(new Set());
  const [selectedPath, setSelectedPath] = useState(null);

  const toggleExpand = (path) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path); else next.add(path);
      return next;
    });
  };

  return (
    <div style={{ background: "#1a1a2e", borderRadius: 8, border: "1px solid #333", padding: "8px 0" }}>
      {tree.children.map(child => (
        <TreeNode key={child.name} node={child} path="" depth={0}
          expanded={expanded} toggleExpand={toggleExpand}
          selectedPath={selectedPath} onSelect={setSelectedPath} />
      ))}
      {selectedPath && (
        <div data-testid="selected-path" style={{ padding: "8px 12px", borderTop: "1px solid #333", marginTop: 8, fontSize: 12, color: "#999", fontFamily: "monospace" }}>
          {selectedPath}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <h3 style={{ marginBottom: 12, fontSize: 16, fontWeight: 600 }}>Explorer</h3>
      <FileExplorer tree={fileSystem} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-43",
    chapterId: 5,
    title: "Pomodoro Timer",
    difficulty: "medium",
    description:
      "Build a Pomodoro timer that alternates between work sessions (25 min) and break sessions (5 min). Track completed pomodoros and allow configurable durations.",
    requirements: [
      "25-minute work session timer with countdown display",
      "5-minute break timer after each work session",
      "Start, Pause, Skip controls",
      "Visual indication of work vs break mode",
      "Count of completed pomodoro cycles",
      "Circular progress indicator",
    ],
    starterCode: `const { useState, useRef, useCallback, useEffect } = React;

function PomodoroTimer() {
  return <div>Implement PomodoroTimer</div>;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 400, margin: "0 auto" }}>
      <PomodoroTimer />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const display = document.querySelector('[data-testid="timer-display"]');
console.assert(display, 'Test 1: Timer display exists');
console.assert(display.textContent.includes("25:00"), 'Test 2: Starts at 25 minutes');

const mode = document.querySelector('[data-testid="timer-mode"]');
console.assert(mode.textContent.toLowerCase().includes("work"), 'Test 3: Work mode initially');

// Start timer
document.querySelector('[data-testid="start-btn"]').click();
await new Promise(r => setTimeout(r, 1500));
document.querySelector('[data-testid="pause-btn"]').click();
await new Promise(r => setTimeout(r, 50));

const afterStart = document.querySelector('[data-testid="timer-display"]');
console.assert(!afterStart.textContent.includes("25:00"), 'Test 4: Timer counting down');

// Skip to break
document.querySelector('[data-testid="skip-btn"]').click();
await new Promise(r => setTimeout(r, 50));
const modeAfter = document.querySelector('[data-testid="timer-mode"]');
console.assert(modeAfter.textContent.toLowerCase().includes("break"), 'Test 5: Switched to break mode');`,
    tags: ["timer", "countdown", "mode-toggle", "useRef"],
    order: 9,
    timeEstimate: "25-30 min",
    hints: [
      "Track mode (work/break), timeLeft, and running state",
      "Use setInterval that decrements timeLeft by 1 each second",
      "When timeLeft hits 0, switch modes and reset the timer",
    ],
    keyInsight:
      "Pomodoro timers are state machines with two modes. The transition logic (work->break->work) runs when timeLeft reaches 0. Storing the interval in a ref ensures clean start/stop without stale closures.",
    solution: `const { useState, useRef, useCallback, useEffect } = React;

function PomodoroTimer() {
  const WORK = 25 * 60;
  const BREAK = 5 * 60;
  const [mode, setMode] = useState("work");
  const [timeLeft, setTimeLeft] = useState(WORK);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (mode === "work") {
              setCompleted(c => c + 1);
              setMode("break");
              return BREAK;
            } else {
              setMode("work");
              return WORK;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const toggle = () => setRunning(r => !r);
  const skip = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    if (mode === "work") { setMode("break"); setTimeLeft(BREAK); }
    else { setMode("work"); setTimeLeft(WORK); }
  };
  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false); setMode("work"); setTimeLeft(WORK);
  };

  const fmt = (s) => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  const total = mode === "work" ? WORK : BREAK;
  const pct = ((total - timeLeft) / total) * 100;

  return (
    <div style={{ textAlign: "center" }}>
      <div data-testid="timer-mode" style={{ fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2,
        color: mode === "work" ? "#ef4444" : "#22c55e", marginBottom: 24 }}>
        {mode === "work" ? "🎯 Work" : "☕ Break"}
      </div>
      <div style={{ position: "relative", width: 200, height: 200, margin: "0 auto 24px" }}>
        <svg width="200" height="200" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="100" cy="100" r="90" fill="none" stroke="#333" strokeWidth="8" />
          <circle cx="100" cy="100" r="90" fill="none" stroke={mode === "work" ? "#ef4444" : "#22c55e"}
            strokeWidth="8" strokeDasharray={2 * Math.PI * 90} strokeDashoffset={2 * Math.PI * 90 * (1 - pct / 100)}
            strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s" }} />
        </svg>
        <div data-testid="timer-display" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 40, fontWeight: 700, fontFamily: "monospace", color: "#eee" }}>
          {fmt(timeLeft)}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 24 }}>
        {!running ? (
          <button data-testid="start-btn" onClick={toggle}
            style={{ padding: "10px 24px", background: mode === "work" ? "#ef4444" : "#22c55e", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
            Start
          </button>
        ) : (
          <button data-testid="pause-btn" onClick={toggle}
            style={{ padding: "10px 24px", background: "#f59e0b", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
            Pause
          </button>
        )}
        <button data-testid="skip-btn" onClick={skip}
          style={{ padding: "10px 24px", background: "#333", color: "#eee", border: "none", borderRadius: 8, cursor: "pointer" }}>
          Skip
        </button>
        <button data-testid="reset-btn" onClick={reset}
          style={{ padding: "10px 24px", background: "#333", color: "#eee", border: "none", borderRadius: 8, cursor: "pointer" }}>
          Reset
        </button>
      </div>
      <div style={{ color: "#666", fontSize: 14 }}>Completed: <strong style={{ color: "#eee" }}>{completed}</strong> pomodoros</div>
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 400, margin: "0 auto" }}>
      <PomodoroTimer />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
  {
    id: "mc-44",
    chapterId: 5,
    title: "Weather Dashboard",
    difficulty: "medium",
    description:
      "Build a weather dashboard that displays weather data for a searched city. Show current conditions, temperature, and a 5-day forecast. Use simulated API data.",
    requirements: [
      "Search input to look up city weather",
      "Display current temperature, conditions, and icon",
      "Show humidity, wind speed, and feels-like temperature",
      "5-day forecast strip with daily highs/lows",
      "Loading state while fetching",
      "Error state for city not found",
    ],
    starterCode: `const { useState, useCallback } = React;

// Simulated weather data
const weatherDB = {
  "new york": { temp: 22, feels: 20, humidity: 65, wind: 15, condition: "Partly Cloudy", icon: "⛅",
    forecast: [{ day: "Mon", high: 24, low: 18, icon: "☀️" }, { day: "Tue", high: 22, low: 17, icon: "⛅" }, { day: "Wed", high: 20, low: 15, icon: "🌧️" }, { day: "Thu", high: 23, low: 16, icon: "☀️" }, { day: "Fri", high: 25, low: 19, icon: "☀️" }] },
  "london": { temp: 15, feels: 13, humidity: 78, wind: 20, condition: "Rainy", icon: "🌧️",
    forecast: [{ day: "Mon", high: 16, low: 11, icon: "🌧️" }, { day: "Tue", high: 14, low: 10, icon: "🌧️" }, { day: "Wed", high: 17, low: 12, icon: "⛅" }, { day: "Thu", high: 18, low: 13, icon: "☀️" }, { day: "Fri", high: 15, low: 11, icon: "🌧️" }] },
  "tokyo": { temp: 28, feels: 31, humidity: 70, wind: 10, condition: "Sunny", icon: "☀️",
    forecast: [{ day: "Mon", high: 30, low: 24, icon: "☀️" }, { day: "Tue", high: 29, low: 23, icon: "☀️" }, { day: "Wed", high: 27, low: 22, icon: "⛅" }, { day: "Thu", high: 28, low: 23, icon: "☀️" }, { day: "Fri", high: 31, low: 25, icon: "☀️" }] },
};

function WeatherDashboard() {
  return <div>Implement WeatherDashboard</div>;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 500, margin: "0 auto" }}>
      <WeatherDashboard />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const input = document.querySelector('[data-testid="city-input"]');
console.assert(input, 'Test 1: City input exists');

// Search for a city
input.value = "Tokyo";
input.dispatchEvent(new Event("input", { bubbles: true }));
document.querySelector('[data-testid="search-btn"]').click();
await new Promise(r => setTimeout(r, 600));

const temp = document.querySelector('[data-testid="temperature"]');
console.assert(temp.textContent.includes("28"), 'Test 2: Temperature displayed');

const condition = document.querySelector('[data-testid="condition"]');
console.assert(condition.textContent.includes("Sunny"), 'Test 3: Condition displayed');

const forecastDays = document.querySelectorAll('[data-testid="forecast-day"]');
console.assert(forecastDays.length === 5, 'Test 4: Five forecast days');

// Search for unknown city
input.value = "Atlantis";
input.dispatchEvent(new Event("input", { bubbles: true }));
document.querySelector('[data-testid="search-btn"]').click();
await new Promise(r => setTimeout(r, 600));
const error = document.querySelector('[data-testid="error"]');
console.assert(error, 'Test 5: Error shown for unknown city');`,
    tags: ["api-simulation", "loading-state", "dashboard", "search"],
    order: 10,
    timeEstimate: "25-30 min",
    hints: [
      "Simulate API call with setTimeout + Promise for realistic loading state",
      "Track loading, error, and data states separately",
      "Normalize city name to lowercase for lookup",
    ],
    keyInsight:
      "Weather dashboards demonstrate the loading/error/data triple state pattern found in all async UIs. A search triggers: loading=true -> fetch -> success (data) or failure (error). This pattern is the foundation of every data-driven component.",
    solution: `const { useState, useCallback } = React;

const weatherDB = {
  "new york": { temp: 22, feels: 20, humidity: 65, wind: 15, condition: "Partly Cloudy", icon: "⛅",
    forecast: [{ day: "Mon", high: 24, low: 18, icon: "☀️" }, { day: "Tue", high: 22, low: 17, icon: "⛅" }, { day: "Wed", high: 20, low: 15, icon: "🌧️" }, { day: "Thu", high: 23, low: 16, icon: "☀️" }, { day: "Fri", high: 25, low: 19, icon: "☀️" }] },
  "london": { temp: 15, feels: 13, humidity: 78, wind: 20, condition: "Rainy", icon: "🌧️",
    forecast: [{ day: "Mon", high: 16, low: 11, icon: "🌧️" }, { day: "Tue", high: 14, low: 10, icon: "🌧️" }, { day: "Wed", high: 17, low: 12, icon: "⛅" }, { day: "Thu", high: 18, low: 13, icon: "☀️" }, { day: "Fri", high: 15, low: 11, icon: "🌧️" }] },
  "tokyo": { temp: 28, feels: 31, humidity: 70, wind: 10, condition: "Sunny", icon: "☀️",
    forecast: [{ day: "Mon", high: 30, low: 24, icon: "☀️" }, { day: "Tue", high: 29, low: 23, icon: "☀️" }, { day: "Wed", high: 27, low: 22, icon: "⛅" }, { day: "Thu", high: 28, low: 23, icon: "☀️" }, { day: "Fri", high: 31, low: 25, icon: "☀️" }] },
};

function WeatherDashboard() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(() => {
    if (!city.trim()) return;
    setLoading(true); setError(null); setData(null);
    setTimeout(() => {
      const result = weatherDB[city.trim().toLowerCase()];
      if (result) { setData({ ...result, cityName: city.trim() }); }
      else { setError("City not found. Try: New York, London, Tokyo"); }
      setLoading(false);
    }, 500);
  }, [city]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input data-testid="city-input" value={city} onChange={e => setCity(e.target.value)}
          onKeyDown={e => e.key === "Enter" && search()} placeholder="Enter city name..."
          style={{ flex: 1, padding: "10px 14px", background: "#1a1a2e", border: "1px solid #333", borderRadius: 8, color: "#eee", outline: "none" }} />
        <button data-testid="search-btn" onClick={search}
          style={{ padding: "10px 16px", background: "#3b82f6", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>Search</button>
      </div>
      {loading && <div style={{ textAlign: "center", padding: 32, color: "#999" }}>Loading...</div>}
      {error && <div data-testid="error" style={{ textAlign: "center", padding: 24, color: "#ef4444", background: "#ef444410", borderRadius: 12 }}>{error}</div>}
      {data && (
        <div>
          <div style={{ textAlign: "center", padding: 24, background: "#1a1a2e", borderRadius: 12, border: "1px solid #333", marginBottom: 16 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>{data.icon}</div>
            <div data-testid="temperature" style={{ fontSize: 48, fontWeight: 700 }}>{data.temp}°C</div>
            <div data-testid="condition" style={{ color: "#999", fontSize: 16, marginTop: 4 }}>{data.condition}</div>
            <div style={{ color: "#666", fontSize: 14, marginTop: 4 }}>{data.cityName}</div>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <div style={{ flex: 1, textAlign: "center", padding: 12, background: "#1a1a2e", borderRadius: 8, border: "1px solid #333" }}>
              <div style={{ fontSize: 12, color: "#666" }}>Feels Like</div>
              <div style={{ fontWeight: 600 }}>{data.feels}°C</div>
            </div>
            <div style={{ flex: 1, textAlign: "center", padding: 12, background: "#1a1a2e", borderRadius: 8, border: "1px solid #333" }}>
              <div style={{ fontSize: 12, color: "#666" }}>Humidity</div>
              <div style={{ fontWeight: 600 }}>{data.humidity}%</div>
            </div>
            <div style={{ flex: 1, textAlign: "center", padding: 12, background: "#1a1a2e", borderRadius: 8, border: "1px solid #333" }}>
              <div style={{ fontSize: 12, color: "#666" }}>Wind</div>
              <div style={{ fontWeight: 600 }}>{data.wind} km/h</div>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 14, color: "#999", marginBottom: 8 }}>5-Day Forecast</h4>
            <div style={{ display: "flex", gap: 8 }}>
              {data.forecast.map((d, i) => (
                <div key={i} data-testid="forecast-day" style={{ flex: 1, textAlign: "center", padding: 12, background: "#1a1a2e", borderRadius: 8, border: "1px solid #333" }}>
                  <div style={{ fontSize: 12, color: "#666" }}>{d.day}</div>
                  <div style={{ fontSize: 24, margin: "4px 0" }}>{d.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{d.high}°</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{d.low}°</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 500, margin: "0 auto" }}>
      <WeatherDashboard />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
  },
];
