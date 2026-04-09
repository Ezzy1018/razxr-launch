"use client";

import { useRef, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HeroAtsAnalysis, HeroResumeFixResult } from "@/types";

const RESUME_PLACEHOLDER = `Experience\nBuilt and shipped a student finance dashboard with TypeScript and React. Improved onboarding conversion by 18%.\n\nProjects\nLed API redesign for billing service and reduced failure rate by 34%.\n\nSkills\nTypeScript, React, Node.js, SQL, Testing`;

const JOB_PLACEHOLDER = `We are hiring a Junior Software Engineer with strong TypeScript, React, API development, testing, and debugging fundamentals.\n\nResponsibilities include shipping production features, improving performance, collaborating across product and design, and owning reliability outcomes with measurable impact.`;

export default function HeroSpacePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [resumeText, setResumeText] = useState(RESUME_PLACEHOLDER);
  const [jobDescription, setJobDescription] = useState(JOB_PLACEHOLDER);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [result, setResult] = useState<HeroAtsAnalysis | null>(null);
  const [fixingResume, setFixingResume] = useState(false);
  const [fixError, setFixError] = useState<string | null>(null);
  const [fixResult, setFixResult] = useState<HeroResumeFixResult | null>(null);

  const scoreLabel = useMemo(() => {
    if (!result) {
      return "-";
    }
    if (result.overallScore >= 80) {
      return "Strong";
    }
    if (result.overallScore >= 60) {
      return "Good";
    }
    return "Needs work";
  }, [result]);

  async function runAnalysis() {
    setLoading(true);
    setError(null);

    const response = await fetch("/api/hero-space/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ resumeText, jobDescription }),
    });

    const payload = (await response.json()) as {
      ok: boolean;
      error?: string;
      data?: HeroAtsAnalysis;
    };

    if (!payload.ok || !payload.data) {
      setError(payload.error ?? "Unable to analyze ATS fit right now.");
      setResult(null);
      setLoading(false);
      return;
    }

    setResult(payload.data);
    setLoading(false);
  }

  async function fixResumeOneClick() {
    setFixingResume(true);
    setFixError(null);

    const response = await fetch("/api/hero-space/fix-resume", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ resumeText, jobDescription }),
    });

    const payload = (await response.json()) as {
      ok: boolean;
      error?: string;
      data?: HeroResumeFixResult;
    };

    if (!payload.ok || !payload.data) {
      setFixError(payload.error ?? "Unable to generate ATS-fixed resume right now.");
      setFixingResume(false);
      return;
    }

    setFixResult(payload.data);
    setResumeText(payload.data.fixedResume);
    setFixingResume(false);
  }

  async function handleResumeUpload(file: File) {
    const isSupported = /\.(pdf|docx|png|jpe?g|webp|heic|heif)$/i.test(file.name);
    if (!isSupported) {
      setUploadError("Supported files: PDF, DOCX, PNG, JPG, WEBP, HEIC.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/hero-space/extract", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as {
      ok: boolean;
      error?: string;
      data?: { fileName: string; extractedText: string };
    };

    if (!payload.ok || !payload.data) {
      setUploadError(payload.error ?? "Unable to read this resume file.");
      setUploading(false);
      return;
    }

    setResumeText(payload.data.extractedText);
    setUploadStatus(`Loaded ${payload.data.fileName}`);
    setUploading(false);
  }

  return (
    <section className="relative isolate mx-auto flex w-full max-w-6xl flex-col gap-6 overflow-hidden px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(255,195,113,0.2),_transparent_44%),radial-gradient(circle_at_bottom_right,_rgba(116,132,255,0.16),_transparent_38%)]" />

      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Hero Space</p>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Why resumes fail ATS filters, and exactly how to fix them.
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Upload your resume file or paste text to get keyword coverage, rejection risks,
          rewrites, and Gemini coaching for a better shortlist chance.
        </p>
      </header>

      <Card className="border border-border/70 bg-gradient-to-br from-amber-300/10 via-transparent to-indigo-300/10">
        <CardHeader>
          <CardTitle>Upload Resume (Document or Image)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-xl border border-dashed border-white/25 bg-black/25 p-4">
            <p className="text-sm text-muted-foreground">
              Use file upload for ATS checks instead of manual text copy. We run AI vision
              extraction for resume images before scoring.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Button size="lg" variant="secondary" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
                {uploading ? "Reading file..." : "Upload resume file"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Accepted: .pdf, .docx, .png, .jpg, .jpeg, .webp, .heic (up to 8 MB)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.docx,.png,.jpg,.jpeg,.webp,.heic,.heif,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg,image/webp,image/heic,image/heif"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void handleResumeUpload(file);
                }
                event.currentTarget.value = "";
              }}
            />
          </div>

          {uploadStatus ? (
            <p className="text-sm text-emerald-400">{uploadStatus}</p>
          ) : null}

          {uploadError ? (
            <p className="text-sm text-destructive">{uploadError}</p>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resume Text</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              className="min-h-80 w-full rounded-md border border-border/80 bg-black/35 p-3 text-sm outline-none transition focus:border-white/60"
              value={resumeText}
              onChange={(event) => setResumeText(event.target.value)}
              placeholder="Paste resume text..."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              className="min-h-80 w-full rounded-md border border-border/80 bg-black/35 p-3 text-sm outline-none transition focus:border-white/60"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste job description..."
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={runAnalysis} disabled={loading} size="lg">
          {loading ? "Analyzing..." : "Analyze ATS Fit"}
        </Button>
        <p className="text-sm text-muted-foreground">
          Tip: include full bullet points with measurable outcomes.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>ATS Readiness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-border/70 bg-muted/30 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Score</p>
                <p className="mt-2 text-4xl font-semibold">{result.overallScore}</p>
                <p className="text-sm text-muted-foreground">{scoreLabel}</p>
              </div>
              <div className="rounded-lg border border-border/70 bg-muted/30 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Keyword coverage</p>
                <p className="mt-2 text-3xl font-semibold">{result.keywordCoverage}%</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Matched Keywords</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {result.keywordsMatched.length > 0 ? (
                  result.keywordsMatched.map((item) => (
                    <span key={item} className="rounded-full border border-emerald-200/30 bg-emerald-200/10 px-2 py-1 text-xs">
                      {item}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No direct keyword matches detected.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Missing Keywords</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {result.keywordsMissing.length > 0 ? (
                  result.keywordsMissing.map((item) => (
                    <span key={item} className="rounded-full border border-amber-200/30 bg-amber-200/10 px-2 py-1 text-xs">
                      {item}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Great match. Few keyword gaps remain.</p>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>ATS Rejection Risks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.risks.length > 0 ? (
                  result.risks.map((risk) => (
                    <div
                      key={risk.id}
                      className="rounded-md border border-border/70 bg-muted/20 p-3 text-sm"
                    >
                      <p className="font-medium">
                        {risk.title} <span className="text-xs text-muted-foreground">({risk.severity})</span>
                      </p>
                      <p className="mt-1 text-muted-foreground">{risk.detail}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No major ATS risks detected.</p>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Rewrite Playbook</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.rewriteTips.map((tip) => (
                  <div key={tip.title} className="rounded-md border border-border/70 p-3 text-sm">
                    <p className="font-medium">{tip.title}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">Before</p>
                    <p className="text-muted-foreground">{tip.before}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">After</p>
                    <p>{tip.after}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{tip.why}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Gemini Coaching</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {result.geminiCoaching}
                </pre>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 border border-border/70 bg-gradient-to-br from-indigo-300/10 via-transparent to-amber-300/10">
              <CardHeader>
                <CardTitle>Fix My Resume</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  One click to rebuild your resume into a stronger ATS-friendly version using the
                  detected issues, missing keywords, and rewrite playbook.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Button size="lg" onClick={fixResumeOneClick} disabled={fixingResume}>
                    {fixingResume ? "Building solid resume..." : "Fix my resume now"}
                  </Button>

                  {fixResult ? (
                    <Button
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(fixResult.fixedResume)}
                    >
                      Copy fixed resume
                    </Button>
                  ) : null}
                </div>

                {fixError ? <p className="text-sm text-destructive">{fixError}</p> : null}

                {fixResult ? (
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-md border border-border/70 bg-muted/20 p-3 text-sm">
                        <p className="font-medium">Before</p>
                        <p className="mt-1 text-muted-foreground">Score: {fixResult.before.overallScore}</p>
                        <p className="text-muted-foreground">Coverage: {fixResult.before.keywordCoverage}%</p>
                      </div>
                      <div className="rounded-md border border-border/70 bg-muted/20 p-3 text-sm">
                        <p className="font-medium">After</p>
                        <p className="mt-1 text-muted-foreground">Score: {fixResult.after.overallScore}</p>
                        <p className="text-muted-foreground">Coverage: {fixResult.after.keywordCoverage}%</p>
                      </div>
                    </div>

                    <div className="rounded-md border border-border/70 p-3 text-sm">
                      <p className="font-medium">Improvements applied</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                        {fixResult.improvementsApplied.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {fixResult.warnings.length > 0 ? (
                      <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
                        <p className="font-medium">Warnings</p>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                          {fixResult.warnings.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    <div className="rounded-md border border-border/70 p-3">
                      <p className="mb-2 text-sm font-medium">Generated ATS-friendly resume</p>
                      <textarea
                        className="min-h-72 w-full rounded-md border border-border/80 bg-black/35 p-3 text-sm"
                        value={fixResult.fixedResume}
                        onChange={(event) =>
                          setFixResult((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  fixedResume: event.target.value,
                                }
                              : prev,
                          )
                        }
                      />
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </section>
  );
}