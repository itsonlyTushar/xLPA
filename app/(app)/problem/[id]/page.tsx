"use client";

import { use, useState, useCallback } from "react";
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

const difficultyConfig = {
  warmup: { label: "Warmup", class: "badge-warmup" },
  core: { label: "Core", class: "badge-core" },
  challenge: { label: "Challenge", class: "badge-challenge" },
  "real-world": { label: "Real-World", class: "badge-real-world" },
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
  const { run } = useCodeRunner();

  const [result, setResult] = useState<RunResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showDescription, setShowDescription] = useState(true);

  const handleRun = useCallback(
    async (code: string) => {
      if (!problem) return;
      setIsRunning(true);
      const res = await run(code, problem.testCases);
      setResult(res);
      setIsRunning(false);
    },
    [run, problem]
  );

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
          <h1 className="font-semibold truncate">{problem.title}</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${dc.class}`}>
            {dc.label}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-3 text-xs text-muted shrink-0">
          {problem.timeComplexity && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {problem.timeComplexity}
            </span>
          )}
          {problem.spaceComplexity && (
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3" />
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
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Problem description */}
        <div className="w-[380px] shrink-0 border-r border-border overflow-y-auto code-scroll">
          <div className="p-5 space-y-5">
            {/* Description */}
            <div>
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="flex items-center gap-1 text-sm font-semibold mb-2 text-foreground"
              >
                {showDescription ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
                Description
              </button>
              {showDescription && (
                <p className="text-sm text-muted leading-relaxed">
                  {problem.description}
                </p>
              )}
            </div>

            {/* Examples */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Examples</h3>
              <div className="space-y-3">
                {problem.examples.map((ex, i) => (
                  <div
                    key={i}
                    className="bg-background border border-border rounded-lg p-3"
                  >
                    <div className="text-xs text-muted mb-1">Example {i + 1}</div>
                    <div className="font-mono text-sm">
                      <div>
                        <span className="text-muted">Input: </span>
                        <span className="text-blue-400">{ex.input}</span>
                      </div>
                      <div>
                        <span className="text-muted">Output: </span>
                        <span className="text-green-400">{ex.output}</span>
                      </div>
                      {ex.explanation && (
                        <div className="text-xs text-muted mt-1">
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
              <h3 className="text-sm font-semibold mb-2">Constraints</h3>
              <ul className="text-sm text-muted space-y-1">
                {problem.constraints.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary">·</span>
                    <span className="font-mono text-xs">{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              {problem.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-border/30 px-2 py-0.5 rounded text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Hints */}
            {problem.hints && problem.hints.length > 0 && (
              <div>
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center gap-1.5 text-sm text-yellow-500 hover:text-yellow-400 transition-colors"
                >
                  <Lightbulb className="w-4 h-4" />
                  {showHints ? "Hide hints" : "Need a hint?"}
                </button>
                {showHints && (
                  <div className="mt-2 space-y-2">
                    {problem.hints.map((hint, i) => (
                      <div
                        key={i}
                        className="text-sm text-muted bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-3"
                      >
                        {hint}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Solution reveal */}
            <div className="border-t border-border pt-4">
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-hover transition-colors"
              >
                <Eye className="w-4 h-4" />
                {showSolution ? "Hide solution" : "Release Explanation"}
              </button>
              {showSolution && problem.solution && (
                <div className="mt-3 space-y-3">
                  {problem.patternSentence && (
                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                      <div className="text-xs text-primary font-semibold mb-1">
                        KEY INSIGHT
                      </div>
                      <p className="text-sm">{problem.patternSentence}</p>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-muted mb-1">Solution Code</div>
                    <pre className="bg-background border border-border rounded-lg p-3 text-sm font-mono overflow-x-auto code-scroll whitespace-pre-wrap">
                      {problem.solution}
                    </pre>
                  </div>
                  {problem.solutionExplanation && (
                    <div>
                      <div className="text-xs text-muted mb-1">Walkthrough</div>
                      <p className="text-sm text-muted leading-relaxed">
                        {problem.solutionExplanation}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-4 text-xs text-muted">
                    {problem.timeComplexity && (
                      <span>
                        Time: <b className="text-foreground">{problem.timeComplexity}</b>
                      </span>
                    )}
                    {problem.spaceComplexity && (
                      <span>
                        Space: <b className="text-foreground">{problem.spaceComplexity}</b>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Next Problem navigation */}
            {nextProblem && (
              <div className="border-t border-border pt-4">
                <Link
                  href={`/problem/${nextProblem.id}`}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 hover:border-primary/40 transition-all group"
                >
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-wider text-muted mb-0.5">
                      Next Problem
                    </div>
                    <div className="text-sm font-medium truncate">
                      {nextProblem.title}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Code editor + output */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Code editor */}
          <div className="flex-1 min-h-0">
            <CodeEditor
              initialCode={problem.starterCode}
              onRun={handleRun}
              onReset={() => setResult(null)}
              isRunning={isRunning}
            />
          </div>

          {/* Output panel */}
          <div className="h-[240px] shrink-0 border-t border-border bg-surface">
            <OutputPanel result={result} />
          </div>
        </div>
      </div>
    </div>
  );
}
