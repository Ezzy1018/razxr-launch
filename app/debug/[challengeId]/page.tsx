"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DebugEditor } from "@/components/debug/debug-editor";
import type { DebugChallenge } from "@/types";

export default function DebugChallengePage() {
  const params = useParams<{ challengeId: string }>();
  const challengeId = params?.challengeId;
  const [challenge, setChallenge] = useState<DebugChallenge | null>(null);
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [result, setResult] = useState<{
    score: number;
    status: string;
    expectedSnippet: string;
  } | null>(null);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (!challengeId) {
      return;
    }

    async function loadChallenge() {
      const response = await fetch(`/api/debug/${challengeId}`, { cache: "no-store" });
      const payload = (await response.json()) as { ok: boolean; data?: DebugChallenge };
      if (payload.ok && payload.data) {
        setChallenge(payload.data);
        setCode(payload.data.buggyCode);
      }
    }

    loadChallenge();
  }, [challengeId]);

  async function submitFix() {
    if (!challengeId) {
      return;
    }

    const response = await fetch(`/api/debug/${challengeId}/submit`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        fixedCode: code,
        explanation,
        timeTakenS: Math.round((Date.now() - startedAt.current) / 1000),
      }),
    });

    const payload = (await response.json()) as {
      ok: boolean;
      data?: { attempt: { score: number; status: string }; expectedSnippet: string };
    };

    if (payload.ok && payload.data) {
      setResult({
        score: payload.data.attempt.score,
        status: payload.data.attempt.status,
        expectedSnippet: payload.data.expectedSnippet,
      });
    }
  }

  if (!challenge) {
    return <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">Loading challenge...</section>;
  }

  return (
    <section className="mx-auto flex w-full max-w-[1100px] flex-col gap-5 px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{challenge.title}</h1>
        <p className="text-sm text-muted-foreground">
          {challenge.language} • {challenge.difficulty}
        </p>
      </header>

      <DebugEditor language={challenge.language} value={code} onChange={setCode} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Explain the bug and your fix</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <textarea
            className="min-h-28 w-full rounded-md border border-border bg-background p-3 text-sm"
            value={explanation}
            onChange={(event) => setExplanation(event.target.value)}
            placeholder="Root cause, fix strategy, and edge cases..."
          />
          <Button onClick={submitFix}>Submit debug solution</Button>
        </CardContent>
      </Card>

      {result ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Status: <span className="font-medium text-foreground">{result.status}</span>
            </p>
            <p>
              Score: <span className="font-medium text-foreground">{result.score}</span>
            </p>
            <p>Reference snippet: {result.expectedSnippet}</p>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}
