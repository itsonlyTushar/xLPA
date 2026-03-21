"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Play, RotateCcw } from "lucide-react";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Tab inserts 2 spaces
      if (e.key === "Tab") {
        e.preventDefault();
        const textarea = e.currentTarget;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newCode = code.substring(0, start) + "  " + code.substring(end);
        setCode(newCode);
        // Restore cursor position
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        });
      }
      // Ctrl/Cmd + Enter runs code
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onRun(code);
      }
    },
    [code, onRun]
  );

  function handleReset() {
    setCode(initialCode);
    onReset();
  }

  // Line numbers
  const lineCount = code.split("\n").length;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface">
        <span className="text-xs text-muted font-mono">solution.js</span>
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
            onClick={() => onRun(code)}
            disabled={isRunning}
            className="flex items-center gap-1.5 text-xs bg-success/20 text-success hover:bg-success/30 disabled:opacity-50 px-3 py-1.5 rounded font-medium transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            {isRunning ? "Running..." : "Run (Ctrl+Enter)"}
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line numbers */}
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

        {/* Code textarea */}
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
  );
}
