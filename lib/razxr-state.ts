import { randomUUID } from "node:crypto";
import { debugChallenges, seededProjects } from "@/data";
import { generateReviewFeedback } from "@/lib/gemini";
import type {
  AssessmentAnswer,
  AssessmentQuestion,
  AssessmentResult,
  DebugAttemptRecord,
  DebugChallenge,
  PassportSummary,
  ProjectSeed,
  ProjectSessionRecord,
  UserLevel,
  UserRecord,
} from "@/types";

type SubmitProjectPayload = {
  projectId: string;
  ticketId: string;
  files: Record<string, string>;
  notes?: string;
};

type SubmitDebugPayload = {
  challengeId: string;
  fixedCode: string;
  explanation: string;
  timeTakenS: number;
};

type TalentEntry = PassportSummary & {
  averageProjectScore: number;
  projects: ProjectSessionRecord[];
};

const users = new Map<string, UserRecord>();
const assessments = new Map<string, AssessmentResult>();
const projectSessions = new Map<string, ProjectSessionRecord>();
const debugAttempts = new Map<string, DebugAttemptRecord[]>();

const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: "assess-1",
    language: "javascript",
    difficulty: "easy",
    prompt: "Implement a function that returns the sum of an array of numbers.",
    starterCode:
      "export function sum(values) {\n  // return sum of all values\n  return 0\n}",
  },
  {
    id: "assess-2",
    language: "typescript",
    difficulty: "medium",
    prompt:
      "Implement a function that returns unique strings from a list while preserving order.",
    starterCode:
      "export function uniqueNames(values: string[]): string[] {\n  return values\n}",
  },
  {
    id: "assess-3",
    language: "python",
    difficulty: "medium",
    prompt:
      "Write a function that checks whether a string is a palindrome ignoring spaces.",
    starterCode:
      "def is_palindrome(value: str) -> bool:\n    return False\n",
  },
];

function sessionKey(uid: string, projectId: string): string {
  return `${uid}:${projectId}`;
}

function normalizeText(input: string): string {
  return input.replace(/\s+/g, " ").trim().toLowerCase();
}

function scoreToLevel(score: number): UserLevel {
  if (score >= 80) {
    return "senior";
  }
  if (score >= 55) {
    return "developer";
  }
  return "apprentice";
}

export function getOrCreateUser(uid: string): UserRecord {
  const existing = users.get(uid);
  if (existing) {
    return existing;
  }

  const user: UserRecord = {
    id: uid,
    level: null,
    createdAt: new Date().toISOString(),
  };
  users.set(uid, user);
  return user;
}

export function getAssessmentQuestions(): AssessmentQuestion[] {
  return assessmentQuestions;
}

export function submitAssessment(uid: string, answers: AssessmentAnswer[]): AssessmentResult {
  const answered = answers.filter((item) => item.code.trim().length > 0).length;
  const richness = answers.reduce((acc, item) => {
    const codeScore = Math.min(item.code.trim().length / 4, 20);
    const explanationScore = Math.min((item.explanation ?? "").trim().length / 12, 10);
    return acc + codeScore + explanationScore;
  }, 0);

  const score = Math.max(0, Math.min(100, Math.round(answered * 18 + richness)));
  const level = scoreToLevel(score);

  const result: AssessmentResult = {
    score,
    level,
    feedback:
      level === "senior"
        ? "Strong fundamentals and clear reasoning. Start in complex sprint tickets."
        : level === "developer"
          ? "Good fundamentals. Focus on debugging and edge-case handling in sprint tasks."
          : "You have the basics. Start with beginner tickets and build consistency.",
  };

  assessments.set(uid, result);
  const user = getOrCreateUser(uid);
  user.level = level;
  users.set(uid, user);
  return result;
}

export function getDashboard(uid: string) {
  const user = getOrCreateUser(uid);
  const assessment = assessments.get(uid) ?? null;
  const sessions = Array.from(projectSessions.values()).filter((item) => item.userId === uid);
  const attempts = debugAttempts.get(uid) ?? [];
  const completedProjects = sessions.filter((item) => item.status === "reviewed");
  const projectScore =
    completedProjects.length > 0
      ? Math.round(
          completedProjects.reduce((acc, item) => acc + (item.score ?? 0), 0) /
            completedProjects.length,
        )
      : 0;
  const debugScore =
    attempts.length > 0
      ? Math.round(attempts.reduce((acc, item) => acc + item.score, 0) / attempts.length)
      : 0;

  return {
    user,
    assessment,
    stats: {
      completedProjects: completedProjects.length,
      projectScore,
      debugScore,
      completedDebugChallenges: attempts.filter((item) => item.status === "pass").length,
    },
    tracks: seededProjects.map((project) => ({
      id: project.id,
      title: project.title,
      difficulty: project.difficulty,
      track: project.track,
      ticketCount: project.tickets.length,
    })),
  };
}

export function listProjects(): ProjectSeed[] {
  return seededProjects;
}

export function getProjectSession(uid: string, projectId: string) {
  const project = seededProjects.find((item) => item.id === projectId);
  if (!project) {
    return null;
  }

  getOrCreateUser(uid);
  const key = sessionKey(uid, projectId);
  const existing = projectSessions.get(key);
  if (existing) {
    return { project, session: existing };
  }

  const session: ProjectSessionRecord = {
    id: randomUUID(),
    userId: uid,
    projectId,
    status: "active",
    files: { ...project.files },
    aiFeedback: null,
    score: null,
    createdAt: new Date().toISOString(),
    submittedAt: null,
  };

  projectSessions.set(key, session);
  return { project, session };
}

