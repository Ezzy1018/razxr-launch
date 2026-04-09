"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SprintCard } from "@/components/dashboard/sprint-card";
import { LevelBadge } from "@/components/dashboard/level-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DashboardData = {
  user: { id: string; level: string | null };
  assessment: { score: number; level: string } | null;
  stats: {
    completedProjects: number;
    projectScore: number;
    debugScore: number;
    completedDebugChallenges: number;
  };
  tracks: Array<{
    id: string;
    title: string;
    difficulty: string;
    track: string;
    ticketCount: number;
  }>;
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      const response = await fetch("/api/dashboard", { cache: "no-store" });
      const payload = (await response.json()) as { ok: boolean; data?: DashboardData };
      if (payload.ok && payload.data) {
        setData(payload.data);
      }
    }

    loadDashboard();
  }, []);

  if (!data) {
    return <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">Loading dashboard...</section>;
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Your Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Track sprint momentum, debug performance, and overall readiness.
          </p>
        </div>
        <LevelBadge level={data.user.level} />
      </header>

      <div className="grid gap-3 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Completed projects</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{data.stats.completedProjects}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Project score</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{data.stats.projectScore}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Debug score</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{data.stats.debugScore}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Debug solved</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {data.stats.completedDebugChallenges}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/debug" className={cn(buttonVariants({ variant: "outline" }))}>
          Open debugging chamber
        </Link>
        <Link href={`/passport/${data.user.id}`} className={cn(buttonVariants())}>
          View skill passport
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {data.tracks.map((track) => (
          <SprintCard key={track.id} {...track} />
        ))}
      </div>
    </section>
  );
}
