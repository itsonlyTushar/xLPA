"use client";

import { getCaseStudy, getCaseStudiesForChapter } from "@/lib/system-design";
import { notFound } from "next/navigation";
import Link from "next/link";
import { use, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Layers,
  Database,
  Code2,
  Scaling,
  Mic,
  Tag,
  Calculator,
} from "lucide-react";

const difficultyColor: Record<string, string> = {
  beginner: "text-green-400 bg-green-400/10",
  intermediate: "text-blue-400 bg-blue-400/10",
  advanced: "text-red-400 bg-red-400/10",
};

export default function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const cs = getCaseStudy(id);
  if (!cs) notFound();

  const allCases = getCaseStudiesForChapter(cs.chapterId);
  const currentIdx = allCases.findIndex((c) => c.id === id);
  const prev = currentIdx > 0 ? allCases[currentIdx - 1] : null;
  const next = currentIdx < allCases.length - 1 ? allCases[currentIdx + 1] : null;

  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(
    new Set([0])
  );

  const togglePhase = (idx: number) => {
    setExpandedPhases((prev) => {
      const n = new Set(prev);
      if (n.has(idx)) n.delete(idx);
      else n.add(idx);
      return n;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link
          href="/system-design"
          className="hover:text-foreground transition-colors"
        >
          System Design
        </Link>
        <span>/</span>
        <span>Case Studies</span>
        <span>/</span>
        <span className="text-foreground truncate">{cs.title}</span>
      </div>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span
            className={`text-xs px-2.5 py-1 rounded-full ${difficultyColor[cs.difficulty]}`}
          >
            {cs.difficulty}
          </span>
          <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">
            Case Study
          </span>
        </div>
        <h1 className="text-3xl font-bold">{cs.title}</h1>
        <p className="text-muted mt-3 leading-relaxed">{cs.description}</p>
      </div>

      {/* Tags */}
      {cs.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-8">
          <Tag className="w-3 h-3 text-muted" />
          {cs.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] bg-surface border border-border px-2 py-0.5 rounded-full text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Requirements */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Requirements</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <h3 className="font-medium text-sm">Functional</h3>
            </div>
            <ul className="space-y-2">
              {cs.requirements.functional.map((req, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted"
                >
                  <span className="text-green-400 mt-1 shrink-0">•</span>
                  <span className="leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-orange-400" />
              <h3 className="font-medium text-sm">Non-Functional</h3>
            </div>
            <ul className="space-y-2">
              {cs.requirements.nonFunctional.map((req, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted"
                >
                  <span className="text-orange-400 mt-1 shrink-0">•</span>
                  <span className="leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Back-of-Envelope Estimations */}
      {cs.estimations.length > 0 && (
        <section className="mb-10">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Calculator className="w-4 h-4 text-blue-400" />
            Capacity Estimation
          </h2>
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">
                    Value
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider hidden sm:table-cell">
                    Calculation
                  </th>
                </tr>
              </thead>
              <tbody>
                {cs.estimations.map((est, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/50 last:border-0"
                  >
                    <td className="px-5 py-3 font-medium">{est.metric}</td>
                    <td className="px-5 py-3 font-mono text-primary">
                      {est.value}
                    </td>
                    <td className="px-5 py-3 text-muted hidden sm:table-cell">
                      {est.explanation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Architecture Layers */}
      {cs.architectureLayers.length > 0 && (
        <section className="mb-10">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Layers className="w-4 h-4 text-purple-400" />
            Architecture Components
          </h2>
          <div className="space-y-3">
            {cs.architectureLayers.map((layer, i) => (
              <div
                key={i}
                className="bg-surface border border-border rounded-xl p-5"
              >
                <h3 className="font-medium mb-2">{layer.name}</h3>
                <p className="text-sm text-muted mb-3 leading-relaxed">
                  {layer.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {layer.components.map((comp) => (
                    <span
                      key={comp}
                      className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Architecture Diagram */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Architecture Diagram</h2>
        <div className="bg-background border border-border rounded-xl p-5 overflow-x-auto">
          <pre className="text-xs font-mono text-muted leading-relaxed">
            {cs.architectureDiagram}
          </pre>
        </div>
      </section>

      {/* Data Flow */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Data Flow</h2>
        <div className="bg-background border border-border rounded-xl p-5 overflow-x-auto">
          <pre className="text-xs font-mono text-muted leading-relaxed whitespace-pre-wrap">
            {cs.dataFlow}
          </pre>
        </div>
      </section>

      {/* Database Schema */}
      <section className="mb-10">
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <Database className="w-4 h-4 text-green-400" />
          Database Schema
        </h2>
        <div className="bg-background border border-border rounded-xl p-5 overflow-x-auto">
          <pre className="text-xs font-mono text-muted leading-relaxed">
            {cs.databaseSchema}
          </pre>
        </div>
      </section>

      {/* API Design */}
      <section className="mb-10">
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <Code2 className="w-4 h-4 text-blue-400" />
          API Design
        </h2>
        <div className="bg-background border border-border rounded-xl p-5 overflow-x-auto">
          <pre className="text-xs font-mono text-muted leading-relaxed whitespace-pre-wrap">
            {cs.apiDesign}
          </pre>
        </div>
      </section>

      {/* Scaling Considerations */}
      {cs.scalingConsiderations.length > 0 && (
        <section className="mb-10">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Scaling className="w-4 h-4 text-yellow-400" />
            Scaling Considerations
          </h2>
          <div className="bg-surface border border-border rounded-xl p-5">
            <ul className="space-y-3">
              {cs.scalingConsiderations.map((sc, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="text-yellow-400 font-bold mt-0.5 shrink-0">
                    {i + 1}.
                  </span>
                  <span className="text-muted leading-relaxed">{sc}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Interview Script */}
      {cs.interviewScript.length > 0 && (
        <section className="mb-10">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Mic className="w-4 h-4 text-primary" />
            Interview Walkthrough Script
          </h2>
          <p className="text-sm text-muted mb-4">
            Follow this script step-by-step during a real interview. Click each
            phase to expand.
          </p>
          <div className="space-y-2">
            {cs.interviewScript.map((step, i) => {
              const isExpanded = expandedPhases.has(i);
              return (
                <div
                  key={i}
                  className="border border-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => togglePhase(i)}
                    className="flex items-center gap-3 w-full px-5 py-4 text-left hover:bg-surface-hover transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-muted shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="font-medium">{step.phase}</span>
                      <span className="text-xs text-muted ml-3">
                        ({step.duration})
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-border/50">
                      <div className="mt-4 text-sm text-muted leading-relaxed whitespace-pre-line">
                        {step.content}
                      </div>
                      {step.tips.length > 0 && (
                        <div className="mt-4 bg-primary/5 border border-primary/20 rounded-lg p-3">
                          <div className="text-xs font-semibold text-primary mb-2">
                            Pro Tips:
                          </div>
                          <ul className="space-y-1">
                            {step.tips.map((tip, j) => (
                              <li
                                key={j}
                                className="text-xs text-muted flex items-start gap-2"
                              >
                                <span className="text-primary shrink-0">→</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        {prev ? (
          <Link
            href={`/system-design/case-study/${prev.id}`}
            className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{prev.title}</span>
            <span className="sm:hidden">Previous</span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/system-design/case-study/${next.id}`}
            className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
          >
            <span className="hidden sm:inline">{next.title}</span>
            <span className="sm:hidden">Next</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href="/system-design"
            className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover transition-colors"
          >
            Back to System Design
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