export async function submitProjectWork(uid: string, payload: SubmitProjectPayload) {
  const loaded = getProjectSession(uid, payload.projectId);
  if (!loaded) {
    return null;
  }

  const { project, session } = loaded;
  const ticket = project.tickets.find((item) => item.id === payload.ticketId);
  if (!ticket) {
    return null;
  }

  const mergedFiles = {
    ...session.files,
    ...payload.files,
  };

  const editedLines = Object.values(payload.files).reduce(
    (acc, value) => acc + value.split("\n").length,
    0,
  );
  const baseScore = Math.min(95, 55 + editedLines + (payload.notes?.length ?? 0) / 8);
  const score = Math.round(baseScore);

  let aiFeedback = "";
  try {
    aiFeedback = await generateReviewFeedback(
      `You are reviewing a sprint ticket submission. Ticket: ${ticket.title}. Description: ${ticket.description}. Notes: ${payload.notes ?? "n/a"}. Provide concise strengths, issues, and one improvement suggestion.`,
    );
  } catch {
    aiFeedback =
      "AI review unavailable right now. Manual summary: good momentum, but improve edge-case handling and add tests before merge.";
  }

  const updated: ProjectSessionRecord = {
    ...session,
    files: mergedFiles,
    status: "reviewed",
    aiFeedback,
    score,
    submittedAt: new Date().toISOString(),
  };

  projectSessions.set(sessionKey(uid, payload.projectId), updated);

  return {
    ticket,
    score,
    feedback: aiFeedback,
    session: updated,
  };
}

export function listDebugChallenges(): DebugChallenge[] {
  return debugChallenges;
}

export function getDebugChallenge(challengeId: string): DebugChallenge | null {
  return debugChallenges.find((item) => item.id === challengeId) ?? null;
}

export function submitDebugAttempt(uid: string, payload: SubmitDebugPayload) {
  const challenge = getDebugChallenge(payload.challengeId);
  if (!challenge) {
    return null;
  }

  const expected = normalizeText(challenge.fixedCode);
  const actual = normalizeText(payload.fixedCode);
  const explanationLen = payload.explanation.trim().length;

  const codeMatch = actual === expected || actual.includes(expected.slice(0, 35));
  const explanationScore = Math.min(20, Math.round(explanationLen / 8));
  const timeScore = Math.max(0, 35 - Math.round(payload.timeTakenS / 30));
  const codeScore = codeMatch ? 55 : 20;
  const score = Math.max(0, Math.min(100, codeScore + explanationScore + timeScore));

  const attempt: DebugAttemptRecord = {
    id: randomUUID(),
    userId: uid,
    challengeId: payload.challengeId,
    status: codeMatch ? "pass" : "fail",
    explanation: payload.explanation,
    timeTakenS: payload.timeTakenS,
    score,
    createdAt: new Date().toISOString(),
  };

  const current = debugAttempts.get(uid) ?? [];
  debugAttempts.set(uid, [attempt, ...current]);

  return {
    attempt,
    expectedSnippet: challenge.fixedCode.slice(0, 160),
  };
}

export function buildPassport(uid: string): PassportSummary & {
  projects: ProjectSessionRecord[];
  debug: DebugAttemptRecord[];
  trend: Array<{ name: string; score: number }>;
} {
  const user = getOrCreateUser(uid);
  const assessment = assessments.get(uid);
  const projects = Array.from(projectSessions.values()).filter((item) => item.userId === uid);
  const debug = debugAttempts.get(uid) ?? [];

  const reviewed = projects.filter((item) => item.status === "reviewed");
  const averageProjectScore =
    reviewed.length > 0
      ? Math.round(reviewed.reduce((acc, item) => acc + (item.score ?? 0), 0) / reviewed.length)
      : 0;

  const debuggingScore =
    debug.length > 0
      ? Math.round(debug.reduce((acc, item) => acc + item.score, 0) / debug.length)
      : 0;

  const topLanguages = Array.from(
    new Set([
      ...reviewed.flatMap((item) => {
        const project = seededProjects.find((entry) => entry.id === item.projectId);
        if (!project) {
          return [];
        }
        if (project.track === "ecommerce") {
          return ["python"] as const;
        }
        if (project.track === "saas") {
          return ["javascript", "typescript"] as const;
        }
        return ["typescript"] as const;
      }),
      ...debug
        .map((item) => getDebugChallenge(item.challengeId)?.language)
        .filter((item): item is "javascript" | "typescript" | "python" => Boolean(item)),
    ]),
  ).slice(0, 4);

  const trend = [
    ...reviewed.map((item, index) => ({ name: `PR ${index + 1}`, score: item.score ?? 0 })),
    ...debug.slice(0, 3).map((item, index) => ({ name: `Debug ${index + 1}`, score: item.score })),
  ];

  return {
    uid,
    level: user.level ?? assessment?.level ?? "apprentice",
    completedProjects: reviewed.length,
    averageProjectScore,
    debuggingScore,
    topLanguages,
    projects: reviewed,
    debug,
    trend,
  };
}

export function listTalent(filters: {
  level?: string | null;
  track?: string | null;
  minScore?: number | null;
}) {
  const entries: TalentEntry[] = Array.from(users.keys()).map((uid) => {
    const passport = buildPassport(uid);
    return {
      ...passport,
      averageProjectScore: passport.averageProjectScore,
    };
  });

  return entries.filter((entry) => {
    if (filters.level && entry.level !== filters.level) {
      return false;
    }
    if (filters.minScore && entry.averageProjectScore < filters.minScore) {
      return false;
    }
    if (filters.track) {
      const hasTrack = entry.projects.some((project) => {
        const found = seededProjects.find((item) => item.id === project.projectId);
        return found?.track === filters.track;
      });
      if (!hasTrack) {
        return false;
      }
    }
    return true;
  });
}
