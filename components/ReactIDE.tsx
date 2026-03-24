"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackFileExplorer,
  useSandpack,
  SandpackConsole,
  SandpackThemeProp,
} from "@codesandbox/sandpack-react";
import { Editor, OnMount } from "@monaco-editor/react";
import {
  Play,
  RotateCcw,
  FlaskConical,
  Eye,
  Terminal,
  FileCode,
  ChevronRight,
  ChevronLeft,
  X,
  FilePlus,
  Save,
  Monitor,
  Plus,
} from "lucide-react";

// Premium Custom Theme based on the site's colors
const dsaTheme: SandpackThemeProp = {
  colors: {
    surface1: "#000000",
    surface2: "#111111",
    surface3: "#1a1a1a",
    disabled: "#444444",
    base: "#737373",
    accent: "#dc2626",
    error: "#ef4444",
    warning: "#eab308",
  },
  syntax: {
    plain: "#ededed",
    comment: { color: "#525252", fontStyle: "italic" },
    keyword: "#dc2626",
    tag: "#ef4444",
    punctuation: "#737373",
    definition: "#ffffff",
    property: "#dc2626",
    static: "#a855f7",
    string: "#22c55e",
  },
  font: {
    body: 'var(--font-geist-sans), "Inter", sans-serif',
    mono: 'var(--font-geist-mono), "Fira Code", monospace',
    size: "13px",
    lineHeight: "1.6",
  },
};

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

// Custom Editor component that uses Monaco but syncs with Sandpack
const MonacoEditor = () => {
  const { sandpack } = useSandpack();
  const { files, activeFile, updateFile } = sandpack;
  const editorRef = useRef<any>(null);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateFile(activeFile, value);
    }
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Match theme
    monaco.editor.defineTheme("dsa-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "525252", fontStyle: "italic" },
        { token: "keyword", foreground: "dc2626" },
        { token: "tag", foreground: "ef4444" },
        { token: "string", foreground: "22c55e" },
        { token: "delimiter", foreground: "737373" },
      ],
      colors: {
        "editor.background": "#000000",
        "editor.foreground": "#ededed",
        "editor.lineHighlightBackground": "#111111",
        "editorCursor.foreground": "#dc2626",
        "editorIndentGuide.background": "#222222",
        "editorLineNumber.foreground": "#444444",
        "editorLineNumber.activeForeground": "#737373",
      },
    });
    monaco.editor.setTheme("dsa-dark");
  };

  return (
    <div className="flex-1 h-full overflow-hidden">
      {activeFile && files[activeFile] ? (
        <Editor
          height="100%"
          language={
            activeFile.endsWith(".js") || activeFile.endsWith(".jsx")
              ? "javascript"
              : "css"
          }
          value={files[activeFile].code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "var(--font-geist-mono)",
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
            padding: { top: 16 },
            tabSize: 2,
          }}
        />
      ) : (
        <div className="h-full flex items-center justify-center text-muted">
          Select a file to edit
        </div>
      )}
    </div>
  );
};

