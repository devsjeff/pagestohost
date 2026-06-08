import { useState } from "react";

const categories = [
  {
    label: "Core Concepts",
    color: "#61DAFB",
    emoji: "⚛️",
    terms: [
      {
        term: "React",
        simple: "A JavaScript library made by Meta for building user interfaces faster and more efficiently.",
        technical: "React is a declarative, component-based JavaScript library for building UIs. It uses a Virtual DOM to minimize expensive real DOM operations by diffing changes and applying only what's needed. It follows a unidirectional data flow and separates UI into reusable components.",
        tip: "Don't call it a framework — it's a library. Frameworks like Angular are opinionated and come with everything. React only handles the View layer.",
      },
      {
        term: "SPA (Single Page Application)",
        simple: "A web app that loads once and updates the content dynamically without refreshing the browser.",
        technical: "An SPA loads a single HTML file on the first request. After that, JavaScript intercepts navigation, updates the URL via the History API, and re-renders components without a full page reload. React with React Router is a classic SPA setup.",
        tip: "Downside of SPAs: poor SEO and slow initial load. That's why Next.js (SSR) was created.",
      },
      {
        term: "Virtual DOM",
        simple: "A lightweight copy of the real DOM that React uses to figure out what changed before updating the browser.",
        technical: "The Virtual DOM is an in-memory JavaScript object tree that mirrors the real DOM. When state changes, React creates a new Virtual DOM tree, diffs it against the previous one (reconciliation), and batches only the minimal real DOM updates needed. This is far faster than re-rendering the entire page.",
        tip: "Key interview answer: 'React never touches the real DOM directly — it updates the Virtual DOM first, calculates the diff, then commits the minimum changes.'",
      },
      {
        term: "Reconciliation",
        simple: "The process React uses to compare the old and new Virtual DOM and decide what to update.",
        technical: "When state or props change, React calls render to produce a new Virtual DOM tree. React then diffs this against the previous tree using its reconciliation algorithm. It uses keys to track list items, bails out on subtrees that haven't changed, and batches DOM mutations for performance.",
        tip: "This is why the key prop matters in lists — without it React can't correctly identify which item changed.",
      },
      {
        term: "Component",
        simple: "A reusable, self-contained piece of UI — like a LEGO block for your web page.",
        technical: "A React component is a JavaScript function (or class) that accepts props as input and returns JSX describing what to render. Components encapsulate their own logic and UI, can hold local state, and can be composed together to build complex interfaces.",
        tip: "Always start component names with a capital letter. React treats lowercase names as native HTML elements.",
      },
      {
        term: "JSX",
        simple: "A syntax that lets you write HTML-like code inside JavaScript.",
        technical: "JSX (JavaScript XML) is syntactic sugar that gets compiled by Babel into React.createElement() calls. It is not HTML — it uses className instead of class, htmlFor instead of for, and all tags must be closed. JavaScript expressions go inside curly braces {}.",
        tip: "JSX is optional — you could write React.createElement() manually — but nobody does.",
      },
      {
        term: "Props",
        simple: "Data passed from a parent component to a child component, like arguments to a function.",
        technical: "Props (properties) are read-only inputs passed down the component tree. They enforce one-way data flow — data flows from parent to child only. A child component must never mutate its props. For two-way communication, parents pass callback functions as props.",
        tip: "Props are immutable. If a child needs to change something, it should call a function prop passed from the parent.",
      },
      {
        term: "State",
        simple: "Data that belongs to a component and can change over time, triggering a re-render.",
        technical: "State is mutable data managed inside a component using the useState hook. When state is updated via the setter function, React schedules a re-render of that component and its children. State updates may be batched for performance. Unlike props, state is private to the component.",
        tip: "Props come from outside (parent). State lives inside the component itself. This is a very common interview question.",
      },
      {
        term: "Reusability",
        simple: "Writing a component once and using it in multiple places without rewriting the code.",
        technical: "Reusability is achieved by building components that accept props to control their output, keeping them generic and composable. Custom hooks extend this to logic reuse. A well-designed reusable component has a clear API (props), no side effects hidden inside, and a single responsibility.",
        tip: "Example: a Button component that accepts label, onClick, and variant props can be reused everywhere instead of rewriting button markup each time.",
      },
    ],
  },
  {
    label: "Hooks",
    color: "#F7DF1E",
    emoji: "🪝",
    terms: [
      {
        term: "Hooks",
        simple: "Special functions that let you add React features like state and side effects to functional components.",
        technical: "Hooks are functions prefixed with 'use' that allow functional components to opt into React features previously only available in class components. Introduced in React 16.8. They must be called at the top level of a component (not inside loops, conditions, or nested functions) to preserve call order between renders.",
        tip: "The two rules of hooks: 1) Only call hooks at the top level. 2) Only call hooks from React functions.",
      },
      {
        term: "useState",
        simple: "A hook that adds a state variable to a component.",
        technical: "useState(initialValue) returns a tuple [state, setState]. The state persists across renders. Calling setState schedules a re-render with the new value. State updates are asynchronous and may be batched. For updates based on previous state, use the functional form: setState(prev => prev + 1).",
        tip: "Never mutate state directly (e.g. state.push()). Always use the setter function — otherwise React won't know to re-render.",
      },
      {
        term: "useEffect",
        simple: "A hook for running side effects like fetching data, setting timers, or subscribing to events.",
        technical: "useEffect(fn, deps) runs fn after the component renders. The dependency array controls when it re-runs: [] runs once on mount, [val] runs when val changes, and no array runs after every render. Return a cleanup function to cancel subscriptions or timers when the component unmounts.",
        tip: "Common mistake: putting an async function directly inside useEffect. Define the async function inside and call it instead.",
      },
      {
        term: "useRef",
        simple: "A hook that stores a mutable value that does NOT cause a re-render when changed.",
        technical: "useRef returns a mutable ref object { current: value } that persists across renders. Unlike state, mutating .current does not trigger a re-render. Two main uses: 1) Accessing a DOM element directly (ref={myRef} on JSX). 2) Storing mutable values like interval IDs or previous state values.",
        tip: "useRef vs useState: state change = re-render. Ref change = no re-render. Use ref for things React doesn't need to 'know about'.",
      },
      {
        term: "useContext",
        simple: "A hook that lets any component read shared data without passing props through every level.",
        technical: "useContext(MyContext) subscribes a component to the nearest matching Context Provider above it in the tree. When the Provider's value changes, all consuming components re-render. It solves prop drilling but shouldn't be overused — best for truly global data like theme, auth user, or locale.",
        tip: "Context is not a state manager — it's a way to broadcast a value. For complex state, pair it with useReducer.",
      },
      {
        term: "useReducer",
        simple: "A hook for managing complex state using a reducer function, similar to how Redux works.",
        technical: "useReducer(reducer, initialState) returns [state, dispatch]. You dispatch action objects ({ type, payload }) and the reducer — a pure function (state, action) => newState — computes the next state. Preferred over useState when state logic is complex, has multiple sub-values, or transitions depend on the previous state.",
        tip: "useReducer is useState under the hood. Choose useReducer when your state logic has more than 2-3 related transitions.",
      },
      {
        term: "useMemo",
        simple: "A hook that caches the result of an expensive calculation so it isn't recalculated on every render.",
        technical: "useMemo(() => compute(), deps) memoizes the return value of a function. React reuses the cached result across renders and only calls compute() again when one of the deps changes. Used to avoid expensive operations like sorting or filtering large arrays on every render.",
        tip: "Don't overuse it. useMemo itself has overhead. Only use it when profiling shows an actual performance problem.",
      },
      {
        term: "useCallback",
        simple: "A hook that caches a function so it doesn't get recreated on every render.",
        technical: "useCallback(fn, deps) returns a memoized version of fn. Without it, a new function reference is created on every render. This matters when passing callbacks to child components wrapped in React.memo — a new reference would force the child to re-render even if nothing changed.",
        tip: "useCallback(fn, deps) is equivalent to useMemo(() => fn, deps). Both memoize — one for values, one for functions.",
      },
      {
        term: "Custom Hooks",
        simple: "Your own reusable hooks that extract stateful logic out of components.",
        technical: "A custom hook is a JavaScript function whose name starts with 'use' that calls other hooks inside. Each component that calls a custom hook gets its own isolated state — hooks don't share state between callers. They allow logic reuse without changing component hierarchy.",
        tip: "The 'use' prefix is required — it signals to React (and linters) that hook rules apply to this function.",
      },
    ],
  },
  {
    label: "Rendering & Performance",
    color: "#FF6B6B",
    emoji: "🚀",
    terms: [
      {
        term: "Re-render",
        simple: "When React calls a component function again to produce an updated UI.",
        technical: "A component re-renders when: 1) Its own state changes. 2) Its parent re-renders (even with same props). 3) A Context it subscribes to changes. React batches multiple state updates in the same event handler into a single re-render. Re-renders are cheap — only the Virtual DOM diff + minimal real DOM update.",
        tip: "Re-renders are not bad by default. The real cost is unnecessary re-renders in expensive components.",
      },
      {
        term: "React.memo",
        simple: "A wrapper that skips re-rendering a component if its props haven't changed.",
        technical: "React.memo is a higher-order component that performs a shallow comparison of the component's props between renders. If all props are reference-equal, React reuses the last render output and skips calling the component function. A custom comparison function can be passed as the second argument.",
        tip: "memo only prevents re-renders from the parent. The component still re-renders if its own state or context changes.",
      },
      {
        term: "Lazy Loading",
        simple: "Loading a component's code only when it's actually needed, not upfront.",
        technical: "React.lazy(() => import('./Component')) creates a lazily loaded component. Its JavaScript bundle is only downloaded when the component first renders. Must be wrapped in a Suspense boundary that shows a fallback UI during loading. Dramatically reduces initial bundle size.",
        tip: "Best used at the route level — each page loads only when the user navigates to it.",
      },
      {
        term: "Code Splitting",
        simple: "Breaking your app's JavaScript into smaller files that load on demand.",
        technical: "Code splitting uses dynamic import() to split a bundle into chunks. Vite and Webpack do this automatically for React.lazy imports. Instead of one large bundle, users download only the code needed for the current view. Reduces Time to Interactive (TTI) significantly for large apps.",
        tip: "Code splitting and lazy loading go hand in hand. lazy() is how you trigger a split point in React.",
      },
      {
        term: "Batching",
        simple: "React grouping multiple state updates together and doing one re-render instead of many.",
        technical: "React 18 introduced automatic batching — multiple setState calls inside event handlers, setTimeout, Promises, and native event listeners are all batched into a single re-render. Previously, only React event handlers were batched. Batching reduces render cycles and improves performance.",
        tip: "Batching is automatic in React 18. In React 17 and earlier, updates inside async functions were NOT batched.",
      },
    ],
  },
  {
    label: "Patterns & Architecture",
    color: "#A78BFA",
    emoji: "🏗️",
    terms: [
      {
        term: "Lifting State Up",
        simple: "Moving shared state to the closest common parent so sibling components can both access it.",
        technical: "When two sibling components need to share state, the state is lifted to their nearest common ancestor. The parent owns the state and passes it down as props. Children communicate back up via callback functions passed as props. This maintains unidirectional data flow.",
        tip: "This is the answer to: 'How do you share data between two sibling components?' in an interview.",
      },
      {
        term: "Prop Drilling",
        simple: "Passing props through many intermediate components just to reach a deeply nested child.",
        technical: "Prop drilling occurs when props are passed through multiple component layers that don't use them — they just pass them along to children. It makes components tightly coupled and hard to refactor. Solutions: Context API, state management libraries, or component composition.",
        tip: "Prop drilling 2-3 levels deep is fine. More than that — consider Context or state management.",
      },
      {
        term: "Component Composition",
        simple: "Building complex UIs by combining simple, reusable components instead of making one giant component.",
        technical: "Composition uses the children prop or named slot props to build flexible, reusable wrapper components. A Card component doesn't need to know what it wraps — it just renders {children}. This avoids the need for class inheritance and keeps components loosely coupled and highly reusable.",
        tip: "React favours composition over inheritance. You rarely need to extend components — compose them instead.",
      },
      {
        term: "Controlled Component",
        simple: "A form input whose value is controlled by React state, making React the single source of truth.",
        technical: "In a controlled component, the input's value is set by state and every change fires an onChange handler that updates state. The DOM never holds the data — React does. This enables real-time validation, conditional disabling, and formatted input. The opposite is an uncontrolled component, where the DOM manages the value.",
        tip: "Controlled: value={state} + onChange={handler}. Uncontrolled: uses useRef to read the value when needed.",
      },
      {
        term: "Higher-Order Component (HOC)",
        simple: "A function that takes a component and returns a new component with added behavior.",
        technical: "An HOC is a pattern where a function accepts a component as an argument and returns a new component that wraps it with additional props, logic, or behavior — without modifying the original. Examples: React.memo, connect() from Redux, withRouter. HOCs have largely been replaced by hooks in modern React.",
        tip: "HOCs were the old way to share logic. Custom hooks are now the preferred approach — simpler and more composable.",
      },
      {
        term: "Pure Component",
        simple: "A component that always produces the same output for the same input and has no side effects.",
        technical: "A pure component is referentially transparent — its render output depends only on its props and state, never on external mutable state or side effects. React.PureComponent (class) and React.memo (function) implement shallow prop comparison to skip re-renders when inputs haven't changed, leveraging the purity guarantee.",
        tip: "Pure components are predictable, easy to test, and easy to optimize. Always aim to keep components pure.",
      },
      {
        term: "Unidirectional Data Flow",
        simple: "Data always flows in one direction in React: from parent to child via props.",
        technical: "React enforces a single direction for data: parent components pass data down to children via props. Children cannot modify props — they communicate upward by calling callback functions received as props. This makes data flow predictable, debuggable, and easy to trace compared to two-way binding frameworks.",
        tip: "This is the fundamental architecture of React. Understanding it deeply is essential for senior-level interviews.",
      },
    ],
  },
  {
    label: "Advanced Concepts",
    color: "#34D399",
    emoji: "🔬",
    terms: [
      {
        term: "Context API",
        simple: "A built-in way to share data across the component tree without passing props at every level.",
        technical: "Context provides a way to pass data through the component tree without explicit prop threading. createContext creates a context object. A Provider component wraps the subtree and broadcasts a value. Any descendant can call useContext to read that value and will re-render when it changes.",
        tip: "Context is not a performance tool — every consumer re-renders on value change. For frequent updates, consider a dedicated state library.",
      },
      {
        term: "Portals",
        simple: "A way to render a component's output into a different part of the DOM outside its parent.",
        technical: "Portals render children into a DOM node that exists outside the parent component's DOM hierarchy. Despite the different DOM location, the component remains a child in the React tree — events bubble normally, Context works, and lifecycle hooks behave as expected. Primarily used for modals, tooltips, and dropdowns.",
        tip: "Portals solve the 'overflow:hidden parent trapping a modal' problem — the modal escapes the parent in the real DOM.",
      },
      {
        term: "Error Boundary",
        simple: "A component that catches JavaScript errors in its children and shows a fallback UI instead of crashing the app.",
        technical: "Error boundaries are class components that implement getDerivedStateFromError (to show fallback UI) and/or componentDidCatch (to log errors). They catch errors during rendering, lifecycle methods, and constructors of child components — but NOT in event handlers (use try/catch there) or async code.",
        tip: "Place error boundaries strategically around sections — not just one at the top — so one broken feature doesn't crash unrelated UI.",
      },
      {
        term: "Suspense",
        simple: "A component that shows a fallback UI while waiting for something — like a lazy-loaded component — to finish loading.",
        technical: "Suspense catches components that 'suspend' (throw a Promise) and renders a fallback until they resolve. Currently used with React.lazy for code splitting and with data fetching libraries that support Suspense. React 18 expanded Suspense support for concurrent features like startTransition.",
        tip: "Suspense is React's declarative way to handle async loading states — instead of writing isLoading checks manually.",
      },
      {
        term: "Keys",
        simple: "A unique identifier React uses to track items in a list across re-renders.",
        technical: "Keys help React's reconciliation algorithm identify which items in a list have changed, been added, or removed. They must be unique among siblings. Using array index as key causes bugs when list order changes — use stable unique IDs from your data instead. Keys are not passed as props to the child component.",
        tip: "Common bug: using index as key in sortable or filterable lists causes input values to appear on the wrong item after re-order.",
      },
      {
        term: "Strict Mode",
        simple: "A React tool that highlights potential problems in your app during development.",
        technical: "React.StrictMode wraps your app in development mode only and intentionally double-invokes render functions and effects to detect side effects. It also warns about deprecated APIs and unexpected side effects. Has zero impact on production builds.",
        tip: "Strict Mode is why useEffect seems to fire twice in development — it's intentional, to catch impure effects.",
      },
      {
        term: "Concurrent Mode / Concurrent Features",
        simple: "React's ability to work on multiple tasks at once and prioritize urgent updates over slower ones.",
        technical: "Concurrent rendering (React 18+) allows React to pause, interrupt, and resume rendering work. startTransition marks updates as non-urgent so React can prioritize urgent updates (like typing) over slow ones (like filtering a large list). This prevents UI from feeling janky under heavy render load.",
        tip: "useTransition and startTransition are the main APIs. If asked about React 18, mention concurrent features.",
      },
    ],
  },
];

