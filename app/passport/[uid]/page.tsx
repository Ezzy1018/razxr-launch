"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { StatBadge } from "@/components/passport/stat-badge";
import { SkillChart } from "@/components/passport/skill-chart";
import { ProjectCard } from "@/components/passport/project-card";

type PassportData = {
  uid: string;
  level: string;
  completedProjects: number;
  averageProjectScore: number;
  debuggingScore: number;
  topLanguages: string[];
  trend: Array<{ name: string; score: number }>;
  projects: Array<{ projectId: string; score: number | null; submittedAt: string | null }>;
};

export default function PassportPage() {
  const params = useParams<{ uid: string }>();
  const uid = params?.uid;
  const [data, setData] = useState<PassportData | null>(null);

  useEffect(() => {
    if (!uid) {
      return;
    }

    async function loadPassport() {
      const response = await fetch(`/api/passport/${uid}`, { cache: "no-store" });
      const payload = (await response.json()) as { ok: boolean; data?: PassportData };
      if (payload.ok && payload.data) {
        setData(payload.data);
      }
    }

    loadPassport();
  }, [uid]);

  if (!data) {
    return <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">Loading passport...</section>;
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Skill Passport</h1>
        <p className="text-sm text-muted-foreground">UID: {data.uid}</p>
      </header>

      <div className="grid gap-3 md:grid-cols-4">
        <StatBadge label="Level" value={data.level.toUpperCase()} />
        <StatBadge label="Completed projects" value={data.completedProjects} />
        <StatBadge label="Project score" value={data.averageProjectScore} />
        <StatBadge label="Debug score" value={data.debuggingScore} />
      </div>

      <div className="rounded-lg border border-border/70 bg-card p-3">
        <p className="mb-2 text-sm text-muted-foreground">
          Languages: {data.topLanguages.join(", ") || "No evidence yet"}
        </p>
        <SkillChart points={data.trend} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {data.projects.map((project) => (
          <ProjectCard
            key={`${project.projectId}-${project.submittedAt ?? "na"}`}
            projectId={project.projectId}
            score={project.score}
            submittedAt={project.submittedAt}
          />
        ))}
      </div>
    </section>
  );
}
