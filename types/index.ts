export const RAZXR_UID_COOKIE = "razxr_uid";

export type UserLevel = "apprentice" | "developer" | "senior";

export type ProjectTrack = "fintech" | "saas" | "ecommerce";

export type Difficulty = "easy" | "medium" | "hard";

export type ProjectSessionStatus = "active" | "submitted" | "reviewed";

export type DebugAttemptStatus = "pass" | "fail";

export type Language = "javascript" | "typescript" | "python";

export type ScoreBand = {
  min: number;
  max: number;
};

export type CodeFileMap = Record<string, string>;

export type TicketTestCase = {
  input: string;
  expected: string;
  description: string;
};

export type TicketSeed = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  testCases: TicketTestCase[];
};

export type ProjectSeed = {
  id: string;
  title: string;
  description: string;
  track: ProjectTrack;
  difficulty: Difficulty;
  files: CodeFileMap;
  tickets: TicketSeed[];
};

export type DebugChallenge = {
  id: string;
  title: string;
  language: Language;
  buggyCode: string;
  fixedCode: string;
  hint: string;
  difficulty: Difficulty;
};

export type AssessmentQuestion = {
  id: string;
  language: Language;
  prompt: string;
  starterCode: string;
  difficulty: Difficulty;
};

export type AssessmentAnswer = {
  questionId: string;
  code: string;
  explanation?: string;
};

export type AssessmentResult = {
  score: number;
  level: UserLevel;
  feedback: string;
};

export type UserRecord = {
  id: string;
  level: UserLevel | null;
  createdAt: string;
};

export type ProjectSessionRecord = {
  id: string;
  userId: string;
  projectId: string;
  status: ProjectSessionStatus;
  files: CodeFileMap;
  aiFeedback: string | null;
  score: number | null;
  createdAt: string;
  submittedAt: string | null;
};

export type DebugAttemptRecord = {
  id: string;
  userId: string;
  challengeId: string;
  status: DebugAttemptStatus;
  explanation: string;
  timeTakenS: number;
  score: number;
  createdAt: string;
};

export type PassportSummary = {
  uid: string;
  level: UserLevel;
  completedProjects: number;
  averageProjectScore: number;
  debuggingScore: number;
  topLanguages: Language[];
};

export type ApiSuccess<T> = {
  ok: true;
  data: T;
};

export type ApiFailure = {
  ok: false;
  error: string;
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export type HeroRiskSeverity = "high" | "medium" | "low";

export type HeroRisk = {
  id: string;
  severity: HeroRiskSeverity;
  title: string;
  detail: string;
};

export type HeroRewriteTip = {
  title: string;
  before: string;
  after: string;
  why: string;
};

export type HeroAtsAnalysis = {
  overallScore: number;
  keywordCoverage: number;
  keywordsMatched: string[];
  keywordsMissing: string[];
  risks: HeroRisk[];
  rewriteTips: HeroRewriteTip[];
  geminiCoaching: string;
};

export type HeroResumeFixRequest = {
  resumeText: string;
  jobDescription: string;
};

export type HeroResumeFixResult = {
  fixedResume: string;
  improvementsApplied: string[];
  warnings: string[];
  before: Pick<HeroAtsAnalysis, "overallScore" | "keywordCoverage" | "keywordsMissing" | "risks">;
  after: Pick<HeroAtsAnalysis, "overallScore" | "keywordCoverage" | "keywordsMissing" | "risks">;
};
