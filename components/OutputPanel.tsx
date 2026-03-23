"use client";

import type { RunResult } from "@/hooks/useCodeRunner";
import { CheckCircle2, XCircle, AlertTriangle, Terminal, Hash, Info } from "lucide-react";

export default function OutputPanel({ result }: { result: RunResult | null }) {
  if (!result) {
    return (
      <div className="h-full flex items-center justify-center text-muted text-sm bg-black/20">
        <div className="text-center group">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-white/10 transition-all duration-500 shadow-2xl">
            <Terminal className="w-8 h-8 opacity-20 group-hover:opacity-40 transition-opacity" />
          </div>
          <p className="font-bold uppercase tracking-[0.2em] text-[10px] text-muted/40">Ready for execution</p>
          <p className="text-[11px] mt-2 text-muted/20 font-medium italic">Press Ctrl+Enter to trigger tests</p>
        </div>
      </div>
    );
  }

  const { logs, assertionResults, error, allPassed } = result;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#000]">
      {/* Status bar */}
      <div
        className={`px-6 py-3 border-b border-white/10 flex items-center justify-between backdrop-blur-md sticky top-0 z-10 ${
          error
            ? "bg-red-500/10"
            : allPassed
            ? "bg-success/10"
            : "bg-yellow-500/10"
        }`}
      >
        <div className="flex items-center gap-3">
          {error ? (
            <XCircle className="w-4 h-4 text-red-400" />
          ) : allPassed ? (
            <CheckCircle2 className="w-4 h-4 text-success" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
          )}
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
            error ? "text-red-400" : allPassed ? "text-success" : "text-yellow-500"
          }`}>
            {error ? "Runtime Error" : allPassed ? "All Tests Passed" : "Verification Failed"}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-[10px] font-bold text-muted/40 tracking-widest uppercase">
          <span className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-md border border-white/5">
            <Hash className="w-3 h-3" />
            {assertionResults.length} Tests
          </span>
          <span className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-md border border-white/5">
            <Info className="w-3 h-3" />
            {logs.length} Logs
          </span>
        </div>
      </div>

      {/* Output content */}
      <div className="flex-1 overflow-auto p-6 space-y-6 code-scroll">
        {/* Error display */}
        {error && (
          <div className="bg-red-500/[0.03] border border-red-500/10 rounded-2xl p-5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex items-center gap-2 mb-3">
               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
               <span className="text-[10px] font-black text-red-400/70 uppercase tracking-widest">Stack Trace</span>
            </div>
            <div className="text-red-400 font-mono text-[13px] font-medium leading-relaxed mb-4">
              {error.name}: {error.message}
            </div>
            {error.stack && (
              <pre className="text-red-400/40 text-[11px] font-mono leading-relaxed bg-black/40 p-4 rounded-xl border border-red-400/5 overflow-x-auto scroller-none">
                {error.stack.split("\n").slice(1, 6).join("\n")}
              </pre>
            )}
          </div>
        )}

        {/* Assertion results */}
        {assertionResults.length > 0 && (
          <div className="space-y-3">
             <h3 className="text-[10px] font-black text-muted/30 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <div className="w-1 h-3 bg-primary/30 rounded-full" />
                Test Suite Execution
             </h3>
            {assertionResults.map((r, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 group hover:scale-[1.01] ${
                  r.passed
                    ? "bg-success/[0.02] border-success/10 text-success/80 hover:bg-success/[0.04]"
                    : "bg-red-500/[0.02] border-red-500/10 text-red-400 hover:bg-red-500/[0.04]"
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-inner ${
                   r.passed ? "bg-success/20 text-success" : "bg-red-500/20 text-red-400"
                }`}>
                  {r.passed ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                </div>
                <span className="text-[13px] font-medium tracking-tight font-mono truncate">{r.message}</span>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                      r.passed ? "bg-success/20" : "bg-red-500/20"
                   }`}>
                      {r.passed ? "Passed" : "Failed"}
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Console logs */}
        {logs.length > 0 && (
          <div className="pt-4 space-y-3">
            <h3 className="text-[10px] font-black text-muted/30 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <div className="w-1 h-3 bg-blue-500/30 rounded-full" />
                Terminal Output
             </h3>
            <div className="bg-[#050505] border border-white/5 rounded-2xl p-4 font-mono shadow-inner">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={`text-[12px] py-1 border-b border-white/[0.02] last:border-0 flex gap-3 ${
                    log.type === "error"
                      ? "text-red-400/80"
                      : log.type === "warn"
                      ? "text-yellow-400/80"
                      : "text-muted/70"
                  }`}
                >
                  <span className="text-muted/20 select-none w-4">{i + 1}</span>
                  <div className="flex-1">
                    {log.type !== "log" && (
                      <span className="text-[10px] font-black opacity-30 mr-2 uppercase tracking-tighter">
                        [{log.type}]
                      </span>
                    )}
                    {log.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {logs.length === 0 && assertionResults.length === 0 && !error && (
          <div className="text-muted/30 text-[11px] font-medium italic text-center py-10 opacity-50">No runtime output generated</div>
        )}
      </div>
    </div>
  );
}
