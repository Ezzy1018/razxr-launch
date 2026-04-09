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
    <section className="page-wrap">
      <header className="page-hero">
        <p className="page-kicker">Failure Lab</p>
        <h1 className="page-title text-3xl">Debugging Chamber</h1>
        <p className="page-subtitle text-sm">
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
