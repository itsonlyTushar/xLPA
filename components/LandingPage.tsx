"use client";
import { useState, useEffect, useRef } from "react";
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
  Layout,
  Cpu,
  Boxes,
  Activity,
  Monitor,
  MousePointer2,
  Fingerprint,
  Sparkles,
  Hexagon,
  Search,
  MessageSquare,
  Table,
  FolderTree,
  ChevronRight,
  Plus,
  Shield,
  Database,
  SearchCode,
  Github,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import LightRays from "./LightRays";
import XLPALogo from "./XLPALogo";

const machineCodingSamples = [
  {
    title: "Star Rating",
    desc: "Build a reusable, accessible rating component with custom SVG logic and hover states.",
    icon: Sparkles,
    size: "md:col-span-2 md:row-span-1",
    color: "text-[#d9b608]",
    bg: "from-[#d9b608]/20 to-transparent",
    featured: false,
  },
  {
    title: "Infinite Scroll",
    desc: "Master Intersection Observer API and data virtualization for smooth lists.",
    icon: Activity,
    size: "md:col-span-1 md:row-span-2",
    color: "text-black",
    bg: "bg-[#d9b608]",
    featured: true,
  },
  {
    title: "Autocomplete",
    desc: "Implement debouncing, caching, and accessibility.",
    icon: Search,
    size: "md:col-span-1 md:row-span-1",
    color: "text-[#d9b608]",
    bg: "from-[#d9b608]/20 to-transparent",
    featured: false,
  },
  {
    title: "Nested Comments",
    desc: "Recursively render complex data structures.",
    icon: MessageSquare,
    size: "md:col-span-1 md:row-span-1",
    color: "text-[#d9b608]",
    bg: "from-[#d9b608]/20 to-transparent",
    featured: false,
  },
  {
    title: "Data Table",
    desc: "Handle sorting, filtering, and multi-select with large datasets.",
    icon: Table,
    size: "md:col-span-2 md:row-span-1",
    color: "text-[#d9b608]",
    bg: "from-[#d9b608]/20 to-transparent",
    featured: false,
  },
  {
    title: "Rich Text Editor",
    desc: "Build a robust WYSIWYG editor from scratch.",
    icon: Layout,
    size: "md:col-span-1 md:row-span-1",
    color: "text-[#d9b608]",
    bg: "from-[#d9b608]/20 to-transparent",
    featured: false,
  },
];

const modules = [
  {
    icon: Layout,
    title: "Machine Coding",
    desc: "Master frontend interviews by building real-world components in a live browser environment with real-time feedback.",
    color: "text-orange-400",
    bg: "bg-orange-400/5",
  },
  {
    icon: Code2,
    title: "DSA Core",
    desc: "169 curated problems that bridge competitive programming with real-world engineering. Perfect for technical rounds.",
    color: "text-blue-400",
    bg: "bg-blue-400/5",
  },
  {
    icon: Layers,
    title: "System Design",
    desc: "Master large-scale architectures through visual simulations and JavaScript-driven HLD modules for senior roles.",
    color: "text-red-500",
    bg: "bg-red-500/5",
  },
];

const studioFeatures = [
  {
    icon: Terminal,
    title: "Monaco IDE",
    desc: "The same core that powers VS Code. Intellisense, shortcuts, and syntax highlighting you're used to.",
  },
  {
    icon: Boxes,
    title: "Sandpack Sandbox",
    desc: "A live browser instance to render components and test real DOM logic as you write it.",
  },
  {
    icon: Activity,
    title: "Interview Ready",
    desc: "Machine coding questions for the next interview: build Tabs, Star Ratings, Accordions, and much more.",
  },
];

