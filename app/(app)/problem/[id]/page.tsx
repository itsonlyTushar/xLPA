"use client";

import { use, useState, useCallback, useEffect } from "react";
import { getProblem, getNextProblem, getPreviousProblem } from "@/lib/curriculum";
import { chapters } from "@/lib/curriculum/chapters";
import { useCodeRunner, RunResult } from "@/hooks/useCodeRunner";
import CodeEditor from "@/components/CodeEditor";
import OutputPanel from "@/components/OutputPanel";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Eye,
  Lightbulb,
  Clock,
  Cpu,
} from "lucide-react";
import { SandpackProvider, useSandpack } from "@codesandbox/sandpack-react";

const difficultyConfig = {
  warmup: { label: "Warmup", class: "badge-warmup" },
  core: { label: "Core", class: "badge-core" },
  challenge: { label: "Challenge", class: "badge-challenge" },
  "real-world": { label: "Real-World", class: "badge-real-world" },
};

// Internal component to handle runner logic while having access to Sandpack context
const ProblemContent = ({ problem, nextProblem, prevProblem, chapter, dc, starterCode, testCases }: any) => {
  const { sandpack } = useSandpack();
  const { updateFile, runSandpack } = sandpack;
  const { run } = useCodeRunner(); // Fallback/Original runner for compatibility if needed, but we'll try to unify

  const [result, setResult] = useState<RunResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showDescription, setShowDescription] = useState(true);

  // Listen for results from Sandpack (if using event-based runner)
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === "__mc_test_result") {
        setResult({
          logs: e.data.logs || [],
          assertionResults: e.data.tests || [],
          error: e.data.error ? { name: "Error", message: e.data.error } : null,
          allPassed: e.data.allPassed ?? false,
        });
        setIsRunning(false);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleRun = useCallback(
    async (code: string) => {
      if (!problem) return;
      setIsRunning(true);
      
      // Update Sandpack files and trigger run
      updateFile("/solution.js", code);
      // We trigger the run by updating the active file or using runSandpack
      // The actual execution is handled by the index.js logic we put in the provider
      
      // For now, let's stick to the worker-based runner but improve its output
      // OR replace it entirely with the Sandpack logic if we can ensure it works without a visible preview
      const res = await run(code, problem.testCases);
      setResult(res);
      setIsRunning(false);
    },
    [run, problem, updateFile]
  );

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Problem header bar */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-border bg-surface shrink-0">
        <Link
          href={chapter ? `/chapter/${chapter.slug}` : "/dashboard"}
          className="text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-mono text-muted shrink-0">
            {chapter ? `CH.${chapter.number}` : ""}
          </span>
          <h1 className="font-semibold truncate text-sm">{problem.title}</h1>
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shrink-0 ${dc.class}`}>
            {dc.label}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted shrink-0">
          {problem.timeComplexity && (
            <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded">
              <Clock className="w-3 h-3 text-primary/70" />
              {problem.timeComplexity}
            </span>
          )}
          {problem.spaceComplexity && (
            <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded">
              <Cpu className="w-3 h-3 text-blue-400/70" />
              {problem.spaceComplexity}
            </span>
          )}
          <span className="w-px h-4 bg-border" />
          {prevProblem ? (
            <Link
              href={`/problem/${prevProblem.id}`}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
              title={prevProblem.title}
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </Link>
          ) : (
            <span className="flex items-center gap-1 text-muted/30 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
              Prev
            </span>
          )}
          {nextProblem ? (
            <Link
              href={`/problem/${nextProblem.id}`}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
              title={nextProblem.title}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="flex items-center gap-1 text-muted/30 cursor-not-allowed">
              Next
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </div>
      </div>

      {/* Main content: split pane */}
      <div className="flex-1 flex overflow-hidden bg-black/40">
        {/* Left: Problem description */}
        <div className="w-[420px] shrink-0 border-r border-border overflow-y-auto code-scroll bg-surface/20 backdrop-blur-sm">
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-3 text-foreground/90"
              >
                {showDescription ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5" />
                )}
                Problem Description
              </button>
              {showDescription && (
                <div className="text-sm text-muted/80 leading-relaxed font-medium">
                  {problem.description}
                </div>
              )}
            </div>

            {/* Examples */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-foreground/70">Examples</h3>
              <div className="space-y-4">
                {problem.examples.map((ex, i) => (
                  <div
                    key={i}
                    className="bg-[#000] border border-white/5 rounded-2xl p-5 shadow-xl"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted/40 mb-3 border-b border-white/5 pb-2">Example {i + 1}</div>
                    <div className="font-mono text-[13px] space-y-2">
                      <div className="flex gap-2">
                        <span className="text-muted/40 font-bold w-12 shrink-0">Input</span>
                        <span className="text-blue-400">{ex.input}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-muted/40 font-bold w-12 shrink-0">Output</span>
                        <span className="text-success/80">{ex.output}</span>
                      </div>
                      {ex.explanation && (
                        <div className="text-[11px] text-muted/50 mt-3 pt-2 border-t border-white/5 italic">
                           {ex.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Constraints */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3 text-foreground/70">Constraints</h3>
              <ul className="text-sm text-muted/60 space-y-2 font-mono">
                {problem.constraints.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white/5 p-2 rounded-lg border border-white/5 shadow-inner">
                    <span className="text-primary font-bold">·</span>
                    <span className="text-xs">{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap pt-2">
              {problem.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-muted/60 uppercase font-bold tracking-widest"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Hints */}
            {problem.hints && problem.hints.length > 0 && (
              <div className="pt-4 border-t border-white/5">
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-500/80 hover:text-yellow-400 transition-all group"
                >
                  <Lightbulb className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  {showHints ? "Hide hints" : "Need a hint?"}
                </button>
                {showHints && (
                  <div className="mt-4 space-y-3">
                    {problem.hints.map((hint, i) => (
                      <div
                        key={i}
                        className="text-sm text-muted/70 bg-yellow-500/[0.03] border border-yellow-500/10 rounded-2xl p-4 shadow-lg shadow-yellow-500/5"
                      >
                        {hint}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Solution reveal */}
            <div className="border-t border-white/5 pt-6 pb-20">
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80 hover:text-primary transition-all group"
              >
                <Eye className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                {showSolution ? "Hide solution" : "Release Explanation"}
              </button>
              {showSolution && problem.solution && (
                <div className="mt-4 space-y-4">
                  {problem.patternSentence && (
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5 shadow-xl">
                      <div className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-2 px-1">
                        KEY INSIGHT
                      </div>
                      <p className="text-sm font-medium leading-relaxed italic">{problem.patternSentence}</p>
                    </div>
                  )}
                  <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden p-1 shadow-2xl">
                    <div className="text-[10px] text-muted/40 font-bold uppercase tracking-widest p-3 border-b border-white/5">Solution Code</div>
                    <pre className="p-4 text-xs font-mono overflow-x-auto code-scroll whitespace-pre text-success/70 leading-relaxed">
                      {problem.solution}
                    </pre>
                  </div>
                  {problem.solutionExplanation && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-[10px] text-muted/40 font-bold uppercase tracking-widest mb-2">Walkthrough</div>
                      <p className="text-sm text-muted/80 leading-relaxed">
                        {problem.solutionExplanation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Code editor + output */}
        <div className="flex-1 flex flex-col min-w-0 p-4 gap-4">
          {/* Code editor */}
          <div className="flex-1 min-h-0 bg-background/50 backdrop-blur-sm rounded-2xl shadow-inner">
            <CodeEditor
              initialCode={problem.starterCode}
              onRun={handleRun}
              onReset={() => setResult(null)}
              isRunning={isRunning}
            />
          </div>

          {/* Output panel */}
          <div className="h-[280px] shrink-0 border border-border/50 bg-black/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl">
            <OutputPanel result={result} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const problem = getProblem(id);
  const nextProblem = getNextProblem(id);
  const prevProblem = getPreviousProblem(id);

  if (!problem) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">Problem not found</h1>
        <Link href="/dashboard" className="text-primary mt-4 inline-block">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  const chapter = chapters.find((c) => c.id === problem.chapterId);
  const dc = difficultyConfig[problem.difficulty];

  // Prepare Sandpack files
  const files = {
    "/solution.js": problem.starterCode,
    "/index.js": {
      code: `
        import * as Solution from "./solution.js";
        
        // Console interception logic here if we were using a real Sandpack preview
        // For algorithm problems, we'll mostly use the worker, but keeping Sandpack context
        // allows us to eventually unify them or use Sandpack's more robust bundling.
      `,
      hidden: true
    }
  };

  return (
    <SandpackProvider
      template="node"
      files={files}
      theme="dark"
      customSetup={{
        dependencies: {
          "lucide-react": "latest",
        }
      }}
    >
      <ProblemContent 
        problem={problem}
        nextProblem={nextProblem}
        prevProblem={prevProblem}
        chapter={chapter}
        dc={dc}
        starterCode={problem.starterCode}
        testCases={problem.testCases}
      />
    </SandpackProvider>
  );
}
