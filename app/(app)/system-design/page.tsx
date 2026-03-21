"use client";

import { sdChapters } from "@/lib/system-design/chapters";
import {
  getTopicsForChapter,
  getCaseStudiesForChapter,
  getTotalSDTopics,
  getTotalCaseStudies,
} from "@/lib/system-design";
import Link from "next/link";
import { ArrowRight, BookOpen, Layers, GraduationCap } from "lucide-react";

const difficultyColor: Record<string, string> = {
  beginner: "text-green-400 bg-green-400/10",
  intermediate: "text-blue-400 bg-blue-400/10",
  advanced: "text-red-400 bg-red-400/10",
};

export default function SystemDesignPage() {
  const totalTopics = getTotalSDTopics();
  const totalCases = getTotalCaseStudies();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium mb-4">
          <Layers className="w-3 h-3" />
          System Design (HLD)
        </div>
        <h1 className="text-3xl font-bold">System Design Interview Prep</h1>
        <p className="text-muted mt-2">
          {sdChapters.length} chapters · {totalTopics} topics · {totalCases}{" "}
          case studies — Master the building blocks of large-scale systems
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="text-2xl font-bold">{totalTopics}</div>
          <div className="text-sm text-muted">Concept Topics</div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="text-2xl font-bold flex items-center gap-1">
            <GraduationCap className="w-5 h-5 text-blue-400" />
            {totalCases}
          </div>
          <div className="text-sm text-muted">Case Studies</div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="text-2xl font-bold">{sdChapters.length}</div>
          <div className="text-sm text-muted">Chapters</div>
        </div>
      </div>

      {/* Chapter cards */}
      <div className="space-y-3">
        {sdChapters.map((ch) => {
          const isCaseStudyChapter = ch.id === 8;
          const topics = isCaseStudyChapter
            ? []
            : getTopicsForChapter(ch.id);
          const cases = isCaseStudyChapter
            ? getCaseStudiesForChapter(ch.id)
            : [];
          const items = isCaseStudyChapter ? cases : topics;

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
                      {ch.topicCount}{" "}
                      {isCaseStudyChapter ? "case studies" : "topics"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Topic / case study list */}
              <div className="border-t border-border/50 px-5 py-3">
                <div className="grid gap-1">
                  {items.map((item) => {
                    const href = isCaseStudyChapter
                      ? `/system-design/case-study/${item.id}`
                      : `/system-design/topic/${item.id}`;
                    return (
                      <Link
                        key={item.id}
                        href={href}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-surface-hover transition-colors group/item"
                      >
                        <span className="text-xs font-mono text-muted/50 w-5 text-right shrink-0">
                          {item.order}
                        </span>
                        <span className="flex-1 truncate">{item.title}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${difficultyColor[item.difficulty]}`}
                        >
                          {item.difficulty}
                        </span>
                        <ArrowRight className="w-3 h-3 text-muted opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Why system design callout */}
      <div className="mt-12 bg-surface border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-2">Why System Design?</h3>
        <p className="text-sm text-muted leading-relaxed">
          System design interviews test your ability to build scalable,
          reliable, and efficient architectures. Unlike DSA rounds that focus on
          algorithmic thinking, HLD rounds evaluate your understanding of
          distributed systems, trade-offs, and real-world engineering decisions.
          Start with fundamentals, then tackle case studies to build
          interview-ready confidence.
        </p>
      </div>
    </div>
  );
}
