"use client";

import { useState, useEffect } from "react";
import { Play, RotateCcw } from "lucide-react";
import { Editor } from "@monaco-editor/react";

interface CodeEditorProps {
  initialCode: string;
  onRun: (code: string) => void;
  onReset: () => void;
  isRunning: boolean;
}

export default function CodeEditor({
  initialCode,
  onRun,
  onReset,
  isRunning,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  function handleReset() {
    setCode(initialCode);
    onReset();
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  return (
    <div className="flex flex-col h-full border border-border rounded-xl overflow-hidden bg-background shadow-2xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface/50 border-b border-border backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 px-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted/60 ml-2">
            solution.js
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted hover:text-foreground transition-all px-2 py-1 rounded hover:bg-white/5"
            title="Reset to starter code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <div className="w-px h-4 bg-border/50 mx-1" />
          <button
            onClick={() => onRun(code)}
            disabled={isRunning}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-success/10 text-success hover:bg-success/20 disabled:opacity-50 px-4 py-1.5 rounded-lg border border-success/20 transition-all active:scale-95 shadow-lg shadow-success/10"
          >
            <Play className="w-3.5 h-3.5" />
            {isRunning ? "Running..." : "Run (Ctrl+Enter)"}
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 min-h-0 bg-black/20">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            smoothScrolling: true,
            scrollbar: {
              vertical: "hidden",
              horizontal: "hidden",
            },
          }}
          onMount={(editor) => {
            // Add Ctrl+Enter keybinding
            editor.addCommand(2048 | 3, () => {
              onRun(editor.getValue());
            });
          }}
        />
      </div>
    </div>
  );
}
