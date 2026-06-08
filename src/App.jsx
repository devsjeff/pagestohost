import { useState, useReducer, useMemo, useCallback, memo, createContext, useContext, lazy, Suspense } from "react";

const topics = [
  {
    id: 19,
    emoji: "⚙️",
    title: "useReducer",
    color: "#61DAFB",
    theory: [
      "useReducer is an alternative to useState for managing complex state logic inside a component.",
      "Instead of calling a setter directly, you dispatch an action object, and a reducer function decides how state changes based on that action.",
      "This is the same pattern Redux uses — useReducer is basically a built-in mini-Redux.",
      "Use useReducer when state has multiple sub-values, or when the next state depends on the previous one in complex ways.",
    ],
    notes: [
      "useReducer(reducer, initialState) returns [state, dispatch].",
      "reducer is a pure function: (state, action) => newState. Never mutate state directly inside it.",
      "dispatch({ type: 'INCREMENT' }) — you send an action, the reducer decides the outcome.",
      "Actions usually have a type string and optionally a payload: { type: 'ADD', payload: 'text' }.",
      "Rule of thumb: 3+ related state values or complex transitions → prefer useReducer over useState.",
    ],
    code: `import { useReducer, useState } from "react";

function counterReducer(state, action) {
  switch (action.type) {
    case "INCREMENT": return { count: state.count + 1 };
    case "DECREMENT": return { count: state.count - 1 };
    case "RESET":     return { count: 0 };
    case "SET":       return { count: action.payload };
    default:          return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+1</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-1</button>
      <button onClick={() => dispatch({ type: "RESET" })}>Reset</button>
      <button onClick={() => dispatch({ type: "SET", payload: 100 })}>Set 100</button>
    </div>
  );
}

function todoReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, { id: Date.now(), text: action.payload, done: false }];
    case "TOGGLE":
      return state.map((t) =>
        t.id === action.payload ? { ...t, done: !t.done } : t
      );
    case "DELETE":
      return state.filter((t) => t.id !== action.payload);
    default:
      return state;
  }
}

function TodoApp() {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [input, setInput] = useState("");

  function add() {
    if (!input.trim()) return;
    dispatch({ type: "ADD", payload: input });
    setInput("");
  }

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={add}>Add</button>
      <ul>
        {todos.map((t) => (
          <li key={t.id} style={{ textDecoration: t.done ? "line-through" : "none" }}>
            {t.text}
            <button onClick={() => dispatch({ type: "TOGGLE", payload: t.id })}>✓</button>
            <button onClick={() => dispatch({ type: "DELETE", payload: t.id })}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
  },
  {
    id: 20,
    emoji: "⚡",
    title: "useMemo & useCallback",
    color: "#F7DF1E",
    theory: [
      "useMemo and useCallback are performance optimization hooks that prevent expensive recalculations and function recreation on every render.",
      "useMemo memoizes a computed value — only recalculates when its dependencies change.",
      "useCallback memoizes a function reference — only creates a new function when its dependencies change.",
      "Important: do not use these everywhere. Memoization has its own cost. Only add them after identifying a real performance problem.",
    ],
    notes: [
      "useMemo(() => expensiveCalc(), [dep]) — recalculates only when dep changes.",
      "useCallback(() => myFn(), [dep]) — returns the same function reference unless dep changes.",
      "Main use for useCallback: pass stable functions to children wrapped in React.memo.",
      "Main use for useMemo: expensive computations like filtering or sorting large arrays.",
      "If your app feels fast without them — skip them. Premature optimization is the root of all evil.",
    ],
    code: `import { useState, useMemo, useCallback, memo } from "react";

// --- useMemo: skip expensive recomputation ---
function FilteredList({ items, filter }) {
  const filtered = useMemo(() => {
    console.log("Filtering...");
    return items.filter((item) =>
      item.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  return <ul>{filtered.map((x, i) => <li key={i}>{x}</li>)}</ul>;
}

// --- useCallback: stable function reference ---
const ChildButton = memo(function ChildButton({ onClick, label }) {
  console.log("Child rendered:", label);
  return <button onClick={onClick}>{label}</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [other, setOther] = useState(0);

  const handleIncrement = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  return (
    <div>
      <p>Count: {count} | Other: {other}</p>
      <ChildButton onClick={handleIncrement} label="Increment" />
      <button onClick={() => setOther((o) => o + 1)}>
        Change Other (child stays the same)
      </button>
    </div>
  );
}`,
  },
  {
    id: 21,
    emoji: "🧠",
    title: "React.memo",
    color: "#FF6B6B",
    theory: [
      "React.memo is a higher-order component that prevents a component from re-rendering if its props have not changed.",
      "By default React re-renders a child whenever its parent re-renders — even if the child receives the exact same props.",
      "React.memo does a shallow comparison of props. If references are the same, the render is skipped entirely.",
      "memo only blocks re-renders caused by the parent. If the component's own state or context changes, it still re-renders.",
    ],
    notes: [
      "Wrap a component: const MyComp = memo(function MyComp(props) { ... })",
      "Shallow comparison checks object and function references — not deep equality.",
      "For object or array props, memoize the value with useMemo. For function props, use useCallback.",
      "Most useful when a component renders often, receives the same props often, and is expensive to render.",
      "Do not wrap every component — the comparison itself costs something. Use where re-renders are provably wasteful.",
    ],
    code: `import { useState, memo } from "react";

// Without memo — re-renders on every parent render
function RegularChild({ name }) {
  console.log("RegularChild rendered");
  return <p>Regular: {name}</p>;
}

// With memo — only re-renders when name prop actually changes
const MemoizedChild = memo(function MemoizedChild({ name }) {
  console.log("MemoizedChild rendered");
  return <p>Memoized: {name}</p>;
});

// Custom comparison — full control over when to re-render
const SmartChild = memo(
  function SmartChild({ id }) {
    console.log("SmartChild rendered, id:", id);
    return <p>Smart ID: {id}</p>;
  },
  (prev, next) => prev.id === next.id
  // return true  -> skip re-render
  // return false -> allow re-render
);

function Parent() {
  const [count, setCount] = useState(0);
  const [name] = useState("Devendra");

  return (
    <div>
      <p>Parent count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Re-render Parent</button>
      <hr />
      <RegularChild name={name} />   {/* always re-renders */}
      <MemoizedChild name={name} />  {/* skips — name unchanged */}
      <SmartChild id={42} />         {/* skips — id unchanged */}
    </div>
  );
}`,
  },
  {
    id: 22,
    emoji: "✂️",
    title: "Code Splitting & Lazy Loading",
    color: "#A78BFA",
    theory: [
      "Code splitting breaks your app bundle into smaller chunks that download only when needed, rather than loading everything upfront.",
      "React.lazy lets you dynamically import a component — its JS chunk is only fetched when the component first renders.",
      "Suspense is the wrapper that shows a fallback UI while the lazy component chunk is downloading.",
      "This massively improves initial load time — users only download the code for pages they actually visit.",
    ],
    notes: [
      "const MyComp = lazy(() => import('./MyComp')) — dynamic import, loads the file on demand.",
      "Always wrap lazy components in a Suspense boundary with a fallback prop.",
      "Best split points: route-level pages, heavy feature sections, modals, data visualizations.",
      "React.lazy only works with default exports from the imported module.",
      "In production, Vite and Webpack automatically create separate .js chunk files per lazy import.",
    ],
    code: `import { useState, lazy, Suspense } from "react";

// In a real project these live in separate files:
// const HeavyChart   = lazy(() => import('./HeavyChart'));
// const AdminPanel   = lazy(() => import('./AdminPanel'));

// Simulated heavy components for this demo
function HeavyChart()   { return <div>📊 Heavy Chart — loaded on demand</div>; }
function AdminPanel()   { return <div>🔒 Admin Panel — loaded on demand</div>; }
function UserSettings() { return <div>⚙️  Settings  — loaded on demand</div>; }

function App() {
  const [page, setPage] = useState(null);

  return (
    <div>
      <nav style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setPage("chart")}>Chart</button>
        <button onClick={() => setPage("admin")}>Admin</button>
        <button onClick={() => setPage("settings")}>Settings</button>
      </nav>

      <Suspense fallback={<p>Loading component...</p>}>
        {page === "chart"    && <HeavyChart />}
        {page === "admin"    && <AdminPanel />}
        {page === "settings" && <UserSettings />}
      </Suspense>

      {!page && (
        <p style={{ color: "#8b949e" }}>
          Click a button. In a real app each section is a
          separate JS chunk — downloaded only on first visit.
        </p>
      )}
    </div>
  );
}`,
  },
  {
    id: 23,
    emoji: "🌀",
    title: "Portals",
    color: "#34D399",
    theory: [
      "A Portal renders a component's output into a different DOM node than its parent, escaping the normal component hierarchy.",
      "Normally a component renders inside its parent's DOM node. With a portal you can target any node — like document.body.",
      "Most common use cases: modals, tooltips, and dropdowns that need to escape overflow:hidden or z-index stacking on a parent.",
      "Even though a portal renders elsewhere in the DOM, it still behaves like a normal React child — events bubble through the React tree as expected.",
    ],
    notes: [
      "createPortal(children, domNode) is a function from the core React library that renders children into domNode.",
      "The target DOM node must exist first — usually document.body or a dedicated div in index.html.",
      "Event bubbling follows the React component tree, NOT the real DOM tree — React events still work normally.",
      "State and Context work fine inside portals — they remain part of the React component tree.",
      "The demo below simulates portal behaviour with fixed positioning so you can see the concept live.",
    ],
    code: `import { useState } from "react";

// Portal API (for your real project):
//   createPortal(<YourModal />, document.body)
// Renders YourModal into document.body instead of inside
// the parent component — escaping overflow:hidden or z-index.

// Working modal demo — simulates portal visual result
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000,
    }}>
      <div style={{
        background: "#161b22",
        border: "1px solid #30363d",
        borderRadius: 12, padding: 24, minWidth: 280,
      }}>
        {children}
        <button onClick={onClose} style={{
          marginTop: 16, padding: "8px 16px",
          background: "#FF6B6B", color: "#fff",
          border: "none", borderRadius: 6, cursor: "pointer",
        }}>
          Close
        </button>
      </div>
    </div>
  );
}

function App() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      overflow: "hidden",
      border: "2px solid #FF6B6B",
      padding: 16, borderRadius: 8,
    }}>
      <p>Parent has overflow:hidden — a real portal escapes it.</p>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <h3>Modal via Portal</h3>
        <p>In production: wrap this JSX in createPortal and it
           renders directly into document.body.</p>
      </Modal>
    </div>
  );
}`,
  },
  {
    id: 24,
    emoji: "🔗",
    title: "Compound Components",
    color: "#FB923C",
    theory: [
      "Compound Components let a group of components share implicit state through Context — no prop threading required.",
      "Think of HTML select and option tags — they work together without you wiring them. Compound components do the same in React.",
      "A parent component owns the state and provides it via Context. Child components consume that context automatically.",
      "This gives consumers a clean expressive API with no prop drilling and no awkward config objects.",
    ],
    notes: [
      "The parent creates a Context and wraps children in a Provider.",
      "Sub-components (Tab, Panel, Item) read shared state from Context instead of receiving it as props.",
      "Attach sub-components to the parent as properties: Tabs.Tab, Tabs.Panel — one clean import for everything.",
      "This is how popular headless UI libraries are built under the hood.",
      "Best for: Tabs, Accordion, Select, Dropdown, Stepper — any set of components that logically belong together.",
    ],
    code: `import { useState, useContext, createContext } from "react";

