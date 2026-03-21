"use client";

import { getSDTopic, getNextTopic, getPreviousTopic, getSDChapter } from "@/lib/system-design";
import { notFound } from "next/navigation";
import Link from "next/link";
import { use, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Building2,
  Scale,
  MessageSquare,
  Tag,
  BookOpen,
} from "lucide-react";

const difficultyColor: Record<string, string> = {
  beginner: "text-green-400 bg-green-400/10",
  intermediate: "text-blue-400 bg-blue-400/10",
  advanced: "text-red-400 bg-red-400/10",
};

export default function TopicDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const topic = getSDTopic(id);
  if (!topic) notFound();

  const chapter = getSDChapter(topic.chapterId);
  const next = getNextTopic(id);
  const prev = getPreviousTopic(id);

  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(
    new Set()
  );
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set([0])
  );

  const toggleAnswer = (idx: number) => {
    setRevealedAnswers((prev) => {
      const n = new Set(prev);
      if (n.has(idx)) n.delete(idx);
      else n.add(idx);
      return n;
    });
  };

  const toggleSection = (idx: number) => {
    setExpandedSections((prev) => {
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
        {chapter && (
          <>
            <span>{chapter.title}</span>
            <span>/</span>
          </>
        )}
        <span className="text-foreground truncate">{topic.title}</span>
      </div>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span
            className={`text-xs px-2.5 py-1 rounded-full ${difficultyColor[topic.difficulty]}`}
          >
            {topic.difficulty}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted">
            <Clock className="w-3 h-3" />
            {topic.estimatedMinutes} min read
          </span>
        </div>
        <h1 className="text-3xl font-bold">{topic.title}</h1>
        <p className="text-muted mt-3 leading-relaxed">{topic.overview}</p>
      </div>

      {/* Tags */}
      {topic.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-8">
          <Tag className="w-3 h-3 text-muted" />
          {topic.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] bg-surface border border-border px-2 py-0.5 rounded-full text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Key Points */}
      <section className="mb-10">
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          Key Points
        </h2>
        <div className="bg-surface border border-border rounded-xl p-5">
          <ul className="space-y-2">
            {topic.keyPoints.map((kp, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{kp}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Deep Dive Sections */}
      <section className="mb-10">
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <BookOpen className="w-4 h-4 text-blue-400" />
          Deep Dive
        </h2>
        <div className="space-y-2">
          {topic.deepDive.map((section, i) => {
            const isExpanded = expandedSections.has(i);
            return (
              <div
                key={i}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(i)}
                  className="flex items-center gap-3 w-full px-5 py-4 text-left hover:bg-surface-hover transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted shrink-0" />
                  )}
                  <span className="font-medium">{section.title}</span>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-border/50">
                    <div className="mt-4 text-sm text-muted leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                    {section.diagram && (
                      <div className="mt-4 bg-background border border-border rounded-lg p-4 overflow-x-auto">
                        <pre className="text-xs font-mono text-muted leading-relaxed">
                          {section.diagram}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Real-World Examples */}
      {topic.realWorldExamples.length > 0 && (
        <section className="mb-10">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Building2 className="w-4 h-4 text-green-400" />
            Real-World Examples
          </h2>
          <div className="grid gap-3">
            {topic.realWorldExamples.map((ex, i) => (
              <div
                key={i}
                className="bg-surface border border-border rounded-xl p-4"
              >
                <div className="font-medium text-sm mb-1">{ex.company}</div>
                <p className="text-sm text-muted leading-relaxed">
                  {ex.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trade-offs */}
      {topic.tradeOffs.length > 0 && (
        <section className="mb-10">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Scale className="w-4 h-4 text-orange-400" />
            Trade-offs
          </h2>
          <div className="space-y-3">
            {topic.tradeOffs.map((tf, i) => (
              <div
                key={i}
                className="bg-surface border border-border rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono bg-blue-400/10 text-blue-400 px-2 py-0.5 rounded">
                    {tf.optionA}
                  </span>
                  <span className="text-xs text-muted">vs</span>
                  <span className="text-xs font-mono bg-orange-400/10 text-orange-400 px-2 py-0.5 rounded">
                    {tf.optionB}
                  </span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  {tf.comparison}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interview Tips */}
      {topic.interviewTips.length > 0 && (
        <section className="mb-10">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            Interview Tips
          </h2>
          <div className="bg-surface border border-primary/20 rounded-xl p-5">
            <ul className="space-y-3">
              {topic.interviewTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="text-primary font-bold mt-0.5 shrink-0">
                    {i + 1}.
                  </span>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Practice Questions */}
      {topic.practiceQuestions.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">
            Practice Questions
          </h2>
          <div className="space-y-3">
            {topic.practiceQuestions.map((pq, i) => (
              <div
                key={i}
                className="bg-surface border border-border rounded-xl overflow-hidden"
              >
                <div className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded shrink-0 mt-0.5">
                      Q{i + 1}
                    </span>
                    <p className="text-sm leading-relaxed">{pq.question}</p>
                  </div>
                </div>
                <div className="border-t border-border/50">
                  <button
                    onClick={() => toggleAnswer(i)}
                    className="w-full px-5 py-3 text-left text-xs font-medium text-muted hover:text-foreground hover:bg-surface-hover transition-colors flex items-center gap-2"
                  >
                    {revealedAnswers.has(i) ? (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        Hide Answer
                      </>
                    ) : (
                      <>
                        <ChevronRight className="w-3 h-3" />
                        Reveal Answer
                      </>
                    )}
                  </button>
                  {revealedAnswers.has(i) && (
                    <div className="px-5 pb-4 text-sm text-muted leading-relaxed">
                      {pq.answer}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        {prev ? (
          <Link
            href={`/system-design/topic/${prev.id}`}
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
            href={`/system-design/topic/${next.id}`}
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
