// Web Worker for sandboxed JS code execution
// Runs user code in an isolated scope with console capture

self.onmessage = function (e) {
  const { code, testCases } = e.data;
  const logs = [];
  const assertionResults = [];
  let error = null;

  // Override console methods
  const mockConsole = {
    log: (...args) => {
      logs.push({ type: "log", message: args.map(formatArg).join(" ") });
    },
    error: (...args) => {
      logs.push({ type: "error", message: args.map(formatArg).join(" ") });
    },
    warn: (...args) => {
      logs.push({ type: "warn", message: args.map(formatArg).join(" ") });
    },
    assert: (condition, message) => {
      const msg = message || "Assertion";
      assertionResults.push({ passed: !!condition, message: msg });
      if (!condition) {
        logs.push({ type: "error", message: `Assertion failed: ${msg}` });
      }
    },
  };

  function formatArg(arg) {
    if (arg === null) return "null";
    if (arg === undefined) return "undefined";
    if (typeof arg === "object") {
      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    }
    return String(arg);
  }

  try {
    // Create a function scope with console override
    const wrappedCode = `
      "use strict";
      ${code}
      ${testCases || ""}
    `;

    const fn = new Function("console", wrappedCode);
    fn(mockConsole);
  } catch (err) {
    error = {
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
  }

  self.postMessage({
    logs,
    assertionResults,
    error,
    allPassed:
      !error &&
      assertionResults.length > 0 &&
      assertionResults.every((r) => r.passed),
  });
};