const TabsCtx = createContext(null);

function Tabs({ children, defaultTab = 0 }) {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabsCtx.Provider value={{ active, setActive }}>
      <div>{children}</div>
    </TabsCtx.Provider>
  );
}

function TabList({ children }) {
  return (
    <div style={{
      display: "flex", gap: 4,
      borderBottom: "2px solid #30363d", marginBottom: 16,
    }}>
      {children}
    </div>
  );
}

function Tab({ children, index }) {
  const { active, setActive } = useContext(TabsCtx);
  const on = active === index;
  return (
    <button onClick={() => setActive(index)} style={{
      padding: "8px 16px", cursor: "pointer", fontFamily: "inherit",
      background: on ? "#FB923C22" : "transparent",
      color: on ? "#FB923C" : "#8b949e",
      border: "none",
      borderBottom: on ? "2px solid #FB923C" : "2px solid transparent",
    }}>
      {children}
    </button>
  );
}

function TabPanel({ children, index }) {
  const { active } = useContext(TabsCtx);
  return active === index ? <div>{children}</div> : null;
}

Tabs.TabList  = TabList;
Tabs.Tab      = Tab;
Tabs.TabPanel = TabPanel;

function App() {
  return (
    <Tabs defaultTab={0}>
      <Tabs.TabList>
        <Tabs.Tab index={0}>Profile</Tabs.Tab>
        <Tabs.Tab index={1}>Settings</Tabs.Tab>
        <Tabs.Tab index={2}>Billing</Tabs.Tab>
      </Tabs.TabList>
      <Tabs.TabPanel index={0}><p>Profile content</p></Tabs.TabPanel>
      <Tabs.TabPanel index={1}><p>Settings content</p></Tabs.TabPanel>
      <Tabs.TabPanel index={2}><p>Billing content</p></Tabs.TabPanel>
    </Tabs>
  );
}`,
  },
  {
    id: 25,
    emoji: "🎭",
    title: "Render Props",
    color: "#F472B6",
    theory: [
      "The Render Props pattern is when a component receives a function as a prop and calls it to decide what to render.",
      "This lets you share stateful logic while giving the consumer full control over the UI output.",
      "The component with the logic calls props.render(state) and passes its internal state as arguments.",
      "Custom hooks have largely replaced render props — but the pattern still appears in many libraries and older codebases.",
    ],
    notes: [
      "The render prop can be named anything: render, children, or any custom name.",
      "Using children as the render prop is called the 'function as children' pattern.",
      "Custom hooks are now preferred — same result, cleaner syntax, no extra nesting.",
      "Both render props and custom hooks solve the same problem: sharing stateful logic between components.",
      "You will encounter this pattern reading library source code, so knowing it is still valuable.",
    ],
    code: `import { useState } from "react";

