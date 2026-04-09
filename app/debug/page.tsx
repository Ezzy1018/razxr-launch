"use client";

import { useEffect, useState } from "react";
import { ChallengeCard } from "@/components/debug/challenge-card";
import type { DebugChallenge } from "@/types";

export default function DebugPage() {
  const [challenges, setChallenges] = useState<DebugChallenge[]>([]);

  useEffect(() => {
    async function loadChallenges() {
      const response = await fetch("/api/debug", { cache: "no-store" });
      const payload = (await response.json()) as {
        ok: boolean;
        data?: { challenges: DebugChallenge[] };
      };
      if (payload.ok && payload.data) {
        setChallenges(payload.data.challenges);
      }
    }

    loadChallenges();
  }, []);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Debugging Chamber</h1>
        <p className="text-sm text-muted-foreground">
          Fix broken code paths, explain root causes, and improve your debugging score.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </section>
  );
}
