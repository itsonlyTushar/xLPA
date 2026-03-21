"use client";

import { chapters } from "@/lib/curriculum/chapters";
import { mcChapters } from "@/lib/machine-coding/chapters";
import { getTotalMCProblems } from "@/lib/machine-coding";
import { sdChapters } from "@/lib/system-design/chapters";
import { getTotalSDTopics, getTotalCaseStudies } from "@/lib/system-design";
import Link from "next/link";
import {
  Lock,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Trophy,
  Code2,
  Layers,
  Flame,
  Clock,
  Target,
  TrendingUp,
  Zap,
  BarChart3,
  FileCode2,
  Server,
} from "lucide-react";

/* ─── SVG ring chart ─── */
function RadialProgress({
  value,
  max,
  size = 120,
  strokeWidth = 10,
  color = "#dc2626",
  trackColor = "#262626",
  label,
  sublabel,
}: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  sublabel?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = max > 0 ? value / max : 0;
  const offset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-xl font-bold">{Math.round(pct * 100)}%</span>
        {sublabel && <span className="text-[10px] text-muted">{sublabel}</span>}
      </div>
      {label && <span className="text-xs text-muted mt-2">{label}</span>}
    </div>
  );
}

/* ─── Mini bar chart (SVG) ─── */
function MiniBarChart({
  data,
  color = "#dc2626",
  height = 60,
}: {
  data: { label: string; value: number; max: number }[];
  color?: string;
  height?: number;
}) {
  const barWidth = 100 / data.length;
  return (
    <svg viewBox={`0 0 ${data.length * 32} ${height}`} className="w-full" preserveAspectRatio="none">
      {data.map((d, i) => {
        const barH = d.max > 0 ? (d.value / d.max) * (height - 8) : 0;
        return (
          <g key={i}>
            <rect
              x={i * 32 + 4}
              y={0}
              width={24}
              height={height - 8}
              rx={4}
              fill="#1a1a1a"
            />
            <rect
              x={i * 32 + 4}
              y={height - 8 - barH}
              width={24}
              height={barH}
              rx={4}
              fill={color}
              opacity={0.85}
              style={{ transition: "height 0.4s ease, y 0.4s ease" }}
            />
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Activity heatmap (last 12 weeks) ─── */
function ActivityHeatmap() {
  // Placeholder data — replace with real attempt data from Supabase
  const weeks = 12;
  const days = 7;
  const cells: number[][] = [];
  for (let w = 0; w < weeks; w++) {
    const week: number[] = [];
    for (let d = 0; d < days; d++) {
      week.push(0); // 0 = no activity
    }
    cells.push(week);
  }

  const intensityColors = ["#111", "#2d1515", "#5c1a1a", "#991b1b", "#dc2626"];

  return (
    <div className="flex gap-[3px]">
      {cells.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {week.map((count, di) => (
            <div
              key={di}
              className="w-3 h-3 rounded-sm"
              title={`${count} problems`}
              style={{
                backgroundColor:
                  intensityColors[Math.min(count, intensityColors.length - 1)],
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── Progress bar ─── */
function ProgressBar({
  value,
  max,
  color = "bg-primary",
}: {
  value: number;
  max: number;
  color?: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full bg-border/50 rounded-full h-2 overflow-hidden">
      <div
        className={`h-full rounded-full ${color} transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// Status for all DSA chapters – in production this comes from Supabase
const userChapterStatus: Record<number, "locked" | "active" | "completed"> = Object.fromEntries(
  Array.from({ length: 18 }, (_, i) => [i + 1, i === 0 ? "active" : "locked"])
) as Record<number, "locked" | "active" | "completed">;
userChapterStatus[1] = "active";

export default function DashboardPage() {
  const totalDSAProblems = chapters.reduce((s, c) => s + c.problemCount, 0);
  const totalMCProblems = getTotalMCProblems();
  const totalSDTopics = getTotalSDTopics();
  const totalCaseStudies = getTotalCaseStudies();
  const totalAllProblems = totalDSAProblems + totalMCProblems;

  // Simulated user stats — replace with Supabase data
  const solvedDSA = 0;
  const solvedMC = 0;
  const solvedSD = 0;
  const currentStreak = 0;
  const bestStreak = 0;
  const totalSolved = solvedDSA + solvedMC + solvedSD;

  // Per-chapter solved counts (placeholder)
  const chapterSolved: Record<number, number> = {};
  chapters.forEach((ch) => { chapterSolved[ch.id] = 0; });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* ─── HEADER ─── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted mt-1">
          Track your progress across all {chapters.length + mcChapters.length + sdChapters.length} chapters
        </p>
      </div>

      {/* ─── TOP STATS ROW ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card: Total Solved */}
        <div className="bg-surface border border-border rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold">{totalSolved}<span className="text-sm font-normal text-muted">/{totalAllProblems}</span></div>
            <div className="text-xs text-muted">Problems Solved</div>
          </div>
        </div>

        {/* Card: Current Streak */}
        <div className="bg-surface border border-border rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">{currentStreak} <span className="text-sm font-normal text-muted">days</span></div>
            <div className="text-xs text-muted">Current Streak</div>
          </div>
        </div>

        {/* Card: Study Time */}
        <div className="bg-surface border border-border rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">0<span className="text-sm font-normal text-muted"> hrs</span></div>
            <div className="text-xs text-muted">Total Study Time</div>
          </div>
        </div>

        {/* Card: Accuracy */}
        <div className="bg-surface border border-border rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">—<span className="text-sm font-normal text-muted"> %</span></div>
            <div className="text-xs text-muted">First-Attempt Accuracy</div>
          </div>
        </div>
      </div>

      {/* ─── PROGRESS OVERVIEW (CHARTS + ACTIVITY) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Overall Progress Ring */}
        <div className="bg-surface border border-border rounded-xl p-6 flex flex-col items-center justify-center relative">
          <h3 className="text-sm font-semibold text-muted mb-4 self-start">Overall Progress</h3>
          <div className="relative">
            <RadialProgress
              value={totalSolved}
              max={totalAllProblems}
              size={140}
              strokeWidth={12}
              color="#dc2626"
              sublabel={`${totalSolved}/${totalAllProblems}`}
            />
          </div>
          <div className="flex gap-6 mt-5 text-xs text-muted">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary inline-block" /> DSA</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500 inline-block" /> Machine Coding</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500 inline-block" /> System Design</span>
          </div>
        </div>

        {/* Module Breakdown Bars */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-muted mb-5">Module Breakdown</h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" /> DSA
                </span>
                <span className="text-muted">{solvedDSA}/{totalDSAProblems}</span>
              </div>
              <ProgressBar value={solvedDSA} max={totalDSAProblems} color="bg-primary" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-violet-500" /> Machine Coding
                </span>
                <span className="text-muted">{solvedMC}/{totalMCProblems}</span>
              </div>
              <ProgressBar value={solvedMC} max={totalMCProblems} color="bg-violet-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-500" /> System Design
                </span>
                <span className="text-muted">{solvedSD}/{totalSDTopics}</span>
              </div>
              <ProgressBar value={solvedSD} max={totalSDTopics} color="bg-sky-500" />
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Best streak: {bestStreak} days</span>
            <span>{chapters.length + mcChapters.length + sdChapters.length} total chapters</span>
          </div>
        </div>

        {/* Activity Heatmap */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-muted mb-4">Activity (12 weeks)</h3>
          <ActivityHeatmap />
          <div className="flex items-center justify-between mt-4 text-[10px] text-muted">
            <span>Less</span>
            <div className="flex gap-1">
              {["#111", "#2d1515", "#5c1a1a", "#991b1b", "#dc2626"].map((c) => (
                <div key={c} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
              ))}
            </div>
            <span>More</span>
          </div>
          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Today</span>
              <span className="font-medium">0 problems</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-muted">This week</span>
              <span className="font-medium">0 problems</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── DSA CHAPTERS BAR CHART ─── */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-muted flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> DSA Chapters — Problems per Chapter
          </h3>
          <span className="text-xs text-muted">{chapters.length} chapters · {totalDSAProblems} problems</span>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <MiniBarChart
              data={chapters.map((ch) => ({
                label: ch.title,
                value: chapterSolved[ch.id] ?? 0,
                max: ch.problemCount,
              }))}
              color="#dc2626"
              height={80}
            />
            <div className="flex mt-2" style={{ minWidth: chapters.length * 32 }}>
              {chapters.map((ch) => (
                <div key={ch.id} className="text-[9px] text-muted text-center" style={{ width: 32 }}>
                  {ch.title.slice(0, 3)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── MODULE SECTIONS ─── */}

      {/* DSA Module */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Data Structures &amp; Algorithms
            <span className="text-xs font-normal text-muted bg-border/40 px-2 py-0.5 rounded-full ml-1">
              {chapters.length} chapters
            </span>
          </h2>
          <Link href="/chapter/arrays" className="text-xs text-primary hover:underline flex items-center gap-1">
            Continue learning <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {chapters.map((ch) => {
            const status = userChapterStatus[ch.id] ?? "locked";
            const isLocked = status === "locked";
            const isCompleted = status === "completed";
            const isActive = status === "active";
            const solved = chapterSolved[ch.id] ?? 0;
            const pct = ch.problemCount > 0 ? Math.round((solved / ch.problemCount) * 100) : 0;

            return (
              <div key={ch.id} className="relative">
                {isLocked ? (
                  <div className="flex flex-col p-4 rounded-xl border border-border bg-surface/40 opacity-50 h-full">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-border/30 flex items-center justify-center shrink-0">
                        <Lock className="w-3.5 h-3.5 text-muted" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-mono text-muted">CH.{String(ch.number).padStart(2, "0")}</span>
                        <h4 className="font-medium text-sm text-muted truncate">{ch.title}</h4>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between text-xs text-muted/60">
                      <span>{ch.problemCount} problems</span>
                      <span className="bg-border/30 px-2 py-0.5 rounded-full">Locked</span>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={`/chapter/${ch.slug}`}
                    className={`flex flex-col p-4 rounded-xl border transition-all group h-full ${
                      isActive
                        ? "border-primary/40 bg-primary/5 hover:border-primary/60 hover:bg-primary/10"
                        : "border-success/40 bg-success/5 hover:border-success/60"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold font-mono ${
                          isCompleted ? "bg-success/20 text-success" : "bg-primary/20 text-primary"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : ch.number}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-muted">CH.{String(ch.number).padStart(2, "0")}</span>
                          {isActive && (
                            <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full leading-none">Active</span>
                          )}
                          {isCompleted && (
                            <span className="text-[10px] bg-success/20 text-success px-1.5 py-0.5 rounded-full leading-none">Done</span>
                          )}
                        </div>
                        <h4 className="font-semibold text-sm truncate">{ch.title}</h4>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                    <p className="text-xs text-muted line-clamp-2 mb-3">{ch.description}</p>
                    <div className="mt-auto">
                      <div className="flex justify-between text-[11px] text-muted mb-1">
                        <span>{solved}/{ch.problemCount} solved</span>
                        <span>{pct}%</span>
                      </div>
                      <ProgressBar value={solved} max={ch.problemCount} color={isCompleted ? "bg-success" : "bg-primary"} />
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Machine Coding Module */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Code2 className="w-5 h-5 text-violet-500" />
            Machine Coding
            <span className="text-xs font-normal text-muted bg-border/40 px-2 py-0.5 rounded-full ml-1">
              {mcChapters.length} chapters · {totalMCProblems} problems
            </span>
          </h2>
          <Link href="/machine-coding" className="text-xs text-violet-400 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mcChapters.map((ch) => (
            <Link
              key={ch.id}
              href="/machine-coding"
              className="group flex flex-col p-4 rounded-xl border border-border bg-surface hover:border-violet-500/40 hover:bg-violet-500/5 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0 text-base group-hover:bg-violet-500/20 transition-colors">
                  {ch.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-mono text-muted">CH.{String(ch.number).padStart(2, "0")}</span>
                  <h4 className="font-semibold text-sm truncate">{ch.title}</h4>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
              <p className="text-xs text-muted line-clamp-2 mb-3">{ch.description}</p>
              <div className="mt-auto">
                <div className="flex justify-between text-[11px] text-muted mb-1">
                  <span className="flex items-center gap-1"><FileCode2 className="w-3 h-3" /> {ch.problemCount} problems</span>
                  <span>0%</span>
                </div>
                <ProgressBar value={0} max={ch.problemCount} color="bg-violet-500" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* System Design Module */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-500" />
            System Design
            <span className="text-xs font-normal text-muted bg-border/40 px-2 py-0.5 rounded-full ml-1">
              {sdChapters.length} chapters · {totalSDTopics} topics · {totalCaseStudies} case studies
            </span>
          </h2>
          <Link href="/system-design" className="text-xs text-sky-400 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sdChapters.map((ch) => (
            <Link
              key={ch.id}
              href="/system-design"
              className="group flex flex-col p-4 rounded-xl border border-border bg-surface hover:border-sky-500/40 hover:bg-sky-500/5 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0 text-base group-hover:bg-sky-500/20 transition-colors">
                  {ch.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-mono text-muted">CH.{String(ch.number).padStart(2, "0")}</span>
                  <h4 className="font-semibold text-sm truncate">{ch.title}</h4>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
              <p className="text-xs text-muted line-clamp-2 mb-3">{ch.description}</p>
              <div className="mt-auto">
                <div className="flex justify-between text-[11px] text-muted mb-1">
                  <span className="flex items-center gap-1">
                    <Server className="w-3 h-3" />
                    {ch.id === 8 ? `${ch.topicCount} case studies` : `${ch.topicCount} topics`}
                  </span>
                  <span>0%</span>
                </div>
                <ProgressBar value={0} max={ch.topicCount} color="bg-sky-500" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── QUICK ACTIONS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          href="/chapter/arrays"
          className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-surface hover:border-primary/40 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="font-semibold text-sm">Continue DSA</span>
            <p className="text-xs text-muted">Chapter 1 — Arrays</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <Link
          href="/machine-coding"
          className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-surface hover:border-violet-500/40 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0 group-hover:bg-violet-500/20 transition-colors">
            <Code2 className="w-5 h-5 text-violet-500" />
          </div>
          <div>
            <span className="font-semibold text-sm">Start Machine Coding</span>
            <p className="text-xs text-muted">Build React components</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <Link
          href="/system-design"
          className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-surface hover:border-sky-500/40 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0 group-hover:bg-sky-500/20 transition-colors">
            <Layers className="w-5 h-5 text-sky-500" />
          </div>
          <div>
            <span className="font-semibold text-sm">Start System Design</span>
            <p className="text-xs text-muted">HLD concepts & case studies</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>
    </div>
  );
}