// MouseTracker owns the tracking logic.
// The consumer decides what to display with that data.
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div
      onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
      style={{ height: 90, border: "1px dashed #30363d", borderRadius: 8 }}
    >
      {render(pos)}
    </div>
  );
}

// Counter shares logic — consumer controls the UI shape
function SharedCounter({ children }) {
  const [count, setCount] = useState(0);
  return children({
    count,
    increment: () => setCount((c) => c + 1),
    decrement: () => setCount((c) => c - 1),
    reset:     () => setCount(0),
  });
}

function App() {
  return (
    <div>
      <MouseTracker
        render={({ x, y }) => (
          <p style={{ padding: 12 }}>Mouse position: ({x}, {y})</p>
        )}
      />

      <br />

      <SharedCounter>
        {({ count, increment, decrement, reset }) => (
          <div>
            <p>Count: {count}</p>
            <button onClick={increment}>+</button>{" "}
            <button onClick={decrement}>-</button>{" "}
            <button onClick={reset}>Reset</button>
          </div>
        )}
      </SharedCounter>
    </div>
  );
}`,
  },
  {
    id: 26,
    emoji: "🗃️",
    title: "State Management Libraries",
    color: "#38BDF8",
    theory: [
      "For large apps, passing state via props or Context alone gets unwieldy. Dedicated state libraries provide a structured global store.",
      "Zustand is the modern lightweight choice — minimal boilerplate, hooks-based API, no Provider setup needed.",
      "Redux Toolkit is the official modern Redux — far simpler than classic Redux, dominant in enterprise projects.",
      "Both solve the same core problem: a single global source of truth that any component can read and update.",
    ],
    notes: [
      "Zustand: create a store with create(), then call it as a custom hook anywhere. No Provider required.",
      "Redux Toolkit: createSlice bundles your reducer and actions. configureStore wires them. Wrap app in Provider.",
      "useSelector reads from the Redux store. useDispatch sends actions to it.",
      "Zustand is simpler and great for most projects. Use Redux Toolkit when the team already has it.",
      "Other options worth knowing: Jotai (atomic state), MobX (reactive OOP style), Recoil (also atomic).",
    ],
    code: `// ── ZUSTAND ──────────────────────────────────
