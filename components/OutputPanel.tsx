"use client";

import type { RunResult } from "@/hooks/useCodeRunner";
import { CheckCircle2, XCircle, AlertTriangle, Terminal } from "lucide-react";

export default function OutputPanel({ result }: { result: RunResult | null }) {
  if (!result) {
    return (
      <div className="h-full flex items-center justify-center text-muted text-sm">
        <div className="text-center">
          <Terminal className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>Run your code to see output</p>
          <p className="text-xs mt-1 text-muted/60">Ctrl+Enter to run</p>
        </div>
      </div>
    );
  }

  const { logs, assertionResults, error, allPassed } = result;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Status bar */}
      <div
        className={`px-4 py-2 border-b border-border flex items-center gap-2 text-sm font-medium ${
          error
            ? "bg-red-500/10 text-red-400"
            : allPassed
            ? "bg-green-500/10 text-green-400"
            : "bg-yellow-500/10 text-yellow-400"
        }`}
      >
        {error ? (
          <>
            <XCircle className="w-4 h-4" /> Runtime Error
          </>
        ) : allPassed ? (
          <>
            <CheckCircle2 className="w-4 h-4" /> All Tests Passed
          </>
        ) : (
          <>
            <AlertTriangle className="w-4 h-4" /> Some Tests Failed
          </>
        )}
      </div>

      {/* Output content */}
      <div className="flex-1 overflow-auto p-4 space-y-1 code-scroll">
        {/* Error display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-3">
            <div className="text-red-400 font-mono text-sm font-bold">
              {error.name}: {error.message}
            </div>
            {error.stack && (
              <pre className="text-red-400/60 text-xs mt-2 whitespace-pre-wrap">
                {error.stack.split("\n").slice(1, 4).join("\n")}
              </pre>
            )}
          </div>
        )}

        {/* Assertion results */}
        {assertionResults.length > 0 && (
          <div className="mb-3 space-y-1">
            {assertionResults.map((r, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 text-sm font-mono px-2 py-1 rounded ${
                  r.passed
                    ? "text-green-400 bg-green-500/5"
                    : "text-red-400 bg-red-500/5"
                }`}
              >
                {r.passed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                )}
                <span className="truncate">{r.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Console logs */}
        {logs.map((log, i) => (
          <div
            key={i}
            className={`text-sm font-mono px-2 py-0.5 ${
              log.type === "error"
                ? "text-red-400"
                : log.type === "warn"
                ? "text-yellow-400"
                : "text-muted"
            }`}
          >
            {log.type !== "log" && (
              <span className="text-xs opacity-50 mr-2">
                [{log.type.toUpperCase()}]
              </span>
            )}
            {log.message}
          </div>
        ))}

        {logs.length === 0 && assertionResults.length === 0 && !error && (
          <div className="text-muted text-sm">No output</div>
        )}
      </div>
    </div>
  );
}
