"use client";

import { chapters } from "@/lib/curriculum/chapters";
import { getProblemsForChapter, getProblem } from "@/lib/curriculum";
import { sdChapters } from "@/lib/system-design/chapters";
import { getTopicsForChapter, getCaseStudiesForChapter } from "@/lib/system-design";
import { mcChapters } from "@/lib/machine-coding/chapters";
import { getMCProblemsForChapter, getMCProblem } from "@/lib/machine-coding";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ChevronDown, 
  ChevronRight, 
  Home, 
  Layers, 
  Code2, 
  ChevronLeft,
  ChevronsLeft,
  PanelLeftClose,
  PanelLeft
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import XLPALogo from "./XLPALogo";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ 
  isCollapsed, 
  onToggleCollapse, 
  isMobileOpen, 
  onCloseMobile 
}: SidebarProps) {
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
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" 
            onClick={onCloseMobile} 
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={{ 
          width: isCollapsed ? 72 : 260,
          translateX: isMobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 768) ? -260 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0 shrink-0 border-r border-border bg-black/40 backdrop-blur-xl flex flex-col h-full overflow-hidden`}
      >
        <div className={`px-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} border-b border-border/40 mb-2 shrink-0 h-16`}>
          <XLPALogo 
            isCollapsed={isCollapsed} 
            href="/dashboard"
            className={isCollapsed ? "text-xl" : "text-xl"}
          />
          
          <button 
            onClick={onToggleCollapse}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface/50 text-muted hover:text-foreground hover:bg-surface transition-all ${isCollapsed ? 'hidden' : ''}`}
            title="Collapse"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Toggle Button for Collapsed State */}
        {isCollapsed && (
          <button 
            onClick={onToggleCollapse}
            className="flex h-8 w-8 mx-auto items-center justify-center rounded-lg border border-border bg-surface/50 text-muted hover:text-foreground hover:bg-surface transition-all mb-4"
            title="Expand"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}

        <div className="flex-1 overflow-y-auto overflow-x-hidden code-scroll p-3">
          {/* Dashboard link */}
          <Link
            href="/dashboard"
            onClick={onCloseMobile}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/dashboard"
                ? "bg-primary/10 text-primary"
                : "text-muted hover:text-foreground hover:bg-surface-hover"
            } ${isCollapsed ? "justify-center px-2" : ""}`}
            title="Dashboard"
          >
            <Home className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="truncate">Dashboard</span>}
          </Link>

          {/* Machine Coding Module */}
          <div className="mt-6">
            {!isCollapsed ? (
              <div className="text-[10px] font-semibold text-muted/60 uppercase tracking-widest px-3 mb-2 truncate">
                Machine Coding
              </div>
            ) : (
                <div className="h-px bg-border/40 mx-2 mb-4" />
            )}

            {/* MC Overview link */}
            <Link
              href="/machine-coding"
              onClick={onCloseMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 ${
                pathname === "/machine-coding"
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:text-foreground hover:bg-surface-hover"
              } ${isCollapsed ? "justify-center px-2" : ""}`}
              title="MC Overview"
            >
              <Code2 className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate">Overview</span>}
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
                    <div className="flex items-center group">
                      {hasProblems && !isCollapsed ? (
                        <button
                          onClick={() => toggleMCChapter(ch.id)}
                          className="p-1 text-muted/40 hover:text-muted transition-colors shrink-0"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                        </button>
                      ) : !isCollapsed ? (
                        <span className="w-5 shrink-0" />
                      ) : null}
                      <span
                        className={`flex items-center gap-2 flex-1 px-2 py-1.5 text-sm min-w-0 ${
                          chapterHasActiveProblem
                            ? "text-primary font-medium"
                            : "text-foreground/80"
                        } ${isCollapsed ? "justify-center" : ""}`}
                        title={isCollapsed ? ch.title : undefined}
                      >
                        <span className="shrink-0">{ch.icon}</span>
                        {!isCollapsed && <span className="truncate">{ch.title}</span>}
                      </span>
                    </div>

                    {/* Problem list */}
                    {isExpanded && hasProblems && !isCollapsed && (
                      <div className="ml-5 pl-3 border-l border-border/50 mt-0.5 mb-1 space-y-0.5">
                        {problems.map((p) => (
                          <Link
                            key={p.id}
                            href={`/machine-coding/problem/${p.id}`}
                            onClick={onCloseMobile}
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

          {/* Chapters (DSA) */}
          <div className="mt-6">
            {!isCollapsed ? (
              <div className="text-[10px] font-semibold text-muted/60 uppercase tracking-widest px-3 mb-2 truncate">
                DSA
              </div>
            ) : (
                <div className="h-px bg-border/40 mx-2 mb-4" />
            )}
            <nav className="space-y-0.5">
              {chapters.map((ch) => {
                const isExpanded = expandedChapters.has(ch.id);
                const isActive = ch.id === activeChapterId;
                const problems = getProblemsForChapter(ch.id);
                const hasProblems = problems.length > 0;

                return (
                  <div key={ch.id}>
                    {/* Chapter row */}
                    <div className="flex items-center group">
                      {hasProblems && !isCollapsed ? (
                        <button
                          onClick={() => toggleChapter(ch.id)}
                          className="p-1 text-muted/40 hover:text-muted transition-colors shrink-0"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                        </button>
                      ) : !isCollapsed ? (
                        <span className="w-5 shrink-0" />
                      ) : null}

                      <Link
                          href={`/chapter/${ch.slug}`}
                          onClick={onCloseMobile}
                          className={`flex items-center gap-2 flex-1 px-2 py-1.5 rounded-md text-sm transition-colors min-w-0 ${
                            isActive && !activeProblemId
                              ? "text-primary font-medium"
                                : "text-foreground/80 hover:text-foreground hover:bg-surface-hover"
                            } ${isCollapsed ? "justify-center" : ""}`}
                            title={isCollapsed ? ch.title : undefined}
                        >
                          {!isCollapsed ? (
                            <span className="font-mono text-[10px] text-muted/50 shrink-0">
                                {ch.number}
                            </span>
                          ) : (
                                <span className="w-4 h-4 rounded-full border border-border/50 text-[10px] flex items-center justify-center shrink-0">
                                    {ch.number}
                                </span>
                          )}
                          {!isCollapsed && <span className="truncate">{ch.title}</span>}
                        </Link>
                    </div>

                    {/* Problem list */}
                    {isExpanded && hasProblems && !isCollapsed && (
                      <div className="ml-5 pl-3 border-l border-border/50 mt-0.5 mb-1 space-y-0.5">
                        {problems.map((p) => (
                          <Link
                            key={p.id}
                            href={`/problem/${p.id}`}
                            onClick={onCloseMobile}
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
          <div className="mt-6">
            {!isCollapsed ? (
              <div className="text-[10px] font-semibold text-muted/60 uppercase tracking-widest px-3 mb-2 truncate">
                System Design
              </div>
            ) : (
                <div className="h-px bg-border/40 mx-2 mb-4" />
            )}

            {/* SD Dashboard link */}
            <Link
              href="/system-design"
              onClick={onCloseMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 ${
                pathname === "/system-design"
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:text-foreground hover:bg-surface-hover"
              } ${isCollapsed ? "justify-center px-2" : ""}`}
              title="SD Overview"
            >
              <Layers className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate">Overview</span>}
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
                    <div className="flex items-center group">
                      {hasTopics && !isCollapsed ? (
                        <button
                          onClick={() => toggleSDChapter(ch.id)}
                          className="p-1 text-muted/40 hover:text-muted transition-colors shrink-0"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                        </button>
                      ) : !isCollapsed ? (
                        <span className="w-5 shrink-0" />
                      ) : null}
                      <span
                        className={`flex items-center gap-2 flex-1 px-2 py-1.5 text-sm min-w-0 ${
                          chapterHasActiveTopic
                            ? "text-primary font-medium"
                            : "text-foreground/80"
                        } ${isCollapsed ? "justify-center" : ""}`}
                        title={isCollapsed ? ch.title : undefined}
                      >
                        <span className="shrink-0">{ch.icon}</span>
                        {!isCollapsed && <span className="truncate">{ch.title}</span>}
                      </span>
                    </div>

                    {/* Topic list */}
                    {isExpanded && hasTopics && !isCollapsed && (
                      <div className="ml-5 pl-3 border-l border-border/50 mt-0.5 mb-1 space-y-0.5">
                        {topics.map((t) => {
                          const href = isCaseStudyChapter
                            ? `/system-design/case-study/${t.id}`
                            : `/system-design/topic/${t.id}`;
                          return (
                            <Link
                              key={t.id}
                              href={href}
                              onClick={onCloseMobile}
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
      </motion.aside>
    </>
  );
}
