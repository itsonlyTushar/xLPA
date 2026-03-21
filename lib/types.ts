export interface Chapter {
  id: number;
  number: number;
  title: string;
  slug: string;
  description: string;
  webDevConnection: string;
  problemCount: number;
  status: "locked" | "active" | "completed";
  jsBridgeTopics: string[];
  coreConcepts: string[];
}

export interface Problem {
  id: string;
  chapterId: number;
  title: string;
  difficulty: "warmup" | "core" | "challenge" | "real-world";
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: string;
  testCases: string;
  tags: string[];
  order: number;
  hints?: string[];
  solution?: string;
  solutionExplanation?: string;
  patternSentence?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  current_chapter: number;
  created_at: string;
}

export interface UserProgress {
  user_id: string;
  chapter_id: number;
  problems_solved: number;
  total_problems: number;
  mastery_percentage: number;
  hint_dependency_rate: number;
}

export interface Attempt {
  id: string;
  user_id: string;
  problem_id: string;
  code: string;
  passed: boolean;
  used_hint: boolean;
  time_taken_ms: number;
  created_at: string;
}

export interface Streak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_solved_date: string;
}

export interface SpacedRepetition {
  id: string;
  user_id: string;
  problem_id: string;
  next_review_date: string;
  interval_days: number;
  review_count: number;
}
