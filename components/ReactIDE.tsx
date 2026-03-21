"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Play, RotateCcw, Eye, FlaskConical } from "lucide-react";

interface ReactIDEProps {
  initialCode: string;
  testCases: string;
}

interface TestResult {
  passed: boolean;
  message: string;
}

interface RunState {
  logs: { type: string; message: string }[];
  tests: TestResult[];
  error: string | null;
  allPassed: boolean;
}

function buildPreviewHTML(code: string, testScript?: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0f0f23; color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  #root { min-height: 100vh; }
</style>
<script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin><\/script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin><\/script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
</head>
<body>
<div id="root"></div>
<script>
  // Message parent with console/test results
  const __logs = [];
  const __tests = [];
  let __error = null;

  const __origConsole = { ...console };
  function __fmt(a) {
    if (a === null) return 'null';
    if (a === undefined) return 'undefined';
    if (typeof a === 'object') { try { return JSON.stringify(a); } catch { return String(a); } }
    return String(a);
  }
  console.log = (...a) => { __logs.push({ type: 'log', message: a.map(__fmt).join(' ') }); __origConsole.log(...a); };
  console.error = (...a) => { __logs.push({ type: 'error', message: a.map(__fmt).join(' ') }); __origConsole.error(...a); };
  console.warn = (...a) => { __logs.push({ type: 'warn', message: a.map(__fmt).join(' ') }); __origConsole.warn(...a); };
  console.assert = (cond, msg) => {
    const m = msg || 'Assertion';
    __tests.push({ passed: !!cond, message: m });
    if (!cond) __logs.push({ type: 'error', message: 'Assertion failed: ' + m });
  };
<\/script>
<script type="text/babel" data-type="module">
try {
${code}
} catch(e) {
  document.getElementById('root').innerHTML = '<pre style="color:#f87171;padding:24px;white-space:pre-wrap">Error: ' + e.message + '</pre>';
  window.__error = e.message;
}
<\/script>
${
  testScript
    ? `<script>
  // Run tests after React has rendered
  window.addEventListener('load', async function() {
    await new Promise(r => setTimeout(r, 300));
    try {
      ${testScript}
    } catch(e) {
      __tests.push({ passed: false, message: 'Test error: ' + e.message });
    }
    window.parent.postMessage({
      type: '__mc_test_result',
      logs: __logs,
      tests: __tests,
      error: __error,
      allPassed: !__error && __tests.length > 0 && __tests.every(t => t.passed)
    }, '*');
  });
<\/script>`
    : `<script>
  window.addEventListener('load', function() {
    setTimeout(function() {
      window.parent.postMessage({
        type: '__mc_test_result',
        logs: __logs,
        tests: __tests,
        error: __error,
        allPassed: true
      }, '*');
    }, 300);
  });
<\/script>`
}
</body>
</html>`;
}

export default function ReactIDE({ initialCode, testCases }: ReactIDEProps) {
  const [code, setCode] = useState(initialCode);
  const [activeTab, setActiveTab] = useState<"preview" | "tests">("preview");
  const [runState, setRunState] = useState<RunState | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [previewHTML, setPreviewHTML] = useState(() => buildPreviewHTML(initialCode));
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCode(initialCode);
    setPreviewHTML(buildPreviewHTML(initialCode));
    setRunState(null);
    setPreviewKey((k) => k + 1);
  }, [initialCode]);

  // Listen for test results from iframe
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === "__mc_test_result") {
        setRunState({
          logs: e.data.logs || [],
          tests: e.data.tests || [],
          error: e.data.error || null,
          allPassed: e.data.allPassed ?? false,
        });
        setIsRunning(false);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleRun = useCallback(() => {
    setIsRunning(true);
    setRunState(null);
    setPreviewHTML(buildPreviewHTML(code));
    setPreviewKey((k) => k + 1);
    setActiveTab("preview");
  }, [code]);

  const handleRunTests = useCallback(() => {
    setIsRunning(true);
    setRunState(null);
    setPreviewHTML(buildPreviewHTML(code, testCases));
    setPreviewKey((k) => k + 1);
    setActiveTab("tests");
  }, [code, testCases]);

  const handleReset = useCallback(() => {
    setCode(initialCode);
    setRunState(null);
    setPreviewHTML(buildPreviewHTML(initialCode));
    setPreviewKey((k) => k + 1);
  }, [initialCode]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const textarea = e.currentTarget;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newCode = code.substring(0, start) + "  " + code.substring(end);
        setCode(newCode);
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        });
      }
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleRun();
      }
    },
    [code, handleRun]
  );

  const lineCount = code.split("\n").length;

  return (
    <div className="flex flex-col h-full">
      {/* Two-pane: editor left, preview right */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Code editor */}
        <div className="w-1/2 flex flex-col border-r border-border min-w-0">
          {/* Editor toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface shrink-0">
            <span className="text-xs text-muted font-mono">solution.jsx</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors px-2 py-1 rounded"
                title="Reset to starter code"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
              <button
                onClick={handleRunTests}
                disabled={isRunning}
                className="flex items-center gap-1.5 text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 disabled:opacity-50 px-3 py-1.5 rounded font-medium transition-colors"
                title="Run tests"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                Test
              </button>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center gap-1.5 text-xs bg-success/20 text-success hover:bg-success/30 disabled:opacity-50 px-3 py-1.5 rounded font-medium transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                {isRunning ? "Running..." : "Run"}
              </button>
            </div>
          </div>

          {/* Code textarea with line numbers */}
          <div className="flex-1 flex overflow-hidden">
            <div className="py-4 px-3 text-right select-none border-r border-border bg-background overflow-hidden">
              {Array.from({ length: lineCount }, (_, i) => (
                <div
                  key={i}
                  className="text-xs text-muted/40 leading-[1.6] font-mono"
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="code-editor code-scroll flex-1 bg-background text-foreground p-4 resize-none text-sm overflow-auto"
            />
          </div>
        </div>

        {/* Right: Preview + Tests */}
        <div className="w-1/2 flex flex-col min-w-0">
          {/* Tab bar */}
          <div className="flex items-center gap-0 border-b border-border bg-surface shrink-0">
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors border-b-2 ${
                activeTab === "preview"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab("tests")}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors border-b-2 ${
                activeTab === "tests"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              Tests
              {runState && runState.tests.length > 0 && (
                <span
                  className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                    runState.allPassed
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {runState.tests.filter((t) => t.passed).length}/{runState.tests.length}
                </span>
              )}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "preview" ? (
              <iframe
                ref={iframeRef}
                key={previewKey}
                srcDoc={previewHTML}
                sandbox="allow-scripts allow-same-origin"
                className="w-full h-full bg-[#0f0f23] border-none"
                title="React Preview"
              />
            ) : (
              <div className="h-full overflow-auto code-scroll bg-background p-4 space-y-2">
                {isRunning && (
                  <div className="text-muted text-sm animate-pulse">
                    Running tests...
                  </div>
                )}

                {runState?.error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-3">
                    <div className="text-red-400 font-mono text-sm font-bold">
                      Error: {runState.error}
                    </div>
                  </div>
                )}

                {runState && runState.tests.length > 0 && (
                  <div className="space-y-1.5">
                    {runState.tests.map((t, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 text-sm font-mono px-3 py-2 rounded-lg ${
                          t.passed
                            ? "text-green-400 bg-green-500/5 border border-green-500/10"
                            : "text-red-400 bg-red-500/5 border border-red-500/10"
                        }`}
                      >
                        <span className="shrink-0">{t.passed ? "✓" : "✕"}</span>
                        <span className="truncate">{t.message}</span>
                      </div>
                    ))}
                    <div
                      className={`mt-3 text-sm font-semibold ${
                        runState.allPassed ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {runState.allPassed
                        ? `All ${runState.tests.length} tests passed!`
                        : `${runState.tests.filter((t) => t.passed).length}/${runState.tests.length} tests passed`}
                    </div>
                  </div>
                )}

                {runState && runState.logs.length > 0 && (
                  <div className="mt-4 border-t border-border pt-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted/60 mb-2">
                      Console Output
                    </div>
                    {runState.logs.map((log, i) => (
                      <div
                        key={i}
                        className={`text-xs font-mono px-2 py-0.5 ${
                          log.type === "error"
                            ? "text-red-400"
                            : log.type === "warn"
                            ? "text-yellow-400"
                            : "text-muted"
                        }`}
                      >
                        {log.message}
                      </div>
                    ))}
                  </div>
                )}

                {!isRunning && !runState && (
                  <div className="h-full flex items-center justify-center text-muted text-sm">
                    <div className="text-center">
                      <FlaskConical className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p>Click &quot;Test&quot; to run test cases</p>
                      <p className="text-xs mt-1 text-muted/60">
                        Ctrl+Enter to preview
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
