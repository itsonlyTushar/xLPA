"use client";

import { useSession, useUser } from "@clerk/nextjs";
import { use, useState, useEffect } from "react";
import { createClerkSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { chapters } from "@/lib/curriculum/chapters";
import { getProblemsForChapter } from "@/lib/curriculum";
import Link from "next/link";
import { ArrowLeft, BookOpen, Lightbulb, Code2, CheckCircle2 } from "lucide-react";

const difficultyConfig = {
  warmup: { label: "Warmup", class: "badge-warmup" },
  core: { label: "Core", class: "badge-core" },
  challenge: { label: "Challenge", class: "badge-challenge" },
  "real-world": { label: "Real-World", class: "badge-real-world" },
};

export default function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { user } = useUser();
  const { session } = useSession();
  const [passedProblemIds, setPassedProblemIds] = useState<Set<string>>(new Set());
  const chapter = chapters.find((c) => c.slug === slug);

  useEffect(() => {
    async function fetchProgress() {
      if (!session || !user || !isSupabaseConfigured) return;
      const supabase = createClerkSupabaseClient(session);
      const { data } = await supabase
        .from("attempts")
        .select("problem_id")
        .eq("user_id", user.id)
        .eq("passed", true);
      
      if (data) {
        setPassedProblemIds(new Set(data.map(a => a.problem_id)));
      }
    }
    fetchProgress();
  }, [session, user]);

  if (!chapter) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold font-playfair">Chapter not found</h1>
        <Link href="/dashboard" className="text-primary mt-4 inline-block">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  const problems = getProblemsForChapter(chapter.id);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to chapters
      </Link>

      {/* Chapter header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-mono text-muted">
            CHAPTER {chapter.number}
          </span>
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>
        <h1 className="text-3xl font-bold font-playfair">{chapter.title}</h1>
        <p className="text-muted mt-2 max-w-2xl">{chapter.description}</p>

        {/* Web dev connection */}
        <div className="mt-4 bg-surface border border-border rounded-xl p-4 flex gap-3">
          <Lightbulb className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-sm text-muted leading-relaxed">
            {chapter.webDevConnection}
          </p>
        </div>
      </div>

      {/* Phase 1: JS Bridge Topics */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold font-playfair flex items-center gap-2 mb-4">
          <Code2 className="w-5 h-5 text-blue-400" />
          Phase 1 — JS Fundamentals Bridge
        </h2>
        <div className="bg-surface border border-border rounded-xl p-5">
          <p className="text-sm text-muted mb-3">
            Before diving into {chapter.title.toLowerCase()}, sharpen these JS
            tools:
          </p>
          <ul className="space-y-2">
            {chapter.jsBridgeTopics.map((topic, i) => (
              <li
                key={i}
                className="text-sm text-foreground flex items-start gap-2"
              >
                <span className="text-primary font-mono text-xs mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Phase 2: Core Concepts */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold font-playfair flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-green-400" />
          Phase 2 — Core Concepts
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {chapter.coreConcepts.map((concept, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-lg p-4 text-sm"
            >
              {concept}
            </div>
          ))}
        </div>
      </div>

      {/* Phase 3: Problem Set */}
      <div>
        <h2 className="text-lg font-semibold font-playfair mb-4">
          Phase 3 — Problems ({problems.length} available)
        </h2>

        {problems.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-8 text-center text-muted">
            <p>Problems for this chapter are coming soon.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {problems.map((problem, i) => {
              const dc = difficultyConfig[problem.difficulty];
              return (
                <Link
                  key={problem.id}
                  href={`/problem/${problem.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-primary/20 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-border/50 flex items-center justify-center text-sm font-mono text-muted shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium">{problem.title}</h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${dc.class}`}
                      >
                        {dc.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {problem.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-muted bg-border/30 px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={`text-xs flex items-center gap-1.5 shrink-0 transition-colors ${passedProblemIds.has(problem.id) ? "text-success font-bold" : "text-muted"}`}>
                    {passedProblemIds.has(problem.id) ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Solved
                      </>
                    ) : (
                      "Not attempted"
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
