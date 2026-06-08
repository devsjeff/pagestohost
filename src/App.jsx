import { useState } from "react";

const topics = [
  {
    id: 1,
    title: "What is React & Why It Exists",
    color: "#6366f1",
    theory: [
      "React is a JavaScript library made by Facebook (2013) for building UIs.",
      "Before React, updating the DOM manually was slow and messy.",
      "React uses a Virtual DOM — a lightweight copy of the real DOM in memory.",
      "When state changes, React diffs the virtual DOM and only updates what changed in the real DOM.",
      "This makes React fast and predictable.",
    ],
    note: "💡 React doesn't replace HTML/CSS/JS. It's built on top of them. You still write JS — just in a smarter, component-based way.",
    code: `// Without React (vanilla JS — messy)
document.getElementById("btn").addEventListener("click", () => {
  document.getElementById("count").innerText = Number(
    document.getElementById("count").innerText
  ) + 1;
});

// With React — just update state, React handles the DOM
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}`,
  },
  {
    id: 2,
    title: "JSX — JavaScript + XML",
    color: "#ec4899",
    theory: [
      "JSX lets you write HTML-like syntax directly inside JavaScript.",
      "It's NOT real HTML — it gets compiled to React.createElement() calls by Babel.",
      "JSX must return a single root element. Wrap in <> </> (Fragment) if needed.",
      "Use className instead of class (class is a reserved word in JS).",
      "Use {} to embed any JS expression inside JSX.",
      "Self-closing tags must have a slash: <img /> not <img>",
    ],
    note: "💡 JSX is syntactic sugar. <h1>Hello</h1> becomes React.createElement('h1', null, 'Hello') under the hood.",
    code: `// JSX basics
function App() {
  const name = "Dev";
  const age = 22;
  const isLoggedIn = true;

  return (
    <>
      <h1 className="title">Hello, {name}!</h1>
      <p>Age: {age}</p>
      <p>2 + 2 = {2 + 2}</p>
      <p>{isLoggedIn ? "Welcome back" : "Please login"}</p>
      <img src="photo.jpg" alt="profile" />
    </>
  );
}

// This JSX:       <h1>Hello</h1>
// Compiles to:    React.createElement("h1", null, "Hello")`,
  },
  {
    id: 3,
    title: "Components — The Building Blocks",
    color: "#f59e0b",
    theory: [
      "A component is just a JavaScript function that returns JSX.",
      "Components let you split the UI into reusable, independent pieces.",
      "Component names MUST start with a capital letter (React rule).",
      "You can nest components inside each other to build complex UIs.",
      "Each component manages its own logic and appearance.",
    ],
    note: "💡 Think of components like LEGO blocks. You build small reusable pieces, then assemble them into a full page.",
    code: `// A simple component
function Greeting() {
  return <h2>Hello from a component!</h2>;
}

// A more structured component
function UserCard() {
  return (
    <div className="card">
      <h3>Dev</h3>
      <p>Age: 22</p>
      <p>📍 India</p>
    </div>
  );
}

// Nesting components
function App() {
  return (
    <div>
      <Greeting />
      <UserCard />
      <UserCard />  {/* Reuse as many times as you want */}
    </div>
  );
}`,
  },
  {
    id: 4,
    title: "Props — Passing Data to Components",
    color: "#10b981",
    theory: [
      "Props (properties) let you pass data from a parent component to a child.",
      "Props flow one way: parent → child. You can't pass props upward.",
      "Inside the child, props is just an object: { name: 'Dev', age: 22 }",
      "You can destructure props directly in the function parameter.",
      "Props can be strings, numbers, booleans, arrays, objects, even functions.",
      "Children passed between tags are accessible as props.children.",
    ],
    note: "💡 Props make components dynamic and reusable. Same component, different data = different output.",
    code: `// Defining props in a child component
function UserCard({ name, age, city }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>Age: {age}</p>
      <p>📍 {city}</p>
    </div>
  );
}

// Passing props from parent
function App() {
  return (
    <div>
      <UserCard name="Dev" age={22} city="India" />
      <UserCard name="Alice" age={25} city="USA" />
      <UserCard name="Bob" age={30} city="UK" />
    </div>
  );
}

// props.children example
function Card({ children }) {
  return <div className="box">{children}</div>;
}

function App() {
  return (
    <Card>
      <h2>I am inside the Card!</h2>  {/* This is children */}
    </Card>
  );
}`,
  },
  {
    id: 5,
    title: "State — useState Hook",
    color: "#3b82f6",
    theory: [
      "State is data that belongs to a component and can change over time.",
      "When state changes, React automatically re-renders the component.",
      "useState returns an array: [currentValue, setterFunction].",
      "NEVER directly mutate state (e.g. count++ is wrong). Always use the setter.",
      "Each call to useState manages one independent piece of state.",
      "State is local to the component — other components don't see it.",
    ],
    note: "💡 State = memory of a component. Props = input from outside. State is private, props come from parent.",
    code: `import { useState } from 'react';

// Counter example
function Counter() {
  const [count, setCount] = useState(0);  // starts at 0

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// Multiple state values
function Form() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={age} onChange={(e) => setAge(e.target.value)} />
      <p>{name} is {age} years old</p>
    </div>
  );
}

// ❌ WRONG — never mutate state directly
count++;           // React won't re-render!
state.name = "X";  // same issue

// ✅ CORRECT — use the setter
setCount(count + 1);`,
  },
  {
    id: 6,
    title: "Event Handling",
    color: "#8b5cf6",
    theory: [
      "React events are camelCase: onClick, onChange, onSubmit, onMouseOver.",
      "You pass a function reference, not a function call: onClick={handleClick} not onClick={handleClick()}",
      "The event handler receives a synthetic event object (e) as its argument.",
      "Use e.preventDefault() to stop default browser behavior (like form submission).",
      "You can write handlers inline or as named functions outside the JSX.",
    ],
    note: "💡 Notice onClick={handleClick} NOT onClick={handleClick()}. The () calls it immediately on render. You want to pass the function, not its result.",
    code: `function EventDemo() {
  // Named handler (cleaner for complex logic)
  function handleClick() {
    alert("Button clicked!");
  }

  function handleInput(e) {
    console.log(e.target.value); // what user typed
  }

  function handleSubmit(e) {
    e.preventDefault(); // stops page reload
    alert("Form submitted!");
  }

  return (
    <div>
      {/* Button click */}
      <button onClick={handleClick}>Click me</button>

      {/* Inline arrow function (fine for short logic) */}
      <button onClick={() => alert("Hi!")}>Inline</button>

      {/* Input change */}
      <input onChange={handleInput} placeholder="Type here" />

      {/* Form submit */}
      <form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </form>

      {/* Passing arguments */}
      <button onClick={() => handleGreet("Dev")}>Greet</button>
    </div>
  );
}

function handleGreet(name) {
  alert(\`Hello, \${name}!\`);
}`,
  },
  {
    id: 7,
    title: "Conditional Rendering",
    color: "#ef4444",
    theory: [
      "React can show/hide parts of the UI based on conditions.",
      "Use ternary operator (? :) for if/else inside JSX.",
      "Use && for 'render only if true' (short-circuit evaluation).",
      "Use an if/else block OUTSIDE the return for more complex logic.",
      "Returning null from a component renders nothing.",
    ],
    note: "💡 0 && <Component /> is a gotcha! If count is 0, React renders '0' on screen. Use count > 0 && ... or a ternary instead.",
    code: `function ConditionalDemo({ isLoggedIn, score, items }) {
  // Method 1: if/else outside return (best for complex conditions)
  if (!isLoggedIn) {
    return <p>Please log in first.</p>;
  }

  return (
    <div>
      {/* Method 2: Ternary — renders one of two things */}
      <p>{isLoggedIn ? "Welcome back!" : "Please login"}</p>

      {/* Method 3: && — renders only if true */}
      {score > 90 && <p>🏆 Top scorer!</p>}

      {/* ⚠️ Gotcha: 0 && renders "0" on screen */}
      {items.length > 0 && <p>{items.length} items</p>}

      {/* Null = render nothing */}
      {isLoggedIn ? <Dashboard /> : null}
    </div>
  );
}

// Returning null hides component completely
function Banner({ show }) {
  if (!show) return null;
  return <div className="banner">Important notice!</div>;
}`,
  },
  {
    id: 8,
    title: "Lists & Keys",
    color: "#06b6d4",
    theory: [
      "Use .map() to render arrays of elements in JSX.",
      "Every item in a list needs a unique key prop.",
      "Keys help React identify which items changed, added, or removed.",
      "Keys must be unique among siblings, not globally.",
      "Use a unique ID from your data as key — avoid using array index as key (causes bugs with reordering).",
      "Key is not a prop — you can't access props.key inside the component.",
    ],
    note: "💡 Using index as key works for static lists, but breaks for lists that can be reordered or filtered. Always prefer a real ID.",
    code: `function FruitList() {
  const fruits = ["Apple", "Banana", "Mango", "Orange"];

  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={index}>{fruit}</li>  // index is ok for static lists
      ))}
    </ul>
  );
}

// Better: use a real ID when available
function UserList() {
  const users = [
    { id: 1, name: "Dev", role: "Developer" },
    { id: 2, name: "Alice", role: "Designer" },
    { id: 3, name: "Bob", role: "Manager" },
  ];

  return (
    <div>
      {users.map((user) => (
        <div key={user.id} className="user-card">  {/* ✅ unique ID as key */}
          <h3>{user.name}</h3>
          <p>{user.role}</p>
        </div>
      ))}
    </div>
  );
}

// Filtering + mapping together
function ActiveUsers({ users }) {
  return (
    <ul>
      {users
        .filter(user => user.isActive)
        .map(user => <li key={user.id}>{user.name}</li>)
      }
    </ul>
  );
}`,
  },
  {
    id: 9,
    title: "Basic Styling",
    color: "#f97316",
    theory: [
      "Three main ways to style in React: inline styles, CSS files, CSS Modules.",
      "Inline styles use a JS object with camelCase properties: { backgroundColor: 'red' }.",
      "className (not class) is used to apply CSS classes in JSX.",
      "CSS files work exactly like normal CSS — just import them.",
      "CSS Modules scope styles to one component — no class name conflicts.",
      "Libraries like Tailwind CSS are also very popular in React projects.",
    ],
    note: "💡 CSS Modules are the safest for large apps (no global conflicts). Tailwind CSS is the most popular choice in modern React projects.",
    code: `// Method 1: Inline styles (JS object, camelCase)
function InlineExample() {
  const style = {
    backgroundColor: "steelblue",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
  };

  return <button style={style}>Styled Button</button>;
}

// Method 2: Regular CSS file
// styles.css → .title { font-size: 24px; color: navy; }
import "./styles.css";

function CSSExample() {
  return <h1 className="title">Styled with CSS</h1>;
}

// Method 3: CSS Modules (scoped styles)
// Button.module.css → .btn { background: coral; }
import styles from "./Button.module.css";

function ModuleExample() {
  return <button className={styles.btn}>Module Styled</button>;
}

// Dynamic className based on condition
function Alert({ type }) {
  return (
    <div className={\`alert \${type === "error" ? "alert-red" : "alert-green"}\`}>
      {type === "error" ? "Something went wrong!" : "All good!"}
    </div>
  );
}`,
