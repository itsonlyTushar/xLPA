"use client";

import { mcChapters } from "@/lib/machine-coding/chapters";
import { getMCProblemsForChapter, getTotalMCProblems } from "@/lib/machine-coding";
import Link from "next/link";
import { ArrowRight, BookOpen, Code2, GraduationCap } from "lucide-react";

const difficultyColor: Record<string, string> = {
  easy: "text-green-400 bg-green-400/10",
  medium: "text-yellow-400 bg-yellow-400/10",
  hard: "text-red-400 bg-red-400/10",
};

export default function MachineCodingPage() {
  const totalProblems = getTotalMCProblems();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium mb-4">
          <Code2 className="w-3 h-3" />
          Machine Coding
        </div>
        <h1 className="text-3xl font-bold">Machine Coding Interview Prep</h1>
        <p className="text-muted mt-2">
          {mcChapters.length} chapters · {totalProblems} problems — Build
          real-world React components in a live IDE
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="text-2xl font-bold">{totalProblems}</div>
          <div className="text-sm text-muted">Problems</div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="text-2xl font-bold flex items-center gap-1">
            <GraduationCap className="w-5 h-5 text-blue-400" />
            {mcChapters.length}
          </div>
          <div className="text-sm text-muted">Chapters</div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="text-2xl font-bold">React</div>
          <div className="text-sm text-muted">Live IDE</div>
        </div>
      </div>

      {/* Chapter cards */}
      <div className="space-y-3">
        {mcChapters.map((ch) => {
          const problems = getMCProblemsForChapter(ch.id);

          return (
            <div
              key={ch.id}
              className="rounded-xl border border-border bg-surface hover:border-primary/30 transition-colors group"
            >
              {/* Chapter header */}
              <div className="flex items-center gap-5 p-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0 group-hover:bg-primary/20 transition-colors">
                  {ch.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted">
                      CH.{ch.number}
                    </span>
                    <h3 className="font-semibold">{ch.title}</h3>
                  </div>
                  <p className="text-sm text-muted mt-0.5 line-clamp-1">
                    {ch.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {ch.problemCount} problems
                    </span>
                  </div>
                </div>
              </div>

              {/* Problem list */}
              <div className="border-t border-border/50 px-5 py-3">
                <div className="grid gap-1">
                  {problems.map((p) => (
                    <Link
                      key={p.id}
                      href={`/machine-coding/problem/${p.id}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-surface-hover transition-colors group/item"
                    >
                      <span className="text-xs font-mono text-muted/50 w-5 text-right shrink-0">
                        {p.order}
                      </span>
                      <span className="flex-1 truncate">{p.title}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${difficultyColor[p.difficulty]}`}
                      >
                        {p.difficulty}
                      </span>
                      <ArrowRight className="w-3 h-3 text-muted opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Why machine coding callout */}
      <div className="mt-12 bg-surface border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-2">Why Machine Coding?</h3>
        <p className="text-sm text-muted leading-relaxed">
          Machine coding rounds test your ability to build functional,
          production-quality React components under time pressure. Unlike
          algorithmic rounds, these focus on real-world frontend skills:
          component design, state management, event handling, and clean UI
          patterns. Each problem here gives you a live IDE with React — write
          code, see instant previews, and run tests to validate your solution.
        </p>
      </div>
    </div>
  );
}
