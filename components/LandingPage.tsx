import {
  Code2,
  Zap,
  Target,
  BarChart3,
  BookOpen,
  ArrowRight,
  Terminal,
  Flame,
  Layers,
  Database,
  Globe,
  Server,
} from "lucide-react";
import Link from "next/link";

const chapters = [
  { num: 1, title: "Arrays", problems: "28 problems", icon: "[ ]" },
  { num: 2, title: "Linear Search", problems: "16 problems", icon: "→" },
  { num: 3, title: "Binary Search", problems: "22 problems", icon: "⟡" },
  { num: 4, title: "Sorting", problems: "32 problems", icon: "↕" },
  { num: 5, title: "HashMap", problems: "26 problems", icon: "#" },
  { num: 6, title: "Recursion", problems: "24 problems", icon: "∞" },
  { num: 7, title: "Backtracking", problems: "21 problems", icon: "↩" },
];

const features = [
  {
    icon: Code2,
    title: "Built for JS Devs",
    desc: "Every concept bridges to real web dev — React lists, API pagination, DOM traversal. No abstract theory.",
  },
  {
    icon: Terminal,
    title: "In-Browser IDE",
    desc: "Write, run, and test vanilla JS directly in your browser. No setup, no installs, instant feedback.",
  },
  {
    icon: Target,
    title: "169 Curated Problems",
    desc: "Warmup → Core → Challenge → Real-world. Each problem builds on the last in a strict learning path.",
  },
  {
    icon: Flame,
    title: "Streak System",
    desc: "Daily streaks, mastery percentages, and spaced repetition keep you coming back and retaining what you learn.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    desc: "See your struggle score, pattern recognition speed, and chapter mastery evolve over time.",
  },
  {
    icon: BookOpen,
    title: "Step-by-Step Solutions",
    desc: "Stuck? Get annotated walkthroughs with dry runs, variable tracing, and the pattern sentence to remember.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">DSA Learner</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-muted">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#curriculum" className="hover:text-foreground transition-colors">
              Curriculum
            </a>
            <a href="#system-design" className="hover:text-foreground transition-colors">
              System Design
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How It Works
            </a>
          </div>

          <Link
            href="/login"
            className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-primary-dark/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 text-sm text-muted mb-8">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Open source — MIT License
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Master DSA
              <br />
              <span className="gradient-text">with JavaScript.</span>
            </h1>

            <p className="mt-6 text-lg text-muted max-w-lg leading-relaxed">
              The structured learning path for web developers who want to think
              algorithmically. 7 chapters. 169 problems. Zero fluff.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-full font-medium transition-colors glow-red"
              >
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#curriculum"
                className="inline-flex items-center justify-center gap-2 bg-surface hover:bg-surface-hover border border-border text-foreground px-8 py-3.5 rounded-full font-medium transition-colors"
              >
                View Curriculum
              </a>
            </div>

            <div className="mt-12 flex items-center gap-8 text-sm text-muted">
              <div>
                <div className="text-2xl font-bold text-foreground">169</div>
                Problems
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <div className="text-2xl font-bold text-foreground">7</div>
                Chapters
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <div className="text-2xl font-bold text-foreground">100%</div>
                JavaScript
              </div>
            </div>
          </div>

          {/* Code preview */}
          <div className="hidden lg:block">
            <div className="rounded-2xl border border-border bg-surface overflow-hidden glow-red">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-3 text-xs text-muted">twoSumSorted.js</span>
              </div>
              <pre className="p-6 text-sm leading-relaxed font-mono overflow-x-auto">
                <code>
                  <span className="text-blue-400">function</span>{" "}
                  <span className="text-yellow-300">twoSumSorted</span>
                  <span className="text-white">(arr, target) {"{"}</span>
                  {"\n"}
                  <span className="text-muted">{"  // Two pointers — O(n) time, O(1) space"}</span>
                  {"\n"}
                  <span className="text-blue-400">{"  let"}</span>
                  <span className="text-white">{" left = "}</span>
                  <span className="text-orange-300">0</span>
                  <span className="text-white">;</span>
                  {"\n"}
                  <span className="text-blue-400">{"  let"}</span>
                  <span className="text-white">{" right = arr."}</span>
                  <span className="text-green-300">length</span>
                  <span className="text-white">{" - "}</span>
                  <span className="text-orange-300">1</span>
                  <span className="text-white">;</span>
                  {"\n\n"}
                  <span className="text-purple-400">{"  while"}</span>
                  <span className="text-white">{" (left < right) {"}</span>
                  {"\n"}
                  <span className="text-blue-400">{"    const"}</span>
                  <span className="text-white">{" sum = arr[left] + arr[right];"}</span>
                  {"\n"}
                  <span className="text-purple-400">{"    if"}</span>
                  <span className="text-white">{" (sum === target)"}</span>
                  {"\n"}
                  <span className="text-purple-400">{"      return"}</span>
                  <span className="text-white">{" [left, right];"}</span>
                  {"\n"}
                  <span className="text-purple-400">{"    if"}</span>
                  <span className="text-white">{" (sum < target) left++;"}</span>
                  {"\n"}
                  <span className="text-purple-400">{"    else"}</span>
                  <span className="text-white">{" right--;"}</span>
                  {"\n"}
                  <span className="text-white">{"  }"}</span>
                  {"\n"}
                  <span className="text-white">{"}"}</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Built for web developers who <span className="text-primary">ship code</span>
            </h2>
            <p className="mt-4 text-muted max-w-2xl mx-auto">
              Not another generic algorithm course. Every concept connects to the
              React components, API calls, and data processing you do daily.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section id="curriculum" className="py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              7 chapters. Strict order. No skipping.
            </h2>
            <p className="mt-4 text-muted max-w-2xl mx-auto">
              Each chapter builds on the previous one. Master the fundamentals
              before moving to advanced patterns.
            </p>
          </div>

          <div className="space-y-4">
            {chapters.map((ch) => (
              <div
                key={ch.num}
                className="flex items-center gap-6 p-5 rounded-xl border border-border bg-surface hover:border-primary/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl font-mono text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
                  {ch.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted">
                      CH.{ch.num}
                    </span>
                    <h3 className="font-semibold">{ch.title}</h3>
                  </div>
                  <p className="text-sm text-muted mt-0.5">{ch.problems}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Design Module */}
      <section id="system-design" className="py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Layers className="w-4 h-4" />
              New Module
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">
              System Design <span className="text-primary">Interview Prep</span>
            </h2>
            <p className="mt-4 text-muted max-w-2xl mx-auto">
              Master the building blocks of large-scale systems. 8 chapters covering
              fundamentals to real-world case studies — everything you need for HLD rounds.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { icon: Globe, label: "Networking & APIs", desc: "DNS, CDN, REST, gRPC" },
              { icon: Database, label: "Databases", desc: "Sharding, replication, indexing" },
              { icon: Server, label: "Distributed Systems", desc: "Caching, queues, load balancing" },
              { icon: Layers, label: "Case Studies", desc: "URL shortener, Twitter, chat" },
            ].map((item) => (
              <div
                key={item.label}
                className="p-5 rounded-xl border border-border bg-surface hover:border-primary/30 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{item.label}</h3>
                <p className="text-xs text-muted">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-surface hover:bg-surface-hover border border-border text-foreground px-8 py-3.5 rounded-full font-medium transition-colors"
            >
              Explore System Design
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">How it works</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "JS Bridge",
                desc: "Sharpen the JS tools you need before each chapter. Short, focused exercises — 2 min each.",
              },
              {
                step: "02",
                title: "Learn the Pattern",
                desc: "Real web dev scenario first, then the algorithm. Visual mental models and Big-O in plain English.",
              },
              {
                step: "03",
                title: "Solve Problems",
                desc: "Warmup → Core → Challenge → Real-world. Write and test code directly in the browser.",
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="text-5xl font-bold text-primary/20 mb-4 font-mono">
                  {s.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to think <span className="text-primary">algorithmically</span>?
          </h2>
          <p className="mt-4 text-muted max-w-xl mx-auto">
            Join web developers who are leveling up their problem-solving skills
            with JavaScript — the language they already know.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-full font-medium transition-colors mt-8 glow-red"
          >
            Start Chapter 1 — Arrays
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span>DSA Learner</span>
          </div>
          <div>Open source — MIT License</div>
        </div>
      </footer>
    </div>
  );
}
