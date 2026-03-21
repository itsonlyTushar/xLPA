import { MCProblem } from "../types";

export const formProblems: MCProblem[] = [
  {
    id: "mc-11",
    chapterId: 2,
    title: "Login Form with Validation",
    difficulty: "easy",
    description:
      "Build a login form with email and password fields. Validate that email is a valid format and password is at least 8 characters. Show inline error messages and disable the submit button until the form is valid.",
    requirements: [
      "Email input with format validation",
      "Password input with minimum 8 character validation",
      "Show inline error messages below each field when invalid",
      "Only validate on blur or on submit (not while typing)",
      "Disable submit button until both fields are valid",
      "Show a success message on valid submission",
    ],
    starterCode: `const { useState } = React;

function LoginForm() {
  // Implement login form with validation
  return <form>Implement LoginForm</form>;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <h2 style={{ color: "#e2e8f0", marginBottom: 16 }}>Sign In</h2>
      <LoginForm />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const emailInput = document.querySelector('[data-testid="email-input"]');
const passwordInput = document.querySelector('[data-testid="password-input"]');
const submitBtn = document.querySelector('[data-testid="submit-btn"]');
console.assert(emailInput !== null, 'Test 1: Email input exists');
console.assert(passwordInput !== null, 'Test 2: Password input exists');
console.assert(submitBtn !== null, 'Test 3: Submit button exists');
console.assert(submitBtn.disabled === true, 'Test 4: Submit disabled initially');

// Enter valid email
emailInput.value = "test@example.com";
emailInput.dispatchEvent(new Event('change', { bubbles: true }));
emailInput.dispatchEvent(new Event('blur', { bubbles: true }));

// Enter valid password
passwordInput.value = "password123";
passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
passwordInput.dispatchEvent(new Event('blur', { bubbles: true }));
await new Promise(r => setTimeout(r, 50));

console.assert(submitBtn.disabled === false, 'Test 5: Submit enabled with valid inputs');`,
    tags: ["forms", "validation", "controlled-input"],
    order: 1,
    timeEstimate: "15-20 min",
    hints: [
      "Track both values and error messages in state",
      "Validate on blur using a simple regex for email: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/",
      "Derive the disabled state from whether errors exist and fields are non-empty",
    ],
    keyInsight: "Form validation state is typically separate from form values. Track { values, errors, touched } independently. Validate on blur for good UX (don't show errors while user is still typing).",
    solution: `const { useState } = React;

function LoginForm() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitted, setSubmitted] = useState(false);

  const validate = (field, value) => {
    if (field === "email") {
      return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value) ? "" : "Invalid email format";
    }
    if (field === "password") {
      return value.length >= 8 ? "" : "Password must be at least 8 characters";
    }
    return "";
  };

  const handleChange = (field) => (e) => {
    const val = e.target.value;
    setValues((prev) => ({ ...prev, [field]: val }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validate(field, val) }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validate(field, values[field]) }));
  };

  const isValid = values.email && values.password && !validate("email", values.email) && !validate("password", values.password);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) setSubmitted(true);
  };

  if (submitted) return <div data-testid="success" style={{ color: "#22c55e", fontSize: 16 }}>Login successful!</div>;

  const fieldStyle = { width: "100%", padding: "8px 12px", background: "#1e293b", border: "1px solid #334155", borderRadius: 6, color: "#e2e8f0", fontSize: 14, marginBottom: 4 };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginBottom: 4 }}>Email</label>
        <input data-testid="email-input" type="email" value={values.email} onChange={handleChange("email")} onBlur={handleBlur("email")} style={fieldStyle} />
        {touched.email && errors.email && <div style={{ color: "#ef4444", fontSize: 12 }}>{errors.email}</div>}
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginBottom: 4 }}>Password</label>
        <input data-testid="password-input" type="password" value={values.password} onChange={handleChange("password")} onBlur={handleBlur("password")} style={fieldStyle} />
        {touched.password && errors.password && <div style={{ color: "#ef4444", fontSize: 12 }}>{errors.password}</div>}
      </div>
      <button data-testid="submit-btn" type="submit" disabled={!isValid}
        style={{ width: "100%", padding: "10px", background: isValid ? "#3b82f6" : "#334155", color: isValid ? "white" : "#64748b", border: "none", borderRadius: 6, cursor: isValid ? "pointer" : "not-allowed", fontSize: 14 }}>
        Sign In
      </button>
    </form>
  );
}`,
    solutionExplanation: "Three state objects: values, errors, touched. Validate on blur and during typing (if field was touched). Derive isValid to control the submit button. On submit, show success message.",
  },
  {
    id: "mc-12",
    chapterId: 2,
    title: "Multi-Step Form Wizard",
    difficulty: "hard",
    description:
      "Build a multi-step form with 3 steps: Personal Info, Address, and Review. Users can navigate between steps with Previous/Next buttons. The Review step shows all entered data. Track progress with a step indicator.",
    requirements: [
      "Three distinct form steps with different fields",
      "Step indicator showing progress (Step 1 of 3)",
      "Next/Previous navigation between steps",
      "Validate current step before allowing Next",
      "Review step shows summary of all entered data",
      "Submit button on the final step",
    ],
    starterCode: `const { useState } = React;

function MultiStepForm() {
  // Step 1: name, email
  // Step 2: street, city, zipCode
  // Step 3: Review all data + Submit
  return <div>Implement MultiStepForm</div>;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <h2 style={{ color: "#e2e8f0", marginBottom: 16 }}>Registration</h2>
      <MultiStepForm />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const stepIndicator = document.querySelector('[data-testid="step-indicator"]');
console.assert(stepIndicator !== null, 'Test 1: Step indicator exists');
console.assert(stepIndicator.textContent.includes("1"), 'Test 2: Starts at step 1');

const nextBtn = document.querySelector('[data-testid="next-btn"]');
console.assert(nextBtn !== null, 'Test 3: Next button exists');

// Fill step 1
const nameInput = document.querySelector('[data-testid="name-input"]');
const emailInput = document.querySelector('[data-testid="email-input"]');
nameInput.value = "John Doe";
nameInput.dispatchEvent(new Event('change', { bubbles: true }));
emailInput.value = "john@test.com";
emailInput.dispatchEvent(new Event('change', { bubbles: true }));

// Go to step 2
nextBtn.click();
await new Promise(r => setTimeout(r, 50));
console.assert(stepIndicator.textContent.includes("2"), 'Test 4: Now on step 2');

const prevBtn = document.querySelector('[data-testid="prev-btn"]');
console.assert(prevBtn !== null, 'Test 5: Prev button exists on step 2');`,
    tags: ["multi-step", "form-state", "wizard-pattern"],
    order: 2,
    timeEstimate: "25-30 min",
    hints: [
      "Use a single state object for all form data across steps",
      "Track currentStep as a separate state value",
      "Each step is a conditional render based on currentStep",
      "Validate only the fields relevant to the current step before proceeding",
    ],
    keyInsight: "Multi-step forms use a single shared state object with a step counter. Each step renders its own fields but reads/writes to the same state. This separation keeps data persistent across navigation.",
    solution: `const { useState } = React;

function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ name: "", email: "", street: "", city: "", zipCode: "" });
  const [submitted, setSubmitted] = useState(false);

  const update = (field) => (e) => setData((prev) => ({ ...prev, [field]: e.target.value }));
  const fieldStyle = { width: "100%", padding: "8px 12px", background: "#1e293b", border: "1px solid #334155", borderRadius: 6, color: "#e2e8f0", fontSize: 14, marginBottom: 12 };

  const canNext = step === 1 ? data.name && data.email : step === 2 ? data.street && data.city && data.zipCode : true;

  if (submitted) return <div data-testid="success" style={{ color: "#22c55e", textAlign: "center", padding: 24 }}>Registration complete!</div>;

  return (
    <div>
      <div data-testid="step-indicator" style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? "#3b82f6" : "#334155" }} />
        ))}
        <span style={{ color: "#94a3b8", fontSize: 12, whiteSpace: "nowrap" }}>Step {step} of 3</span>
      </div>

      {step === 1 && (
        <div>
          <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginBottom: 4 }}>Full Name</label>
          <input data-testid="name-input" value={data.name} onChange={update("name")} style={fieldStyle} />
          <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginBottom: 4 }}>Email</label>
          <input data-testid="email-input" value={data.email} onChange={update("email")} style={fieldStyle} />
        </div>
      )}
      {step === 2 && (
        <div>
          <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginBottom: 4 }}>Street</label>
          <input data-testid="street-input" value={data.street} onChange={update("street")} style={fieldStyle} />
          <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginBottom: 4 }}>City</label>
          <input data-testid="city-input" value={data.city} onChange={update("city")} style={fieldStyle} />
          <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginBottom: 4 }}>ZIP Code</label>
          <input data-testid="zip-input" value={data.zipCode} onChange={update("zipCode")} style={fieldStyle} />
        </div>
      )}
      {step === 3 && (
        <div style={{ color: "#e2e8f0", fontSize: 14 }}>
          <h3 style={{ marginBottom: 12 }}>Review Your Info</h3>
          <div style={{ background: "#1e293b", padding: 16, borderRadius: 8, lineHeight: 2 }}>
            <div><strong>Name:</strong> {data.name}</div>
            <div><strong>Email:</strong> {data.email}</div>
            <div><strong>Street:</strong> {data.street}</div>
            <div><strong>City:</strong> {data.city}</div>
            <div><strong>ZIP:</strong> {data.zipCode}</div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
        {step > 1 ? (
          <button data-testid="prev-btn" onClick={() => setStep(step - 1)}
            style={{ padding: "8px 20px", background: "#334155", color: "#e2e8f0", border: "none", borderRadius: 6, cursor: "pointer" }}>Previous</button>
        ) : <span />}
        {step < 3 ? (
          <button data-testid="next-btn" onClick={() => canNext && setStep(step + 1)} disabled={!canNext}
            style={{ padding: "8px 20px", background: canNext ? "#3b82f6" : "#334155", color: canNext ? "white" : "#64748b", border: "none", borderRadius: 6, cursor: canNext ? "pointer" : "not-allowed" }}>Next</button>
        ) : (
          <button data-testid="submit-btn" onClick={() => setSubmitted(true)}
            style={{ padding: "8px 20px", background: "#22c55e", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Submit</button>
        )}
      </div>
    </div>
  );
}`,
    solutionExplanation: "Single data state shared across all steps. Step counter controls which fields are shown. canNext validates current step's fields. Navigation with Previous/Next. Step 3 is a read-only review.",
  },
  {
    id: "mc-13",
    chapterId: 2,
    title: "OTP Input",
    difficulty: "medium",
    description:
      "Build a 6-digit OTP (One Time Password) input component. Each digit has its own input box. Typing a digit auto-focuses the next box. Backspace goes to the previous box.",
    requirements: [
      "Render 6 individual input boxes for each digit",
      "Typing a digit auto-advances focus to the next box",
      "Backspace on empty box focuses the previous box",
      "Pasting a full 6-digit code fills all boxes",
      "Only accept numeric input (0-9)",
      "Call onComplete callback when all 6 digits are filled",
    ],
    starterCode: `const { useState, useRef } = React;

function OTPInput({ length = 6, onComplete }) {
  // Implement 6-digit OTP input
  return <div>Implement OTPInput</div>;
}

function App() {
  const [result, setResult] = React.useState("");
  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <h2 style={{ color: "#e2e8f0", marginBottom: 8 }}>Enter Verification Code</h2>
      <p style={{ color: "#94a3b8", marginBottom: 24, fontSize: 14 }}>We sent a 6-digit code to your email</p>
      <OTPInput onComplete={(code) => setResult(code)} />
      {result && <p data-testid="result" style={{ color: "#22c55e", marginTop: 16 }}>Code entered: {result}</p>}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const inputs = document.querySelectorAll('[data-testid="otp-input"]');
console.assert(inputs.length === 6, 'Test 1: Six OTP input boxes');

// Type in first box
inputs[0].focus();
inputs[0].value = "1";
inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
await new Promise(r => setTimeout(r, 50));
console.assert(document.activeElement === inputs[1], 'Test 2: Focus moves to second box');

// Type digits 2-6
for (let i = 1; i < 6; i++) {
  inputs[i].value = String(i + 1);
  inputs[i].dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise(r => setTimeout(r, 30));
}

// Check complete callback fired
await new Promise(r => setTimeout(r, 100));
const result = document.querySelector('[data-testid="result"]');
console.assert(result !== null, 'Test 3: onComplete called with all digits');`,
    tags: ["refs", "focus-management", "keyboard"],
    order: 3,
    timeEstimate: "20-25 min",
    hints: [
      "Use useRef with an array of refs for each input",
      "On input, if value is a digit, move focus to next ref",
      "On keydown of Backspace with empty value, move focus to previous ref",
      "Handle paste by splitting the string and distributing to each input",
    ],
    keyInsight: "Managing multiple input focus with refs requires an array of refs. The auto-advance pattern (type → focus next) is used in OTP, PIN inputs, and credit card forms.",
    solution: `const { useState, useRef } = React;

function OTPInput({ length = 6, onComplete }) {
  const [values, setValues] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  const handleInput = (index) => (e) => {
    const val = e.target.value;
    if (!/^[0-9]?$/.test(val)) return;
    const newValues = [...values];
    newValues[index] = val;
    setValues(newValues);
    if (val && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }
    if (newValues.every((v) => v)) {
      onComplete(newValues.join(""));
    }
  };

  const handleKeyDown = (index) => (e) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\\D/g, "").slice(0, length);
    const newValues = [...values];
    pasted.split("").forEach((ch, i) => { newValues[i] = ch; });
    setValues(newValues);
    const focusIdx = Math.min(pasted.length, length - 1);
    inputsRef.current[focusIdx].focus();
    if (newValues.every((v) => v)) onComplete(newValues.join(""));
  };

  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      {values.map((val, i) => (
        <input key={i} data-testid="otp-input" ref={(el) => (inputsRef.current[i] = el)}
          value={val} onInput={handleInput(i)} onKeyDown={handleKeyDown(i)} onPaste={handlePaste}
          maxLength={1}
          style={{ width: 48, height: 56, textAlign: "center", fontSize: 24, fontWeight: "bold",
            background: "#1e293b", border: val ? "2px solid #3b82f6" : "1px solid #334155",
            borderRadius: 8, color: "#e2e8f0", outline: "none" }} />
      ))}
    </div>
  );
}`,
    solutionExplanation: "Array of values in state, array of refs for input elements. On input: validate digit, update value, auto-focus next. On backspace of empty: focus previous. On paste: distribute characters across inputs.",
  },
  {
    id: "mc-14",
    chapterId: 2,
    title: "Password Strength Meter",
    difficulty: "easy",
    description:
      "Build a password input with a real-time strength indicator. The meter should check for length, uppercase, lowercase, numbers, and special characters, updating as the user types.",
    requirements: [
      "Password input field",
      "Visual strength bar that fills based on criteria met",
      "Color changes: red (weak), orange (fair), yellow (good), green (strong)",
      "Show which criteria are met/unmet as a checklist",
      "Criteria: 8+ chars, uppercase, lowercase, number, special char",
    ],
    starterCode: `const { useState } = React;

function PasswordStrength() {
  // Implement password input with strength meter
  return <div>Implement PasswordStrength</div>;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <h3 style={{ color: "#e2e8f0", marginBottom: 16 }}>Create Password</h3>
      <PasswordStrength />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const input = document.querySelector('[data-testid="password-input"]');
console.assert(input !== null, 'Test 1: Password input exists');

const bar = document.querySelector('[data-testid="strength-bar"]');
console.assert(bar !== null, 'Test 2: Strength bar exists');

// Type weak password
input.value = "abc";
input.dispatchEvent(new Event('change', { bubbles: true }));
await new Promise(r => setTimeout(r, 50));

const criteria = document.querySelectorAll('[data-testid="criteria-item"]');
console.assert(criteria.length === 5, 'Test 3: Five criteria items shown');

// Type strong password
input.value = "StrongP@ss1";
input.dispatchEvent(new Event('change', { bubbles: true }));
await new Promise(r => setTimeout(r, 50));

const met = document.querySelectorAll('[data-testid="criteria-met"]');
console.assert(met.length === 5, 'Test 4: All criteria met for strong password');`,
    tags: ["real-time-validation", "derived-state", "visual-feedback"],
    order: 4,
    timeEstimate: "15-20 min",
    hints: [
      "Derive strength from the password value — don't store it separately",
      "Use regex tests for each criterion: /[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/",
      "Score = number of criteria met, map to color and width percentage",
    ],
    keyInsight: "Strength is derived state — computed from the password, never stored independently. This 'derive don't duplicate' principle prevents sync bugs and is a key React pattern.",
    solution: `const { useState } = React;

function PasswordStrength() {
  const [password, setPassword] = useState("");

  const criteria = [
    { label: "At least 8 characters", test: (p) => p.length >= 8 },
    { label: "Uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { label: "Lowercase letter", test: (p) => /[a-z]/.test(p) },
    { label: "Number", test: (p) => /[0-9]/.test(p) },
    { label: "Special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
  ];

  const score = criteria.filter((c) => c.test(password)).length;
  const colors = ["#ef4444", "#ef4444", "#f97316", "#eab308", "#22c55e"];
  const labels = ["Weak", "Weak", "Fair", "Good", "Strong"];
  const color = score > 0 ? colors[score - 1] : "#334155";

  return (
    <div>
      <input data-testid="password-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        style={{ width: "100%", padding: "8px 12px", background: "#1e293b", border: "1px solid #334155", borderRadius: 6, color: "#e2e8f0", fontSize: 14, marginBottom: 12 }} />
      <div data-testid="strength-bar" style={{ height: 6, borderRadius: 3, background: "#1e293b", marginBottom: 8, overflow: "hidden" }}>
        <div style={{ height: "100%", width: (score / 5 * 100) + "%", background: color, transition: "all 0.3s ease", borderRadius: 3 }} />
      </div>
      {password && <div style={{ color, fontSize: 12, marginBottom: 8 }}>{labels[Math.max(score - 1, 0)]}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {criteria.map((c, i) => {
          const met = c.test(password);
          return (
            <div key={i} data-testid="criteria-item">
              <span data-testid={met ? "criteria-met" : "criteria-unmet"} style={{ color: met ? "#22c55e" : "#64748b", fontSize: 13 }}>
                {met ? "✓" : "○"} {c.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}`,
    solutionExplanation: "Password value in state. Criteria array with test functions. Score derived by counting passing tests. Color and label mapped from score. Bar width is (score/5 * 100)%. Criteria rendered as checklist.",
  },
  {
    id: "mc-15",
    chapterId: 2,
    title: "Editable Text (Click to Edit)",
    difficulty: "medium",
    description:
      "Build a click-to-edit inline text component. Clicking the text transforms it into an input field. Pressing Enter or clicking away saves the edit. Pressing Escape cancels.",
    requirements: [
      "Display text as a span/paragraph by default",
      "Clicking the text switches to edit mode (input field)",
      "Input is pre-filled with the current text value",
      "Enter key or blur saves the new value",
      "Escape key cancels and reverts to original value",
      "Auto-focus the input when entering edit mode",
    ],
    starterCode: `const { useState, useRef, useEffect } = React;

function EditableText({ initialValue, onSave }) {
  // Implement click-to-edit inline text
  return <span>{initialValue}</span>;
}

function App() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");

  return (
    <div style={{ padding: 24, color: "#e2e8f0" }}>
      <div style={{ marginBottom: 16 }}>
        <span style={{ color: "#94a3b8", fontSize: 13 }}>Name: </span>
        <EditableText initialValue={name} onSave={setName} />
      </div>
      <div>
        <span style={{ color: "#94a3b8", fontSize: 13 }}>Email: </span>
        <EditableText initialValue={email} onSave={setEmail} />
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const display = document.querySelector('[data-testid="editable-display"]');
console.assert(display !== null, 'Test 1: Display text exists');
console.assert(display.textContent === "John Doe", 'Test 2: Shows initial value');

// Click to edit
display.click();
await new Promise(r => setTimeout(r, 50));
const input = document.querySelector('[data-testid="editable-input"]');
console.assert(input !== null, 'Test 3: Input appears on click');
console.assert(input.value === "John Doe", 'Test 4: Input pre-filled');

// Edit and save with Enter
input.value = "Jane Doe";
input.dispatchEvent(new Event('change', { bubbles: true }));
input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
await new Promise(r => setTimeout(r, 50));

const updatedDisplay = document.querySelector('[data-testid="editable-display"]');
console.assert(updatedDisplay.textContent === "Jane Doe", 'Test 5: Value updated after Enter');`,
    tags: ["inline-editing", "focus", "keyboard-events"],
    order: 5,
    timeEstimate: "15-20 min",
    hints: [
      "Boolean isEditing state toggles between display and input",
      "Use useRef + useEffect to auto-focus the input when isEditing becomes true",
      "On Escape: revert to the original value and exit editing mode",
    ],
    keyInsight: "The display/edit mode toggle pattern (render text or input based on a boolean) is fundamental in admin panels, CMS dashboards, and any data table with inline editing.",
    solution: `const { useState, useRef, useEffect } = React;

function EditableText({ initialValue, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  const save = () => {
    setIsEditing(false);
    onSave(value);
  };

  const cancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <input data-testid="editable-input" ref={inputRef} value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") cancel(); }}
        style={{ padding: "4px 8px", background: "#1e293b", border: "1px solid #3b82f6", borderRadius: 4, color: "#e2e8f0", fontSize: 14, outline: "none" }} />
    );
  }

  return (
    <span data-testid="editable-display" onClick={() => setIsEditing(true)}
      style={{ cursor: "pointer", borderBottom: "1px dashed #475569", paddingBottom: 2 }}>
      {value}
    </span>
  );
}`,
    solutionExplanation: "isEditing boolean toggles display/input. Click sets editing on, auto-focus via ref + useEffect. Enter/blur saves. Escape reverts value and exits. Dashed underline hints the text is editable.",
  },
  {
    id: "mc-16",
    chapterId: 2,
    title: "Auto-Resize Textarea",
    difficulty: "easy",
    description:
      "Build a textarea that automatically grows in height as the user types more lines. It should shrink back when content is deleted. Set a minimum and maximum height.",
    requirements: [
      "Textarea that expands vertically as content grows",
      "Shrinks when content is removed",
      "Minimum height of 80px",
      "Maximum height of 300px (then scroll)",
      "Character count display below the textarea",
    ],
    starterCode: `const { useState, useRef, useEffect } = React;

function AutoResizeTextarea({ placeholder, maxLength = 500 }) {
  // Implement auto-growing textarea
  return <textarea placeholder={placeholder} />;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <h3 style={{ color: "#e2e8f0", marginBottom: 12 }}>Write a comment</h3>
      <AutoResizeTextarea placeholder="Type something..." maxLength={500} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const textarea = document.querySelector('[data-testid="auto-textarea"]');
console.assert(textarea !== null, 'Test 1: Textarea exists');

const counter = document.querySelector('[data-testid="char-count"]');
console.assert(counter !== null, 'Test 2: Character counter exists');

// Type some text
textarea.value = "Hello World";
textarea.dispatchEvent(new Event('input', { bubbles: true }));
await new Promise(r => setTimeout(r, 50));
console.assert(counter.textContent.includes("11"), 'Test 3: Character count updates');

// Textarea should have min height
console.assert(textarea.style.minHeight === "80px" || textarea.offsetHeight >= 80, 'Test 4: Has minimum height');`,
    tags: ["dom-manipulation", "ref", "scrollHeight"],
    order: 6,
    timeEstimate: "10-15 min",
    hints: [
      "Reset height to 'auto' first, then set it to scrollHeight — this allows shrinking",
      "Use Math.min and Math.max to clamp between min and max",
      "Use a useEffect or the onChange handler to recalc",
    ],
    keyInsight: "Auto-resize trick: set height to 'auto' first (to get true scrollHeight), then set height to scrollHeight. Without the reset, the textarea never shrinks.",
    solution: `const { useState, useRef, useCallback } = React;

function AutoResizeTextarea({ placeholder, maxLength = 500 }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(Math.max(el.scrollHeight, 80), 300) + "px";
  }, []);

  const handleChange = (e) => {
    if (e.target.value.length <= maxLength) {
      setValue(e.target.value);
      resize();
    }
  };

  return (
    <div>
      <textarea data-testid="auto-textarea" ref={textareaRef} value={value} onChange={handleChange} onInput={resize}
        placeholder={placeholder}
        style={{ width: "100%", minHeight: 80, maxHeight: 300, padding: "10px 12px", background: "#1e293b",
          border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0", fontSize: 14,
          resize: "none", overflow: "auto", lineHeight: 1.6 }} />
      <div data-testid="char-count" style={{ textAlign: "right", color: "#64748b", fontSize: 12, marginTop: 4 }}>
        {value.length}/{maxLength}
      </div>
    </div>
  );
}`,
    solutionExplanation: "On each input, reset height to 'auto' then set it to clamped scrollHeight. This allows both growing and shrinking. Character count is derived from value.length.",
  },
  {
    id: "mc-17",
    chapterId: 2,
    title: "Dynamic Form Builder",
    difficulty: "hard",
    description:
      "Build a form builder where users can add different field types (text, select, checkbox) dynamically. Each field can be reordered and removed. Include a preview of the generated form.",
    requirements: [
      "Button to add new form fields (text, select, checkbox)",
      "Each field has a configurable label",
      "Fields can be removed via a delete button",
      "Fields can be moved up/down to reorder",
      "Live preview shows the rendered form with all fields",
    ],
    starterCode: `const { useState } = React;

function FormBuilder() {
  // Implement dynamic form builder
  return <div>Implement FormBuilder</div>;
}

function App() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: "#e2e8f0", marginBottom: 16 }}>Form Builder</h2>
      <FormBuilder />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const addBtn = document.querySelector('[data-testid="add-field-btn"]');
console.assert(addBtn !== null, 'Test 1: Add field button exists');

// Add a text field
addBtn.click();
await new Promise(r => setTimeout(r, 50));
let fields = document.querySelectorAll('[data-testid="field-item"]');
console.assert(fields.length === 1, 'Test 2: One field added');

// Add another field
addBtn.click();
await new Promise(r => setTimeout(r, 50));
fields = document.querySelectorAll('[data-testid="field-item"]');
console.assert(fields.length === 2, 'Test 3: Two fields added');

// Remove first field
const removeBtn = fields[0].querySelector('[data-testid="remove-field"]');
removeBtn.click();
await new Promise(r => setTimeout(r, 50));
fields = document.querySelectorAll('[data-testid="field-item"]');
console.assert(fields.length === 1, 'Test 4: Field removed');`,
    tags: ["dynamic-lists", "array-state", "builder-pattern"],
    order: 7,
    timeEstimate: "25-30 min",
    hints: [
      "Store fields as an array of objects: [{ id, type, label }]",
      "Use a counter for unique IDs (not array index)",
      "Reorder by swapping adjacent items in the array",
    ],
    keyInsight: "Dynamic list management with add/remove/reorder on an array of objects is a pattern used everywhere — form builders, kanban boards, playlist editors. Always use unique IDs, never array indices as keys.",
    solution: `const { useState } = React;

let fieldId = 0;

function FormBuilder() {
  const [fields, setFields] = useState([]);

  const addField = (type = "text") => {
    setFields((prev) => [...prev, { id: ++fieldId, type, label: "Field " + fieldId }]);
  };

  const removeField = (id) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const moveField = (index, dir) => {
    setFields((prev) => {
      const next = [...prev];
      const newIndex = index + dir;
      if (newIndex < 0 || newIndex >= next.length) return prev;
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return next;
    });
  };

  const updateLabel = (id, label) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, label } : f)));
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button data-testid="add-field-btn" onClick={() => addField("text")}
            style={{ padding: "6px 14px", background: "#3b82f6", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>+ Text</button>
          <button onClick={() => addField("select")}
            style={{ padding: "6px 14px", background: "#8b5cf6", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>+ Select</button>
          <button onClick={() => addField("checkbox")}
            style={{ padding: "6px 14px", background: "#f59e0b", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>+ Checkbox</button>
        </div>
        {fields.map((field, i) => (
          <div key={field.id} data-testid="field-item" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: 8, background: "#1e293b", borderRadius: 6 }}>
            <span style={{ color: "#64748b", fontSize: 12, width: 60 }}>{field.type}</span>
            <input value={field.label} onChange={(e) => updateLabel(field.id, e.target.value)}
              style={{ flex: 1, padding: "4px 8px", background: "#0f172a", border: "1px solid #334155", borderRadius: 4, color: "#e2e8f0", fontSize: 13 }} />
            <button onClick={() => moveField(i, -1)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>↑</button>
            <button onClick={() => moveField(i, 1)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>↓</button>
            <button data-testid="remove-field" onClick={() => removeField(field.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>✕</button>
          </div>
        ))}
      </div>
      <div>
        <h3 style={{ color: "#94a3b8", fontSize: 14, marginBottom: 12 }}>Preview</h3>
        <div style={{ background: "#1e293b", padding: 16, borderRadius: 8 }}>
          {fields.length === 0 ? (
            <p style={{ color: "#475569", fontSize: 13 }}>Add fields to see preview</p>
          ) : fields.map((field) => (
            <div key={field.id} style={{ marginBottom: 12 }}>
              <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginBottom: 4 }}>{field.label}</label>
              {field.type === "text" && <input style={{ width: "100%", padding: "6px 10px", background: "#0f172a", border: "1px solid #334155", borderRadius: 4, color: "#e2e8f0" }} />}
              {field.type === "select" && <select style={{ width: "100%", padding: "6px 10px", background: "#0f172a", border: "1px solid #334155", borderRadius: 4, color: "#e2e8f0" }}><option>Option 1</option><option>Option 2</option></select>}
              {field.type === "checkbox" && <input type="checkbox" style={{ width: 18, height: 18 }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`,
    solutionExplanation: "Fields array in state with unique IDs. Add creates new object, remove filters, reorder swaps adjacent items. Two-column layout: configuration on left, live preview on right.",
  },
  {
    id: "mc-18",
    chapterId: 2,
    title: "Search Input with Debounce",
    difficulty: "medium",
    description:
      "Build a search input that debounces API calls. Show a loading indicator while searching, and display results in a dropdown. The search should only fire after the user stops typing for 300ms.",
    requirements: [
      "Text input that filters/searches as user types",
      "Debounce the search by 300ms (don't search on every keystroke)",
      "Show loading spinner while search is in progress",
      "Display results in a dropdown below the input",
      "Clear results when input is empty",
    ],
    starterCode: `const { useState, useEffect, useRef, useCallback } = React;

// Simulated API call
function searchAPI(query) {
  const items = ["React", "Redux", "Router", "Remix", "RSC", "Vue", "Vite", "Vitest", "Angular", "Astro", "Alpine", "Svelte", "SolidJS", "Next.js", "Nuxt", "Nest.js"];
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(items.filter((i) => i.toLowerCase().includes(query.toLowerCase())));
    }, 300);
  });
}

function SearchInput() {
  // Implement debounced search with results dropdown
  return <div>Implement SearchInput</div>;
}

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <h3 style={{ color: "#e2e8f0", marginBottom: 12 }}>Search Frameworks</h3>
      <SearchInput />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));`,
    testCases: `const input = document.querySelector('[data-testid="search-input"]');
console.assert(input !== null, 'Test 1: Search input exists');

// Type a query
input.value = "Re";
input.dispatchEvent(new Event('change', { bubbles: true }));

// Wait for debounce + API
await new Promise(r => setTimeout(r, 700));
const results = document.querySelectorAll('[data-testid="search-result"]');
console.assert(results.length > 0, 'Test 2: Results appear after debounced search');
console.assert(results[0].textContent.toLowerCase().includes("re"), 'Test 3: Results match query');

// Clear input
input.value = "";
input.dispatchEvent(new Event('change', { bubbles: true }));
await new Promise(r => setTimeout(r, 400));
const clearedResults = document.querySelectorAll('[data-testid="search-result"]');
console.assert(clearedResults.length === 0, 'Test 4: Results cleared on empty input');`,
    tags: ["debounce", "async", "search", "loading-state"],
    order: 8,
    timeEstimate: "20-25 min",
    hints: [
      "Use setTimeout/clearTimeout in useEffect for debouncing",
      "Track loading state separately from results",
      "Clear the timeout on cleanup (return from useEffect)",
    ],
    keyInsight: "Debounce in React: use useEffect with the query as dependency, set a timeout, return clearTimeout as cleanup. The cleanup runs before each new effect, canceling the previous timer.",
    solution: `const { useState, useEffect } = React;

function SearchInput() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    const timer = setTimeout(async () => {
      const data = await searchAPI(query);
      setResults(data);
      setLoading(false);
    }, 300);
    return () => { clearTimeout(timer); setLoading(false); };
  }, [query]);

  return (
    <div style={{ position: "relative" }}>
      <input data-testid="search-input" value={query} onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        style={{ width: "100%", padding: "8px 12px", background: "#1e293b", border: "1px solid #334155", borderRadius: 6, color: "#e2e8f0", fontSize: 14 }} />
      {loading && <div style={{ position: "absolute", right: 12, top: 10, color: "#64748b", fontSize: 12 }}>Loading...</div>}
      {results.length > 0 && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#1e293b", border: "1px solid #334155", borderRadius: 6, overflow: "hidden", zIndex: 10 }}>
          {results.map((item, i) => (
            <div key={i} data-testid="search-result" style={{ padding: "8px 12px", color: "#e2e8f0", fontSize: 14, borderBottom: i < results.length - 1 ? "1px solid #0f172a" : "none", cursor: "pointer" }}
              onMouseEnter={(e) => e.target.style.background = "#334155"}
              onMouseLeave={(e) => e.target.style.background = "transparent"}>
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`,
    solutionExplanation: "useEffect watches query. On change: clear previous timeout (via cleanup return), start a new 300ms timeout. After 300ms of inactivity, fire the API call and update results. Loading state shown while waiting.",
  },
];
