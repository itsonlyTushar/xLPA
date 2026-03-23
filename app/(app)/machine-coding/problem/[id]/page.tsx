"use client";

import { use, useState, useEffect } from "react";
import {
  getMCProblem,
  getNextMCProblem,
  getPreviousMCProblem,
  getMCChapter,
} from "@/lib/machine-coding";
import ReactIDE from "@/components/ReactIDE";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  Clock,
  Eye,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Layout,
  FileText,
  HelpCircle,
  PlayCircle,
  Trophy,
  History,
  MoreVertical,
} from "lucide-react";

const difficultyColor: Record<string, string> = {
  easy: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
  medium: "text-amber-400 border-amber-400/20 bg-amber-400/5",
  hard: "text-rose-400 border-rose-400/20 bg-rose-400/5",
};

export default function MCProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const problem = getMCProblem(id);
  const nextProblem = getNextMCProblem(id);
  const prevProblem = getPreviousMCProblem(id);

  const [activeSideTab, setActiveSideTab] = useState<
    "description" | "hints" | "solution"
  >("description");
  const [showSolution, setShowSolution] = useState(false);

  if (!problem) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Problem not found
        </h1>
        <Link
          href="/machine-coding"
          className="text-primary mt-4 inline-block hover:underline"
        >
          ← Back to Machine Coding
        </Link>
      </div>
    );
  }

  const chapter = getMCChapter(problem.chapterId);
  const dc = difficultyColor[problem.difficulty];

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-[#000]">
      {/* Premium Workspace Header */}
      <header className="flex items-center justify-between px-6 h-14 border-b border-white/5 bg-black/40 backdrop-blur-xl shrink-0 z-20">
        <div className="flex items-center gap-6 min-w-0">
          <Link
            href="/machine-coding"
            className="group flex items-center gap-2 text-muted hover:text-foreground transition-all"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold tracking-wide uppercase hidden sm:inline">
              Directory
            </span>
          </Link>

          <div className="h-6 w-px bg-white/10" />

          <div className="flex items-center gap-4 min-w-0">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-primary/70 uppercase tracking-widest leading-none">
                  {chapter ? `Chapter ${chapter.number}` : "Machine Coding"}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-tighter shrink-0 ${dc}`}
                >
                  {problem.difficulty}
                </span>
              </div>
              <h1 className="font-bold text-base text-foreground truncate max-w-[300px] leading-tight mt-0.5">
                {problem.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="hidden md:flex items-center gap-4 text-xs text-muted/60 mr-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              {problem.timeEstimate}
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-zinc-500" />
              150 Points
            </span>
          </div>

          <div className="flex items-center bg-white/5 rounded-xl border border-white/5 p-1 h-10">
            <Link
              href={
                prevProblem ? `/machine-coding/problem/${prevProblem.id}` : "#"
              }
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
                prevProblem
                  ? "text-foreground hover:bg-white/5"
                  : "text-muted/20 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <Link
              href={
                nextProblem ? `/machine-coding/problem/${nextProblem.id}` : "#"
              }
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
                nextProblem
                  ? "text-foreground hover:bg-white/5"
                  : "text-muted/20 cursor-not-allowed"
              }`}
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/5 text-muted hover:text-foreground hover:bg-white/10 transition-all">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Vertical Tab Bar */}
        <aside className="w-14 shrink-0 border-r border-white/5 flex flex-col items-center py-4 bg-black/40 z-10">
          {[
            { id: "description", icon: FileText, label: "Info" },
            { id: "hints", icon: HelpCircle, label: "Hints" },
            { id: "solution", icon: Eye, label: "Solution" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSideTab(tab.id as any)}
              title={tab.label}
              className={`relative flex items-center justify-center w-10 h-10 rounded-xl mb-4 transition-all group ${
                activeSideTab === tab.id
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(220,38,38,0.1)]"
                  : "text-muted/60 hover:text-foreground hover:bg-white/5"
              }`}
            >
              <tab.icon
                className={`w-5 h-5 ${activeSideTab === tab.id ? "scale-110" : "group-hover:scale-110"} transition-transform`}
              />
              {activeSideTab === tab.id && (
                <div className="absolute -left-1 w-1 h-5 bg-primary rounded-full" />
              )}
            </button>
          ))}

          <div className="mt-auto flex flex-col items-center gap-4">
            <button
              title="History"
              className="text-muted/40 hover:text-foreground transition-colors"
            >
              <History className="w-5 h-5" />
            </button>
            <button
              title="Layout"
              className="text-muted/40 hover:text-foreground transition-colors"
            >
              <Layout className="w-5 h-5" />
            </button>
          </div>
        </aside>

        {/* Dynamic Left Pane */}
        <div className="w-[380px] shrink-0 bg-[#050505] overflow-y-auto code-scroll border-r border-white/5 animate-in slide-in-from-left duration-300">
          <div className="p-8 pb-20">
            {activeSideTab === "description" && (
              <div className="space-y-8">
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-4 bg-primary rounded-full" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                      Requirement Analysis
                    </h3>
                  </div>
                  <div className="prose prose-invert prose-sm">
                    <p className="text-zinc-400 leading-relaxed text-[15px]">
                      {problem.description}
                    </p>
                  </div>
                </section>

                <section>
                  <h4 className="text-xs font-bold text-foreground mb-4 flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded bg-foreground/5 text-foreground/50 border border-foreground/10 text-[10px]">
                      01
                    </span>
                    Functional requirements
                  </h4>
                  <ul className="space-y-3">
                    {problem.requirements.map((req, i) => (
                      <li
                        key={i}
                        className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all"
                      >
                        <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 group-hover:bg-primary transition-colors" />
                        <span className="text-zinc-400 text-sm leading-relaxed">
                          {req}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                <div className="flex flex-wrap gap-2 pt-4">
                  {problem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold tracking-tight uppercase bg-white/5 border border-white/10 px-3 py-1 rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeSideTab === "hints" && (
              <div className="space-y-6">
                <div className="p-6 rounded-[2rem] bg-amber-400/5 border border-amber-400/10 mb-8 overflow-hidden relative group">
                  <div className="absolute -top-12 -right-12 w-24 h-24 bg-amber-400/10 rounded-full blur-3xl group-hover:bg-amber-400/20 transition-all" />
                  <Lightbulb className="w-10 h-10 text-amber-500 mb-4" />
                  <h3 className="text-xl font-bold text-amber-500 mb-2">
                    Need a push?
                  </h3>
                  <p className="text-sm text-amber-500/60 leading-relaxed">
                    Stuck on the implementation? Here are some conceptual
                    breadcrumbs to lead you to the solution.
                  </p>
                </div>

                <div className="space-y-4">
                  {problem.hints.length > 0 ? (
                    problem.hints.map((hint, i) => (
                      <div
                        key={i}
                        className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.07] transition-all"
                      >
                        <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 opacity-60">
                          Hint {i + 1}
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed">
                          {hint}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted text-center py-10 italic">
                      No hints available for this challenge yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeSideTab === "solution" && (
              <div className="space-y-6">
                {!showSolution ? (
                  <div className="p-10 text-center rounded-[3rem] bg-white/[0.02] border-2 border-dashed border-white/5">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                      <PlayCircle className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Unlock Solution</h3>
                    <p className="text-sm text-muted mb-8 max-w-xs mx-auto">
                      Reviewing the solution is best after attempting the
                      challenge. Are you ready to see the implementation?
                    </p>
                    <button
                      onClick={() => setShowSolution(true)}
                      className="px-8 py-3 bg-primary text-white font-bold rounded-2xl text-sm hover:scale-105 transition-transform active:scale-95 shadow-[0_10px_40px_rgba(220,38,38,0.3)]"
                    >
                      Reveal Implementation
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {problem.keyInsight && (
                      <div className="p-6 bg-emerald-400/5 border border-emerald-400/10 rounded-2xl">
                        <div className="flex items-center gap-2 text-emerald-400 mb-3">
                          <Trophy className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                            Key Insight
                          </span>
                        </div>
                        <p className="text-sm text-emerald-400/80 leading-relaxed">
                          {problem.keyInsight}
                        </p>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest opacity-50">
                          Reference Code
                        </h4>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "This will replace your current code with the solution. Continue?",
                              )
                            ) {
                              // Handled by user manually via copy-paste for now or add a custom solution bridge
                            }
                          }}
                          className="text-[10px] font-bold text-primary hover:underline"
                        >
                          COPY TO EDITOR
                        </button>
                      </div>
                      <div className="relative group">
                        <pre className="bg-[#0D0D0D] border border-white/5 text-emerald-400/90 rounded-2xl p-6 text-[13px] font-mono overflow-auto code-scroll leading-relaxed max-h-[500px]">
                          {problem.solution}
                        </pre>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none rounded-2xl" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: ReactIDE Container */}
        <div className="flex-1 min-w-0 bg-black">
          <ReactIDE
            initialCode={problem.starterCode}
            testCases={problem.testCases}
          />
        </div>
      </div>
    </div>
  );
}
