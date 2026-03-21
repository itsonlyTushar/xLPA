// ──────────────────────────────────────────────────────
// System Design Module — Type Definitions
// ──────────────────────────────────────────────────────

export interface SDChapter {
  id: number;
  number: number;
  title: string;
  slug: string;
  description: string;
  icon: string;
  topicCount: number;
}

export interface ContentSection {
  title: string;
  content: string;
  diagram?: string; // ASCII architecture diagram
}

export interface RealWorldExample {
  company: string;
  description: string;
}

export interface TradeOff {
  optionA: string;
  optionB: string;
  comparison: string;
}

export interface PracticeQuestion {
  question: string;
  answer: string;
}

export interface SDTopic {
  id: string;
  chapterId: number;
  title: string;
  order: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  overview: string;
  keyPoints: string[];
  deepDive: ContentSection[];
  realWorldExamples: RealWorldExample[];
  tradeOffs: TradeOff[];
  interviewTips: string[];
  practiceQuestions: PracticeQuestion[];
  tags: string[];
}

export interface ArchitectureLayer {
  name: string;
  components: string[];
  description: string;
}

export interface Estimation {
  metric: string;
  value: string;
  explanation: string;
}

export interface InterviewStep {
  phase: string;
  duration: string;
  content: string;
  tips: string[];
}

export interface CaseStudy {
  id: string;
  chapterId: number;
  title: string;
  order: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  requirements: { functional: string[]; nonFunctional: string[] };
  estimations: Estimation[];
  architectureLayers: ArchitectureLayer[];
  architectureDiagram: string;
  dataFlow: string;
  databaseSchema: string;
  apiDesign: string;
  scalingConsiderations: string[];
  interviewScript: InterviewStep[];
  tags: string[];
}
