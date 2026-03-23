"use client";

import { chapters } from "@/lib/curriculum/chapters";
import { getProblemsForChapter, getProblem } from "@/lib/curriculum";
import { sdChapters } from "@/lib/system-design/chapters";
import { getTopicsForChapter, getCaseStudiesForChapter } from "@/lib/system-design";
import { mcChapters } from "@/lib/machine-coding/chapters";
import { getMCProblemsForChapter, getMCProblem } from "@/lib/machine-coding";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Home, Layers, Code2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

export default function Sidebar() {
  const pathname = usePathname();

  const activeChapterSlug = useMemo(() => {
    const match = pathname.match(/\/chapter\/([^/]+)/);
    return match ? match[1] : null;
  }, [pathname]);

  const activeProblemId = useMemo(() => {
    const match = pathname.match(/\/problem\/([^/]+)/);
    return match ? match[1] : null;
  }, [pathname]);

  const activeSDTopicId = useMemo(() => {
    const match = pathname.match(/\/system-design\/(?:topic|case-study)\/([^/]+)/);
    return match ? match[1] : null;
  }, [pathname]);

  const activeMCProblemId = useMemo(() => {
    const match = pathname.match(/\/machine-coding\/problem\/([^/]+)/);
    return match ? match[1] : null;
  }, [pathname]);

  const activeChapterId = useMemo(() => {
    if (activeChapterSlug) {
      const ch = chapters.find((c) => c.slug === activeChapterSlug);
      return ch?.id ?? null;
    }
    if (activeProblemId) {
      const problem = getProblem(activeProblemId);
      return problem?.chapterId ?? null;
    }
    return null;
  }, [activeChapterSlug, activeProblemId]);

  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(
    activeChapterId ? new Set([activeChapterId]) : new Set()
  );
  const [expandedSDChapters, setExpandedSDChapters] = useState<Set<number>>(
    new Set()
  );
  const [expandedMCChapters, setExpandedMCChapters] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    if (activeChapterId) {
      setExpandedChapters((prev) => {
        if (prev.has(activeChapterId)) return prev;
        return new Set([...prev, activeChapterId]);
      });
    }
  }, [activeChapterId]);

  // Auto-expand the MC chapter containing the active problem
  useEffect(() => {
    if (activeMCProblemId) {
      const problem = getMCProblem(activeMCProblemId);
      if (problem) {
        setExpandedMCChapters((prev) => {
          if (prev.has(problem.chapterId)) return prev;
          return new Set([...prev, problem.chapterId]);
        });
      }
    }
  }, [activeMCProblemId]);

  // Auto-expand the SD chapter containing the active topic
  useEffect(() => {
    if (activeSDTopicId) {
      for (const ch of sdChapters) {
        const topics = ch.id === 8
          ? getCaseStudiesForChapter(ch.id)
          : getTopicsForChapter(ch.id);
        if (topics.some((t) => t.id === activeSDTopicId)) {
          setExpandedSDChapters((prev) => {
            if (prev.has(ch.id)) return prev;
            return new Set([...prev, ch.id]);
          });
          break;
        }
      }
    }
  }, [activeSDTopicId]);

  const toggleChapter = (id: number) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSDChapter = (id: number) => {
    setExpandedSDChapters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleMCChapter = (id: number) => {
    setExpandedMCChapters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isSDActive = pathname.startsWith("/system-design");

  return (
    <aside className="w-[240px] shrink-0 border-r border-border bg-surface/50 overflow-y-auto code-scroll">
      <div className="p-3">
        {/* Dashboard link */}
        <Link
          href="/dashboard"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            pathname === "/dashboard"
              ? "bg-primary/10 text-primary"
              : "text-muted hover:text-foreground hover:bg-surface-hover"
          }`}
        >
          <Home className="w-4 h-4" />
          Dashboard
        </Link>

        {/* Machine Coding Module */}
        <div className="mt-5">
          <div className="text-[10px] font-semibold text-muted/60 uppercase tracking-widest px-3 mb-2">
            Machine Coding
          </div>

          {/* MC Overview link */}
          <Link
            href="/machine-coding"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 ${
              pathname === "/machine-coding"
                ? "bg-primary/10 text-primary"
                : "text-muted hover:text-foreground hover:bg-surface-hover"
            }`}
          >
            <Code2 className="w-4 h-4" />
            Overview
          </Link>

          <nav className="space-y-0.5">
            {mcChapters.map((ch) => {
              const problems = getMCProblemsForChapter(ch.id);
              const isExpanded = expandedMCChapters.has(ch.id);
              const hasProblems = problems.length > 0;
              const chapterHasActiveProblem =
                activeMCProblemId && problems.some((p) => p.id === activeMCProblemId);

              return (
                <div key={ch.id}>
                  {/* Chapter row */}
                  <div className="flex items-center">
                    {hasProblems ? (
                      <button
                        onClick={() => toggleMCChapter(ch.id)}
                        className="p-1 text-muted/40 hover:text-muted transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronRight className="w-3 h-3" />
                        )}
                      </button>
                    ) : (
                      <span className="w-5 shrink-0" />
                    )}
                    <span
                      className={`flex items-center gap-2 flex-1 px-2 py-1.5 text-sm min-w-0 ${
                        chapterHasActiveProblem
                          ? "text-primary font-medium"
                          : "text-foreground/80"
                      }`}
                    >
                      <span className="shrink-0">{ch.icon}</span>
                      <span className="truncate">{ch.title}</span>
                    </span>
                  </div>

                  {/* Problem list */}
                  {isExpanded && hasProblems && (
                    <div className="ml-5 pl-3 border-l border-border/50 mt-0.5 mb-1 space-y-0.5">
                      {problems.map((p) => (
                        <Link
                          key={p.id}
                          href={`/machine-coding/problem/${p.id}`}
                          className={`block px-2 py-1 rounded-md text-xs transition-colors truncate ${
                            activeMCProblemId === p.id
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted hover:text-foreground hover:bg-surface-hover"
                          }`}
                          title={p.title}
                        >
                          {p.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Chapter navigation */}
        <div className="mt-5">
          <div className="text-[10px] font-semibold text-muted/60 uppercase tracking-widest px-3 mb-2">
            DSA - Data Structures & Algorithms
          </div>
          <nav className="space-y-0.5">
            {chapters.map((ch) => {
              const isExpanded = expandedChapters.has(ch.id);
              const isActive = ch.id === activeChapterId;
              const problems = getProblemsForChapter(ch.id);
              const hasProblems = problems.length > 0;

              return (
                <div key={ch.id}>
                  {/* Chapter row */}
                  <div className="flex items-center">
                    {hasProblems ? (
                      <button
                        onClick={() => toggleChapter(ch.id)}
                        className="p-1 text-muted/40 hover:text-muted transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronRight className="w-3 h-3" />
                        )}
                      </button>
                    ) : (
                      <span className="w-5 shrink-0" />
                    )}

                    <Link
                        href={`/chapter/${ch.slug}`}
                        className={`flex items-center gap-2 flex-1 px-2 py-1.5 rounded-md text-sm transition-colors min-w-0 ${
                          isActive && !activeProblemId
                            ? "text-primary font-medium"
                            : "text-foreground/80 hover:text-foreground hover:bg-surface-hover"
                        }`}
                      >
                        <span className="font-mono text-[10px] text-muted/50 shrink-0">
                          {ch.number}
                        </span>
                        <span className="truncate">{ch.title}</span>
                      </Link>
                  </div>

                  {/* Problem list */}
                  {isExpanded && hasProblems && (
                    <div className="ml-5 pl-3 border-l border-border/50 mt-0.5 mb-1 space-y-0.5">
                      {problems.map((p) => (
                        <Link
                          key={p.id}
                          href={`/problem/${p.id}`}
                          className={`block px-2 py-1 rounded-md text-xs transition-colors truncate ${
                            activeProblemId === p.id
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted hover:text-foreground hover:bg-surface-hover"
                          }`}
                          title={p.title}
                        >
                          {p.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* System Design Module */}
        <div className="mt-5">
          <div className="text-[10px] font-semibold text-muted/60 uppercase tracking-widest px-3 mb-2">
            System Design
          </div>

          {/* SD Dashboard link */}
          <Link
            href="/system-design"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 ${
              pathname === "/system-design"
                ? "bg-primary/10 text-primary"
                : "text-muted hover:text-foreground hover:bg-surface-hover"
            }`}
          >
            <Layers className="w-4 h-4" />
            Overview
          </Link>

          <nav className="space-y-0.5">
            {sdChapters.map((ch) => {
              const isCaseStudyChapter = ch.id === 8;
              const topics = isCaseStudyChapter
                ? getCaseStudiesForChapter(ch.id)
                : getTopicsForChapter(ch.id);
              const isExpanded = expandedSDChapters.has(ch.id);
              const hasTopics = topics.length > 0;
              const chapterHasActiveTopic =
                activeSDTopicId && topics.some((t) => t.id === activeSDTopicId);

              return (
                <div key={ch.id}>
                  {/* Chapter row */}
                  <div className="flex items-center">
                    {hasTopics ? (
                      <button
                        onClick={() => toggleSDChapter(ch.id)}
                        className="p-1 text-muted/40 hover:text-muted transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronRight className="w-3 h-3" />
                        )}
                      </button>
                    ) : (
                      <span className="w-5 shrink-0" />
                    )}
                    <span
                      className={`flex items-center gap-2 flex-1 px-2 py-1.5 text-sm min-w-0 ${
                        chapterHasActiveTopic
                          ? "text-primary font-medium"
                          : "text-foreground/80"
                      }`}
                    >
                      <span className="shrink-0">{ch.icon}</span>
                      <span className="truncate">{ch.title}</span>
                    </span>
                  </div>

                  {/* Topic list */}
                  {isExpanded && hasTopics && (
                    <div className="ml-5 pl-3 border-l border-border/50 mt-0.5 mb-1 space-y-0.5">
                      {topics.map((t) => {
                        const href = isCaseStudyChapter
                          ? `/system-design/case-study/${t.id}`
                          : `/system-design/topic/${t.id}`;
                        return (
                          <Link
                            key={t.id}
                            href={href}
                            className={`block px-2 py-1 rounded-md text-xs transition-colors truncate ${
                              activeSDTopicId === t.id
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted hover:text-foreground hover:bg-surface-hover"
                            }`}
                            title={t.title}
                          >
                            {t.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
