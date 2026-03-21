export interface MCChapter {
  id: number;
  number: number;
  title: string;
  slug: string;
  description: string;
  icon: string;
  problemCount: number;
}

export interface MCProblem {
  id: string;
  chapterId: number;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  requirements: string[];
  starterCode: string;
  testCases: string;
  tags: string[];
  order: number;
  timeEstimate: string;
  hints: string[];
  keyInsight: string;
  solution: string;
  solutionExplanation?: string;
}