// Create a store — call outside any component

const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: s.count - 1 })),
  reset:     () => set({ count: 0 }),
}));

// Use the hook in any component — no Provider needed!
function ZustandCounter() {
  const { count, increment, decrement, reset } = useCounterStore();
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}


// ── REDUX TOOLKIT ─────────────────────────────
// createSlice bundles reducer + actions together

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
    decrement: (state) => { state.value -= 1; },
    setTo:     (state, action) => { state.value = action.payload; },
  },
});

const store = configureStore({
  reducer: { counter: counterSlice.reducer },
});

function RTKCounter() {
  const count    = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => dispatch(counterSlice.actions.increment())}>+</button>
      <button onClick={() => dispatch(counterSlice.actions.decrement())}>-</button>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <RTKCounter />
    </Provider>
  );
}`,
  },
  {
    id: 27,
    emoji: "📡",
    title: "Data Fetching Libraries",
    color: "#FBBF24",
    theory: [
      "TanStack Query (also called React Query) is the gold standard for server state — it handles fetching, caching, background refetching, and sync automatically.",
      "Server state is different from UI state — it can go stale, needs periodic sync, and is often shared across many components.",
      "Without a library you write useEffect plus useState for every fetch and manage caching manually. TanStack Query does all of that in one hook.",
      "SWR by Vercel is a lighter alternative with a similar API — a great fit for Next.js projects.",
    ],
    notes: [
      "Install TanStack Query via npm, then wrap your app once in QueryClientProvider.",
      "useQuery({ queryKey: ['users'], queryFn: fetchUsers }) — auto-handles loading, error, data, and caching.",
      "queryKey is the cache identifier — same key anywhere in the app shares the same cached data.",
      "useMutation handles POST/PUT/DELETE. Invalidate a queryKey after success to trigger a refetch.",
      "By default data is cached and reused. Background refetch fires when the browser tab regains focus.",
      "The DevTools package lets you inspect the full query cache visually in the browser.",
    ],
    code: `// TanStack Query setup (done once at app root):
