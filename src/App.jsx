import { useState } from "react";

const topics = [
  {
    id: 1,
    emoji: "⚛️",
    title: "What is React & Why It Exists",
    color: "#61DAFB",
    theory: [
      "React is a JavaScript library (not a framework) for building user interfaces.",
      "Before React, every time data changed, the whole HTML page had to re-render — slow and messy.",
      "React introduced the Virtual DOM: a lightweight copy of the real DOM. When data changes, React updates only the parts that actually changed.",
      "Think of it like this: instead of repainting the whole wall, React only repaints the scratch.",
    ],
    notes: [
      "React was made by Facebook (Meta) in 2013.",
      "React is just the UI layer — it doesn't care about routing, data fetching, etc. (you add those separately).",
      "Virtual DOM → React figures out what changed → updates only that in the real DOM. This is called Reconciliation.",
    ],
    code: `// Without React (vanilla JS — painful):
document.getElementById("name").innerHTML = "Devendra";

// With React — you just describe WHAT the UI should look like,
// React figures out HOW to update the DOM.
function App() {
  return <h1>Hello, Devendra!</h1>;
}`,
  },
  {
    id: 2,
    emoji: "📝",
    title: "JSX",
    color: "#F7DF1E",
    theory: [
      "JSX = JavaScript XML. It lets you write HTML-like syntax directly inside JavaScript.",
      "JSX is NOT HTML. It looks like HTML but gets compiled to regular JavaScript by a tool called Babel.",
      "Every JSX element compiles down to React.createElement() calls under the hood.",
    ],
    notes: [
      "Use className instead of class (because class is a reserved JS keyword).",
      "Use htmlFor instead of for (same reason).",
      "Every JSX expression must return ONE parent element. Wrap in a <div> or empty <> fragment if needed.",
      "JavaScript expressions inside JSX go in curly braces {}.",
      "Self-closing tags must have a slash: <img /> not <img>.",
    ],
    code: `// JSX example
function App() {
  const name = "Devendra";
  const age = 22;

  return (
    <>
      <h1 className="title">Hello, {name}!</h1>
      <p>Age: {age}</p>
      <p>In 5 years: {age + 5}</p>
      <img src="photo.jpg" alt="profile" />
    </>
  );
}

// What JSX compiles to (you never write this manually):
// React.createElement("h1", { className: "title" }, "Hello, Devendra!")`,
  },
  {
    id: 3,
    emoji: "🧩",
    title: "Components",
    color: "#FF6B6B",
    theory: [
      "A component is just a JavaScript function that returns JSX.",
      "Components are the building blocks of React apps — like LEGO pieces you combine together.",
      "Think of a webpage: Header, Sidebar, Card, Footer — each is a component.",
      "Components can be reused anywhere in your app. Write once, use many times.",
    ],
    notes: [
      "Component names MUST start with a capital letter. <button> is an HTML tag, <Button> is your component.",
      "Keep components small and focused — one component should do one thing.",
      "Components can be nested inside other components.",
      "The top-level component is usually called App.",
    ],
    code: `// A simple component
function Greeting() {
  return <h2>Hello from Greeting component!</h2>;
}

// A reusable Card component
function Card() {
  return (
    <div className="card">
      <h3>Card Title</h3>
      <p>Some content here.</p>
    </div>
  );
}

// App uses both — components nest inside components
function App() {
  return (
    <div>
      <Greeting />
      <Card />
      <Card />  {/* reused! */}
    </div>
  );
}`,
  },
  {
    id: 4,
    emoji: "📦",
    title: "Props",
    color: "#A78BFA",
    theory: [
      "Props (short for properties) are how you pass data from a parent component to a child component.",
      "Props flow in ONE direction only: parent → child. Never the other way.",
      "Props make components reusable — the same component can render different content based on props.",
      "Think of props like arguments to a function — you pass them in, the component uses them.",
    ],
    notes: [
      "Props are read-only inside the child. Never modify props.",
      "You can pass any data type as a prop: string, number, array, object, function, even JSX.",
      "Non-string props use curly braces: age={22}, not age='22'.",
      "You can set default values for props using default parameters.",
    ],
    code: `// Child component receives props as a parameter
function UserCard({ name, age, role }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>Age: {age}</p>
      <p>Role: {role}</p>
    </div>
  );
}

// Parent passes props to child
function App() {
  return (
    <div>
      <UserCard name="Devendra" age={22} role="Developer" />
      <UserCard name="Arjun" age={25} role="Designer" />
      <UserCard name="Priya" age={28} role="Manager" />
    </div>
  );
}

// Default props example
function Button({ label = "Click Me", color = "blue" }) {
  return <button style={{ background: color }}>{label}</button>;
}`,
  },
  {
    id: 5,
    emoji: "⚡",
    title: "State (useState)",
    color: "#34D399",
    theory: [
      "State is data that belongs to a component and can change over time.",
      "When state changes, React automatically re-renders the component with the new data.",
      "Props come from outside (parent). State lives inside the component itself.",
      "useState is a React Hook — a special function that adds state to a functional component.",
    ],
    notes: [
      "useState returns an array with two things: [currentValue, setterFunction].",
      "NEVER directly modify state like count = count + 1. Always use the setter: setCount(count + 1).",
      "State updates may be batched — React is smart about when to re-render.",
      "Each component instance has its own state — two <Counter /> components don't share state.",
      "State can be any type: number, string, boolean, array, object.",
    ],
    code: `import { useState } from "react";

function Counter() {
  // Declare state: initial value is 0
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// Boolean state example
function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => setIsOn(!isOn)}>
      {isOn ? "ON 🟢" : "OFF 🔴"}
    </button>
  );
}`,
  },
  {
    id: 6,
    emoji: "🖱️",
    title: "Event Handling",
    color: "#FB923C",
    theory: [
      "React handles events similarly to HTML but with a few key differences.",
      "In React, event names are camelCase (onClick, not onclick).",
      "You pass a function reference, not a function call, as the event handler.",
      "React uses Synthetic Events — wrappers around native browser events, so they work consistently across all browsers.",
    ],
    notes: [
      "onClick={() => doSomething()} ✅ — passes a function.",
      "onClick={doSomething()} ❌ — calls the function immediately on render!",
      "Common events: onClick, onChange, onSubmit, onKeyDown, onMouseOver, onFocus.",
      "Event object (e) is automatically passed to handlers — use e.target.value to get input value.",
      "Use e.preventDefault() to stop default browser behavior (like form submission).",
    ],
    code: `import { useState } from "react";

function EventDemo() {
  const [text, setText] = useState("");

  // Handler functions defined separately — clean approach
  function handleClick() {
    alert("Button clicked!");
  }

  function handleChange(e) {
    setText(e.target.value); // e.target.value = what user typed
  }

  function handleSubmit(e) {
    e.preventDefault(); // stops page from reloading
    alert("Submitted: " + text);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Type something..."
      />
      <button type="button" onClick={handleClick}>
        Alert
      </button>
      <button type="submit">Submit</button>
      <p>You typed: {text}</p>
    </form>
  );
}`,
  },
  {
    id: 7,
    emoji: "🔀",
    title: "Conditional Rendering",
    color: "#F472B6",
    theory: [
      "Conditional rendering means showing different UI based on certain conditions.",
      "Since JSX is just JavaScript, you can use normal JS logic (if, ternary, &&) to decide what to render.",
      "React renders nothing for null, undefined, and false — useful for hiding elements.",
    ],
    notes: [
      "Ternary (condition ? A : B) — use when you need to show one thing OR another.",
      "&& operator — use when you want to show something OR nothing.",
      "Avoid putting 0 before && (0 && <X/> will render 0!). Convert to boolean: {count > 0 && <X/>}.",
      "For complex logic, use a regular if/else before the return statement.",
    ],
    code: `import { useState } from "react";

function ConditionalDemo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [score, setScore] = useState(75);

  return (
    <div>
      {/* Method 1: Ternary — show one OR the other */}
      {isLoggedIn ? (
        <h2>Welcome back, Devendra! 👋</h2>
      ) : (
        <h2>Please log in.</h2>
      )}

      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
        Toggle Login
      </button>

      {/* Method 2: && — show something OR nothing */}
      {score >= 60 && <p>✅ You passed!</p>}
      {score < 60 && <p>❌ You failed.</p>}

      {/* Method 3: if/else before return (for complex logic) */}
      <Grade score={score} />
    </div>
  );
}

function Grade({ score }) {
  let message;
  if (score >= 90) message = "A — Excellent!";
  else if (score >= 75) message = "B — Good job!";
  else if (score >= 60) message = "C — Pass";
  else message = "F — Try again";

  return <p>Grade: {message}</p>;
}`,
  },
  {
    id: 8,
    emoji: "📋",
    title: "Lists & Keys",
    color: "#38BDF8",
    theory: [
      "To render a list of items in React, you use the .map() array method.",
      ".map() transforms each item in an array into a JSX element.",
      "React needs a key prop on each list item so it can track which items changed, were added, or removed.",
      "Keys help React's reconciliation algorithm be efficient — without keys, React re-renders everything.",
    ],
    notes: [
      "Key must be unique among siblings — not globally unique.",
      "Use a unique ID from your data as the key. Avoid using index as key (it causes bugs when list order changes).",
      "Keys are not passed as props — you can't access props.key inside the child.",
      "The key goes on the outermost element returned in the .map().",
    ],
    code: `import { useState } from "react";

const users = [
  { id: 1, name: "Devendra", city: "Mumbai" },
  { id: 2, name: "Arjun", city: "Delhi" },
  { id: 3, name: "Priya", city: "Bangalore" },
];

function UserList() {
  return (
    <ul>
      {users.map((user) => (
        // key goes here — on the element returned from .map()
        <li key={user.id}>
          {user.name} — {user.city}
        </li>
      ))}
    </ul>
  );
}

// Dynamic list with state
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React" },
    { id: 2, text: "Build a project" },
  ]);

  function removeTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          {todo.text}
          <button onClick={() => removeTodo(todo.id)}>❌</button>
        </li>
      ))}
    </ul>
  );
}`,
  },
  {
    id: 9,
    emoji: "🎨",
    title: "Basic Styling",
    color: "#FBBF24",
    theory: [
      "React gives you multiple ways to style components — each with different tradeoffs.",
      "Inline styles: written as JS objects directly in JSX. Good for dynamic styles.",
      "CSS files: import a .css file and use className. Most familiar, works globally.",
      "CSS Modules: scoped CSS — styles only apply to the component that imports them (no clashes).",
    ],
    notes: [
      "In JSX, use className instead of class.",
      "Inline styles use camelCase: backgroundColor not background-color.",
      "Inline style values are strings or numbers: { fontSize: 16 } not { fontSize: '16px' } (px is auto-added for numbers).",
      "CSS Modules give you locally scoped class names — best for large apps.",
      "Popular alternatives: Tailwind CSS, styled-components, Emotion.",
    ],
    code: `// METHOD 1: Inline styles (JS object)
function InlineStyleDemo() {
  const isActive = true;

  const boxStyle = {
    backgroundColor: isActive ? "green" : "gray",
    color: "white",
    padding: "12px",
    borderRadius: "8px",
  };

  return <div style={boxStyle}>I am {isActive ? "active" : "inactive"}</div>;
}

// METHOD 2: External CSS file
// In App.css:
// .title { font-size: 24px; color: navy; }
// .card { border: 1px solid #ccc; padding: 16px; }

import "./App.css";
function CSSDemo() {
  return (
    <div className="card">
      <h1 className="title">Styled with CSS file</h1>
    </div>
  );
}

// METHOD 3: Dynamic className
function DynamicClass({ isError }) {
  return (
    <p className={isError ? "error-text" : "normal-text"}>
      {isError ? "Something went wrong!" : "All good!"}
    </p>
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
        width: "220px",
        minWidth: "220px",
        background: "#161b22",
        borderRight: "1px solid #30363d",
        overflowY: "auto",
        padding: "16px 0",
      }}>
        <div style={{
          padding: "0 16px 16px",
          borderBottom: "1px solid #30363d",
          marginBottom: "8px",
        }}>
          <div style={{ fontSize: "11px", color: "#8b949e", letterSpacing: "2px", textTransform: "uppercase" }}>React Basics</div>
          <div style={{ fontSize: "18px", fontWeight: "700", color: "#61DAFB", marginTop: "4px" }}>Topics 1–9</div>
        </div>
        {topics.map((t, i) => (
          <button
            key={t.id}
            onClick={() => { setSelected(i); setTab("theory"); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              padding: "10px 16px",
              background: selected === i ? "#21262d" : "transparent",
              border: "none",
              borderLeft: selected === i ? `3px solid ${t.color}` : "3px solid transparent",
              color: selected === i ? "#e6edf3" : "#8b949e",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "12px",
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: "16px" }}>{t.emoji}</span>
            <span style={{ lineHeight: "1.3" }}>{t.id}. {t.title}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Header */}
        <div style={{
          padding: "28px 32px 20px",
          borderBottom: "1px solid #30363d",
          background: "#0d1117",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span style={{ fontSize: "28px" }}>{topic.emoji}</span>
            <div>
              <span style={{ fontSize: "11px", color: "#8b949e", letterSpacing: "1px" }}>TOPIC {topic.id} OF 9</span>
              <h1 style={{ margin: 0, fontSize: "22px", color: topic.color }}>{topic.title}</h1>
            </div>
          </div>
          {/* Tabs */}
          <div style={{ display: "flex", gap: "4px" }}>
            {["theory", "notes", "code"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "6px",
                  border: "1px solid",
                  borderColor: tab === t ? topic.color : "#30363d",
                  background: tab === t ? topic.color + "22" : "transparent",
                  color: tab === t ? topic.color : "#8b949e",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontFamily: "inherit",
                  textTransform: "capitalize",
                  letterSpacing: "0.5px",
                }}
              >
                {t === "theory" ? "📖 Theory" : t === "notes" ? "📌 Notes" : "💻 Code"}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: "28px 32px" }}>
          {tab === "theory" && (
            <div>
              {topic.theory.map((point, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: "14px",
                  marginBottom: "16px",
                  padding: "16px",
                  background: "#161b22",
                  borderRadius: "10px",
                  border: "1px solid #30363d",
                  borderLeft: `3px solid ${topic.color}`,
                }}>
                  <span style={{ color: topic.color, fontWeight: "bold", fontSize: "14px", minWidth: "20px" }}>{i + 1}.</span>
                  <p style={{ margin: 0, color: "#c9d1d9", lineHeight: "1.7", fontSize: "14px" }}>{point}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "notes" && (
            <div>
              <div style={{
                background: "#161b22",
                border: "1px solid #30363d",
                borderRadius: "10px",
                padding: "20px",
              }}>
                {topic.notes.map((note, i) => (
                  <div key={i} style={{
                    display: "flex",
                    gap: "10px",
                    padding: "10px 0",
                    borderBottom: i < topic.notes.length - 1 ? "1px solid #21262d" : "none",
                  }}>
                    <span style={{ color: topic.color, fontSize: "16px" }}>→</span>
                    <p style={{ margin: 0, color: "#c9d1d9", lineHeight: "1.7", fontSize: "14px" }}>{note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "code" && (
            <div>
              <div style={{
                background: "#161b22",
                border: "1px solid #30363d",
                borderRadius: "10px",
                overflow: "hidden",
              }}>
                <div style={{
                  background: "#21262d",
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  borderBottom: "1px solid #30363d",
                }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
                  <span style={{ fontSize: "12px", color: "#8b949e", marginLeft: "8px" }}>example.jsx</span>
                </div>
                <pre style={{
                  margin: 0,
                  padding: "20px",
                  overflowX: "auto",
                  fontSize: "13px",
                  lineHeight: "1.8",
                  color: "#e6edf3",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}>
                  <code>{topic.code}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 32px 32px",
          gap: "12px",
        }}>
          <button
            onClick={() => { setSelected(Math.max(0, selected - 1)); setTab("theory"); }}
            disabled={selected === 0}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "1px solid #30363d",
              background: selected === 0 ? "#161b22" : "#21262d",
              color: selected === 0 ? "#484f58" : "#c9d1d9",
              cursor: selected === 0 ? "not-allowed" : "pointer",
              fontSize: "13px",
              fontFamily: "inherit",
            }}
          >
            ← Previous
          </button>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {topics.map((_, i) => (
              <div
                key={i}
                onClick={() => { setSelected(i); setTab("theory"); }}
                style={{
                  width: selected === i ? "20px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: selected === i ? topic.color : "#30363d",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              />
            ))}
          </div>
          <button
            onClick={() => { setSelected(Math.min(topics.length - 1, selected + 1)); setTab("theory"); }}
            disabled={selected === topics.length - 1}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "1px solid #30363d",
              background: selected === topics.length - 1 ? "#161b22" : "#21262d",
              color: selected === topics.length - 1 ? "#484f58" : "#c9d1d9",
              cursor: selected === topics.length - 1 ? "not-allowed" : "pointer",
              fontSize: "13px",
              fontFamily: "inherit",
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