const systemDesignSteps = [
  {
    id: "01",
    title: "Requirements Discovery",
    desc: "Uncover hidden constraints. Define RPS, data volume, and SLOs before drawing a single box.",
    icon: Target,
    position: "lg:col-start-1 lg:row-start-2",
    glow: "bg-emerald-500/20",
  },
  {
    id: "02",
    title: "High-Level Blueprint",
    desc: "Draft the skeleton. Map DNS, CDNs, and Load Balancers for global resilience.",
    icon: Layers,
    position: "lg:col-start-2 lg:row-start-3 lg:translate-y-12",
    glow: "bg-emerald-500/10",
  },
  {
    id: "03",
    title: "Database Paradigms",
    desc: "Scale the state. Deep dive into SQL sharding, NoSQL partitioning, and consistency models.",
    icon: Database,
    position: "lg:col-start-2 lg:row-start-1 lg:-translate-y-12",
    glow: "bg-emerald-500/30",
    focal: true,
  },
  {
    id: "04",
    title: "Resilient Middleware",
    desc: "Manage the flow. Implement message queues, caching layers, and decoupled microservices.",
    icon: Cpu,
    position: "lg:col-start-3 lg:row-start-2",
    glow: "bg-emerald-500/15",
  },
  {
    id: "05",
    title: "Architectural Guardrails",
    desc: "Engineer the uptime. Handle rate limiting, back-pressure, and graceful degradation.",
    icon: Shield,
    position: "lg:col-start-3 lg:row-start-1 lg:-translate-y-24",
    glow: "bg-emerald-500/10",
  },
];

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [terminalStep, setTerminalStep] = useState(0);
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTerminalVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    if (terminalRef.current) {
      observer.observe(terminalRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isTerminalVisible && terminalStep < 7) {
      const delays = [800, 600, 500, 500, 500, 700, 400];
      const timer = setTimeout(() => {
        setTerminalStep((s) => s + 1);
      }, delays[terminalStep]);
      return () => clearTimeout(timer);
    }
  }, [isTerminalVisible, terminalStep]);

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden selection:bg-primary/30">
      {/* Nav */}
      <nav
        className={`fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out ${
          scrolled
            ? "top-6 w-[90%] max-w-4xl bg-black/80 backdrop-blur-xl rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            : "top-0 w-full bg-black/40 backdrop-blur-md border-b border-border/40"
        }`}
      >
        <div
          className={`mx-auto flex items-center justify-between transition-all duration-500 ${
            scrolled ? "h-12 px-8" : "h-16 px-6 max-w-7xl"
          }`}
        >
          <XLPALogo href="/" />

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
            <a
              href="#modules"
              className="hover:text-foreground transition-colors"
            >
              Modules
            </a>
            <a
              href="#curriculum"
              className="hover:text-foreground transition-colors"
            >
              Curriculum
            </a>
          </div>

          <Link
            href={isSignedIn ? "/dashboard" : "/login"}
            className={`transition-all duration-500 bg-[#C82422] text-white rounded-full text-sm font-semibold hover:scale-105 active:scale-95 ${
              scrolled ? "px-4 py-1.5" : "px-5 py-2"
            }`}
          >
            {isLoaded ? (isSignedIn ? "Dashboard" : "Login") : "..."}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-48 pb-24 px-6 min-h-[800px] flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <LightRays
            raysOrigin="top-center"
            raysColor="#d9b608"
            raysSpeed={1}
            lightSpread={0.5}
            rayLength={3}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0}
            distortion={0}
            className="opacity-60"
            pulsating={false}
            fadeDistance={1}
            saturation={1}
          />
        </div>

        <div className="relative w-full max-w-screen-2xl mx-auto text-center z-10 px-4 md:px-8">
          <h1 className="flex flex-col items-center justify-center font-playfair leading-[0.9] tracking-tighter w-full">
            <span className="text-[clamp(2.5rem,8vw,8rem)] font-bold text-white drop-shadow-sm block whitespace-nowrap">
              Practise your way
            </span>
            <span className="text-[clamp(2rem,6.5vw,6.5rem)] font-medium text-primary italic -mt-[1vw] block whitespace-nowrap">
              to your
            </span>
            <span className="text-[clamp(2.5rem,8vw,8rem)] font-bold text-white flex items-center justify-center gap-x-[1.5vw] -mt-[1vw] whitespace-nowrap">
              next new
              <span className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 bg-[#d9b608] blur-[2vw] opacity-30 rounded-full animate-pulse"></div>
                <Zap className="relative w-[1.1em] h-[1.1em] max-w-[80px] text-[#d9b608] fill-[#d9b608]/40 drop-shadow-[0_0_15px_rgba(217,182,8,0.5)]" />
              </span>
              LPA
            </span>
          </h1>

          <p className="mt-12 text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium">
            Accelerate your journey to high-impact engineering roles with elite
            preparation tools for Machine Coding, DSA, and System Design.
          </p>

          <div className="pt-16 flex justify-center">
            <Link
              href={isSignedIn ? "/dashboard" : "/login"}
              className="group relative inline-flex items-center justify-center px-10 py-4 bg-black border border-white/20 rounded-xl font-bold text-white transition-all hover:border-[#27C98D]/40"
            >
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-[#27C98D]/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {isLoaded
                ? isSignedIn
                  ? "Go to Dashboard"
                  : "Join The Community"
                : "..."}
            </Link>
          </div>
        </div>

        {/* Studio Preview Image Placeholder/Frame */}
        <div className="mt-28 relative max-w-6xl mx-auto group perspective-1000">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
          <div className="relative rounded-xl border border-white/10 bg-[#030303] overflow-hidden shadow-2xl">
            {/* Overlay Grid */}
            <div className="absolute inset-0 grid grid-cols-12 gap-0">
              {/* Left Sidebar Mock */}
              <div className="col-span-1 border-r border-white/5 bg-white/[0.01]" />
              {/* Problem Pane Mock */}
              <div className="col-span-3 border-r border-white/5 p-6 space-y-4">
                <div className="h-4 w-3/4 bg-white/10 rounded" />
                <div className="h-24 w-full bg-white/5 rounded" />
                <div className="space-y-2">
                  <div className="h-2 w-full bg-white/5 rounded" />
                  <div className="h-2 w-5/6 bg-white/5 rounded" />
                  <div className="h-2 w-4/6 bg-white/5 rounded" />
                </div>
              </div>
              {/* Editor Pane Mock */}
              <div className="col-span-5 p-8 font-mono text-[10px] space-y-1">
                <div className="text-blue-400">
                  export default function{" "}
                  <span className="text-yellow-400">Solution</span>() {"{"}
                </div>
                <div className="pl-4 text-muted/80">
                  const [state, setState] = useState(null);
                </div>
                <div className="pl-4 text-purple-400">
                  useEffect(() =&gt; {"{"}
                </div>
                <div className="pl-8 text-green-400">
                  // Large-scale machine coding modules
                </div>
                <div className="pl-8 text-white">connectToStudio();</div>
                <div className="pl-4 text-purple-400">{"}"});</div>
                <div className="text-blue-400">{"}"}</div>
              </div>
              {/* Preview Pane Mock */}
              <div className="col-span-3 bg-white/[0.03] flex items-center justify-center border-l border-white/5">
                <Monitor className="w-12 h-12 text-white/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Grid (Premium Redesign) */}
      <section
        id="modules"
        className="py-24 px-6 bg-black relative overflow-hidden"
      >
        {/* Background "Stars" & Glow */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[20%] w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_8px_2px_rgba(255,255,255,0.4)] animate-pulse" />
          <div className="absolute top-[30%] right-[15%] w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_8px_1px_rgba(255,255,255,0.3)] animate-pulse delay-75" />
          <div className="absolute bottom-[25%] left-[10%] w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_8px_2px_rgba(255,255,255,0.2)] animate-pulse delay-150" />
          <div className="absolute top-[10%] right-[30%] w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_8px_1px_rgba(255,255,255,0.4)] animate-pulse delay-500" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full opacity-40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* Header */}
          <div className="mb-24 space-y-6 max-w-3xl mx-auto">
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold font-playfair tracking-tight text-white flex items-center justify-center gap-4">
              Our Core
              <div className="flex -space-x-3 items-center">
                <div className="p-2 bg-primary/10 rounded-full border border-primary/20 backdrop-blur-sm">
                  <Layout className="w-5 h-5 text-primary" />
                </div>
                <div className="p-2 bg-primary/10 rounded-full border border-primary/20 backdrop-blur-sm">
                  <Code2 className="w-5 h-5 text-primary" />
                </div>
              </div>
              Modules
            </h2>
            <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed px-6">
              A curriculum built on deep research, engineering discipline, and
              interview diversification. We focus on identifying the most
              critical engineering patterns, ensuring that your skills are
              positioned for long-term career success.
            </p>
          </div>

          <div className="relative">
            {/* SVG Arc Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[300px] -z-10 pointer-events-none overflow-hidden sm:block hidden">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 1000 300"
                fill="none"
                xmlns="http://www.w3.org/1999/xlink"
              >
                <path
                  d="M10,250 C10,250 500,0 990,250"
                  stroke="url(#arcGradient)"
                  strokeWidth="2"
                  strokeDasharray="4 6"
                  opacity="0.15"
                />
                <defs>
                  <linearGradient
                    id="arcGradient"
                    x1="0%"
                    y1="100%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="50%" stopColor="white" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Modules Container */}
            <div className="grid lg:grid-cols-3 gap-16 lg:gap-8 pt-12">
              {modules.map((mod, idx) => (
                <div
                  key={mod.title}
                  className={`flex flex-col items-center group transition-all duration-700 ${
                    idx === 1 ? "lg:-mt-12" : "lg:mt-4"
                  }`}
                >
                  {/* Orb Spot */}
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-10 flex items-center justify-center">
                    {/* Shadow / Glow Bottom */}
                    <div className="absolute inset-x-4 -bottom-4 h-1/2 bg-white/[0.03] blur-3xl rounded-[100%] group-hover:bg-primary/5 transition-colors duration-700" />

                    {/* The Orb Circle */}
                    <div className="relative w-full h-full rounded-full border border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-[2px] p-8 overflow-hidden transition-all duration-500 group-hover:border-primary/20 shadow-2xl">
                      {/* Inner Shine */}
                      <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-gradient-radial from-white/[0.05] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Hex Container */}
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Hexagon className="w-full h-full text-primary/10 fill-primary/5 stroke-[0.5px]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <mod.icon
                            className={`w-12 h-12 text-primary drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-transform duration-500 group-hover:scale-110`}
                            strokeWidth={1.5}
                          />
                        </div>
                        {/* Glow Outline for Hexagon Effect */}
                        <div className="absolute inset-0 border-[0.5px] border-primary/20 rounded-xl rotate-45 group-hover:rotate-[225deg] transition-transform duration-1000 scale-90 opacity-40 blur-[1px]" />
                        <div className="absolute inset-0 border-[0.5px] border-primary/20 rounded-xl -rotate-45 group-hover:-rotate-[135deg] transition-transform duration-1000 scale-90 opacity-40 blur-[1px]" />
                      </div>
                    </div>
                  </div>

                  {/* Content below orb */}
                  <div className="space-y-4 max-w-sm px-4">
                    <h3 className="text-2xl font-bold text-white tracking-tight font-playfair group-hover:text-primary transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-muted/70 text-sm leading-relaxed font-medium">
                      {mod.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Studio Experience - Redesigned to match the high-end minimalist aesthetic */}
      <section
        id="studio"
        className="py-40 px-6 bg-black relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto text-center">
          {/* Header */}
          <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-bold font-playfair tracking-tight leading-[1.1] max-w-5xl mx-auto mb-20 text-white">
            A professional-grade <br />
            <span className="text-primary italic">development experience.</span>
          </h2>

          {/* Central Glow & Icon with Grid Background */}
          <div className="relative flex items-center justify-center py-24 mb-20">
            {/* Subtle Grid Background */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(to right, #ffffff10 1px, transparent 1px), linear-gradient(to bottom, #ffffff10 1px, transparent 1px)`,
                backgroundSize: "60px 60px",
                maskImage:
                  "radial-gradient(circle at center, black 40%, transparent 90%)",
              }}
            />

            <div className="relative">
              {/* Outer Glows */}
              <div className="absolute inset-0 bg-primary/30 blur-[60px] rounded-full scale-[2.5] opacity-20 animate-pulse" />
              <div className="absolute inset-0 bg-primary/20 blur-[30px] rounded-full scale-150 opacity-40" />

              {/* The Icon Container */}
              <div className="relative w-24 h-24 rounded-full bg-black border border-primary/30 flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.1)]">
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-primary/20 to-transparent opacity-50" />
                <Cpu
                  className="w-12 h-12 text-primary drop-shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>

          {/* Bottom Content Grid */}
          <div className="grid md:grid-cols-2 gap-20 text-left pt-20 border-t border-white/5 max-w-6xl mx-auto">
            <div className="space-y-8">
              <span className="text-xs font-bold tracking-[0.5em] text-muted/40 uppercase">
                Problem
              </span>
              <p className="text-xl text-muted/80 leading-relaxed font-medium">
                We've integrated industry-standard tools directly into your
                learning path. No more typing into a generic text area. No more
                disconnect between theory and application.
              </p>

              <div className="pt-6 border-t border-white/5">
                <p className="text-[10px] font-bold text-primary/60 mb-6 uppercase tracking-[0.3em]">
                  DSA Curriculum
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    "Arrays & Hashing",
                    "Dynamic Programming",
                    "Graph Theory",
                    "Tree Traversal",
                    "Sliding Window",
                    "Binary Search",
                    "Two Pointers",
                    "Backtracking",
                  ].map((item) => (
                    <span
                      key={item}
                      className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-muted/60 hover:text-white transition-all cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <span className="text-xs font-bold tracking-[0.5em] text-primary uppercase">
                Solution
              </span>
              <div className="relative group" ref={terminalRef}>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/40 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-all duration-1000" />
                <div className="relative rounded-2xl border border-white/10 bg-[#0c0c0c] shadow-2xl overflow-hidden font-mono text-sm min-h-[420px] flex flex-col">
                  {/* Title Bar */}
                  <div className="h-12 bg-[#181313] flex items-center justify-between px-5 border-b border-white/5 flex-shrink-0">
                    <div className="flex gap-2.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] shadow-[0_0_10px_rgba(255,95,86,0.2)]" />
                      <div className="w-3.5 h-3.5 rounded-full bg-white/10" />
                      <div className="w-3.5 h-3.5 rounded-full bg-white/5" />
                    </div>
                    <div className="text-white/40 text-[11px] font-bold tracking-widest uppercase">
                      johndoe@admin: ~
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/15 transition-all cursor-pointer group/plus">
                      <Plus className="w-4 h-4 text-white/40 group-hover/plus:text-white/80 transition-colors" />
                    </div>
                  </div>

                  {/* Terminal Content */}
                  <div className="p-8 space-y-8 flex-grow">
                    <div className="flex items-center gap-3 mb-8">
                      <span className="text-[#27C98D] font-bold">
                        johndoe@admin:
                      </span>
                      <span className="text-primary font-bold">~</span>
                      <span className="text-white/40">$</span>
                      <span
                        className={`text-white font-medium ${terminalStep === 0 ? "after:content-['_'] after:animate-pulse" : ""}`}
                      >
                        {terminalStep >= 0 && "npm run studio"}
                      </span>
                    </div>

                    {terminalStep >= 1 && (
                      <div className="space-y-2 mb-8 text-xs text-muted/40 italic transition-all duration-500 animate-in fade-in slide-in-from-top-2">
                        <div>{">"} xLPA@3.0.0 info</div>
                        <div>{">"} initializing studio ecosystem...</div>
                      </div>
                    )}

                    <div className="space-y-8 mb-10">
                      {studioFeatures.map((f, i) => (
                        <div
                          key={f.title}
                          className={`group/item flex gap-5 transition-all duration-700 ${
                            terminalStep >= i + 2
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-4"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2 pt-1.5 slice-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60 group-hover:item:bg-primary transition-colors shadow-[0_0_5px_rgba(220,38,38,0.3)]" />
                            {i !== studioFeatures.length - 1 && (
                              <div className="w-px h-full bg-white/10" />
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2.5">
                              <f.icon className="w-3.5 h-3.5 text-primary/60" />
                              <h4 className="text-white font-bold tracking-tight text-base">
                                {f.title}
                              </h4>
                            </div>
                            <p className="text-muted/50 text-xs leading-relaxed max-w-sm group-hover/item:text-muted/80 transition-colors">
                              {f.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {terminalStep >= 5 && (
                      <div className="space-y-2 mb-6 transition-all duration-500 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-3">
                          <span className="text-[#27C98D] font-bold">
                            johndoe@admin:
                          </span>
                          <span className="text-primary font-bold">~</span>
                          <span className="text-white/40">$</span>
                          <span
                            className={`text-white font-medium ${terminalStep === 5 ? "after:content-['_'] after:animate-pulse" : ""}`}
                          >
                            node -v
                          </span>
                        </div>
                        {terminalStep >= 6 && (
                          <div className="text-muted/40 font-bold pl-12 text-xs">
                            v22.0.0 (LTS)
                          </div>
                        )}
                      </div>
                    )}

                    {terminalStep >= 7 && (
                      <div className="flex items-center gap-3 transition-opacity duration-300">
                        <span className="text-[#27C98D] font-bold">
                          johndoe@admin:
                        </span>
                        <span className="text-primary font-bold">~</span>
                        <span className="text-white/40">$</span>
                        <div className="w-2.5 h-5 bg-white/80 animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Machine Coding Bento Curriculum */}
      <section
        id="curriculum"
        className="py-40 px-6 border-t border-white/5 bg-[#030303]"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold font-playfair mb-6 text-white tracking-tight">
              Machine Coding{" "}
              <span className="text-primary italic">Roadmap</span>
            </h2>
            <p className="text-muted/60 text-lg max-w-2xl mx-auto font-medium">
              Master the frontend internals. From core components to complex
              system interactions, curated for high-performance engineering
              roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            {machineCodingSamples.map((mod) => (
              <div
                key={mod.title}
                className={`group relative overflow-hidden rounded-[2.5rem] border transition-all duration-700 hover:scale-[1.02] ${
                  mod.featured
                    ? `${mod.bg} border-transparent shadow-[0_0_40px_rgba(217,182,8,0.2)]`
                    : "border-white/10 bg-black hover:border-primary/40"
                } ${mod.size}`}
              >
                {/* Background Decorator */}
                {!mod.featured && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${mod.bg} opacity-5 group-hover:opacity-20 transition-opacity duration-500`}
                  />
                )}

                {/* Content */}
                <div
                  className={`h-full flex flex-col p-10 ${mod.featured ? "justify-between" : ""}`}
                >
                  <div
                    className={`flex ${mod.featured ? "justify-between" : "justify-end"} items-start mb-auto`}
                  >
                    {mod.featured && (
                      <span className="px-4 py-1.5 rounded-full bg-black/10 border border-black/10 text-[10px] font-bold tracking-[0.2em] uppercase">
                        Most Popular
                      </span>
                    )}
                    <mod.icon
                      className={`w-12 h-12 ${mod.color} ${mod.featured ? "opacity-100" : "opacity-40 group-hover:opacity-100"} transition-all duration-500`}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3
                      className={`text-2xl md:text-3xl font-bold tracking-tight font-playfair ${mod.featured ? "text-black" : "text-white group-hover:text-[#d9b608]"} transition-colors`}
                    >
                      {mod.title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed font-medium ${mod.featured ? "text-black/60" : "text-muted/50 group-hover:text-muted/80"} transition-colors`}
                    >
                      {mod.desc}
                    </p>

                    <div
                      className={`flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase pt-4 ${mod.featured ? "text-black" : "text-[#d9b608]/40 group-hover:text-[#d9b608]"} transition-colors`}
                    >
                      Explore Problem <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                {/* Glass Blur Effect for corners (only for non-featured) */}
                {!mod.featured && (
                  <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#d9b608]/20 blur-[50px] opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Design Highlight - Redesigned to match the "How It Works" image */}
      <section
        id="system-design"
        className="relative pt-40 pb-20 px-6 overflow-hidden bg-[#030303]"
      >
        {/* Large Ambient Glows */}
        <div className="absolute top-1/4 left-[10%] w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-[5%] w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-8 mb-32">
            <h2 className="text-5xl sm:text-7xl lg:text-8xl font-bold font-playfair leading-tight text-white tracking-tighter">
              Mastering High-Scale <br />
              <span className="text-primary italic">Architecture.</span>
            </h2>
            <p className="text-muted/60 text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
              Go beyond simple CRUD. Learn to architect systems that handle
              millions of concurrent users with zero downtime.
            </p>
          </div>

          {/* Interactive Steps Flow */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 items-center">
            {/* SVG Connector Path (Desktop) */}
            <div className="absolute inset-0 pointer-events-none hidden lg:block -z-10 overflow-visible">
              <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none">
                <motion.path
                  d="M100 250 C 300 150, 500 450, 600 300 S 900 100, 1100 250"
                  stroke="url(#emeraldGradient)"
                  strokeWidth="2"
                  strokeDasharray="8 12"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.2 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <defs>
                  <linearGradient
                    id="emeraldGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {systemDesignSteps.map((step, idx) => (
              <motion.div
                key={step.id}
                className={`relative group flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 ${step.position}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="relative">
                  {/* Central Glow Orb (matched to image) */}
                  <div
                    className={`absolute inset-0 ${step.glow} blur-3xl rounded-full ${step.focal ? "scale-[2.5]" : "scale-150"} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
                  />

                  {/* Step Node */}
                  <div
                    className={`relative w-20 h-20 rounded-2xl bg-black border border-white/10 flex items-center justify-center group-hover:border-emerald-500/50 transition-all duration-500 shadow-2xl`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 rounded-2xl" />
                    <step.icon
                      className={`w-10 h-10 ${step.focal ? "text-emerald-400" : "text-white group-hover:text-emerald-400"} transition-colors duration-500`}
                      strokeWidth={1.5}
                    />

                    {/* Focal point pulse effect */}
                    {step.focal && (
                      <div className="absolute -inset-4 border border-emerald-500/20 rounded-full animate-ping pointer-events-none" />
                    )}
                  </div>

                  {/* Number Badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-[10px] font-bold text-emerald-400 shadow-xl group-hover:border-emerald-500/30 transition-colors">
                    {step.id}
                  </div>
                </div>

                <div className="space-y-3 max-w-xs">
                  <h3 className="text-2xl font-bold font-playfair text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted/50 text-sm leading-relaxed font-medium group-hover:text-muted/80 transition-colors">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-20 pb-40 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,rgba(217,182,8,0.08),transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,rgba(217,182,8,0.05),transparent_70%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative space-y-10">
          <h2 className="text-4xl sm:text-6xl font-bold font-playfair tracking-tight text-white">
            Give back to the
            <br />
            <span className="text-primary italic">community.</span>
          </h2>
          <p className="text-xl text-muted/80 max-w-2xl mx-auto">
            Share your coding experience by contributing the interview questions
            you've encountered in any section. Your insights help fellow
            engineers level up and succeed.
          </p>
          <a
            href="https://github.com/itsonlyTushar/xLPA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-12 py-5 rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(217,182,8,0.3)]"
          >
            Start Contributing
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 pt-24 pb-12 px-6 bg-black relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-[radial-gradient(circle_at_center,rgba(217,182,8,0.03),transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
            {/* Brand Column */}
            <div className="space-y-6 lg:col-span-2">
              <XLPALogo href="/" size="lg" />
              <p className="text-muted/50 text-sm max-w-sm leading-relaxed font-medium">
                The ultimate preparation studio for elite engineering roles.
                Master complex patterns through hands-on practice.
              </p>
              <div className="pt-4 flex flex-col gap-4">
                <a
                  href="https://github.com/itsonlyTushar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-xs font-bold text-muted/40 hover:text-primary transition-colors group/author"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover/author:border-primary/30 transition-all">
                    <Github className="w-4 h-4" />
                  </div>
                  <span>Made and maintained by itsonlyTushar</span>
                </a>
              </div>
            </div>

            {/* Modules Column */}
            <div className="space-y-6">
              <h4 className="text-white font-bold text-sm tracking-[0.2em] uppercase">
                Modules
              </h4>
              <ul className="space-y-4">
                {[
                  { label: "Machine Coding", href: "#curriculum" },
                  { label: "DSA", href: "#modules" },
                  { label: "System Design", href: "#system-design" },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-muted/50 hover:text-primary text-sm font-medium transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Column */}
            <div className="space-y-6">
              <h4 className="text-white font-bold text-sm tracking-[0.2em] uppercase">
                Resources
              </h4>
              <ul className="space-y-4">
                {[
                  {
                    label: "GitHub",
                    href: "https://github.com/itsonlyTushar/xLPA",
                  },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Use", href: "/terms" },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : "_self"}
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : ""
                      }
                      className="text-muted/50 hover:text-primary text-sm font-medium transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