//   const qc = new QueryClient()
//   <QueryClientProvider client={qc}><App /></QueryClientProvider>

// Plain fetch helpers — no library required
async function fetchUsers() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  return res.json();
}

async function addUser(data) {
  const res = await fetch("https://jsonplaceholder.typicode.com/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// useQuery: one hook replaces useEffect + useState + caching
function UsersList() {
  const client = useQueryClient();

  const { data: users, isLoading, isError } = useQuery({
    queryKey:  ["users"],    // unique cache key
    queryFn:   fetchUsers,   // must return a promise
    staleTime: 60 * 1000,    // data stays fresh for 60 s
  });

  // useMutation: handles write operations cleanly
  const mutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      // Mark users cache stale -> background refetch fires
      client.invalidateQueries({ queryKey: ["users"] });
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError)   return <p>Error loading users</p>;

  return (
    <div>
      <ul>
        {users.slice(0, 3).map((u) => <li key={u.id}>{u.name}</li>)}
      </ul>
      <button onClick={() => mutation.mutate({ name: "New User" })}>
        Add User
      </button>
    </div>
  );
}`,
  },
  {
    id: 28,
    emoji: "🔷",
    title: "TypeScript with React",
    color: "#61DAFB",
    theory: [
      "TypeScript adds static types to JavaScript — you describe the shape of your data and TypeScript catches mistakes at compile time before they become runtime bugs.",
      "With React and TypeScript you type props, state, event handlers, and refs — getting autocomplete and editor errors for free.",
      "TypeScript does not change how React works — it just adds a type layer on top. Your .jsx files become .tsx files.",
      "Create a typed project: npm create vite@latest my-app -- --template react-ts",
    ],
    notes: [
      "Type props with an interface: interface Props { name: string; age: number }",
      "useState with a generic: const [count, setCount] = useState<number>(0)",
      "Optional props use ?: interface Props { label?: string }",
      "Event types: React.ChangeEvent<HTMLInputElement>, React.MouseEvent<HTMLButtonElement>",
      "Children: React.ReactNode covers any valid JSX content passed between tags.",
      "Refs: useRef<HTMLInputElement>(null) — always pass null as the initial value for DOM refs.",
    ],
    code: `// TypeScript React files use the .tsx extension

// ── Typing Props ──
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "danger";
  disabled?: boolean;
}