export default function InterviewDefs() {
  const [activeCat, setActiveCat] = useState(0);
  const [activeTerm, setActiveTerm] = useState(0);
  const [showTip, setShowTip] = useState(false);

  const cat  = categories[activeCat];
  const item = cat.terms[activeTerm];

  function goToTerm(idx) {
    setActiveTerm(idx);
    setShowTip(false);
  }

  function nextTerm() {
    if (activeTerm < cat.terms.length - 1) {
      goToTerm(activeTerm + 1);
    } else if (activeCat < categories.length - 1) {
      setActiveCat(activeCat + 1);
      setActiveTerm(0);
      setShowTip(false);
    }
  }

  function prevTerm() {
    if (activeTerm > 0) {
      goToTerm(activeTerm - 1);
    } else if (activeCat > 0) {
      const prevCat = activeCat - 1;
      setActiveCat(prevCat);
      setActiveTerm(categories[prevCat].terms.length - 1);
      setShowTip(false);
    }
  }

  const totalTerms   = categories.reduce((s, c) => s + c.terms.length, 0);
  const termsBeforeCat = categories.slice(0, activeCat).reduce((s, c) => s + c.terms.length, 0);
  const globalIndex  = termsBeforeCat + activeTerm + 1;

  return (
    <div style={{
      fontFamily: "'Fira Code', 'Courier New', monospace",
      background: "#0d1117", minHeight: "100vh",
      display: "flex", flexDirection: "column",
      color: "#e6edf3",
    }}>
      {/* Top bar */}
      <div style={{
        background: "#161b22", borderBottom: "1px solid #30363d",
        padding: "12px 24px", display: "flex", alignItems: "center",
        gap: 16, flexWrap: "wrap",
      }}>
        <div>
          <div style={{ fontSize: "11px", color: "#8b949e", letterSpacing: "2px", textTransform: "uppercase" }}>React Interview</div>
          <div style={{ fontSize: "16px", fontWeight: "700", color: "#61DAFB" }}>All Definitions</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {categories.map((c, i) => (
            <button key={i} onClick={() => { setActiveCat(i); setActiveTerm(0); setShowTip(false); }} style={{
              padding: "5px 12px", borderRadius: 20, border: "1px solid",
              borderColor: activeCat === i ? c.color : "#30363d",
              background: activeCat === i ? c.color + "22" : "transparent",
              color: activeCat === i ? c.color : "#8b949e",
              cursor: "pointer", fontSize: "11px", fontFamily: "inherit",
            }}>
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{
          width: "200px", minWidth: "200px", background: "#161b22",
          borderRight: "1px solid #30363d", overflowY: "auto", padding: "8px 0",
        }}>
          {cat.terms.map((t, i) => (
            <button key={i} onClick={() => goToTerm(i)} style={{
              display: "block", width: "100%", padding: "9px 14px",
              background: activeTerm === i ? "#21262d" : "transparent",
              border: "none",
              borderLeft: activeTerm === i ? `3px solid ${cat.color}` : "3px solid transparent",
              color: activeTerm === i ? "#e6edf3" : "#8b949e",
              cursor: "pointer", textAlign: "left", fontSize: "12px",
            }}>
              {t.term}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
          {/* Progress */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: "11px", color: "#8b949e" }}>{globalIndex} / {totalTerms}</span>
            <div style={{ flex: 1, height: 4, background: "#21262d", borderRadius: 2 }}>
              <div style={{
                height: 4, borderRadius: 2,
                background: cat.color,
                width: `${(globalIndex / totalTerms) * 100}%`,
                transition: "width 0.3s",
              }} />
            </div>
            <span style={{ fontSize: "11px", color: cat.color }}>{cat.label}</span>
          </div>

          {/* Term card */}
          <div style={{
            background: "#161b22", border: "1px solid #30363d",
            borderRadius: 12, padding: "24px 28px", marginBottom: 16,
            borderTop: `3px solid ${cat.color}`,
          }}>
            <h2 style={{ margin: "0 0 20px", fontSize: "24px", color: cat.color }}>{item.term}</h2>

            {/* Simple */}
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: "10px", letterSpacing: "2px", color: "#8b949e",
                textTransform: "uppercase", marginBottom: 8,
              }}>
                🗣️ Simple Answer (1 sentence)
              </div>
              <p style={{
                margin: 0, color: "#c9d1d9", lineHeight: 1.7, fontSize: "14px",
                padding: "12px 16px", background: "#0d1117",
                borderRadius: 8, borderLeft: `3px solid ${cat.color}`,
              }}>
                {item.simple}
              </p>
            </div>

            {/* Technical */}
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: "10px", letterSpacing: "2px", color: "#8b949e",
                textTransform: "uppercase", marginBottom: 8,
              }}>
                💻 Technical Answer (for experienced interviewers)
              </div>
              <p style={{
                margin: 0, color: "#c9d1d9", lineHeight: 1.7, fontSize: "14px",
                padding: "12px 16px", background: "#0d1117",
                borderRadius: 8, borderLeft: "3px solid #30363d",
              }}>
                {item.technical}
              </p>
            </div>

            {/* Tip toggle */}
            <button onClick={() => setShowTip(!showTip)} style={{
              padding: "8px 16px", borderRadius: 8,
              border: `1px solid ${showTip ? "#FBBF24" : "#30363d"}`,
              background: showTip ? "#FBBF2422" : "transparent",
              color: showTip ? "#FBBF24" : "#8b949e",
              cursor: "pointer", fontSize: "12px", fontFamily: "inherit",
            }}>
              {showTip ? "Hide" : "Show"} Interview Tip 💡
            </button>

            {showTip && (
              <div style={{
                marginTop: 12, padding: "12px 16px",
                background: "#FBBF2411", border: "1px solid #FBBF2444",
                borderRadius: 8, color: "#FBBF24",
                fontSize: "13px", lineHeight: 1.7,
              }}>
                💡 {item.tip}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <button onClick={prevTerm}
              disabled={activeCat === 0 && activeTerm === 0}
              style={{
                padding: "10px 20px", borderRadius: 8, border: "1px solid #30363d",
                background: "#21262d", color: "#c9d1d9",
                cursor: "pointer", fontSize: "13px", fontFamily: "inherit",
                opacity: activeCat === 0 && activeTerm === 0 ? 0.4 : 1,
              }}>
              ← Previous
            </button>

            <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
              {cat.terms.map((_, i) => (
                <div key={i} onClick={() => goToTerm(i)} style={{
                  width: activeTerm === i ? 18 : 7, height: 7,
                  borderRadius: 4,
                  background: activeTerm === i ? cat.color : "#30363d",
                  cursor: "pointer", transition: "all 0.2s",
                }} />
              ))}
            </div>

            <button onClick={nextTerm}
              disabled={activeCat === categories.length - 1 && activeTerm === cat.terms.length - 1}
              style={{
                padding: "10px 20px", borderRadius: 8, border: "1px solid #30363d",
                background: "#21262d", color: "#c9d1d9",
                cursor: "pointer", fontSize: "13px", fontFamily: "inherit",
                opacity: activeCat === categories.length - 1 && activeTerm === cat.terms.length - 1 ? 0.4 : 1,
              }}>
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