// Custom Test Runner component
const TestPanel = ({
  isRunning,
  runState,
  onRunTests,
}: {
  isRunning: boolean;
  runState: RunState | null;
  onRunTests: () => void;
}) => {
  if (isRunning) {
    return (
      <div className="h-full flex items-center justify-center bg-[#000]">
        <div className="text-center">
          <FlaskConical className="w-8 h-8 mx-auto mb-3 text-blue-500 animate-pulse" />
          <p className="text-sm font-medium text-muted">
            Executing Test Cases...
          </p>
        </div>
      </div>
    );
  }

  if (!runState) {
    return (
      <div className="h-full flex items-center justify-center bg-[#111] p-8 text-center m-4 rounded-2xl border border-white/5">
        <div className="max-w-xs">
          <FlaskConical className="w-12 h-12 mx-auto mb-4 text-muted opacity-20" />
          <h3 className="text-foreground font-semibold mb-2">Test Suite</h3>
          <p className="text-sm text-muted mb-6">
            Run tests to verify your solution against the requirements.
          </p>
          <button
            onClick={onRunTests}
            className="w-full py-2.5 px-4 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-xl text-sm font-semibold transition-all shadow-lg active:scale-95"
          >
            Run All Tests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto code-scroll bg-[#000] p-6 pb-20">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted/50">
          Execution Results
        </h3>
        <div
          className={`text-[10px] font-bold px-3 py-1 rounded-full ${runState.allPassed ? "bg-success/10 text-success border border-success/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}
        >
          {runState.allPassed ? "PASSED" : "FAILED"}
        </div>
      </div>

      <div className="space-y-4">
        {runState.tests.map((t, i) => (
          <div
            key={i}
            className={`flex items-start gap-4 p-5 rounded-2xl border transition-all ${
              t.passed
                ? "bg-success/[0.03] border-success/10 text-success/90"
                : "bg-red-500/[0.03] border-red-500/10 text-red-400/90"
            } hover:scale-[1.01]`}
          >
            <div
              className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-inner ${
                t.passed
                  ? "bg-success/20 text-success"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {t.passed ? "✓" : "✕"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium leading-relaxed">{t.message}</p>
            </div>
          </div>
        ))}
      </div>

      {runState.error && (
        <div className="mt-8 p-5 bg-red-500/5 border border-red-500/10 rounded-2xl">
          <div className="flex items-center gap-2 mb-3 text-red-400">
            <X className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-400/70">
              Runtime Exception
            </span>
          </div>
          <pre className="text-xs font-mono text-red-400/80 whitespace-pre-wrap bg-black/40 p-3 rounded-lg border border-red-400/10">
            {runState.error}
          </pre>
        </div>
      )}

      {runState.allPassed && (
        <div className="mt-10 p-8 bg-success/[0.04] border-2 border-dashed border-success/20 rounded-[2rem] text-center shadow-inner">
          <div className="w-14 h-14 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <FlaskConical className="w-7 h-7 text-success" />
          </div>
          <h4 className="text-success font-bold text-xl mb-2">
            Challenge Completed!
          </h4>
          <p className="text-sm text-success/60 max-w-[200px] mx-auto">
            Your solution passes all verification checks.
          </p>
        </div>
      )}
    </div>
  );
};

// Internal IDE components that have access to useSandpack
const IDEInterior = ({ initialCode, testCases }: ReactIDEProps) => {
  const { sandpack } = useSandpack();
  const { activeFile, addFile } = sandpack;

  const [activeTab, setActiveTab] = useState<"preview" | "console" | "tests">(
    "preview",
  );
  const [isRunning, setIsRunning] = useState(false);
  const [runState, setRunState] = useState<RunState | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  // Listen for test results from sandpack preview
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
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleRunTests = () => {
    setIsRunning(true);
    setActiveTab("tests");
    setShowPreview(true);
    setRunState(null);
  };

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName) return;

    // Ensure filename starts with /
    const name = newFileName.startsWith("/") ? newFileName : `/${newFileName}`;

    try {
      addFile(name, "// New file content\n", true);
      setNewFileName("");
      setIsCreatingFile(false);
    } catch (err) {
      alert("Error adding file. Make sure it has a valid extension.");
    }
  };

  return (
    <SandpackLayout style={{ height: "100%", borderRadius: 0, border: "none" }}>
      {/* File Sidebar (Togglable) */}
      {sidebarOpen && (
        <div className="w-52 shrink-0 border-r border-border bg-[#000] flex flex-col pt-3 select-none">
          <div className="px-5 py-2 flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted/40">
              FileSystem
            </span>
            <button
              onClick={() => setIsCreatingFile(true)}
              title="New File"
              className="text-muted/30 hover:text-foreground transition-colors group p-1 hover:bg-white/5 rounded"
            >
              <FilePlus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {isCreatingFile && (
            <form onSubmit={handleCreateFile} className="px-5 py-2">
              <input
                autoFocus
                type="text"
                placeholder="filename.jsx"
                className="w-full bg-[#111] border border-border rounded px-2 py-1 text-xs outline-none focus:border-primary transition-colors"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onBlur={() => !newFileName && setIsCreatingFile(false)}
              />
            </form>
          )}

          <div className="flex-1 overflow-y-auto code-scroll py-1 sp-explorer-custom">
            <SandpackFileExplorer />
          </div>
        </div>
      )}

      {/* Editor Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 ${showPreview ? "border-r border-border" : ""} relative group`}
      >
        {/* Toggle Button for Sidebar */}
        <div
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute z-50 top-1/2 -translate-y-1/2 -left-px w-1.5 h-32 bg-primary/20 hover:bg-primary transition-all cursor-pointer opacity-0 group-hover:opacity-100 rounded-r-full shadow-[0_0_15px_rgba(220,38,38,0.3)]"
          title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        />

        {/* Editor Tabs / Toolbar */}
        <div className="h-11 border-b border-border bg-surface/40 flex items-center justify-between px-4 shrink-0 backdrop-blur-md">
          <div className="flex items-center gap-1 overflow-hidden h-full">
            <div className="flex items-center gap-2.5 px-4 h-full bg-[#000] border-t-2 border-primary border-x border-border rounded-t-sm shadow-[0_-4px_10px_rgba(0,0,0,0.5)]">
              <FileCode className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold tracking-tight uppercase text-foreground/90 truncate max-w-[120px]">
                {activeFile.split("/").pop()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-all px-2 py-1 rounded ${showPreview ? "text-muted hover:text-foreground" : "text-primary bg-primary/10 border border-primary/20"}`}
              title={showPreview ? "Hide Preview" : "Show Preview"}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <div className="w-px h-5 bg-border/50 mx-1" />
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-foreground transition-all px-2 py-1 rounded"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            <div className="w-px h-5 bg-border/50 mx-1" />
            <button
              onClick={handleRunTests}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 px-4 py-2 rounded-xl border border-blue-500/20 transition-all active:scale-95 shadow-[0_4px_15px_rgba(59,130,246,0.15)] group/btn"
            >
              <FlaskConical className="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform" />
              <span>Verify Code</span>
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <MonacoEditor />
      </div>

      {/* Preview / Output Side */}
      {showPreview && (
        <div className="w-1/2 flex flex-col bg-[#000] animate-in slide-in-from-right duration-300">
          {/* Header Tabs */}
          <div className="h-11 border-b border-border bg-surface flex items-center px-1 shrink-0 overflow-x-auto scroller-none backdrop-blur-md">
            {[
              { id: "preview", label: "Preview", icon: Monitor },
              { id: "console", label: "Output", icon: Terminal },
              { id: "tests", label: "Tests", icon: FlaskConical },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-5 h-full text-[10px] font-bold uppercase tracking-[0.15em] transition-all relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <tab.icon
                  className={`w-3.5 h-3.5 transition-transform ${activeTab === tab.id ? "text-primary scale-110" : "text-muted"}`}
                />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-full shadow-[0_-4px_12px_rgba(220,38,38,0.5)]" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-hidden relative">
            <div
              className={`h-full ${activeTab === "preview" ? "block scale-in" : "hidden"}`}
            >
              <SandpackPreview
                showOpenInCodeSandbox={false}
                showRefreshButton={true}
                className="w-full h-full"
              />
            </div>

            <div
              className={`h-full ${activeTab === "console" ? "block font-mono" : "hidden"}`}
            >
              <SandpackConsole className="h-full sp-console-custom" />
            </div>

            <div
              className={`h-full ${activeTab === "tests" ? "block" : "hidden"}`}
            >
              <TestPanel
                isRunning={isRunning}
                runState={runState}
                onRunTests={handleRunTests}
              />
            </div>
          </div>
        </div>
      )}
    </SandpackLayout>
  );
};

// Helper to ensure React/ReactDOM are imported in files that use them without imports
const ensureEnvironment = (code: string) => {
  let finalCode = code;
  if (
    !finalCode.includes("import React") &&
    !finalCode.includes("import * as React")
  ) {
    finalCode = `import React from 'react';\n${finalCode}`;
  }
  if (
    (finalCode.includes("ReactDOM.render") ||
      finalCode.includes("createRoot")) &&
    !finalCode.includes("import ReactDOM") &&
    !finalCode.includes("import * as ReactDOM")
  ) {
    finalCode = `import ReactDOM from 'react-dom';\n${finalCode}`;
  }
  return finalCode;
};

export default function ReactIDE({ initialCode, testCases }: ReactIDEProps) {
  // Final file list
  const files: Record<string, any> = {
    "/solution.jsx": ensureEnvironment(initialCode),
    "/index.js": {
      code: `
import * as React from "react";
import * as ReactDOM from "react-dom";
window.React = React;
window.ReactDOM = ReactDOM;

// Console interception shim
window.__logs = [];
window.__tests = [];
window.__error = null;
const __origConsole = { ...console };
function __fmt(a) {
  if (a === null) return 'null';
  if (a === undefined) return 'undefined';
  if (typeof a === 'object') { try { return JSON.stringify(a); } catch { return String(a); } }
  return String(a);
}
console.log = (...a) => { window.__logs.push({ type: 'log', message: a.map(__fmt).join(' ') }); __origConsole.log(...a); };
console.error = (...a) => { window.__logs.push({ type: 'error', message: a.map(__fmt).join(' ') }); __origConsole.error(...a); };
console.warn = (...a) => { window.__logs.push({ type: 'warn', message: a.map(__fmt).join(' ') }); __origConsole.warn(...a); };
console.assert = (cond, msg) => {
  window.__tests.push({ passed: !!cond, message: msg || 'Assertion' });
  if (!cond) window.__logs.push({ type: 'error', message: 'Assertion failed: ' + (msg || '') });
};

// Import the user's solution
import * as Solution from "./solution.jsx";

// Standard entry point rendering
const rootElement = document.getElementById("root");
if (rootElement) {
  // If it exports a component, we render it
  const App = Solution.default || Solution.App || Solution.Modal || Solution.Component;
  if (App && rootElement.innerHTML === "") {
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(App));
  }
}

// Check for test mode
const isRunning = window.location.search.includes('test=true') || window.__is_running_tests;

if (isRunning) {
  setTimeout(async () => {
    try {
      ${testCases}
    } catch(e) {
      window.__error = e.message;
    }
    
    window.parent.postMessage({
      type: "__mc_test_result",
      logs: window.__logs,
      tests: window.__tests,
      error: window.__error,
      allPassed: !window.__error && window.__tests.length > 0 && window.__tests.every(t => t.passed)
    }, "*");
  }, 1500);
}
      `,
      hidden: true,
    },
    "/styles.css": {
      code: `
body {
  margin: 0;
  padding: 0;
  background-color: #000;
  color: #ededed;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
* { box-sizing: border-box; }
      `,
      hidden: true,
    },
  };

  return (
    <div className="flex flex-col h-full bg-[#000] overflow-hidden border-t border-border">
      <SandpackProvider
        template="react"
        theme={dsaTheme}
        files={files}
        customSetup={{
          dependencies: {
            react: "18.2.0",
            "react-dom": "18.2.0",
            "lucide-react": "latest",
          },
        }}
        options={{
          recompileMode: "delayed",
          recompileDelay: 800,
        }}
      >
        <IDEInterior initialCode={initialCode} testCases={testCases} />
      </SandpackProvider>

      <style jsx global>{`
        .sp-explorer-custom button {
          font-size: 13px !important;
          color: #737373 !important;
          padding: 10px 20px !important;
          transition:
            background 0.3s,
            color 0.3s,
            transform 0.2s !important;
          border-radius: 0 !important;
        }
        .sp-explorer-custom button:hover {
          background: #111111 !important;
          color: #ededed !important;
        }
        .sp-explorer-custom button[data-active="true"] {
          color: #dc2626 !important;
          background: #111111 !important;
          font-weight: 700 !important;
          border-left: 2px solid #dc2626 !important;
        }
        .sp-console-custom div {
          font-size: 13px !important;
          font-family: var(--font-geist-mono) !important;
          background: #000 !important;
        }
        .scroller-none::-webkit-scrollbar {
          display: none;
        }
        .code-scroll::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .code-scroll::-webkit-scrollbar-thumb {
          background: #262626;
          border-radius: 10px;
        }
        .code-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .scale-in {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