function Button({ label, onClick, variant = "primary", disabled = false }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}

// ── Typing useState ──
const [count, setCount] = useState<number>(0);
const [user,  setUser]  = useState<User | null>(null);
const [items, setItems] = useState<string[]>([]);

// ── Typing a data model ──
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
}

function UserCard({ user }: { user: User }) {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email} — {user.role}</p>
    </div>
  );
}

// ── Typing event handlers ──
function SearchInput() {
  const [query, setQuery] = useState<string>("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Query:", query);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={query} onChange={handleChange} />
      <button type="submit">Search</button>
    </form>
  );
}

// ── Typing children ──
interface CardProps {
  title: string;
  children: React.ReactNode;
}
function Card({ title, children }: CardProps) {
  return <div><h2>{title}</h2>{children}</div>;
}

// ── Typing useRef ──
const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();`,
  },
  {
    id: 29,
    emoji: "🧪",
    title: "Testing React",
    color: "#34D399",
    theory: [
      "React Testing Library (RTL) is the standard for testing React components — it tests from the user's perspective, not implementation details.",
      "Core philosophy: test what the user sees and interacts with, not how internal state is structured.",
      "Jest or Vitest acts as the test runner and assertion library. RTL provides render utilities and DOM queries on top.",
      "Install the RTL packages as dev dependencies, then write test files alongside your components.",
    ],
    notes: [
      "render(<Component />) — mounts the component into a virtual DOM for testing.",
      "screen.getByText(), getByRole(), getByPlaceholderText() — query elements the way a real user would.",
      "userEvent.click(), userEvent.type() — simulate realistic browser interactions.",
      "Prefer userEvent over fireEvent — it fires all intermediate events like a real browser does.",
      "screen.findBy* functions are async — they wait for elements to appear after async operations.",
      "Never test internal state variables — test the visible output the user actually sees.",
    ],
    code: `// Tests live in files named ComponentName.test.jsx

// ── Basic render test ──
test("renders initial count of 0", () => {
  render(<Counter />);
  expect(screen.getByText("Count: 0")).toBeInTheDocument();
});

// ── Interaction test ──
test("increments when + button is clicked", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  const btn = screen.getByRole("button", { name: "+" });
  await user.click(btn);
  await user.click(btn);

  expect(screen.getByText("Count: 2")).toBeInTheDocument();
});

// ── Form validation test ──
test("shows error when submitted empty", async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  await user.click(screen.getByRole("button", { name: "Login" }));
  expect(screen.getByText("Both fields are required.")).toBeInTheDocument();
});

// ── Mock function test ──
test("calls onLogin with the entered credentials", async () => {
  const user      = userEvent.setup();
  const mockFn    = jest.fn();

  render(<LoginForm onLogin={mockFn} />);

  await user.type(screen.getByPlaceholderText("Email"),    "dev@email.com");
  await user.type(screen.getByPlaceholderText("Password"), "secret123");
  await user.click(screen.getByRole("button", { name: "Login" }));

  expect(mockFn).toHaveBeenCalledWith({
    email: "dev@email.com",
    password: "secret123",
  });
});

