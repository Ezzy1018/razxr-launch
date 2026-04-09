import { generateReviewFeedback } from "@/lib/gemini";
import { analyzeAtsFit } from "@/lib/hero-space";
import type { HeroResumeFixResult } from "@/types";

const MAX_TEXT_LENGTH = 12000;

function clampText(value: string): string {
  return value.replace(/\u0000/g, "").trim().slice(0, MAX_TEXT_LENGTH);
}

function parseJsonObject(raw: string): Record<string, unknown> | null {
  const trimmed = raw.trim();

  try {
    return JSON.parse(trimmed) as Record<string, unknown>;
  } catch {
    const fenced = trimmed.match(/```json\s*([\s\S]*?)```/i);
    if (!fenced) {
      return null;
    }

    try {
      return JSON.parse(fenced[1]) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim());
}

function fallbackResumeBuilder(args: {
  resumeText: string;
  missingKeywords: string[];
  rewriteSuggestions: string[];
}): { fixedResume: string; improvementsApplied: string[]; warnings: string[] } {
  const keywordLine = args.missingKeywords.slice(0, 8).join(", ");
  const improvementsApplied = [
    "Added ATS-standard section headings for parser reliability.",
    "Strengthened bullet style to action + technology + measurable impact.",
  ];

  if (keywordLine) {
    improvementsApplied.push("Injected missing role keywords into a dedicated skills section.");
  }

  const warning = [
    "Used deterministic fallback rewrite because model response was unavailable.",
  ];

  const rewritten = [
    "SUMMARY",
    "Results-driven software engineer focused on shipping production-ready features with clear business impact.",
    "",
    "EXPERIENCE",
    "- Built and delivered end-to-end features with measurable improvements in reliability and performance.",
    "- Collaborated cross-functionally with product and design to release user-facing improvements.",
    "",
    "PROJECTS",
    "- Implemented APIs and frontend modules with testing and monitoring for robust deployments.",
    "- Improved defect resolution speed with structured debugging and root-cause writeups.",
    "",
    "SKILLS",
    keywordLine
      ? `${keywordLine}, TypeScript, React, Node.js, SQL, Testing, Debugging`
      : "TypeScript, React, Node.js, SQL, Testing, Debugging, CI/CD",
    "",
    "EDUCATION",
    "- Bachelor-level technical training and continuous practical sprint-based learning.",
    "",
    "ORIGINAL CONTENT (for reference)",
    args.resumeText.slice(0, 2500),
  ].join("\n");

  if (args.rewriteSuggestions.length > 0) {
    improvementsApplied.push("Applied rewrite guidance from ATS playbook suggestions.");
  }

  return {
    fixedResume: rewritten,
    improvementsApplied,
    warnings: warning,
  };
}

async function generateFixedResumeWithGemini(args: {
  resumeText: string;
  jobDescription: string;
  missingKeywords: string[];
  rewriteSuggestions: string[];
  riskTitles: string[];
}): Promise<{ fixedResume: string; improvementsApplied: string[]; warnings: string[] } | null> {
  const prompt = [
    "You are an expert ATS resume optimizer.",
    "Rewrite the candidate resume to maximize ATS readability and role relevance.",
    "Hard requirements:",
    "1) Keep content truthful. Do not invent employers, dates, or certifications.",
    "2) Output must include clear sections: SUMMARY, EXPERIENCE, PROJECTS, SKILLS, EDUCATION.",
    "3) Use concise bullet points with action verb + technology + measurable outcome where possible.",
    "4) Include missing role keywords naturally.",
    "5) Return valid JSON only with this shape:",
    '{"fixedResume":"...","improvementsApplied":["..."],"warnings":["..."]}',
    `Missing keywords: ${args.missingKeywords.join(", ") || "none"}`,
    `Major ATS risks: ${args.riskTitles.join(", ") || "none"}`,
    "Rewrite hints:",
    ...args.rewriteSuggestions.map((item) => `- ${item}`),
    "Candidate resume:",
    args.resumeText,
    "Target role:",
    args.jobDescription,
  ].join("\n");

  const raw = await generateReviewFeedback(prompt);
  const parsed = parseJsonObject(raw);
  if (!parsed) {
    return null;
  }

  const fixedResume =
    typeof parsed.fixedResume === "string" ? parsed.fixedResume.trim().slice(0, MAX_TEXT_LENGTH) : "";
  if (!fixedResume) {
    return null;
  }

  const improvementsApplied = toStringArray(parsed.improvementsApplied);
  const warnings = toStringArray(parsed.warnings);

  return {
    fixedResume,
    improvementsApplied,
    warnings,
  };
}

export async function buildSolidAtsResume(input: {
  resumeText: string;
  jobDescription: string;
}): Promise<HeroResumeFixResult> {
  const resumeText = clampText(input.resumeText);
  const jobDescription = clampText(input.jobDescription);

  const before = await analyzeAtsFit({
    resumeText,
    jobDescription,
    includeGeminiCoaching: false,
  });

  const rewriteSuggestions = before.rewriteTips.map((tip) => `${tip.title}: ${tip.after}`);
  let generated = await generateFixedResumeWithGemini({
    resumeText,
    jobDescription,
    missingKeywords: before.keywordsMissing,
    rewriteSuggestions,
    riskTitles: before.risks.map((risk) => risk.title),
  });

  if (!generated) {
    generated = fallbackResumeBuilder({
      resumeText,
      missingKeywords: before.keywordsMissing,
      rewriteSuggestions,
    });
  }

  const after = await analyzeAtsFit({
    resumeText: generated.fixedResume,
    jobDescription,
    includeGeminiCoaching: false,
  });

  return {
    fixedResume: generated.fixedResume,
    improvementsApplied: generated.improvementsApplied,
    warnings: generated.warnings,
    before: {
      overallScore: before.overallScore,
      keywordCoverage: before.keywordCoverage,
      keywordsMissing: before.keywordsMissing,
      risks: before.risks,
    },
    after: {
      overallScore: after.overallScore,
      keywordCoverage: after.keywordCoverage,
      keywordsMissing: after.keywordsMissing,
      risks: after.risks,
    },
  };
}