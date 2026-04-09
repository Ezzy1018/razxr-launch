import { generateReviewFeedback } from "@/lib/gemini";
import type { HeroAtsAnalysis, HeroRewriteTip, HeroRisk } from "@/types";

const STOP_WORDS = new Set([
  "about",
  "after",
  "again",
  "also",
  "and",
  "are",
  "been",
  "from",
  "have",
  "into",
  "just",
  "like",
  "more",
  "that",
  "their",
  "them",
  "they",
  "this",
  "with",
  "will",
  "your",
]);

const ACTION_VERBS = [
  "built",
  "designed",
  "implemented",
  "delivered",
  "optimized",
  "improved",
  "launched",
  "developed",
  "reduced",
  "increased",
];

function normalize(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function uniqueTokens(text: string): string[] {
  const tokens = normalize(text)
    .split(" ")
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));

  return Array.from(new Set(tokens));
}

function extractJobKeywords(jobDescription: string): string[] {
  return uniqueTokens(jobDescription).slice(0, 30);
}

function percentage(numerator: number, denominator: number): number {
  if (denominator <= 0) {
    return 0;
  }
  return Math.round((numerator / denominator) * 100);
}

function buildRisks(resume: string, missingKeywords: string[]): HeroRisk[] {
  const normalizedResume = normalize(resume);
  const risks: HeroRisk[] = [];

  if (!/experience|projects|skills|education/.test(normalizedResume)) {
    risks.push({
      id: "missing-sections",
      severity: "high",
      title: "Missing standard ATS sections",
      detail: "Add explicit headings such as Experience, Projects, Skills, and Education.",
    });
  }

  if (!/\d/.test(resume)) {
    risks.push({
      id: "no-metrics",
      severity: "high",
      title: "No measurable outcomes",
      detail: "ATS and recruiters prioritize resumes with numbers (%, $, time saved, scale).",
    });
  }

  const verbCount = ACTION_VERBS.filter((verb) => normalizedResume.includes(verb)).length;
  if (verbCount < 2) {
    risks.push({
      id: "weak-action-language",
      severity: "medium",
      title: "Weak action language",
      detail: "Use stronger accomplishment verbs like built, improved, optimized, and delivered.",
    });
  }

  if (missingKeywords.length > 8) {
    risks.push({
      id: "keyword-gap",
      severity: "high",
      title: "Large keyword gap",
      detail: "Important job keywords are absent; mirror role-specific terminology from the posting.",
    });
  }

  if (resume.length < 500) {
    risks.push({
      id: "thin-content",
      severity: "low",
      title: "Low content depth",
      detail: "Resume content appears thin. Add more project impact and context per bullet.",
    });
  }

  return risks;
}

function buildRewriteTips(missingKeywords: string[]): HeroRewriteTip[] {
  const topMissing = missingKeywords.slice(0, 3);
  const keywordPhrase = topMissing.join(", ");

  return [
    {
      title: "Switch generic bullets to impact bullets",
      before: "Worked on frontend features for user dashboard.",
      after:
        "Implemented dashboard features in React and TypeScript, reducing page load time by 28% and improving weekly active usage by 14%.",
      why: "Impact + technology + measurable result improves ATS ranking and recruiter confidence.",
    },
    {
      title: "Align wording with role keywords",
      before: "Built APIs for app functionality.",
      after:
        topMissing.length > 0
          ? `Built production APIs using ${keywordPhrase}, with tests and monitoring for reliability.`
          : "Built production APIs with robust validation, test coverage, and monitoring.",
      why: "ATS ranks direct keyword matches higher than broad wording.",
    },
    {
      title: "Make skills scan-friendly",
      before: "Skills: coding, tools, teamwork",
      after:
        topMissing.length > 0
          ? `Skills: ${keywordPhrase}, system design, CI/CD, debugging`
          : "Skills: TypeScript, Node.js, React, SQL, testing, debugging",
      why: "Structured skill lines increase parser reliability.",
    },
  ];
}

async function buildGeminiCoaching(
  resumeText: string,
  jobDescription: string,
  keywordsMissing: string[],
  risks: HeroRisk[],
): Promise<string> {
  const prompt = [
    "You are an ATS resume coach.",
    "Provide exactly 4 concise bullets.",
    "Each bullet must start with an action verb.",
    "Focus on improving ATS match for this role.",
    `Missing keywords: ${keywordsMissing.slice(0, 10).join(", ") || "none"}`,
    `Detected risks: ${risks.map((risk) => risk.title).join("; ") || "none"}`,
    "Candidate resume:",
    resumeText.slice(0, 3500),
    "Job description:",
    jobDescription.slice(0, 3500),
  ].join("\n");

  try {
    return await generateReviewFeedback(prompt);
  } catch {
    return [
      "- Quantify at least three project outcomes with percentages, time, or scale.",
      "- Mirror exact role keywords in project bullets and skills section.",
      "- Rewrite each experience line as action + technology + measurable result.",
      "- Add clear headings to improve parser reliability: Experience, Projects, Skills, Education.",
    ].join("\n");
  }
}

export async function analyzeAtsFit(input: {
  resumeText: string;
  jobDescription: string;
  includeGeminiCoaching?: boolean;
}): Promise<HeroAtsAnalysis> {
  const resumeText = input.resumeText.trim();
  const jobDescription = input.jobDescription.trim();
  const includeGeminiCoaching = input.includeGeminiCoaching ?? true;

  const jobKeywords = extractJobKeywords(jobDescription);
  const normalizedResume = normalize(resumeText);
  const keywordsMatched = jobKeywords.filter((keyword) => normalizedResume.includes(keyword));
  const keywordsMissing = jobKeywords.filter((keyword) => !normalizedResume.includes(keyword));

  const keywordCoverage = percentage(keywordsMatched.length, Math.max(jobKeywords.length, 1));
  const risks = buildRisks(resumeText, keywordsMissing);
  const riskPenalty = risks.reduce((score, risk) => {
    if (risk.severity === "high") {
      return score + 12;
    }
    if (risk.severity === "medium") {
      return score + 7;
    }
    return score + 3;
  }, 0);

  const overallScore = Math.max(0, Math.min(100, keywordCoverage - riskPenalty + 18));
  const rewriteTips = buildRewriteTips(keywordsMissing);
  const geminiCoaching = includeGeminiCoaching
    ? await buildGeminiCoaching(resumeText, jobDescription, keywordsMissing, risks)
    : "Gemini coaching disabled for this analysis run.";

  return {
    overallScore,
    keywordCoverage,
    keywordsMatched: keywordsMatched.slice(0, 12),
    keywordsMissing: keywordsMissing.slice(0, 12),
    risks,
    rewriteTips,
    geminiCoaching,
  };
}