// ── Async data test ──
test("shows user name after fetch completes", async () => {
  render(<UserProfile userId={1} />);
  const name = await screen.findByText("Leanne Graham");
  expect(name).toBeInTheDocument();
});`,
  },
  {
    id: 30,
    emoji: "▲",
    title: "Next.js",
    color: "#ffffff",
    theory: [
      "Next.js is a React framework that adds server-side rendering, file-based routing, API routes, and built-in optimisations on top of React.",
      "With plain React (Vite), all rendering happens in the browser — the server sends an empty HTML shell. Next.js can render pages on the server for faster loads and better SEO.",
      "The App Router (Next.js 13+) uses a folder-based routing system in the app/ directory — each folder maps to a URL segment automatically.",
      "Create a project: npx create-next-app@latest my-app",
    ],
    notes: [
      "app/page.jsx = /   |   app/about/page.jsx = /about   |   app/blog/[id]/page.jsx = /blog/42",
      "Server Components (default) — run on the server, no useState or useEffect allowed inside.",
      "Client Components — add 'use client' at the very top of the file to enable hooks and browser APIs.",
      "Next.js provides a Link component for client-side navigation without a full page reload.",
      "Next.js provides an Image component with automatic optimisation, lazy loading, and responsive sizing.",
      "API routes: app/api/users/route.js — export GET and POST functions to build backend endpoints.",
    ],
    code: `// Create project: npx create-next-app@latest my-app

// ── Folder structure ──────────────────────────
// app/
//   layout.jsx           root layout (wraps all pages)
//   page.jsx             route: /
//   about/
//     page.jsx           route: /about
//   blog/
//     [id]/
//       page.jsx         route: /blog/42
//   api/
//     users/
//       route.js         API endpoint: /api/users

// ── app/layout.jsx ────────────────────────────
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// ── app/page.jsx (Server Component) ───────────
// async function — runs on the server, fetches directly
export default async function HomePage() {
  const res  = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const user = await res.json();
  return <h1>Hello, {user.name}</h1>;
}

// ── app/blog/[id]/page.jsx (dynamic route) ────
export default async function BlogPost({ params }) {
  const { id } = params;
  const res  = await fetch("https://jsonplaceholder.typicode.com/posts/" + id);
  const post = await res.json();
  return <article><h1>{post.title}</h1><p>{post.body}</p></article>;
}

// ── Client Component (needs hooks) ────────────
"use client";  // must be the very first line

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav>
      {/* The Next.js Link component — no full page reload */}
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <button onClick={() => setOpen(!open)}>Menu</button>
    </nav>
  );
}

// ── app/api/users/route.js ─────────────────────
export async function GET() {
  return Response.json([{ id: 1, name: "Devendra" }]);
}

