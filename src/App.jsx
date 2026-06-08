import { useState, useEffect, useRef, useContext, createContext, Component } from "react";

const topics = [
  {
    id: 10,
    emoji: "🔁",
    title: "useEffect",
    color: "#61DAFB",
    theory: [
      "useEffect is a Hook that lets you run side effects in a functional component.",
      "A side effect is anything that reaches outside the component: fetching data, setting a timer, manually changing the DOM, subscribing to events.",
      "useEffect runs AFTER React renders the component to the screen — not during render.",
      "It takes two arguments: a callback function (the effect) and a dependency array that controls WHEN the effect runs.",
    ],
    notes: [
      "useEffect(() => {}, []) — runs ONCE after the first render (like componentDidMount).",
      "useEffect(() => {}) — no dependency array → runs after EVERY render. Usually not what you want.",
      "useEffect(() => {}, [count]) — runs after first render AND whenever count changes.",
      "Return a cleanup function to cancel subscriptions, timers, etc. when the component unmounts.",
      "Never put async directly inside useEffect. Define async function inside and call it.",
    ],
    code: `import { useState, useEffect } from "react";

// [] = run only once after first render
function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
      const data = await res.json();
      setUser(data);
    }
    fetchUser();
  }, []);

  if (!user) return <p>Loading...</p>;
  return <h2>Hello, {user.name}!</h2>;
}

// [query] = re-run whenever query changes
function SearchBox({ query }) {
  useEffect(() => {
    if (!query) return;
    console.log("Searching:", query);
  }, [query]);

  return <div>Search box</div>;
}

// Cleanup example — clear timer on unmount
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval); // cleanup!
  }, []);

  return <p>Timer: {seconds}s</p>;
}`,
  },
  {
    id: 11,
    emoji: "📋",
    title: "Forms & Controlled Components",
    color: "#F7DF1E",
    theory: [
      "In React, a controlled component is one where React controls the form input's value via state.",
      "Every keystroke updates state, and the input's value is always driven by that state — React is the single source of truth.",
      "This is the opposite of uncontrolled components, where the DOM itself holds the value.",
      "Controlled components give you full control: validation, formatting, conditional disabling — all easy.",
    ],
    notes: [
      "Always pair value={state} with onChange={handler} on an input. Without onChange, the input becomes read-only.",
      "For checkboxes use checked={bool} instead of value.",
      "For select elements, put value on the select tag, not on option tags.",
      "e.preventDefault() in onSubmit stops page reload.",
      "Use a single state object for multi-field forms with one shared handler using e.target.name.",
    ],
    code: `import { useState } from "react";

function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Both fields are required.");
      return;
    }
    setError("");
    alert("Submitted: " + form.email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}

// Checkbox + Select
function Preferences() {
  const [agreed, setAgreed] = useState(false);
  const [country, setCountry] = useState("india");

  return (
    <div>
      <input
        type="checkbox"
        checked={agreed}
        onChange={(e) => setAgreed(e.target.checked)}
      />
      <label> I agree to terms</label>
      <br />
      <select value={country} onChange={(e) => setCountry(e.target.value)}>
        <option value="india">India</option>
        <option value="usa">USA</option>
        <option value="uk">UK</option>
      </select>
    </div>
  );
}`,
  },
  {
    id: 12,
    emoji: "🏋️",
    title: "Lifting State Up",
    color: "#FF6B6B",
    theory: [
      "When two sibling components need to share the same state, you lift that state up to their closest common parent.",
      "The parent holds the state and passes it down as props to both children.",
      "The parent also passes down handler functions so children can request state changes — since props are read-only.",
      "Data flows down (props), events flow up (callbacks). This is the core of React's one-way data flow.",
    ],
    notes: [
      "If two components need the same data, their state belongs in their closest common ancestor.",
      "The child never modifies state directly — it calls a function passed down from the parent.",
      "This pattern scales well but can get tedious with many levels — that's when Context or state managers help.",
      "The parent is the single source of truth for shared state.",
    ],
    code: `import { useState } from "react";

function TemperatureInput({ unit, temp, onTempChange }) {
  return (
    <div>
      <label>Temperature in {unit}: </label>
      <input
        type="number"
        value={temp}
        onChange={(e) => onTempChange(e.target.value)}
      />
    </div>
  );
}

function BoilingResult({ celsius }) {
  return (
    <p>
      {celsius >= 100 ? "🔥 Water would boil!" : "💧 Water would NOT boil."}
    </p>
  );
}

// Parent holds ALL shared state
function TemperatureCalculator() {
  const [celsius, setCelsius] = useState(0);
  const fahrenheit = (celsius * 9) / 5 + 32;

  return (
    <div>
      <TemperatureInput
        unit="Celsius"
        temp={celsius}
        onTempChange={(val) => setCelsius(Number(val))}
      />
      <TemperatureInput
        unit="Fahrenheit"
        temp={fahrenheit}
        onTempChange={(val) => setCelsius(((Number(val) - 32) * 5) / 9)}
      />
      <BoilingResult celsius={celsius} />
    </div>
  );
}`,
  },
  {
    id: 13,
    emoji: "🧱",
    title: "Component Composition",
    color: "#A78BFA",
    theory: [
      "Composition is the pattern of building complex UIs by combining simple, reusable components.",
      "The children prop is a special prop React automatically passes — it contains whatever you put between a component's opening and closing tags.",
      "Think of it like HTML div tags that wrap their children — you can do the same with your own components.",
      "Composition is preferred over inheritance in React — you rarely need class-based inheritance.",
    ],
    notes: [
      "props.children contains everything between the component's opening and closing tags.",
      "Use composition to build layout wrappers: Card, Modal, Panel — generic shells that wrap any content.",
      "You can pass JSX as any prop, not just children — this is called the slot pattern.",
      "Composition avoids prop drilling for UI structure — children flow naturally without extra props.",
    ],
    code: `import { useState } from "react";

// Generic Card wrapper
function Card({ title, children, color = "#61DAFB" }) {
  return (
    <div style={{
      border: \`2px solid \${color}\`,
      borderRadius: "10px",
      padding: "16px",
      marginBottom: "12px",
    }}>
      {title && <h3 style={{ color }}>{title}</h3>}
      {children}
    </div>
  );
}

// Button with children
function FancyButton({ children, onClick, variant = "primary" }) {
  const bg = variant === "danger" ? "#FF6B6B" : "#61DAFB";
  const fg = variant === "danger" ? "#fff" : "#000";
  return (
    <button onClick={onClick}
      style={{ background: bg, color: fg, border: "none",
               padding: "8px 14px", borderRadius: 6, cursor: "pointer" }}>
      {children}
    </button>
  );
}

// Slot pattern — named children via props
function Layout({ sidebar, content }) {
  return (
    <div style={{ display: "flex", gap: "16px" }}>
      <aside style={{ width: "150px", background: "#21262d", padding: 8, borderRadius: 6 }}>
        {sidebar}
      </aside>
      <main style={{ flex: 1 }}>{content}</main>
    </div>
  );
}

function App() {
  return (
    <div>
      <Card title="User Info" color="#34D399">
        <p>Name: Devendra</p>
        <FancyButton>Edit</FancyButton>{" "}
        <FancyButton variant="danger">Delete</FancyButton>
      </Card>
      <Layout
        sidebar={<p>Nav links</p>}
        content={<p>Main content area</p>}
      />
    </div>
  );
}`,
  },
  {
    id: 14,
    emoji: "🗺️",
    title: "React Router",
    color: "#34D399",
    theory: [
      "React Router is the standard library for adding navigation to a React app. Install it with: npm install react-router-dom",
      "React apps are Single Page Applications (SPAs) — the browser never loads a new HTML page. React Router fakes navigation by swapping components based on the URL.",
      "The URL changes, but the page never fully reloads. React Router intercepts browser navigation and renders the matching component.",
      "Below is a live simulation of routing using useState so you can understand the concept. In your real project, use the actual library as shown in the Notes tab.",
    ],
    notes: [
      "BrowserRouter — wraps your entire app and provides routing context.",
      "Routes + Route — Route path='/about' element={About} renders About when URL is /about.",
      "Link — use instead of anchor tags for internal navigation (no page reload).",
      "useNavigate() — navigate programmatically, e.g. after a form submit.",
      "useParams() — read dynamic URL segments: path='/users/:id' → const { id } = useParams().",
      "Route path='*' — catch-all 404 route, always put it last inside Routes.",
    ],
    code: `// Live simulation of routing using only useState.
// In your real Vite project, replace this with actual react-router-dom.

import { useState } from "react";

// Page components
function HomePage()    { return <h2>🏠 Home Page</h2>; }
function AboutPage()   { return <h2>ℹ️ About Page</h2>; }
function UserPage({ id }) { return <h2>👤 User Profile — ID: {id}</h2>; }
function NotFound()    { return <h2>❌ 404 — Not Found</h2>; }

// Simulated router
function App() {
  const [route, setRoute] = useState("home");

  function navigate(to) { setRoute(to); }

  function renderPage() {
    if (route === "home")    return <HomePage />;
    if (route === "about")   return <AboutPage />;
    if (route === "user-42") return <UserPage id="42" />;
    return <NotFound />;
  }

  return (
    <div>
      {/* Simulated <Link> buttons */}
      <nav style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          { label: "Home",     to: "home" },
          { label: "About",    to: "about" },
          { label: "User 42",  to: "user-42" },
          { label: "Bad URL",  to: "xyz" },
        ].map(({ label, to }) => (
          <button key={to} onClick={() => navigate(to)}
            style={{
              padding: "6px 14px", borderRadius: 6, cursor: "pointer",
              background: route === to ? "#34D399" : "#21262d",
              color: "#fff", border: "none",
            }}>
            {label}
          </button>
        ))}
      </nav>

      {/* Simulated <Routes> */}
      {renderPage()}

      <p style={{ color: "#8b949e", fontSize: 12, marginTop: 16 }}>
        ↑ Concept demo only. Real setup uses BrowserRouter + Routes + Route + Link.
      </p>
    </div>
  );
}`,
  },
  {
    id: 15,
    emoji: "📌",
    title: "useRef",
    color: "#FB923C",
    theory: [
      "useRef returns a mutable object with a .current property that persists across renders.",
      "Unlike state, changing ref.current does NOT trigger a re-render.",
      "The two main uses: 1) Accessing a DOM element directly. 2) Storing a value that persists between renders without causing re-renders.",
      "Think of useRef as a box you can put anything in — React won't touch it or re-render because of it.",
    ],
    notes: [
      "Attach ref={myRef} to a JSX element, then myRef.current gives you the actual DOM node.",
      "Common DOM uses: focus an input, scroll to element, measure element size.",
      "For storing interval IDs, previous values, or any mutable data without triggering re-renders.",
      "useRef vs useState: state change causes re-render. Ref change does not.",
      "Don't read or write refs during rendering — only inside event handlers or useEffect.",
    ],
    code: `import { useState, useRef, useEffect } from "react";

// USE CASE 1: Direct DOM access — focus an input
function AutoFocusInput() {
  const inputRef = useRef(null);

  return (
    <div>
      <input ref={inputRef} placeholder="Click button to focus me!" />
      <button onClick={() => inputRef.current.focus()}>
        Focus Input
      </button>
    </div>
  );
}

// USE CASE 2: Store interval ID without triggering re-renders
function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  function start() {
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
  }

  function stop() {
    setRunning(false);
    clearInterval(intervalRef.current);
  }

  return (
    <div>
      <p>Time: {time}s</p>
      <button onClick={start} disabled={running}>Start</button>{" "}
      <button onClick={stop} disabled={!running}>Stop</button>
    </div>
  );
}

// USE CASE 3: Track previous state value
function PreviousValue() {
  const [count, setCount] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    prevRef.current = count; // runs after render
  });

  return (
    <div>
      <p>Current: {count} | Previous: {prevRef.current}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  );
}`,
  },
  {
    id: 16,
    emoji: "🌐",
    title: "useContext",
    color: "#F472B6",
    theory: [
      "Context solves prop drilling — when you have to pass props through many intermediate components just to reach a deeply nested child.",
      "useContext lets any component in the tree read a shared value without explicitly passing it as a prop at every level.",
      "Think of it like a global variable for a component tree — but safe and React-aware.",
      "Context has two parts: a Provider (holds and broadcasts the value) and consumers (components that read it with useContext).",
    ],
    notes: [
      "createContext(defaultValue) — creates the context object.",
      "ThemeContext.Provider value={...} — wraps the subtree; all descendants can now read the value.",
      "useContext(ThemeContext) — reads the nearest Provider's value inside any child component.",
      "When the Provider's value changes, all consumers automatically re-render.",
      "Best for truly global data: theme, auth user, language. Don't use it for everything.",
      "For complex state, combine Context with useReducer instead of useState.",
    ],
    code: `import { useState, useContext, createContext } from "react";

// Step 1: Create the context
const ThemeContext = createContext("light");

// Step 2: Custom hook — wraps useContext for convenience
function useTheme() {
  return useContext(ThemeContext);
}

// Deep child — zero prop drilling needed
function ThemedButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} style={{
      background: theme === "dark" ? "#333" : "#eee",
      color:      theme === "dark" ? "#fff" : "#333",
      border: "1px solid currentColor",
      padding: "8px 16px",
      borderRadius: "6px",
      cursor: "pointer",
    }}>
      Theme: {theme} — click to toggle
    </button>
  );
}

function ThemeLabel() {
  const { theme } = useTheme();
  return <p>App is in <strong>{theme}</strong> mode</p>;
}

// Intermediate — doesn't touch theme at all
function Toolbar() {
  return <div><ThemedButton /><ThemeLabel /></div>;
}

// Step 3: Provider owns the state and wraps the tree
function App() {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <h2>useContext Demo</h2>
      <Toolbar />
    </ThemeContext.Provider>
  );
}`,
  },
  {
    id: 17,
    emoji: "🪝",
    title: "Custom Hooks",
    color: "#38BDF8",
    theory: [
      "A custom hook is just a JavaScript function whose name starts with 'use' and can call other hooks inside it.",
      "Custom hooks let you extract reusable stateful logic out of components and share it across the app.",
      "They do not share state — each component that calls a custom hook gets its own isolated copy.",
      "Think of them as building your own hook library, tailored to your app's specific needs.",
    ],
    notes: [
      "Name must start with 'use' — this is how React enforces hook rules on your function.",
      "Can use any built-in hooks inside: useState, useEffect, useRef, useContext, etc.",
      "Each component calling the same custom hook gets fully independent state.",
      "Great use cases: data fetching, form handling, local storage, window size, debouncing.",
      "Extract into a custom hook when you find the same useState + useEffect combo in multiple places.",
    ],
    code: `import { useState, useEffect } from "react";

// ---- useFetch: reusable data fetching ----
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((json) => { setData(json); setLoading(false); })
      .catch((err) => { setError(err); setLoading(false); });
  }, [url]);

  return { data, loading, error };
}

// Component stays clean — no fetch logic inside
function UserCard() {
  const { data: user, loading, error } = useFetch(
    "https://jsonplaceholder.typicode.com/users/1"
  );
  if (loading) return <p>Loading...</p>;
  if (error)   return <p>Error!</p>;
  return <h3>{user?.name}</h3>;
}

// ---- useToggle: reusable boolean flip ----
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue((v) => !v);
  return [value, toggle];
}

function ToggleDemo() {
  const [isOpen, toggle] = useToggle(false);
  return (
    <div>
      <button onClick={toggle}>{isOpen ? "Close ▲" : "Open ▼"}</button>
      {isOpen && <p>Panel content!</p>}
    </div>
  );
}

// ---- useWindowSize: track browser dimensions ----
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}`,
  },
  {
    id: 18,
    emoji: "🛡️",
    title: "Error Boundaries",
    color: "#FBBF24",
    theory: [
      "Error boundaries catch JavaScript errors anywhere in their child component tree and show a fallback UI instead of crashing the whole app.",
      "Without error boundaries, one broken component crashes your entire app — error boundaries contain the damage to just that section.",
      "Think of them like try/catch, but for React component rendering.",
      "Error boundaries must be class components — it's one of the few remaining cases you need a class in modern React.",
    ],
    notes: [
      "Error boundaries catch errors during: rendering, lifecycle methods, and constructors of child components.",
      "They do NOT catch: errors in event handlers (use regular try/catch there) or async code.",
      "getDerivedStateFromError — update state here to show the fallback UI when a child throws.",
      "componentDidCatch — called after the error; good place to log errors to a reporting service.",
      "Place boundaries around individual sections, not just one at the very top of the app.",
      "Click Try Again in the demo below to reset the boundary after a crash.",
    ],
    code: `import { Component, useState } from "react";

// Class-based Error Boundary
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Boundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, background: "#2d1515",
                      border: "1px solid #FF6B6B", borderRadius: 8 }}>
          <h3>😵 Something went wrong.</h3>
          <p style={{ color: "#FF6B6B" }}>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Intentionally buggy component
function BuggyCounter() {
  const [count, setCount] = useState(0);
  if (count === 3) throw new Error("Crashed at count 3!");
  return (
    <div>
      <p>Count: {count} — crashes at 3</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  );
}

// App — boundary contains the crash to one section
function App() {
  return (
    <div>
      <h2>Error Boundary Demo</h2>
      <ErrorBoundary>
        <BuggyCounter />
      </ErrorBoundary>
      <p style={{ color: "#34D399", marginTop: 12 }}>
        This line is outside the boundary — still works even when above crashes.
      </p>
    </div>
  );
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
      background: "#0d1117",
      minHeight: "100vh",
      display: "flex",
      color: "#e6edf3",
    }}>
      {/* Sidebar */}
      <div style={{
        width: "220px", minWidth: "220px",
        background: "#161b22",
        borderRight: "1px solid #30363d",
        overflowY: "auto",
        padding: "16px 0",
      }}>
        <div style={{ padding: "0 16px 16px", borderBottom: "1px solid #30363d", marginBottom: "8px" }}>
          <div style={{ fontSize: "11px", color: "#8b949e", letterSpacing: "2px", textTransform: "uppercase" }}>React Intermediate</div>
          <div style={{ fontSize: "18px", fontWeight: "700", color: "#61DAFB", marginTop: "4px" }}>Topics 10–18</div>
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

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Header */}
        <div style={{
          padding: "28px 32px 20px", borderBottom: "1px solid #30363d",
          background: "#0d1117", position: "sticky", top: 0, zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span style={{ fontSize: "28px" }}>{topic.emoji}</span>
            <div>
              <span style={{ fontSize: "11px", color: "#8b949e", letterSpacing: "1px" }}>TOPIC {topic.id} OF 18</span>
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

        {/* Content */}
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

        {/* Navigation */}
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