export async function POST(request) {
  const body = await request.json();
  return Response.json({ created: true, data: body });
}`,
  },
];

export default function ReactNotes() {
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState("theory");
  const topic = topics[selected];

  return (
    <div style={{
      fontFamily: "'Fira Code', 'Courier New', monospace",
      background: "#0d1117", minHeight: "100vh",
      display: "flex", color: "#e6edf3",
    }}>
      <div style={{
        width: "220px", minWidth: "220px", background: "#161b22",
        borderRight: "1px solid #30363d", overflowY: "auto", padding: "16px 0",
      }}>
        <div style={{ padding: "0 16px 16px", borderBottom: "1px solid #30363d", marginBottom: "8px" }}>
          <div style={{ fontSize: "11px", color: "#8b949e", letterSpacing: "2px", textTransform: "uppercase" }}>React Advanced</div>
          <div style={{ fontSize: "18px", fontWeight: "700", color: "#61DAFB", marginTop: "4px" }}>Topics 19–30</div>
        </div>
        {topics.map((t, i) => (
          <button key={t.id} onClick={() => { setSelected(i); setTab("theory"); }} style={{
            display: "flex", alignItems: "center", gap: "10px",
            width: "100%", padding: "10px 16px",
            background: selected === i ? "#21262d" : "transparent",
            border: "none",
            borderLeft: selected === i ? `3px solid ${t.color}` : "3px solid transparent",
            color: selected === i ? "#e6edf3" : "#8b949e",
            cursor: "pointer", textAlign: "left", fontSize: "12px", transition: "all 0.15s",
          }}>
            <span style={{ fontSize: "16px" }}>{t.emoji}</span>
            <span style={{ lineHeight: "1.3" }}>{t.id}. {t.title}</span>
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{
          padding: "28px 32px 20px", borderBottom: "1px solid #30363d",
          background: "#0d1117", position: "sticky", top: 0, zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span style={{ fontSize: "28px" }}>{topic.emoji}</span>
            <div>
              <span style={{ fontSize: "11px", color: "#8b949e", letterSpacing: "1px" }}>TOPIC {topic.id} OF 30</span>
              <h1 style={{ margin: 0, fontSize: "22px", color: topic.color }}>{topic.title}</h1>
            </div>
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {["theory", "notes", "code"].map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "6px 16px", borderRadius: "6px", border: "1px solid",
                borderColor: tab === t ? topic.color : "#30363d",
                background: tab === t ? topic.color + "22" : "transparent",
                color: tab === t ? topic.color : "#8b949e",
                cursor: "pointer", fontSize: "12px", fontFamily: "inherit",
                textTransform: "capitalize", letterSpacing: "0.5px",
              }}>
                {t === "theory" ? "📖 Theory" : t === "notes" ? "📌 Notes" : "💻 Code"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "28px 32px" }}>
          {tab === "theory" && (
            <div>
              {topic.theory.map((point, i) => (
                <div key={i} style={{
                  display: "flex", gap: "14px", marginBottom: "16px",
                  padding: "16px", background: "#161b22", borderRadius: "10px",
                  border: "1px solid #30363d", borderLeft: `3px solid ${topic.color}`,
                }}>
                  <span style={{ color: topic.color, fontWeight: "bold", fontSize: "14px", minWidth: "20px" }}>{i + 1}.</span>
                  <p style={{ margin: 0, color: "#c9d1d9", lineHeight: "1.7", fontSize: "14px" }}>{point}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "notes" && (
            <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "10px", padding: "20px" }}>
              {topic.notes.map((note, i) => (
                <div key={i} style={{
                  display: "flex", gap: "10px", padding: "10px 0",
                  borderBottom: i < topic.notes.length - 1 ? "1px solid #21262d" : "none",
                }}>
                  <span style={{ color: topic.color, fontSize: "16px" }}>→</span>
                  <p style={{ margin: 0, color: "#c9d1d9", lineHeight: "1.7", fontSize: "14px" }}>{note}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "code" && (
            <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{
                background: "#21262d", padding: "10px 16px",
                display: "flex", alignItems: "center", gap: "8px",
                borderBottom: "1px solid #30363d",
              }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
                <span style={{ fontSize: "12px", color: "#8b949e", marginLeft: "8px" }}>example.jsx</span>
              </div>
              <pre style={{
                margin: 0, padding: "20px", overflowX: "auto",
                fontSize: "13px", lineHeight: "1.8", color: "#e6edf3",
                whiteSpace: "pre-wrap", wordBreak: "break-word",
              }}>
                <code>{topic.code}</code>
              </pre>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", padding: "20px 32px 32px", gap: "12px" }}>
          <button
            onClick={() => { setSelected(Math.max(0, selected - 1)); setTab("theory"); }}
            disabled={selected === 0}
            style={{
              padding: "10px 20px", borderRadius: "8px", border: "1px solid #30363d",
              background: selected === 0 ? "#161b22" : "#21262d",
              color: selected === 0 ? "#484f58" : "#c9d1d9",
              cursor: selected === 0 ? "not-allowed" : "pointer",
              fontSize: "13px", fontFamily: "inherit",
            }}
          >← Previous</button>

          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {topics.map((_, i) => (
              <div key={i} onClick={() => { setSelected(i); setTab("theory"); }} style={{
                width: selected === i ? "20px" : "8px", height: "8px", borderRadius: "4px",
                background: selected === i ? topic.color : "#30363d",
                cursor: "pointer", transition: "all 0.2s",
              }} />
            ))}
          </div>

          <button
            onClick={() => { setSelected(Math.min(topics.length - 1, selected + 1)); setTab("theory"); }}
            disabled={selected === topics.length - 1}
            style={{
              padding: "10px 20px", borderRadius: "8px", border: "1px solid #30363d",
              background: selected === topics.length - 1 ? "#161b22" : "#21262d",
              color: selected === topics.length - 1 ? "#484f58" : "#c9d1d9",
              cursor: selected === topics.length - 1 ? "not-allowed" : "pointer",
              fontSize: "13px", fontFamily: "inherit",
            }}
          >Next →</button>
        </div>
      </div>
    </div>
  );
}
